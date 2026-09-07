// Multilingual Voice-First Engine & Conversational Intent Classifier
// Integrates browser Web Speech API (STT & TTS) with acoustic fallbacks and natural intent extraction.

export class VoiceEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  startListening(lang = 'hi-IN', onResult, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError(new Error("Web Speech API is not supported in this browser. You can type or use one-click audio presets."));
      return;
    }

    this.recognition.lang = lang;
    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      if (onError) onError(err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, lang = 'hi-IN', onEnd) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for clear rural/civic comprehension
    utterance.pitch = 1.0;

    // Pick best available Indian accent voice if available
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Natural Conversational Intent Extraction:
   * Parses natural conversational phrases into structured profile fields.
   * Example: "Mujhe silai ka kaam shuru karne ke liye lagbhag 1.2 lakh chahiye"
   */
  static extractIntent(rawText) {
    const text = (rawText || "").toLowerCase().trim();
    if (!text) {
      return { confidence: 0, clarificationNeeded: true };
    }

    let purpose = "business";
    let categoryName = "General Enterprise";
    let projectCost = null;
    let confidence = 0.5;

    // 1. Detect Purpose
    if (text.includes("padhai") || text.includes("study") || text.includes("college") || text.includes("btech") || text.includes("mbbs") || text.includes("degree") || text.includes("education") || text.includes("shiksha")) {
      purpose = "education";
      categoryName = "Higher Professional Education";
      confidence += 0.3;
    }

    // 2. Detect Specific Business Categories
    if (text.includes("silai") || text.includes("tailor") || text.includes("stitching") || text.includes("boutique") || text.includes("kapde")) {
      categoryName = "Tailoring & Garment Unit";
      confidence += 0.3;
    } else if (text.includes("chai") || text.includes("tea stall") || text.includes("dhaba") || text.includes("tapri")) {
      categoryName = "Tea Stall & Refreshments";
      confidence += 0.3;
    } else if (text.includes("kirana") || text.includes("grocery") || text.includes("retail") || text.includes("dukaan") || text.includes("store")) {
      categoryName = "Kirana & Retail Store";
      confidence += 0.3;
    } else if (text.includes("auto") || text.includes("rickshaw") || text.includes("transport") || text.includes("taxi")) {
      categoryName = "Commercial Transport";
      confidence += 0.3;
    } else if (text.includes("dairy") || text.includes("pashupalan") || text.includes("milk") || text.includes("gaay") || text.includes("bhains")) {
      categoryName = "Dairy & Livestock Unit";
      confidence += 0.3;
    } else if (text.includes("construction") || text.includes("polyhouse") || text.includes("kheti") || text.includes("plantation")) {
      categoryName = "Horticulture & Civil Enterprise";
      confidence += 0.3;
    }

    // 3. Extract Monetary Amounts
    // Matches patterns like: 1.2 lakh, 12 lakh, 1.40 lakh, 50 hazar, 50,000, 120000, 140000
    const lakhMatch = text.match(/(\d+(\.\d+)?)\s*(lakh|lac|लाख)/i);
    const hazarMatch = text.match(/(\d+(\.\d+)?)\s*(hazar|k|हजार|thousand)/i);
    const rawNumberMatch = text.match(/₹?\s*(\d{2,8})/);

    if (lakhMatch) {
      projectCost = Math.round(parseFloat(lakhMatch[1]) * 100000);
      confidence += 0.3;
    } else if (hazarMatch) {
      projectCost = Math.round(parseFloat(hazarMatch[1]) * 1000);
      confidence += 0.3;
    } else if (rawNumberMatch) {
      projectCost = parseInt(rawNumberMatch[1], 10);
      confidence += 0.2;
    }

    // Check if ambiguity requires clarification
    const clarificationNeeded = !projectCost || confidence < 0.6;

    return {
      rawText,
      purpose,
      categoryName,
      projectCost,
      confidence: Math.min(1.0, confidence),
      clarificationNeeded
    };
  }
}

export const PRESET_VOICE_PROMPTS = [
  {
    id: "rani-tailoring",
    label: "Rani's Story (Hindi - ₹1.20L Silai)",
    lang: "hi-IN",
    text: "मुझे सिलाई का काम शुरू करने के लिए लगभग ₹1.2 लाख चाहिए।",
    translation: "I need approximately ₹1.2 lakh to start a tailoring business.",
    targetCost: 120000,
    category: "Tailoring & Garment Unit",
    purpose: "business"
  },
  {
    id: "boundary-term-loan",
    label: "Scale Up Boundary (₹12 Lakh Boutique)",
    lang: "hi-IN",
    text: "मुझे बड़े बुटीक और रेडीमेड गारमेंट निर्माण के लिए ₹12 लाख का लोन चाहिए।",
    translation: "I need a loan of ₹12 lakh for a large boutique and ready-made garment manufacturing.",
    targetCost: 1200000,
    category: "Commercial Manufacturing",
    purpose: "business"
  },
  {
    id: "marathi-kirana",
    label: "Marathi Entrepreneur (₹1.40L Kirana)",
    lang: "mr-IN",
    text: "मला किराणा दुकान आणि छोटे व्यवसाय सुरू करण्यासाठी ₹1.4 लाख हवे आहेत.",
    translation: "I need ₹1.4 lakh to start a grocery shop and small business.",
    targetCost: 140000,
    category: "Kirana & Retail Store",
    purpose: "business"
  },
  {
    id: "education-btech",
    label: "Education Student (₹8 Lakh B.Tech)",
    lang: "hi-IN",
    text: "मुझे बीटेक इंजीनियरिंग कॉलेज फीस के लिए ₹8 लाख का शिक्षा ऋण चाहिए।",
    translation: "I need an education loan of ₹8 lakh for B.Tech engineering college fees.",
    targetCost: 800000,
    category: "Higher Technical Education",
    purpose: "education"
  }
];
