import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowRight, ShieldCheck, HelpCircle, RefreshCw 
} from 'lucide-react';
import { chatWithSahayak } from '../services/api';
import { VoiceEngine } from '../engines/voiceEngine';

export function AIAssistantModal({ isOpen, onClose, lang = 'hi', profile = {}, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      agentName: 'Awaaz Sahayak (AI Caseworker)',
      text: lang === 'hi' 
        ? "नमस्ते! मैं सारथी (SAARTHI) का स्वायत्त AI केसवर्कर हूँ। आप अपने व्यवसाय, ऋण आवश्यकता (जैसे: ₹1.2 लाख सिलाई इकाई), या आवश्यक कागजातों के बारे में बोलकर या लिखकर पूछ सकते हैं।"
        : "Hello! I am your SAARTHI Autonomous AI Caseworker. Feel free to speak or type about your business goals, loan amounts (e.g., ₹1.2L tailoring setup), or documentation doubts.",
      actions: [
        { label: lang === 'hi' ? "सिलाई व्यवसाय हेतु सब्सिडी?" : "Subsidy for Tailoring?", query: "सिलाई मशीन के लिए कितनी सब्सिडी मिलेगी?" },
        { label: lang === 'hi' ? "दस्तावेज क्या चाहिए?" : "Required Documents?", query: "लोन के लिए क्या-क्या दस्तावेज चाहिए?" },
        { label: lang === 'hi' ? "जाति प्रमाण पत्र नहीं है?" : "No Caste Certificate?", query: "मेरे पास जाति प्रमाण पत्र नहीं है, क्या करूँ?" }
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const voiceEngineRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    voiceEngineRef.current = new VoiceEngine();
    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stopListening();
        voiceEngineRef.current.stopSpeaking();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    setInputVal('');
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }));
      const response = await chatWithSahayak(query, history, profile);

      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        agentName: response.agent || 'SAARTHI AI Caseworker',
        text: response.reply,
        actions: (response.suggestedActions || []).map(a => ({
          label: a.label,
          actionType: a.action
        }))
      };

      setMessages(prev => [...prev, agentMsg]);

      // Auto-speak in vernacular if speech synthesis is available
      if (voiceEngineRef.current) {
        voiceEngineRef.current.speak(response.reply.replace(/[*#]/g, ''), lang === 'hi' ? 'hi-IN' : 'en-IN', () => {
          setIsSpeaking(false);
        });
        setIsSpeaking(true);
      }
    } catch (err) {
      console.error('[AI Assistant Error]:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          agentName: 'System Caseworker',
          text: lang === 'hi' 
            ? "माफ़ कीजिए, AI सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें या सीधे योजनाएं देखें।" 
            : "Apologies, the AI Caseworker could not be reached. Please retry or browse schemes directly."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      voiceEngineRef.current?.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceEngineRef.current?.startListening(
        lang === 'hi' ? 'hi-IN' : 'en-IN',
        (transcript) => {
          setIsListening(false);
          if (transcript) handleSend(transcript);
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
    }
  };

  const toggleSpeak = (text) => {
    if (isSpeaking) {
      voiceEngineRef.current?.stopSpeaking();
      setIsSpeaking(false);
    } else {
      voiceEngineRef.current?.speak(text.replace(/[*#]/g, ''), lang === 'hi' ? 'hi-IN' : 'en-IN', () => {
        setIsSpeaking(false);
      });
      setIsSpeaking(true);
    }
  };

  const handleActionClick = (action) => {
    if (action.query) {
      handleSend(action.query);
      return;
    }

    if (action.actionType && onNavigate) {
      onClose();
      switch (action.actionType) {
        case 'OPEN_INTAKE':
          onNavigate('intake');
          break;
        case 'OPEN_SCHEMES':
          onNavigate('schemes');
          break;
        case 'OPEN_DOCUMENTS':
          onNavigate('documents');
          break;
        case 'OPEN_PARTNERS':
          onNavigate('partners');
          break;
        case 'OPEN_REPAYMENT':
          onNavigate('repayment');
          break;
        case 'GENERATE_PASSPORT':
          onNavigate('passport');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div 
      className="ai-modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="ai-modal-box"
        style={{
          width: '100%',
          maxWidth: '650px',
          height: '85vh',
          maxHeight: '750px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.1rem 1.4rem',
            background: 'linear-gradient(135deg, #0b192c 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff6f1e, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(255, 111, 30, 0.5)'
              }}
            >
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
                  SAARTHI AI Sahayak (Autonomous Caseworker)
                </h3>
                <span 
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    background: '#10b981',
                    color: '#ffffff',
                    fontWeight: '800'
                  }}
                >
                  LIVE AGENT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                {lang === 'hi' ? 'ग्रामीण व वंचित उद्यमियों हेतु बहुभाषी क्रेडिट परामर्शदाता' : 'Vernacular Credit Caseworker for Marginalized Entrepreneurs'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div 
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {messages.map((m) => (
            <div 
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'agent' && (
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={12} color="#ff6f1e" />
                  <span>{m.agentName}</span>
                </div>
              )}

              <div 
                style={{
                  padding: '0.9rem 1.15rem',
                  borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.sender === 'user' ? '#0f393b' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                  fontSize: '0.92rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
                  border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>

              {/* Action Pills */}
              {m.actions && m.actions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {m.actions.map((act, i) => (
                    <button 
                      key={i}
                      type="button"
                      onClick={() => handleActionClick(act)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        background: '#e0f2fe',
                        border: '1px solid #7dd3fc',
                        color: '#0369a1',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span>{act.label}</span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              )}

              {/* TTS Read Aloud button for agent messages */}
              {m.sender === 'agent' && (
                <div style={{ marginTop: '0.35rem' }}>
                  <button 
                    type="button"
                    onClick={() => toggleSpeak(m.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: 0
                    }}
                  >
                    {isSpeaking ? <VolumeX size={12} color="#ea580c" /> : <Volume2 size={12} />}
                    <span>{isSpeaking ? (lang === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio') : (lang === 'hi' ? 'सुनें (Audio)' : 'Listen')}</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div 
                style={{
                  padding: '0.8rem 1.1rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#64748b'
                }}
              >
                <RefreshCw size={14} className="animate-spin" color="#ff6f1e" />
                <span>{lang === 'hi' ? 'एजेंटिक तर्क सक्रिय है (Sense ➔ Reason)...' : 'Agentic Reasoner computing policy fit...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div 
          style={{
            padding: '0.85rem 1.25rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          {/* Mic Button */}
          <button 
            type="button"
            onClick={toggleMic}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isListening ? '#ef4444' : '#f1f5f9',
              border: isListening ? '2px solid #b91c1c' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isListening ? '#ffffff' : '#334155',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none'
            }}
            title={lang === 'hi' ? 'बोलकर पूछें' : 'Speak to AI'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Text Input */}
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'hi' ? 'अपनी भाषा में सवाल लिखें या माइक दबाकर बोलें...' : 'Type your question or press mic to speak...'}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '999px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.92rem',
              color: '#0f172a',
              outline: 'none'
            }}
          />

          {/* Send Button */}
          <button 
            type="button"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: inputVal.trim() ? '#ff6f1e' : '#cbd5e1',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: inputVal.trim() ? 'pointer' : 'default',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
