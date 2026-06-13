export const HEALTHCARE_KNOWLEDGE_BASE = {
  greetings: [
    "नमस्ते! मैं एक स्वास्थ्य सहायक हूँ। आपको कैसे मदद करूँ?",
    "Hello! I am a healthcare assistant. How can I help you today?",
  ],
  symptoms: {
    fever: {
      en: "Fever can be caused by infections, inflammation, or other conditions. Have you measured your temperature? Do you have other symptoms like cough or body aches?",
      hi: "बुखार संक्रमण, सूजन या अन्य स्थितियों के कारण हो सकता है। क्या आपने अपना तापमान नापा है? क्या आपको खांसी या बदन दर्द जैसे अन्य लक्षण हैं?",
    },
    cough: {
      en: "Cough can be dry or productive. How long have you had this cough? Do you have phlegm or mucus?",
      hi: "खांसी सूखी या उत्पादक हो सकती है। आपको यह खांसी कितने समय से है? क्या आपको बलगम आ रहा है?",
    },
    breathlessness: {
      en: "Shortness of breath can indicate various conditions. When did this start? Do you have chest pain or discomfort?",
      hi: "सांस की कमी विभिन्न स्थितियों का संकेत दे सकती है। यह कब शुरू हुआ? क्या आपको छाती में दर्द या बेचैनी है?",
    },
    headache: {
      en: "Headaches can have many causes. Is it a constant dull pain or sharp pain? Have you taken any medication?",
      hi: "सिरदर्द के कई कारण हो सकते हैं। क्या यह हल्का दर्द है या तेज? क्या आपने कोई दवा ली है?",
    },
  },
  suggestions: {
    general_health: {
      en: "For general wellness: Stay hydrated, get adequate sleep, exercise regularly, and eat a balanced diet.",
      hi: "सामान्य स्वास्थ्य के लिए: पानी पिएं, पर्याप्त नींद लें, नियमित व्यायाम करें, और संतुलित आहार खाएं।",
    },
    when_to_see_doctor: {
      en: "See a doctor if: symptoms persist for more than a week, you have high fever (>101°F), difficulty breathing, or chest pain.",
      hi: "डॉक्टर के पास जाएं यदि: लक्षण एक सप्ताह से अधिक समय तक रहें, आपको उच्च बुखार (>101°F) हो, सांस लेने में कठिनाई हो, या छाती में दर्द हो।",
    },
    emergency: {
      en: "Seek emergency care immediately if you experience: severe chest pain, difficulty breathing, loss of consciousness, or severe bleeding.",
      hi: "तुरंत आपातकालीन सेवा प्राप्त करें यदि: गंभीर छाती का दर्द, सांस लेने में गंभीर कठिनाई, चेतना की हानि, या गंभीर रक्तस्राव हो।",
    },
  },
};

export function getHealthcareResponse(userInput: string, language: string): string {
  const input = userInput.toLowerCase().trim();
  
  if (input.includes('fever') || input.includes('बुखार') || input.includes('temperature')) {
    return HEALTHCARE_KNOWLEDGE_BASE.symptoms.fever[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('cough') || input.includes('खांसी') || input.includes('throat')) {
    return HEALTHCARE_KNOWLEDGE_BASE.symptoms.cough[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('breath') || input.includes('सांस') || input.includes('breathing')) {
    return HEALTHCARE_KNOWLEDGE_BASE.symptoms.breathlessness[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('headache') || input.includes('सिरदर्द') || input.includes('head')) {
    return HEALTHCARE_KNOWLEDGE_BASE.symptoms.headache[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('health') || input.includes('wellness') || input.includes('स्वास्थ्य')) {
    return HEALTHCARE_KNOWLEDGE_BASE.suggestions.general_health[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('doctor') || input.includes('डॉक्टर') || input.includes('when to see')) {
    return HEALTHCARE_KNOWLEDGE_BASE.suggestions.when_to_see_doctor[language === 'hindi' ? 'hi' : 'en'];
  }
  if (input.includes('emergency') || input.includes('आपातकाल') || input.includes('urgent')) {
    return HEALTHCARE_KNOWLEDGE_BASE.suggestions.emergency[language === 'hindi' ? 'hi' : 'en'];
  }

  return language === 'hindi'
    ? "कृपया अपनी स्वास्थ्य समस्या के बारे में अधिक विवरण दें। मैं बुखार, खांसी, सांस की कमी, सिरदर्द आदि के बारे में जानकारी प्रदान कर सकता हूँ।"
    : "Please provide more details about your health concern. I can help with information about fever, cough, shortness of breath, headaches, and more.";
}
