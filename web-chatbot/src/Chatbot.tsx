import React, { useState, useRef, useEffect } from 'react';
import { SpeechRecognitionManager, speakText } from './speechUtils';
import { getHealthcareResponse, HEALTHCARE_KNOWLEDGE_BASE } from './healthcareKB';
import './Chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognitionManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting = language === 'english' 
      ? HEALTHCARE_KNOWLEDGE_BASE.greetings[1]
      : HEALTHCARE_KNOWLEDGE_BASE.greetings[0];
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: greeting,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages([botMessage]);
    speakText(greeting, language === 'english' ? 'en-US' : 'hi-IN');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const onResult = (transcript: string, isFinal: boolean) => {
      if (isFinal && transcript.trim()) {
        handleSendMessage(transcript);
      }
    };

    speechRecognitionRef.current = new SpeechRecognitionManager(
      onResult,
      language === 'english' ? 'en-US' : 'hi-IN',
    );
  }, [language]);

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputText;
    
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    const response = getHealthcareResponse(text, language);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(response, language === 'english' ? 'en-US' : 'hi-IN');
    }, 500);
  };

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      speechRecognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLanguage);
    
    const message = newLanguage === 'english'
      ? 'Switched to English. How can I help?'
      : 'हिंदी में स्विच किया गया। मैं आपकी कैसे मदद कर सकता हूँ?';
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    speakText(message, newLanguage === 'english' ? 'en-US' : 'hi-IN');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🏥 Healthcare Assistant</h1>
        <div className="header-controls">
          <button 
            className={`lang-btn ${language === 'english' ? 'active' : ''}`}
            onClick={toggleLanguage}
          >
            {language === 'english' ? 'EN' : 'HI'}
          </button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="timestamp">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <div className="input-group">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'english' ? 'Type your health concern...' : 'अपनी स्वास्थ्य समस्या बताएं...'}
            className="input-field"
          />
          
          <button
            onClick={toggleListening}
            className={`mic-btn ${isListening ? 'active' : ''}`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            🎤
          </button>

          <button
            onClick={() => handleSendMessage()}
            className="send-btn"
            title="Send message"
          >
            ➤
          </button>
        </div>

        {isListening && (
          <div className="listening-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <p>{language === 'english' ? 'Listening...' : 'सुन रहे हैं...'}</p>
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        <p className="disclaimer">
          {language === 'english'
            ? '⚠️ Disclaimer: This is an AI assistant for general health information. Always consult a doctor for medical advice.'
            : '⚠️ अस्वीकरण: यह सामान्य स्वास्थ्य जानकारी के लिए एक AI सहायक है। चिकित्सा सलाह के लिए हमेशा डॉक्टर से परामर्श लें।'}
        </p>
      </div>
    </div>
  );
}
