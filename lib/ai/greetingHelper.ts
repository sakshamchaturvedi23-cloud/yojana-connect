import { SupportedLanguage } from "./language";
import {
  CANONICAL_SCHEME_IDS,
  SCHEME_ALIASES,
  extractSchemeIdFromText,
} from "./schemeIdHelper";

export interface GreetingResult {
  type: "greeting" | "wellness" | "identity" | "gratitude" | "farewell" | "short_ack";
  answer: string;
}

export const GREETING_RESPONSES: Record<
  string,
  Record<SupportedLanguage, string>
> = {
  greeting: {
    en: "Hello! I am your Yojana Connect assistant. I can help you discover Indian government schemes, check your eligibility, understand financial benefits, and guide you through the application process. How can I assist you today?",
    hi: "नमस्ते! मैं आपका योजना कनेक्ट सहायक हूँ। मैं आपको सरकारी योजनाओं की जानकारी, पात्रता जाँचने, लाभ समझने और आवेदन प्रक्रिया में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता करूँ?",
    hinglish:
      "Namaste! Main aapka Yojana Connect assistant hoon. Main aapko sarkari yojanaon ki eligibility, benefits aur application process samajhne mein madad kar sakta hoon. Aaj main aapki kya madad kar sakta hoon?",
    mr: "नमस्कार! मी आपला योजना कनेक्ट सहाय्यक आहे. मी आपल्याला सरकारी योजनांची माहिती, पात्रता, मिळणारे फायदे आणि अर्ज प्रक्रियेबद्दल मार्गदर्शन करू शकतो. मी आज आपली काय मदत करू शकतो?",
    ta: "வணக்கம்! நான் உங்கள் யோஜனா கனெக்ட் உதவியாளர். அரசு திட்டங்கள், தகுதி வரம்புகள், நன்மைகள் மற்றும் விண்ணப்பிக்கும் முறைகள் பற்றி உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்?",
  },
  wellness: {
    en: "I'm doing well, thank you! I'm ready to help you explore government schemes and citizen welfare programs. What would you like to know about?",
    hi: "मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! मैं सरकारी योजनाओं और नागरिक लाभों से जुड़ी जानकारी के लिए तैयार हूँ। आप किस योजना के बारे में जानना चाहते हैं?",
    hinglish:
      "Main badhiya hoon, thank you! Main yahan aapko government schemes aur citizen benefits ke baare mein guide karne ke liye ready hoon. Aap kis scheme ke baare mein jaanna chahte hain?",
    mr: "मी छान आहे, विचारल्याबद्दल धन्यवाद! मी आपल्याला शासकीय योजना आणि लाभांबद्दल माहिती देण्यासाठी सज्ज आहे. आपल्याला कोणत्या योजनेबद्दल माहिती हवी आहे?",
    ta: "நான் நலமாக இருக்கிறேன், நன்றி! அரசு திட்டங்கள் பற்றிய தகவல்களை உங்களுக்கு வழங்க நான் தயாராக உள்ளேன். நீங்கள் எதைப் பற்றி தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
  },
  identity: {
    en: "I am Yojana Connect, an AI assistant designed to help Indian citizens discover and understand central and state government schemes (such as PM-KISAN, PM-JAY, PMMY, SSY, and more). You can ask me about scheme benefits, who is eligible, required documents, or how to apply!",
    hi: "मैं योजना कनेक्ट हूँ, एक AI सहायक जो नागरिकों को केंद्र और राज्य सरकार की योजनाओं (जैसे PM-KISAN, PM-JAY, PMMY, SSY आदि) को खोजने और समझने में सहायता करता है। आप मुझसे पात्रता, लाभ, जरूरी दस्तावेज या आवेदन प्रक्रिया के बारे में पूछ सकते हैं!",
    hinglish:
      "Main Yojana Connect hoon, ek AI assistant jo citizens ko government schemes (jaise PM-KISAN, PM-JAY, Mudra, SSY) samajhne mein madad karta hai. Aap mujhse eligibility, benefits, documents ya apply karne ke tareeqe ke baare mein pooch sakte hain!",
    mr: "मी योजना कनेक्ट आहे, नागरिकांना केंद्र आणि राज्य सरकारच्या विविध योजनांची (जसे की PM-KISAN, PM-JAY, PMMY, SSY) माहिती देण्यासाठी बनवलेला AI सहाय्यक. आपण मला योजनांचे निकष, कागदपत्रे किंवा अर्ज कसा करावा याबद्दल विचारू शकता!",
    ta: "நான் யோஜனா கனெக்ட், மத்திய மற்றும் மாநில அரசு திட்டங்களை (PM-KISAN, PM-JAY, PMMY, SSY போன்றவை) எளிதாக கண்டறிய உதவும் AI உதவியாளர். திட்ட தகுதிகள், தேவையான ஆவணங்கள் அல்லது விண்ணப்பிக்கும் முறை பற்றி என்னிடம் கேட்கலாம்!",
  },
  gratitude: {
    en: "You're very welcome! If you have any other questions about government schemes or need help checking your eligibility, feel free to ask.",
    hi: "आपका बहुत-बहुत स्वागत है! यदि आपके पास सरकारी योजनाओं के संबंध में कोई अन्य प्रश्न हैं या पात्रता जाँचनी है, तो बेझिझक पूछें।",
    hinglish:
      "Aapka swagat hai! Agar aapko kisi bhi scheme ya eligibility ke baare mein koi aur sawaal ho, toh zaroor poochein.",
    mr: "आपले मनःपूर्वक स्वागत! शासकीय योजनांबद्दल किंवा पात्रतेबद्दल आपल्याला आणखी काही विचारायचे असल्यास नक्की विचारा.",
    ta: "நல்வரவு! அரசு திட்டங்கள் அல்லது தகுதி குறித்து மேலும் ஏதேனும் கேள்விகள் இருந்தால் தயங்காமல் கேளுங்கள்.",
  },
  farewell: {
    en: "Goodbye! Have a great day ahead. Feel free to come back whenever you have questions about government schemes.",
    hi: "अलविदा! आपका दिन शुभ हो। सरकारी योजनाओं के बारे में जब भी कोई सवाल हो, आप यहाँ वापस आ सकते हैं।",
    hinglish:
      "Alvida! Aapka din shubh rahe. Jab bhi sarkari yojanaon ke baare mein koi sawaal ho, aap bina jhijhak yahan aa sakte hain.",
    mr: "पुन्हा भेटू! आपला दिवस चांगला जावो. शासकीय योजनांबद्दल माहितीसाठी केव्हाही संपर्क साधा.",
    ta: "மீண்டும் சந்திப்போம்! உங்கள் நாள் இனிய நாளாக அமையட்டும். அரசு திட்டங்கள் குறித்து எப்போது வேண்டுமானாலும் என்னிடம் கேட்கலாம்.",
  },
  short_ack: {
    en: "How can I assist you with government schemes today? You can ask about scheme eligibility, financial benefits, or how to apply.",
    hi: "आज मैं सरकारी योजनाओं में आपकी क्या सहायता करूँ? आप योजनाओं की पात्रता, वित्तीय लाभ या आवेदन के तरीके के बारे में पूछ सकते हैं।",
    hinglish:
      "Main sarkari schemes mein aapki kya madad kar sakta hoon? Aap eligibility, benefits ya apply karne ke steps pooch sakte hain.",
    mr: "मी आज शासकीय योजनांबाबत आपली काय मदत करू? आपण पात्रता, आर्थिक लाभ किंवा अर्ज कसा करावा याबद्दल विचारू शकता.",
    ta: "அரசு திட்டங்கள் தொடர்பாக இன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்? நீங்கள் தகுதி, நன்மைகள் அல்லது விண்ணப்பிக்கும் முறை பற்றி கேட்கலாம்.",
  },
};

const SUBSTANTIVE_KEYWORDS = [
  "scheme", "yojana", "yojna", "benefit", "benefits", "eligib", "apply", "applying",
  "document", "documents", "criteria", "portal", "subsidy", "subsidies", "loan",
  "pension", "ration", "kisan", "farmer", "student", "scholarship", "ayushman",
  "hospital", "card", "passbook", "grant", "allowance", "money", "amount",
  "rupee", "rupees", "rs", "inr", "crore", "lakh", "cost", "free", "process",
  "form", "registration", "deadline", "target", "income", "limit", "age",
  "patrata", "labh", "fayde", "fayda", "aavedan", "kaise milega", "dastavez",
  "kagadpatre", "mahiti", "kiti", "thittam", "thevai", "vinnappam",
  "pm-kisan", "pmkisan", "pmjay", "ayushman", "pmmy", "mudra", "ssy", "sukanya",
  "pmay", "awaas", "svanidhi", "vishwakarma", "pmuy", "ujjwala", "apy", "atal",
  "pmfby", "fasal", "bima", "pmgkay", "garib kalyan", "kcc", "kisan credit",
  "ignoaps", "vridha", "pension", "daksh", "stand up", "poshan", "mid day",
];

function hasSubstantiveContent(cleanText: string): boolean {
  if (!cleanText) return false;
  const lower = cleanText.toLowerCase().trim();

  // If input matches a scheme ID or alias directly
  if (
    (CANONICAL_SCHEME_IDS as readonly string[]).includes(lower) ||
    lower in SCHEME_ALIASES
  ) {
    return true;
  }

  // If a known scheme name/keyword is found in text
  if (extractSchemeIdFromText(lower)) {
    return true;
  }

  for (const kw of SUBSTANTIVE_KEYWORDS) {
    if (lower.includes(kw)) {
      return true;
    }
  }

  return false;
}

export function checkGreetingOrSmallTalk(
  rawMessage?: string | null,
  language: SupportedLanguage = "en"
): GreetingResult | null {
  if (!rawMessage || typeof rawMessage !== "string") return null;

  const trimmed = rawMessage.trim();
  if (!trimmed) return null;

  const normalized = trimmed
    .toLowerCase()
    .replace(/[।!?.,;:()"'/\\`~@#$%^&*_+=[\]{}|<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (hasSubstantiveContent(normalized)) {
    return null;
  }

  const wordCount = normalized.split(/\s+/).length;

  // 1. GREETINGS
  const greetingPattern =
    /^(hi+|hey+|heya|hello+|howdy|hola|greetings|namaste+|namaskar+|namaskaram|namaskara|pranam+|pranaam|ram ram|radhe radhe|jai hind|jai shri krishna|jai shree krishna|jai shree ram|jai shri ram|vanakkam|नमस्ते|नमस्कार|प्रणाम|राम राम|राधे राधे|जय हिन्द|जय श्री राम|வணக்கம்|good morning|good afternoon|good evening|good day|shubh prabhat|शुभ प्रभात|शुभ संध्या)(?: there| bot| assistant| ji| sir| mam| maam| friend)?$/i;
  if (greetingPattern.test(normalized)) {
    const responses = GREETING_RESPONSES.greeting;
    return {
      type: "greeting",
      answer: responses[language] || responses.en,
    };
  }

  // 2. WELLNESS / "HOW ARE YOU"
  const wellnessPattern =
    /^(how are (you|u)|how r (you|u)|how do you do|how are you doing|hows it going|how is it going|whats up|what's up|wassup|wazzup|kaise ho|kya haal hai|kya chal raha hai|kaisa hai|aap kaise hain|aap kaise ho|kese ho|आप कैसे हैं|कैसे हो|क्या हाल है|सब ठीक|kasa kay|kase ahat|तुम्ही कसे आहात|कसे आहात|eppadi irukkeenga|eppadi irukinga|எப்படி இருக்கிறீர்கள்)(?: today| now| ji| sir| bro)?$/i;
  if (wellnessPattern.test(normalized)) {
    const responses = GREETING_RESPONSES.wellness;
    return {
      type: "wellness",
      answer: responses[language] || responses.en,
    };
  }

  // 3. IDENTITY / CAPABILITIES
  const identityPattern =
    /^(who are (you|u)|who r (you|u)|what are (you|u)|what can (you|u) do|what do (you|u) do|what is your name|who made (you|u)|tell me about yourself|what is this|what is yojana connect|help me|help|kaun ho tum|aap kaun ho|tum kaun ho|kya kar sakte ho|aap kya kar sakte ho|kya kaam hai aapka|आप कौन हैं|तुम कौन हो|आप क्या कर सकते हैं|kon ahes tu|tumhi kon ahat|तुम्ही कोण आहात|neenga yaaru|நீங்கள் யார்)$/i;
  if (identityPattern.test(normalized)) {
    const responses = GREETING_RESPONSES.identity;
    return {
      type: "identity",
      answer: responses[language] || responses.en,
    };
  }

  // 4. GRATITUDE
  const gratitudePattern =
    /^(thank (you|u)|thanks|thx|thankyou|thanks a lot|many thanks|thank (you|u) so much|dhanyawad|dhanyavad|shukriya|bahut dhanyawad|bahut shukriya|धन्यवाद|शुक्रिया|खूप धन्यवाद|நன்றி)(?: so much| very much| ji| sir)?$/i;
  if (gratitudePattern.test(normalized)) {
    const responses = GREETING_RESPONSES.gratitude;
    return {
      type: "gratitude",
      answer: responses[language] || responses.en,
    };
  }

  // 5. FAREWELL
  const farewellPattern =
    /^(bye+|goodbye|good bye|bye bye|see you|see ya|tata|cya|take care|alvida|phir milenge|fir milenge|अलविदा|फिर मिलेंगे|पुन्हा भेटू|good night|shubh ratri|शुभ रात्रि)(?: now| ji)?$/i;
  if (farewellPattern.test(normalized)) {
    const responses = GREETING_RESPONSES.farewell;
    return {
      type: "farewell",
      answer: responses[language] || responses.en,
    };
  }

  // 6. SHORT ACKNOWLEDGMENT
  const shortAckPattern =
    /^(ok+|okay|k|cool|nice|yep|yes|no|haan|ha|theek hai|thik hai|accha|achha|achha ji|theek|ठीक है|अच्छा|हो|சரி)$/i;
  if (wordCount <= 2 && shortAckPattern.test(normalized)) {
    const responses = GREETING_RESPONSES.short_ack;
    return {
      type: "short_ack",
      answer: responses[language] || responses.en,
    };
  }

  return null;
}
