// Grounded knowledge base directly sourced from official NSFDC guidelines and FAQs
// Official source: https://nsfdc.nic.in/faqs

export const FAQ_ITEMS = [
  {
    id: "faq-income-ceiling",
    question: "What is the annual family income ceiling for NSFDC schemes?",
    questionHindi: "NSFDC योजनाओं के लिए वार्षिक पारिवारिक आय सीमा क्या है?",
    answer: "As per the updated NSFDC guidelines effective January 2026, the annual family income ceiling for eligibility across all concessional schemes is ₹5,00,000 (Rupees Five Lakh). Applicants having family income within this threshold can apply.",
    answerHindi: "जनवरी 2026 से प्रभावी अद्यतन NSFDC दिशा-निर्देशों के अनुसार, सभी रियायती योजनाओं के लिए वार्षिक पारिवारिक आय सीमा ₹5,00,000 (पाँच लाख रुपये) है।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Eligibility Criteria (FAQ Item 3)",
    tags: ["income", "eligibility", "threshold", "5lakh"]
  },
  {
    id: "faq-direct-nsfdc",
    question: "Can an applicant apply directly to NSFDC Delhi headquarters?",
    questionHindi: "क्या कोई आवेदक सीधे NSFDC नई दिल्ली मुख्यालय में आवेदन कर सकता है?",
    answer: "No. NSFDC does not disburse loans directly to individual beneficiaries. As mandated by the Ministry of Social Justice and Empowerment, applications must be routed through authorized State Channelising Agencies (SCAs), Regional Rural Banks (RRBs), Public Sector Banks, or the centralized PM-SURAJ national portal.",
    answerHindi: "नहीं। NSFDC सीधे लाभार्थियों को ऋण वितरित नहीं करता है। नियमों के अनुसार, आवेदन राज्य चैनलाइजिंग एजेंसियों (SCA), क्षेत्रीय ग्रामीण बैंकों (RRB) या राष्ट्रीय PM-SURAJ पोर्टल के माध्यम से ही स्वीकार किए जाते हैं।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Channel Partner Framework (FAQ Item 4)",
    tags: ["channel-partner", "sca", "pm-suraj", "routing"]
  },
  {
    id: "faq-mfs-vs-aajeevika",
    question: "What is the difference between Micro Finance (MFS) and Aajeevika Scheme?",
    questionHindi: "लघु वित्त योजना (MFS) और आजीविका योजना में क्या अंतर है?",
    answer: "Micro Finance Scheme is routed through State SCAs or RRBs at a highly concessional interest rate of 6.5% p.a. Aajeevika Micro-Finance is routed through NBFC-MFIs for rapid doorstep disbursement, but carries an operational interest rate of 15.0% p.a. SAARTHI prioritizes the 6.5% SCA route whenever partner capacity is verified.",
    answerHindi: "लघु वित्त योजना (MFS) राज्य एजेंसियों के माध्यम से केवल 6.5% वार्षिक रियायती ब्याज पर मिलती है। आजीविका योजना NBFC-MFI के माध्यम से तेज़ी से मिलती है परंतु इस पर ब्याज 15.0% होता है।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Lending Policy & Interest Slabs",
    tags: ["micro-finance", "aajeevika", "interest-rate", "comparison"]
  },
  {
    id: "faq-boundary-140k",
    question: "Why does ₹1,40,000 qualify for Micro Finance while ₹1,40,001 moves to Term Loan?",
    questionHindi: "₹1,40,000 की परियोजना लघु वित्त में और ₹1,40,001 सावधि ऋण (Term Loan) में क्यों जाती है?",
    answer: "NSFDC Policy Rule defines Micro Finance as projects up to ₹1,40,000 (maximum loan component ₹1,25,000). Any business project requiring more than ₹1,40,000 falls under the Term Loan Scheme (up to ₹50 Lakh) requiring a detailed project profile and different repayment tenure.",
    answerHindi: "NSFDC नियमों के अनुसार लघु वित्त की अधिकतम सीमा ₹1,40,000 है। इससे ₹1 भी अधिक होने पर परियोजना सावधि ऋण (Term Loan) के दायरे में आती है।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Scheme Operational Guidelines",
    tags: ["boundary", "term-loan", "micro-finance", "project-cost"]
  },
  {
    id: "faq-moratorium-construction",
    question: "What is the moratorium period, and how does it change for construction or agriculture?",
    questionHindi: "ऋण स्थगन (Moratorium) क्या है और निर्माण या कृषि कार्यों के लिए यह कैसे बढ़ता है?",
    answer: "A moratorium is the grace period during which the borrower is not required to repay the principal installment. For standard micro projects it is 3-6 months. For Term Loans involving civil construction, sheds, polyhouses, or horticulture plantations, the moratorium can be officially extended up to 24 months to allow gestation.",
    answerHindi: "ऋण स्थगन (Moratorium) वह अवधि है जिसमें मूलधन की किस्त नहीं देनी होती। सामान्य व्यापार में यह 3-6 महीने और निर्माण/बागवानी प्रोजेक्ट्स में 24 महीने तक बढ़ाया जा सकता है।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Repayment & Gestation Period (FAQ Item 8)",
    tags: ["moratorium", "gestation", "construction", "repayment"]
  },
  {
    id: "faq-women-rebate",
    question: "Is there an interest rebate for women entrepreneurs and female students?",
    questionHindi: "क्या महिला उद्यमियों या छात्राओं को ब्याज में कोई विशेष छूट मिलती है?",
    answer: "Yes. Under the Educational Loan Scheme, female students receive a 0.5% interest rebate (3.5% p.a. vs 4.0% p.a. for male students). Similarly, women-led micro-enterprises receive preference and interest concessions in specialized state tranches.",
    answerHindi: "हाँ। शिक्षा ऋण में छात्राओं को 0.5% की विशेष छूट (केवल 3.5% वार्षिक ब्याज) दी जाती है।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Women Concession Sub-rules",
    tags: ["women", "rebate", "education", "concession"]
  },
  {
    id: "faq-missing-documents",
    question: "What if I do not have a Caste Certificate or Income Certificate yet?",
    questionHindi: "यदि मेरे पास अभी जाति या आय प्रमाण पत्र नहीं है तो क्या होगा?",
    answer: "SAARTHI allows you to complete the scheme fit and repayment planner, but flags your document readiness as 'Incomplete'. You will receive an audio guide in your language explaining where to obtain the certified document from your local Tehsil/CSC before proceeding to the partner office.",
    answerHindi: "सारथी आपको योजना और किस्त की जानकारी देगा, किंतु 'दस्तावेज़ अपूर्ण' चिह्नित करेगा तथा तहसील/CSC से प्रमाण पत्र बनवाने का ऑडियो मार्गदर्शन प्रदान करेगा।",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    sourceClause: "Document Verification Protocol",
    tags: ["documents", "caste-certificate", "income-certificate", "readiness"]
  }
];
