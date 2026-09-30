// SAARTHI — Comprehensive Multi-Language Internationalization (i18n) System
// Supports 10 Indian languages + English
// Covers all critical UI strings across the entire application

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', script: 'Latin' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', script: 'Devanagari' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', script: 'Tamil' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', script: 'Telugu' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', script: 'Bengali' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', script: 'Devanagari' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', script: 'Malayalam' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { code: 'od', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', script: 'Odia' },
];

// Web Speech API language codes mapping
export const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  od: 'or-IN',
};

// Core translations for all supported languages
export const TRANSLATIONS = {
  // ============================================================
  // NAVIGATION & GLOBAL
  // ============================================================
  'nav.journey': {
    en: 'Citizen Journey',
    hi: 'नागरिक यात्रा',
    ta: 'குடிமக்கள் பயணம்',
    te: 'పౌర ప్రయాణం',
    bn: 'নাগরিক যাত্রা',
    mr: 'नागरिक प्रवास',
    gu: 'નાગરિક યાત્રા',
    kn: 'ನಾಗರಿಕ ಪ್ರಯಾಣ',
    ml: 'പൗര യാത്ര',
    pa: 'ਨਾਗਰਿਕ ਯਾਤਰਾ',
    od: 'ନାଗରିକ ଯାତ୍ରା',
  },
  'nav.partners': {
    en: 'Partner Map',
    hi: 'पार्टनर मानचित्र',
    ta: 'பங்குதாரர் வரைபடம்',
    te: 'భాగస్వామి మ్యాప్',
    bn: 'অংশীদার মানচিত্র',
    mr: 'भागीदार नकाशा',
    gu: 'ભાગીદાર નકશો',
    kn: 'ಪಾಲುದಾರ ನಕ್ಷೆ',
    ml: 'പങ്കാളി ഭൂപടം',
    pa: 'ਸਾਥੀ ਨਕਸ਼ਾ',
    od: 'ସାଥୀ ମାନଚିତ୍ର',
  },
  'nav.officer': {
    en: 'Officer Portal',
    hi: 'अधिकारी पोर्टल',
    ta: 'அதிகாரி போர்டல்',
    te: 'అధికారి పోర్టల్',
    bn: 'কর্মকর্তা পোর্টাল',
    mr: 'अधिकारी पोर्टल',
    gu: 'અધિકારી પોર્ટલ',
    kn: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    ml: 'ഓഫീസർ പോർട്ടൽ',
    pa: 'ਅਧਿਕਾਰੀ ਪੋਰਟਲ',
    od: 'ଅଧିକାରୀ ପୋର୍ଟାଲ',
  },
  'nav.admin': {
    en: 'Admin Studio',
    hi: 'प्रशासन स्टूडियो',
    ta: 'நிர்வாக ஸ்டூடியோ',
    te: 'అడ్మిన్ స్టూడియో',
    bn: 'অ্যাডমিন স্টুডিও',
    mr: 'प्रशासन स्टुडिओ',
    gu: 'એડમિન સ્ટુડિયો',
    kn: 'ನಿರ್ವಾಹಕ ಸ್ಟುಡಿಯೋ',
    ml: 'അഡ്മിൻ സ്റ്റുഡിയോ',
    pa: 'ਐਡਮਿਨ ਸਟੂਡੀਓ',
    od: 'ଆଡମିନ ଷ୍ଟୁଡିଓ',
  },
  'nav.faq': {
    en: 'FAQ',
    hi: 'सवाल-जवाब',
    ta: 'கேள்வி-பதில்',
    te: 'ప్రశ్నలు-జవాబులు',
    bn: 'প্রশ্ন-উত্তর',
    mr: 'प्रश्न-उत्तरे',
    gu: 'પ્રશ્ન-ઉત્તર',
    kn: 'ಪ್ರಶ್ನೆ-ಉತ್ತರ',
    ml: 'ചോദ്യം-ഉത്തരം',
    pa: 'ਸਵਾਲ-ਜਵਾਬ',
    od: 'ପ୍ରଶ୍ନ-ଉତ୍ତର',
  },

  // ============================================================
  // HERO / LANDING
  // ============================================================
  'hero.badge': {
    en: 'SAARTHI Prototype • AI-Powered Scheme Matching',
    hi: 'SAARTHI प्रोटोटाइप • AI-आधारित योजना मिलान',
    ta: 'SAARTHI முன்மாதிரி • AI-இயக்கப்பட்ட திட்டப் பொருத்தம்',
    te: 'SAARTHI ప్రోటోటైప్ • AI-ఆధారిత పథక매칭',
    bn: 'SAARTHI প্রোটোটাইপ • AI-চালিত প্রকল্প ম্যাচিং',
    mr: 'SAARTHI प्रोटोटाइप • AI-चालित योजना जुळवणी',
    gu: 'SAARTHI પ્રોટોટાઇપ • AI-સંચાલિત યોજના મેચિંગ',
    kn: 'SAARTHI ಪ್ರೋಟೋಟೈಪ್ • AI-ಚಾಲಿತ ಯೋಜನೆ ಹೊಂದಾಣಿಕೆ',
    ml: 'SAARTHI പ്രോട്ടോടൈപ്പ് • AI-പ്രവർത്തിത പദ്ധതി മാച്ചിംഗ്',
    pa: 'SAARTHI ਪ੍ਰੋਟੋਟਾਈਪ • AI-ਸੰਚਾਲਿਤ ਸਕੀਮ ਮੈਚਿੰਗ',
    od: 'SAARTHI ପ୍ରୋଟୋଟାଇପ୍ • AI-ଚାଳିତ ଯୋଜନା ମ୍ୟାଚିଂ',
  },
  'hero.title': {
    en: 'AI Credit Scheme Navigator for Marginalized Entrepreneurs',
    hi: 'वंचित उद्यमियों के लिए AI ऋण योजना नेविगेटर',
    ta: 'ஒதுக்கப்பட்ட தொழில்முனைவோருக்கான AI கடன் திட்ட வழிகாட்டி',
    te: 'అట్టడుగు వ్యాపారవేత్తల కోసం AI క్రెడిట్ స్కీమ్ నావిగేటర్',
    bn: 'প্রান্তিক উদ্যোক্তাদের জন্য AI ক্রেডিট স্কিম নেভিগেটর',
    mr: 'वंचित उद्योजकांसाठी AI ऋण योजना मार्गदर्शक',
    gu: 'વંચિત ઉદ્યમીઓ માટે AI ક્રેડિટ સ્કીમ નેવિગેટર',
    kn: 'ಅಂಚಿನ ಉದ್ಯಮಿಗಳಿಗಾಗಿ AI ಸಾಲ ಯೋಜನೆ ನ್ಯಾವಿಗೇಟರ್',
    ml: 'പാർശ്വവൽക്കരിക്കപ്പെട്ട സംരംഭകർക്കായി AI ക്രെഡിറ്റ് സ്കീം നാവിഗേറ്റർ',
    pa: 'ਹਾਸ਼ੀਏ \'ਤੇ ਰਹਿੰਦੇ ਉੱਦਮੀਆਂ ਲਈ AI ਕ੍ਰੈਡਿਟ ਸਕੀਮ ਨੈਵੀਗੇਟਰ',
    od: 'ପ୍ରାନ୍ତିକ ଉଦ୍ୟୋଗୀମାନଙ୍କ ପାଇଁ AI କ୍ରେଡିଟ ସ୍କିମ ନାଭିଗେଟର',
  },
  'hero.getStarted': {
    en: 'Get Started — Find Your Scheme',
    hi: 'शुरू करें — अपनी योजना खोजें',
    ta: 'தொடங்கு — உங்கள் திட்டத்தைக் கண்டறியுங்கள்',
    te: 'ప్రారంభించండి — మీ పథకాన్ని కనుగొనండి',
    bn: 'শুরু করুন — আপনার প্রকল্প খুঁজুন',
    mr: 'सुरू करा — तुमची योजना शोधा',
    gu: 'શરૂ કરો — તમારી યોજના શોધો',
    kn: 'ಪ್ರಾರಂಭಿಸಿ — ನಿಮ್ಮ ಯೋಜನೆ ಹುಡುಕಿ',
    ml: 'ആരംഭിക്കുക — നിങ്ങളുടെ പദ്ധതി കണ്ടെത്തുക',
    pa: 'ਸ਼ੁਰੂ ਕਰੋ — ਆਪਣੀ ਸਕੀਮ ਲੱਭੋ',
    od: 'ଆରମ୍ଭ କରନ୍ତୁ — ଆପଣଙ୍କ ଯୋଜନା ଖୋଜନ୍ତୁ',
  },

  // ============================================================
  // STEPPER
  // ============================================================
  'step.venture': {
    en: '1. Venture',
    hi: '1. उद्यम',
    ta: '1. தொழில்',
    te: '1. వ్యాపారం',
    bn: '1. উদ্যোগ',
    mr: '1. उद्योग',
    gu: '1. ઉદ્યમ',
    kn: '1. ಉದ್ಯಮ',
    ml: '1. സംരംഭം',
    pa: '1. ਉੱਦਮ',
    od: '1. ଉଦ୍ୟୋଗ',
  },
  'step.schemes': {
    en: '2. Schemes',
    hi: '2. योजनाएं',
    ta: '2. திட்டங்கள்',
    te: '2. పథకాలు',
    bn: '2. প্রকল্প',
    mr: '2. योजना',
    gu: '2. યોજનાઓ',
    kn: '2. ಯೋಜನೆಗಳು',
    ml: '2. പദ്ധതികൾ',
    pa: '2. ਸਕੀਮਾਂ',
    od: '2. ଯୋଜନା',
  },
  'step.repayment': {
    en: '3. Repayment',
    hi: '3. किस्त',
    ta: '3. திருப்பிச்செலுத்தல்',
    te: '3. తిరిగి చెల్లింపు',
    bn: '3. পরিশোধ',
    mr: '3. परतफेड',
    gu: '3. ચૂકવણી',
    kn: '3. ಮರುಪಾವತಿ',
    ml: '3. തിരിച്ചടവ്',
    pa: '3. ਭੁਗਤਾਨ',
    od: '3. ପରିଶୋଧ',
  },
  'step.bank': {
    en: '4. Bank',
    hi: '4. बैंक',
    ta: '4. வங்கி',
    te: '4. బ్యాంకు',
    bn: '4. ব্যাংক',
    mr: '4. बँक',
    gu: '4. બેંક',
    kn: '4. ಬ್ಯಾಂಕ್',
    ml: '4. ബാങ്ക്',
    pa: '4. ਬੈਂਕ',
    od: '4. ବ୍ୟାଙ୍କ',
  },
  'step.documents': {
    en: '5. Documents',
    hi: '5. दस्तावेज़',
    ta: '5. ஆவணங்கள்',
    te: '5. పత్రాలు',
    bn: '5. নথিপত্র',
    mr: '5. कागदपत्रे',
    gu: '5. દસ્તાવેજો',
    kn: '5. ದಾಖಲೆಗಳು',
    ml: '5. രേഖകൾ',
    pa: '5. ਦਸਤਾਵੇਜ਼',
    od: '5. ଡକୁମେଣ୍ଟ',
  },
  'step.passport': {
    en: '6. Passport',
    hi: '6. पासपोर्ट',
    ta: '6. பாஸ்போர்ட்',
    te: '6. పాస్పోర్ట్',
    bn: '6. পাসপোর্ট',
    mr: '6. पासपोर्ट',
    gu: '6. પાસપોર્ટ',
    kn: '6. ಪಾಸ್ಪೋರ್ಟ್',
    ml: '6. പാസ്പോർട്ട്',
    pa: '6. ਪਾਸਪੋਰਟ',
    od: '6. ପାସପୋର୍ଟ',
  },
  'step.dashboard': {
    en: '7. Dashboard',
    hi: '7. डैशबोर्ड',
    ta: '7. டேஷ்போர்டு',
    te: '7. డాష్‌బోర్డ్',
    bn: '7. ড্যাশবোর্ড',
    mr: '7. डॅशबोर्ड',
    gu: '7. ડેશબોર્ડ',
    kn: '7. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    ml: '7. ഡാഷ്ബോർഡ്',
    pa: '7. ਡੈਸ਼ਬੋਰਡ',
    od: '7. ଡ୍ୟାସବୋର୍ଡ',
  },

  // ============================================================
  // COMMON ACTIONS
  // ============================================================
  'action.proceed': {
    en: 'Proceed',
    hi: 'आगे बढ़ें',
    ta: 'தொடரவும்',
    te: 'కొనసాగించండి',
    bn: 'এগিয়ে যান',
    mr: 'पुढे जा',
    gu: 'આગળ વધો',
    kn: 'ಮುಂದುವರಿಸಿ',
    ml: 'തുടരുക',
    pa: 'ਅੱਗੇ ਵਧੋ',
    od: 'ଆଗକୁ ବଢନ୍ତୁ',
  },
  'action.back': {
    en: 'Back',
    hi: 'वापस',
    ta: 'பின்',
    te: 'వెనుకకు',
    bn: 'পিছনে',
    mr: 'मागे',
    gu: 'પાછા',
    kn: 'ಹಿಂದೆ',
    ml: 'പിന്നിലേക്ക്',
    pa: 'ਪਿੱਛੇ',
    od: 'ପଛକୁ',
  },
  'action.startNew': {
    en: 'Start New Application',
    hi: 'नया आवेदन शुरू करें',
    ta: 'புதிய விண்ணப்பம் தொடங்கு',
    te: 'కొత్త దరఖాస్తు ప్రారంభించండి',
    bn: 'নতুন আবেদন শুরু করুন',
    mr: 'नवीन अर्ज सुरू करा',
    gu: 'નવી અરજી શરૂ કરો',
    kn: 'ಹೊಸ ಅರ್ಜಿ ಪ್ರಾರಂಭಿಸಿ',
    ml: 'പുതിയ അപേക്ഷ ആരംഭിക്കുക',
    pa: 'ਨਵੀਂ ਅਰਜ਼ੀ ਸ਼ੁਰੂ ਕਰੋ',
    od: 'ନୂଆ ଆବେଦନ ଆରମ୍ଭ କରନ୍ତୁ',
  },
  'action.share': {
    en: 'Share via WhatsApp',
    hi: 'WhatsApp पर साझा करें',
    ta: 'WhatsApp மூலம் பகிரவும்',
    te: 'WhatsApp ద్వారా పంచుకోండి',
    bn: 'WhatsApp এ শেয়ার করুন',
    mr: 'WhatsApp वर शेअर करा',
    gu: 'WhatsApp પર શેર કરો',
    kn: 'WhatsApp ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಿ',
    ml: 'WhatsApp വഴി പങ്കിടുക',
    pa: 'WhatsApp \'ਤੇ ਸ਼ੇਅਰ ਕਰੋ',
    od: 'WhatsApp ରେ ସେୟାର କରନ୍ତୁ',
  },

  // ============================================================
  // PROTOTYPE DISCLAIMER
  // ============================================================
  'disclaimer': {
    en: '⚠️ SIH 2026 Prototype — This is a student hackathon demo, not an official government service. Scheme data is sourced from published guidelines and may not reflect real-time availability.',
    hi: '⚠️ SIH 2026 प्रोटोटाइप — यह छात्र हैकाथॉन डेमो है, आधिकारिक सरकारी सेवा नहीं। योजना डेटा प्रकाशित दिशानिर्देशों से लिया गया है।',
    ta: '⚠️ SIH 2026 முன்மாதிரி — இது ஒரு மாணவர் ஹாக்கத்தான் டெமோ, அதிகாரபூர்வ அரசு சேவை அல்ல.',
    te: '⚠️ SIH 2026 ప్రోటోటైప్ — ఇది విద్యార్థి హ్యాకథాన్ డెమో, అధికారిక ప్రభుత్వ సేవ కాదు.',
    bn: '⚠️ SIH 2026 প্রোটোটাইপ — এটি ছাত্র হ্যাকাথন ডেমো, সরকারি পরিষেবা নয়।',
    mr: '⚠️ SIH 2026 प्रोटोटाइप — हे विद्यार्थी हॅकॅथॉन डेमो आहे, अधिकृत सरकारी सेवा नाही.',
    gu: '⚠️ SIH 2026 પ્રોટોટાઇપ — આ વિદ્યાર્થી હેકેથોન ડેમો છે, સત્તાવાર સરકારી સેવા નથી.',
    kn: '⚠️ SIH 2026 ಪ್ರೋಟೋಟೈಪ್ — ಇದು ವಿದ್ಯಾರ್ಥಿ ಹ್ಯಾಕಥಾನ್ ಡೆಮೊ, ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸೇವೆ ಅಲ್ಲ.',
    ml: '⚠️ SIH 2026 പ്രോട്ടോടൈപ്പ് — ഇത് ഒരു വിദ്യാർത്ഥി ഹാക്കത്തോൺ ഡെമോ ആണ്, ഔദ്യോഗിക സർക്കാർ സേവനമല്ല.',
    pa: '⚠️ SIH 2026 ਪ੍ਰੋਟੋਟਾਈਪ — ਇਹ ਵਿਦਿਆਰਥੀ ਹੈਕਾਥਾਨ ਡੈਮੋ ਹੈ, ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਸੇਵਾ ਨਹੀਂ।',
    od: '⚠️ SIH 2026 ପ୍ରୋଟୋଟାଇପ୍ — ଏହା ଛାତ୍ର ହ୍ୟାକାଥନ୍ ଡେମୋ, ସରକାରୀ ସେବା ନୁହେଁ।',
  },

  // AI Sahayak
  'ai.sahayak': {
    en: 'AI Sahayak',
    hi: 'AI सहायक',
    ta: 'AI உதவியாளர்',
    te: 'AI సహాయకం',
    bn: 'AI সহায়ক',
    mr: 'AI सहाय्यक',
    gu: 'AI સહાયક',
    kn: 'AI ಸಹಾಯಕ',
    ml: 'AI സഹായി',
    pa: 'AI ਸਹਾਇਕ',
    od: 'AI ସହାୟକ',
  },
};

/**
 * Get a translated string by key and language code.
 * Falls back to Hindi, then English if translation not available.
 */
export function t(key, lang = 'en') {
  const translation = TRANSLATIONS[key];
  if (!translation) return key;
  return translation[lang] || translation.hi || translation.en || key;
}

/**
 * Get the speech recognition language code for Web Speech API
 */
export function getSpeechLang(lang) {
  return SPEECH_LANG_MAP[lang] || 'en-IN';
}

/**
 * Format currency in Indian format
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate WhatsApp share link with scheme details
 */
export function getWhatsAppShareLink(scheme, profile, lang = 'en') {
  const text = lang === 'hi'
    ? `🏛️ *SAARTHI AI योजना अनुशंसा*\n\n✅ योजना: ${scheme?.nameHindi || scheme?.name}\n💰 पात्र ऋण: ₹${(scheme?.eligibleFunding || 0).toLocaleString('en-IN')}\n📊 ब्याज दर: ${scheme?.effectiveInterestRate || scheme?.interestRatePercent}%\n🎯 सब्सिडी: ₹${(scheme?.directSubsidyAmount || 0).toLocaleString('en-IN')}\n\n👤 आवेदक: ${profile?.applicantName || 'नागरिक'}\n📍 ${profile?.district || ''}, ${profile?.state || ''}\n\n🔗 SAARTHI पर और जानें: [SIH 2026 Prototype]`
    : `🏛️ *SAARTHI AI Scheme Recommendation*\n\n✅ Scheme: ${scheme?.name}\n💰 Eligible Loan: ₹${(scheme?.eligibleFunding || 0).toLocaleString('en-IN')}\n📊 Interest: ${scheme?.effectiveInterestRate || scheme?.interestRatePercent}%\n🎯 Subsidy: ₹${(scheme?.directSubsidyAmount || 0).toLocaleString('en-IN')}\n\n👤 Applicant: ${profile?.applicantName || 'Citizen'}\n📍 ${profile?.district || ''}, ${profile?.state || ''}\n\n🔗 Learn more on SAARTHI: [SIH 2026 Prototype]`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
