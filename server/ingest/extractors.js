/**
 * =============================================================================
 * SAARTHI — SOURCE EXTRACTORS (zero-hallucination rule)
 *
 * Each extractor turns a raw document (PDF bytes or HTML) into normalized text
 * plus field extractions of the shape { value, quote, confidence }.
 *
 * RULE: a field only exists if it carries a VERBATIM quote from the source
 * text. Confidence is deterministic (regex anchor strength), never invented.
 * runIngest.js drops anything below MIN_CONFIDENCE before queueing a review.
 *
 * Parsers (keyed by sources.parser):
 *   nsfdc-annexure        PDF  -> per-scheme rows of the NSFDC master table
 *   mosje-labeled         HTML -> "Maximum Loan Limit: ... / Rate of Interest: ..." pages
 *   mosje-income-ceiling  HTML -> the ₹5.00 Lakh mandate sentence
 *   sca-directory         HTML -> channelizing agency table rows
 * =============================================================================
 */

import { PDFParse } from 'pdf-parse';
import * as cheerio from 'cheerio';

export const MIN_CONFIDENCE = 0.75;

// --- shared helpers ----------------------------------------------------------

/** Collapse whitespace so regexes survive PDF line-wrapping. */
export function normalize(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

/** Extract "Rs.X lakh" / "Rs. X.00 Lakh" style amounts into rupees. */
function lakhToRupees(match) {
  if (!match) return null;
  const n = parseFloat(String(match).replace(/,/g, ''));
  return isNaN(n) ? null : Math.round(n * 100000);
}

/** Pull the FIRST numeric percent from a quote (e.g. "8% from the Beneficiaries"). */
function firstPercent(quote) {
  const m = quote.match(/(\d+(?:\.\d+)?)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

/** Find `label` in text and return a bounded verbatim window around it. */
function quoteAround(text, label, window = 220) {
  const idx = text.indexOf(label);
  if (idx === -1) return null;
  return text.slice(idx, idx + window).trim();
}

// =============================================================================
// PDF PARSER: NSFDC Annexure-I(a) master circular
// =============================================================================
/**
 * The annexure renders the scheme table as flat lines like:
 *   "Micro-Credit Finance (MCF) Up to Rs.1.40 lakh Rs.1.25 lakh 2.5% 6.5% Within 3 years 3 months"
 * We anchor on each known scheme name, then capture: project cost, max loan,
 * CAs rate, beneficiary rate, repayment years, moratorium months.
 */
export async function parseNsfdcAnnexure(pdfBuffer) {
  const parser = new PDFParse(new Uint8Array(pdfBuffer));
  const result = await parser.getText();
  await parser.destroy();

  const raw = result.text || '';
  const text = normalize(raw);

  const schemes = [];
  const anchors = [
    // [schemeId, regex with named groups]
    ['NSFDC_MAHILA_SAMRUDDHI', /Mahila Samriddhi\s*Yojana\s*\(MSY\)\s*Up to Rs\.\s*([\d.,]+)\s*lakh\s*Rs\.\s*([\d.,]+)\s*lakh\s*(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%\s*Within\s*(\d+)\s*years?\s*(\d+)\s*months?/i],
    ['NSFDC_MICRO_FINANCE', /Micro-Credit Finance\s*\(MCF\)\s*Up to Rs\.\s*([\d.,]+)\s*lakh\s*Rs\.\s*([\d.,]+)\s*lakh\s*(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%\s*Within\s*(\d+)\s*years?\s*(\d+)\s*months?/i],
    ['NSFDC_SUVIDHA', /Suvidha Loan\s*Up to Rs\.\s*([\d.,]+)\s*lakh\s*Rs\.\s*([\d.,]+)\s*lakh\s*(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%\s*Within\s*(\d+)\s*years?/i],
    ['NSFDC_UTKARSH', /Utkarsh Loan\s*Above Rs\.\s*10\s*lakh\s*and\s*upto Rs\.\s*50\s*Lakh\s*Rs\.?\s*([\d.,]+)\s*lakh\s*(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%\s*Within\s*(\d+)\s*years?/i],
    ['NSFDC_AAJEEVIKA', /Aajeevika Microfinance\s*Yojana\s*\(AMY\)\s*Up to Rs\.\s*([\d.,]+)\s*lakh\s*Rs\.\s*([\d.,]+)\s*lakh\s*(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%\s*Within\s*(\d+)\s*[Yy]ears?\s*(\d+)\s*months?/i]
  ];

  for (const [schemeId, re] of anchors) {
    const m = text.match(re);
    if (!m) continue;

    const fields = {};
    const push = (key, value, confidence) => {
      if (value === null || value === undefined || isNaN(value)) return;
      fields[key] = {
        value,
        confidence,
        quote: m[0].slice(0, 240) // verbatim: the matched excerpt itself
      };
    };

    if (schemeId === 'NSFDC_UTKARSH') {
      // groups: 1=maxLoan(lakh) 2=CAs% 3=beneficiary% 4=years
      push('maxLoanAmount', lakhToRupees(m[1]), 0.97);
      push('channelRate', parseFloat(m[2]), 0.95);
      push('interestRate', parseFloat(m[3]), 0.97);
      push('tenureYears', parseInt(m[4], 10), 0.93);
      // Utkarsh bracket is fixed above the anchor text
      push('minCost', 1000001, 0.9);
      push('maxCost', 5000000, 0.96);
    } else {
      // groups: 1=projectCost(lakh) 2=maxLoan(lakh) 3=CAs% 4=beneficiary% 5=years 6=months
      push('maxCost', lakhToRupees(m[1]), 0.97);
      push('maxLoanAmount', lakhToRupees(m[2]), 0.97);
      push('channelRate', parseFloat(m[3]), 0.95);
      push('interestRate', parseFloat(m[4]), 0.97);
      if (m[5]) push('tenureYears', parseInt(m[5], 10), 0.93);
      if (m[6]) push('moratoriumMonths', parseInt(m[6], 10), 0.93);
    }

    schemes.push({ schemeId, fields });
  }

  // Education Loan has a two-part row (India / Abroad) with FOUR rates:
  //   CAs: men/women (2% / 1.5%) then Beneficiary: men/women (6% / 5.5%).
  // We must take the BENEFICIARY pair (groups 4/5), never the CAs pair.
  const elsIndia = text.match(
    /For studies in India, upto Rs\.\s*([\d.,]+)\s*lakh or 90% of course fee, whichever is less\s*(\d+(?:\.\d+)?)%\s*\(Men\)\s*(\d+(?:\.\d+)?)%\s*\(Women\)\s*(\d+(?:\.\d+)?)%\s*\(Men\)\s*(\d+(?:\.\d+)?)%\s*\(Women\)/i
  );
  const elsAbroad = text.match(/For studies abroad, upto Rs\.\s*([\d.,]+)\s*lakh/i);
  if (elsIndia) {
    const capLakh = elsAbroad ? elsAbroad[1] : elsIndia[1]; // abroad ₹40L > India ₹30L
    const benefMen = parseFloat(elsIndia[4]);
    const benefWomen = parseFloat(elsIndia[5]);
    schemes.push({
      schemeId: 'NSFDC_EDUCATION_LOAN',
      fields: {
        maxCost: {
          value: lakhToRupees(capLakh),
          confidence: 0.96,
          quote: (elsAbroad ? elsAbroad[0] : elsIndia[0]).slice(0, 240)
        },
        interestRate: { value: benefMen, confidence: 0.94, quote: elsIndia[0].slice(0, 240) },
        femaleRebate: {
          value: Math.abs(benefMen - benefWomen),
          confidence: 0.9,
          quote: elsIndia[0].slice(0, 240)
        }
      }
    });
  }

  return { text: raw, schemes };
}

// =============================================================================
// HTML PARSER: MoSJE labeled scheme pages (e.g. Term Loan id 2998)
// =============================================================================
/**
 * Pages carry labeled salient features:
 *   "Maximum Loan Limit: NSFDC provides loans up to 90% ... upto Rs.45.00 lakh."
 *   "Rate of Interest: ... shall charge 8% from the Beneficiaries."
 *   "Repayment Period: ... maximum period of seven years ... including 6 months ... 12 months."
 */
export function parseMosjeLabeled(html) {
  const $ = cheerio.load(html);
  $('script, style, nav, header, footer').remove();
  const text = normalize($.root().text());

  const fields = {};

  // Headline cap: "units costing >Rs.1.40 lakh & upto Rs.50.00 lakh"
  const headline = text.match(/units costing[^.]*?upto Rs\.\s*([\d.,]+)\s*lakh/i);
  if (headline) {
    fields.maxCost = {
      value: lakhToRupees(headline[1]),
      confidence: 0.98,
      quote: quoteAround(text, 'units costing', 140) || headline[0]
    };
  }

  // "Maximum Loan Limit: ... upto Rs.45.00 lakh."
  const loanLimit = text.match(/Maximum Loan Limit:.*?upto Rs\.\s*([\d.,]+)\s*lakh/i);
  if (loanLimit) {
    fields.maxLoanAmount = {
      value: lakhToRupees(loanLimit[1]),
      confidence: 0.98,
      quote: quoteAround(text, 'Maximum Loan Limit', 220) || loanLimit[0]
    };
  }

  // "shall charge 8% from the Beneficiaries" (beneficiary rate, NOT the SCA rate)
  const rate = text.match(/Rate of Interest:.*?charge\s*([\d.,]+)\s*%\s*from the Beneficiaries/i);
  if (rate) {
    fields.interestRate = {
      value: parseFloat(rate[1]),
      confidence: 0.97,
      quote: quoteAround(text, 'Rate of Interest', 220) || rate[0]
    };
    // NSFDC->SCA rate sits earlier in the same sentence: "@ 4% from the SCAs"
    const scaRate = text.match(/Rate of Interest:.*?@\s*([\d.,]+)\s*%\s*from the SCAs/i);
    if (scaRate) {
      fields.channelRate = {
        value: parseFloat(scaRate[1]),
        confidence: 0.95,
        quote: quoteAround(text, 'Rate of Interest', 220) || scaRate[0]
      };
    }
  }

  // "within a maximum period of seven years" (words-to-number for safety)
  const tenureWords = text.match(/maximum period of (one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s*years/i);
  if (tenureWords) {
    const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    const w = tenureWords[1].toLowerCase();
    const years = WORDS[w] || parseInt(w, 10);
    if (!isNaN(years)) {
      fields.tenureYears = {
        value: years,
        confidence: 0.93,
        quote: quoteAround(text, 'Repayment Period', 240) || tenureWords[0]
      };
    }
  }

  // "...including 6 months except for plantation and construction activities ... 12 months"
  const moratorium = text.match(/including\s*(\d+)\s*months except for plantation[^.]*?which it will be\s*(\d+)\s*months/i);
  if (moratorium) {
    fields.moratoriumMonths = {
      value: parseInt(moratorium[2], 10), // take the LONGER grace window
      confidence: 0.92,
      quote: quoteAround(text, 'Repayment Period', 300) || moratorium[0]
    };
  } else {
    const simpleMoratorium = text.match(/(?:including|moratorium of)\s*(\d+)\s*months/i);
    if (simpleMoratorium) {
      fields.moratoriumMonths = {
        value: parseInt(simpleMoratorium[1], 10),
        confidence: 0.85,
        quote: simpleMoratorium[0]
      };
    }
  }

  return { text, fields };
}

// =============================================================================
// HTML PARSER: income-ceiling mandate (NSFDC overview page)
// =============================================================================
export function parseMosjeIncomeCeiling(html) {
  const $ = cheerio.load(html);
  $('script, style, nav, header, footer').remove();
  const text = normalize($.root().text());

  const m = text.match(/annual family income\s+up\s*to Rs\.?\s*([\d.,]+)\s*lakh/i);
  if (!m) return { text, fields: {} };

  return {
    text,
    fields: {
      incomeCeiling: {
        value: lakhToRupees(m[1]),
        confidence: 0.99,
        quote: m[0]
      }
    }
  };
}

// =============================================================================
// HTML PARSER: MoSJE List of Channelizing Agencies (3 tables: SCA/RRB/PSB)
// =============================================================================
export function parseScaDirectory(html) {
  const $ = cheerio.load(html);
  const rows = [];
  const SECTION_BY_TABLE = ['SCA', 'RRB', 'PSB'];

  $('table').each((tableIdx, table) => {
    const section = SECTION_BY_TABLE[tableIdx] || 'SCA';
    $(table)
      .find('tr')
      .each((_, tr) => {
        const cells = $(tr)
          .find('td')
          .map((__, td) => normalize($(td).text()))
          .get()
          .filter(Boolean);
        if (cells.length < 2) return;

        if (section === 'SCA') {
          // cols: [S.No, State/UT, Contact details block]
          const [, state, contact] = cells;
          if (!contact || contact.length < 10) return;
          const lines = contact.split(/\n| (?=(?:Tel|Tele|E-mail|Email|Fax))/i);
          rows.push({
            section,
            state: state || null,
            agencyName: normalize(lines[0]).slice(0, 200),
            address: normalize(lines.slice(1, 3).join(' ')).slice(0, 400) || null,
            contactRaw: normalize(contact).slice(0, 500)
          });
        } else {
          // RRB/PSB tables: [S.No, Name & Address, Contact, ...]
          const nameAddr = cells[1];
          if (!nameAddr || nameAddr.length < 5) return;
          const parts = nameAddr.split(/\n|Head Office:|Central Office:/i).map(normalize).filter(Boolean);
          rows.push({
            section,
            state: cells.find(c => /^[A-Z][a-z]+( [A-Z][a-z]+)*$/.test(c) && c.length < 30) || null,
            agencyName: (parts[0] || '').slice(0, 200),
            address: (parts.slice(1).join(', ') || null)?.slice(0, 400),
            contactRaw: normalize(cells[2] || '').slice(0, 500)
          });
        }
      });
  });

  return { rows };
}
