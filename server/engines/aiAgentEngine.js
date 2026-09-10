// SAARTHI Agentic AI Engine (Multi-Agent Caseworker Architecture)
// Implements autonomous multi-agent reasoning: Sense -> Reason -> Plan -> Act
// Works with live Gemini/OpenAI API or local cognitive agent fallback (100% offline-proof for hackathons).

import { NATIONAL_SCHEMES } from '../data/nationalSchemes.js';
import { evaluateNationalSchemes } from './eligibilityEngine.js';

// Configuration & API keys (pluggable via process.env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * 1. AWAAZ INTAKE AGENT (Sense & Reason)
 * Parses raw colloquial audio transcripts into structured profiles,
 * detects implicit vulnerabilities, and identifies missing data points.
 */
export async function runAwaazIntakeAgent(transcript, lang = 'hi-IN') {
  const startTime = Date.now();
  const trace = [];

  trace.push({
    agent: "Awaaz Intake Agent",
    stage: "SENSE",
    message: `Received acoustic/text input (${transcript.length} chars) in locale [${lang}]. Initiating semantic parsing...`,
    timestamp: new Date().toISOString()
  });

  // Attempt live LLM extraction if API key configured
  let aiResult = null;
  if (GEMINI_API_KEY) {
    try {
      aiResult = await callGeminiIntake(transcript, lang);
      trace.push({
        agent: "Awaaz Intake Agent",
        stage: "REASON",
        message: "Parsed transcript via Gemini 1.5/2.0 Flash API with contextual parameter extraction.",
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn("[Gemini API Error, switching to Local Agent Reasoner]:", err.message);
    }
  }

  // Fallback / Cognitive Agentic Rule Reasoner (deterministic zero-failure guarantee)
  if (!aiResult) {
    aiResult = localAwaazCognitiveParser(transcript, lang);
    trace.push({
      agent: "Awaaz Intake Agent",
      stage: "REASON",
      message: `Parsed entities locally: Purpose=[${aiResult.purpose}], Sector=[${aiResult.categoryName}], Target Investment=₹${(aiResult.projectCost || 0).toLocaleString('en-IN')}.`,
      timestamp: new Date().toISOString()
    });
  }

  trace.push({
    agent: "Awaaz Intake Agent",
    stage: "PLAN",
    message: `Evaluated applicant completeness confidence: ${Math.round(aiResult.confidence * 100)}%. Detected ${aiResult.missingFields.length} ambiguous fields requiring assisted clarification.`,
    timestamp: new Date().toISOString()
  });

  trace.push({
    agent: "Niyam Policy Reasoner",
    stage: "ACT",
    message: `Transferred structured profile to Policy Graph for multi-scheme matrix matching and subsidy stacking.`,
    timestamp: new Date().toISOString()
  });

  return {
    ...aiResult,
    executionTimeMs: Date.now() - startTime,
    trace
  };
}

/**
 * 2. NIYAM SUBSIDY OPTIMIZER AGENT (Plan & Optimize)
 * Identifies subsidy stacking combinations (e.g. PMEGP 35% grant + PM Vishwakarma tool grant + NSFDC low-interest margin).
 */
export function runSubsidyOptimizerAgent(profile) {
  const evaluation = evaluateNationalSchemes(profile);
  const matched = evaluation.matchedSchemes || [];

  const cost = Number(profile.projectCost) || 100000;
  const isSpecialCategory = ['sc', 'st', 'obc', 'minority', 'pwd'].includes((profile.categoryName || '').toLowerCase()) || Boolean(profile.isSC);
  const isWoman = (profile.gender || '').toLowerCase() === 'female';
  const isRural = (profile.locationType || 'rural').toLowerCase() === 'rural';

  // Calculate subsidy stacking opportunities
  let totalDirectGrant = 0;
  let annualInterestSaved = 0;
  const stackSteps = [];

  // PMEGP Capital Subsidy
  const pmegpMatch = matched.find(s => s.id === 'GOI_PMEGP');
  if (pmegpMatch) {
    const subsidyPct = (isSpecialCategory || isWoman) ? (isRural ? 35 : 25) : (isRural ? 25 : 15);
    const pmegpGrant = Math.round(cost * (subsidyPct / 100));
    totalDirectGrant += pmegpGrant;
    stackSteps.push({
      scheme: "PMEGP Margin Money Subsidy",
      type: "Capital Cash Grant",
      amount: pmegpGrant,
      percentage: subsidyPct,
      detail: `${subsidyPct}% non-repayable direct cash grant deposited directly to loan margin money account.`
    });
  }

  // PM Vishwakarma Toolkit & Concessional Credit
  const vishwakarmaMatch = matched.find(s => s.id === 'GOI_PM_VISHWAKARMA');
  if (vishwakarmaMatch) {
    const toolGrant = 15000;
    totalDirectGrant += toolGrant;
    stackSteps.push({
      scheme: "PM Vishwakarma Modern Toolkit Incentive",
      type: "Equipment e-Voucher",
      amount: toolGrant,
      percentage: null,
      detail: `₹15,000 digital incentive for modern electronic sewing / artisan tools upon skills verification.`
    });
  }

  // Concessional Interest Differential vs Commercial (Commercial = 12.5%, Concessional = 5% to 8%)
  const topScheme = matched[0];
  const effectiveRate = topScheme?.concessionalInterestPercent || topScheme?.interestRatePercent || 8.0;
  const commercialBenchmarkRate = 12.5;
  const rateDelta = Math.max(0, commercialBenchmarkRate - effectiveRate);
  annualInterestSaved = Math.round(cost * (rateDelta / 100));

  // Generate Bank Manager Justification Letter
  const bankerDossier = generateBankerJustificationLetter(profile, matched, totalDirectGrant, effectiveRate);

  return {
    status: 'SUCCESS',
    profileSummary: {
      beneficiary: profile.applicantName || 'Entrepreneur',
      projectCost: cost,
      targetSector: profile.categoryName || 'Micro-Enterprise',
      communityCategory: profile.categoryName || (profile.isSC ? 'SC' : 'General'),
      location: isRural ? 'Rural Area' : 'Urban Center'
    },
    stackedBenefits: {
      totalDirectGrant,
      annualInterestSaved,
      effectiveInterestRate: effectiveRate,
      commercialInterestRate: commercialBenchmarkRate,
      netBenefitOver5Years: (totalDirectGrant + (annualInterestSaved * 5)),
      stackSteps
    },
    bankerDossier,
    matchedCount: matched.length
  };
}

/**
 * 3. CONVERSATIONAL CASEWORKER AGENT (Awaaz Sahayak)
 * Handles multi-turn natural vernacular conversation grounded in actual policy data.
 */
export async function runConversationalSahayak(userMessage, conversationHistory = [], profile = {}) {
  const query = (userMessage || '').trim();
  const lang = /[\u0900-\u097F]/.test(query) ? 'hi' : 'en';

  // If Gemini API key is available, attempt real generative response with scheme system prompt
  if (GEMINI_API_KEY) {
    try {
      const liveAnswer = await callGeminiChat(query, conversationHistory, profile);
      if (liveAnswer) return liveAnswer;
    } catch (e) {
      console.warn("[Gemini Chat fallback to Cognitive Caseworker]:", e.message);
    }
  }

  // Offline-proof Semantic Caseworker Reasoner
  return generateCognitiveCaseworkerReply(query, lang, profile);
}

// ============================================================================
// HELPER: Semantic Cognitive Parser (Local Agent Sense & Reason)
// ============================================================================
function localAwaazCognitiveParser(rawText, locale) {
  const text = (rawText || "").toLowerCase().trim();

  let purpose = "business";
  let categoryName = "General Micro-Enterprise";
  let projectCost = null;
  let detectedCategory = null;
  let gender = "female"; // Default equitable presumption
  let locationType = "rural";
  let confidence = 0.55;
  const missingFields = [];

  // 1. Purpose & Sector Mapping with Devanagari & Latin dialect terms
  if (/padhai|study|college|btech|mbbs|fees|shiksha|degree|engineering|polytechnic|पढ़ाई|शिक्षा|कॉलेज|फीस|डिग्री/i.test(text)) {
    purpose = "education";
    categoryName = "Higher Professional Education";
    confidence += 0.25;
  } else if (/silai|tailor|boutique|kapde|stitching|garment|suit|blouse|सिलाई|टेलर|बुटीक|कपड़े|कपड़ा/i.test(text)) {
    categoryName = "Tailoring & Garment Unit";
    confidence += 0.3;
  } else if (/chai|tea|stall|dhaba|nasta|snack|tapri|food\s*cart|चाय|ढाबा|नाश्ता|ठेला|दुकान/i.test(text)) {
    categoryName = "Tea Stall & Refreshments";
    confidence += 0.3;
  } else if (/kirana|grocery|retail|dukaan|parchoon|store|किराना|राशन|परचून/i.test(text)) {
    categoryName = "Kirana & Retail Store";
    confidence += 0.3;
  } else if (/dairy|gaay|bhains|pashupalan|milk|cow|buffalo|livestock|डेयरी|गाय|भैंस|दूध|पशुपालन/i.test(text)) {
    categoryName = "Dairy & Livestock Unit";
    confidence += 0.3;
  } else if (/auto|rickshaw|e-rickshaw|taxi|transport|tempo|carrier|ऑटो|रिक्शा|ई-रिक्शा|टैक्सी|गाड़ी/i.test(text)) {
    categoryName = "Commercial Transport";
    confidence += 0.3;
  } else if (/workshop|welding|lohar|fabrication|furniture|carpenter|badhai|वर्कशॉप|वेल्डिंग|लोहार|बढ़ई|फर्नीचर/i.test(text)) {
    categoryName = "Artisan & Fabrication Workshop";
    confidence += 0.3;
  }

  // 2. Caste / Marginalized Category Detection
  if (/sc\b|scheduled\s*caste|dalit|anushuchit\s*jati|valmiki|jatav|अनुसूचित\s*जाति|दलित|जाटव|वाल्मीकि/i.test(text)) {
    detectedCategory = "SC";
    confidence += 0.2;
  } else if (/st\b|scheduled\s*tribe|adivasi|anushuchit\s*janjati|meena|gond|अनुसूचित\s*जनजाति|आदिवासी|मीणा|गोंड/i.test(text)) {
    detectedCategory = "ST";
    confidence += 0.2;
  } else if (/obc\b|backward|pichhda|pichhdi|पिछड़ा|पिछड़ी|ओबीसी/i.test(text)) {
    detectedCategory = "OBC";
    confidence += 0.15;
  } else if (/divyang|pwd|handicap|viklang|दिव्यांग|विकलांग/i.test(text)) {
    detectedCategory = "PWD";
    confidence += 0.2;
  } else if (/minority|muslim|sikh|christian|buddhist|alpsankhyak|अल्पसंख्यक|मुस्लिम|सिख|ईसाई|बौद्ध/i.test(text)) {
    detectedCategory = "Minority";
    confidence += 0.15;
  }

  // 3. Location Detection
  if (/gaon|rural|dehat|gram|village|गाँव|गांव|ग्रामीण|देहात/i.test(text)) {
    locationType = "rural";
  } else if (/shahar|city|urban|town|शहर|शहरी/i.test(text)) {
    locationType = "urban";
  }

  // 4. Financial Currency / Amount Extraction
  // Examples: 1.2 lakh, dedh lakh, 50 hazar, 25000, 2 lakh
  const lakhMatch = text.match(/(\d+(\.\d+)?)\s*(lakh|lac|लाख)/i);
  const hazarMatch = text.match(/(\d+(\.\d+)?)\s*(hazar|k|हजार|thousand)/i);
  const rawNumMatch = text.match(/₹?\s*(\d{4,8})/);

  if (lakhMatch) {
    projectCost = Math.round(parseFloat(lakhMatch[1]) * 100000);
    confidence += 0.25;
  } else if (/dedh\s*lakh|सवा\s*लाख/i.test(text)) {
    projectCost = text.includes('सवा') ? 125000 : 150000;
    confidence += 0.3;
  } else if (hazarMatch) {
    projectCost = Math.round(parseFloat(hazarMatch[1]) * 1000);
    confidence += 0.25;
  } else if (rawNumMatch) {
    projectCost = parseInt(rawNumMatch[1], 10);
    confidence += 0.2;
  }

  // Detect missing critical variables for targeted clarification
  if (!projectCost) {
    missingFields.push({
      field: "projectCost",
      questionHindi: "इस काम को शुरू करने के लिए आपको कुल कितने रुपयों (लागत) की आवश्यकता होगी?",
      questionEnglish: "What is the estimated total cost required to set up this venture?"
    });
  }
  if (!detectedCategory) {
    missingFields.push({
      field: "category",
      questionHindi: "क्या आप SC/ST/OBC या अल्पसंख्यक वर्ग से संबंधित हैं, ताकि विशेष सब्सिडी जोड़ी जा सके?",
      questionEnglish: "Do you belong to SC, ST, OBC, or Minority category for preferential margin subsidy?"
    });
  }

  return {
    rawTranscript: rawText,
    locale,
    purpose,
    categoryName,
    projectCost: projectCost || (purpose === 'education' ? 400000 : 120000),
    detectedCategory: detectedCategory || 'SC',
    gender,
    locationType,
    confidence: Math.min(0.98, confidence),
    missingFields,
    clarificationPrompt: missingFields.length > 0 ? missingFields[0].questionHindi : null
  };
}

// ============================================================================
// HELPER: Generate Official Bank Manager Justification Letter (Act stage)
// ============================================================================
function generateBankerJustificationLetter(profile, matchedSchemes, grantAmount, effectiveRate) {
  const name = profile.applicantName || 'Beneficiary Entrepreneur';
  const sector = profile.categoryName || 'Micro-Enterprise';
  const cost = Number(profile.projectCost) || 120000;
  const category = profile.categoryName || (profile.isSC ? 'Scheduled Caste (SC)' : 'Marginalized Category');
  const topScheme = matchedSchemes[0]?.name || 'PMEGP & NSFDC Credit Linkage';

  return {
    subject: `Recommendation Dossier for Micro-Enterprise Credit Linkage under ${topScheme}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    salutation: "To The Branch Manager / Lead District Manager (LDM),",
    applicantSummary: `Applicant ${name}, representing ${category} community, has structured a viable credit proposal of ₹${cost.toLocaleString('en-IN')} for setting up a ${sector}.`,
    statutoryBacking: `The applicant qualifies under National Credit Priority Sector Guidelines with an estimated upfront Capital Subsidy of ₹${grantAmount.toLocaleString('en-IN')} and Concessional Interest Rate of ${effectiveRate}%.`,
    riskMitigation: [
      "100% Collateral-Free under CGTMSE / CGFMU Credit Guarantee Scheme Coverage.",
      "Eligible for upfront Margin Money deposit directly to the escrow loan account upon sanction.",
      "Direct verification roadmap accessible via verified SAARTHI QR Loan Fit Passport."
    ],
    recommendedAction: "Expedited sanction of term loan and working capital limit under Priority Lending targets."
  };
}

// ============================================================================
// HELPER: Cognitive Caseworker Response (Multi-Turn Chat Agent)
// ============================================================================
function generateCognitiveCaseworkerReply(query, lang, profile) {
  const q = query.toLowerCase();

  if (q.includes('dastawez') || q.includes('document') || q.includes('kagaz') || q.includes('kya chahiye')) {
    return {
      agent: "Dastavej Mitr (AI Document Caseworker)",
      reply: lang === 'hi' 
        ? "लोन आवेदन के लिए आपको केवल 4 मुख्य दस्तावेजों की आवश्यकता है:\n1. **आधार कार्ड** (पहचान व पता प्रमाण)\n2. **जाति प्रमाण पत्र** (SC/ST/OBC सब्सिडी हेतु)\n3. **बैंक पासबुक** (पिछले 6 माह का विवरण)\n4. **प्रोजेक्ट कोटेशन** (सिलाई मशीन या उपकरणों का अनुमानित बिल)\n\nयदि आपके पास जाति प्रमाण पत्र नहीं है, तो SAARTHI आपको निकटतम CSC केंद्र से 7 दिनों में प्रमाण पत्र बनवाने का मार्ग दिखाता है।"
        : "For your loan application, you only need 4 essential documents:\n1. **Aadhaar Card** (Identity & Address verification)\n2. **Caste Certificate** (for mandatory SC/ST/OBC subsidies)\n3. **Bank Passbook** (Last 6 months)\n4. **Project Quotation / Invoices** (Estimated machinery or inventory cost)\n\nIf you lack a caste certificate, SAARTHI provides a fast-track CSC workflow to obtain it within 7 days.",
      suggestedActions: [
        { label: "View Required Documents", action: "OPEN_DOCUMENTS" },
        { label: "Find Nearest CSC Center", action: "OPEN_PARTNERS" }
      ]
    };
  }

  if (q.includes('subsidy') || q.includes('chhoot') || q.includes('anudan') || q.includes('grant') || q.includes('maaf')) {
    return {
      agent: "Niyam Policy Reasoner",
      reply: lang === 'hi'
        ? "सारथी (SAARTHI) आपके लिए **सब्सिडी स्टैकिंग (Subsidy Stacking)** करता है!\n• **PMEGP के तहत**: यदि आप ग्रामीण क्षेत्र से हैं और SC/ST/महिला उद्यमी हैं, तो आपको **35% तक का सीधा नकद अनुदान** (Margin Money) मिलता है जो वापस नहीं करना होता।\n• **PM विश्वकर्मा**: सिलाई व कारीगरों को ₹15,000 का आधुनिक टूलकिट ई-वाउचर अतिरिक्त मिलता है।\n\nउदाहरण: ₹1.2 लाख के सिलाई प्रोजेक्ट पर आपको लगभग **₹42,000 की सीधी सब्सिडी** मिल सकती है।"
        : "SAARTHI automatically performs **Subsidy Stacking** for your profile!\n• Under **PMEGP**: Rural SC/ST/Women entrepreneurs receive up to **35% non-repayable Capital Cash Grant**.\n• Under **PM Vishwakarma**: Artisans and tailors receive an additional **₹15,000 digital e-voucher** for modern toolkits.\n\nFor example, on a ₹1.2 Lakh tailoring setup, your net non-repayable grant will be approximately **₹42,000**.",
      suggestedActions: [
        { label: "Calculate Repayment", action: "OPEN_REPAYMENT" },
        { label: "View Matched Schemes", action: "OPEN_SCHEMES" }
      ]
    };
  }

  if (q.includes('silai') || q.includes('tailor') || q.includes('boutique')) {
    return {
      agent: "Awaaz Intake Agent",
      reply: lang === 'hi'
        ? "सिलाई और बुटीक कार्य के लिए सबसे उपयुक्त योजनाएं हैं:\n1. **PMEGP माइक्रो एंटरप्राइज**: 35% अनुदान (ग्रामीण SC/महिला) के साथ 3 साल का आसान ऋण।\n2. **NSFDC महिला समृद्धि योजना**: मात्र 4% रियायती ब्याज दर पर ₹1.40 लाख तक का ऋण।\n3. **PM विश्वकर्मा योजना**: दर्जी वर्ग के लिए ₹15,000 मुफ्त टूलकिट वाउचर + ₹1 लाख का बिना गारंटी ऋण (5% ब्याज)।\n\nक्या आप चाहते हैं कि मैं आपके लिए आवेदन फॉर्म में यह जानकारी भर दूँ?"
        : "The top optimal schemes for a Tailoring & Boutique venture are:\n1. **PMEGP Micro-Enterprise**: Up to 35% capital grant with a 7-year repayment window.\n2. **NSFDC Mahila Samriddhi**: Ultra-low 4% concessional interest up to ₹1.40 Lakh.\n3. **PM Vishwakarma**: ₹15,000 modern toolkit grant + ₹1 Lakh collateral-free loan at 5%.\n\nWould you like me to populate your application profile with these details?",
      suggestedActions: [
        { label: "Auto-Fill Tailoring Profile", action: "AUTOFILL_TAILORING" },
        { label: "Generate Loan Passport", action: "GENERATE_PASSPORT" }
      ]
    };
  }

  // Default intelligent casework guidance
  return {
    agent: "SAARTHI AI Caseworker",
    reply: lang === 'hi'
      ? `नमस्ते! मैं आपका डिजिटल सारथी (AI Caseworker) हूँ। मैं हाशिए पर मौजूद और वंचित उद्यमियों को बिना बिचौलियों के सरकारी ऋण और सब्सिडी दिलाने में मदद करता हूँ।\n\nआप मुझसे अपने काम, आवश्यक पूंजी (जैसे: ₹1 लाख), या दस्तावेजों के बारे में अपनी भाषा में पूछ सकते हैं।`
      : `Hello! I am your SAARTHI AI Caseworker. I help marginalized and micro-entrepreneurs navigate government credit, maximize subsidies, and get bank approvals without middlemen.\n\nFeel free to speak or type in any language about your business idea, loan requirements, or documentation questions.`,
    suggestedActions: [
      { label: "Start Voice Intake", action: "OPEN_INTAKE" },
      { label: "Explore 15+ Schemes", action: "OPEN_SCHEMES" }
    ]
  };
}

// ============================================================================
// HELPER: Gemini Generative API Client (When GEMINI_API_KEY is configured)
// ============================================================================
async function callGeminiIntake(transcript, lang) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `You are SAARTHI AI Intake Agent for marginalized Indian entrepreneurs (SC/ST/OBC/Women/Rural).
Analyze this colloquial speech transcript: "${transcript}".
Respond strictly with valid JSON with keys:
{
  "purpose": "business" or "education",
  "categoryName": "Specific enterprise title e.g. Tailoring & Garment Unit, Kirana Store, etc.",
  "projectCost": integer in INR (e.g. 120000),
  "detectedCategory": "SC" or "ST" or "OBC" or "PWD" or "General",
  "gender": "female" or "male",
  "locationType": "rural" or "urban",
  "confidence": float between 0.0 and 1.0,
  "missingFields": array of missing field objects,
  "clarificationPrompt": string in Hindi or English
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

async function callGeminiChat(query, history, profile) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const systemInstruction = `You are SAARTHI AI Caseworker, a compassionate, expert public finance advisor for rural and marginalized entrepreneurs in India. Ground your answers in official schemes (PMEGP, PMMY, PM Vishwakarma, NSFDC, Stand-Up India). Keep answers concise, direct, helpful, and encourage the applicant. Respond in the user's language (Hindi or English).`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [
        { role: 'user', parts: [{ text: `Applicant Profile: ${JSON.stringify(profile)}\nUser question: ${query}` }] }
      ]
    })
  });

  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  return {
    agent: "SAARTHI AI Caseworker (Gemini LLM)",
    reply,
    suggestedActions: [
      { label: "View Matched Schemes", action: "OPEN_SCHEMES" },
      { label: "Generate Loan Passport", action: "GENERATE_PASSPORT" }
    ]
  };
}
