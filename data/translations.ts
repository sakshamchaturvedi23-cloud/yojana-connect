export type Language = "en" | "hi" | "hinglish" | "mr" | "ta";

export interface TranslationDict {
  nav: {
    schemes: string;
    about: string;
    contact: string;
    citizenPortal: string;
    getStarted: string;
    login: string;
    signIn: string;
    signOut: string;
    profile: string;
    savedSchemes: string;
    logout: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    askAiBtn: string;
    suggestions: {
      eligible: string;
      farmers: string;
      scholarships: string;
      state: string;
    };
  };
  yojanaAi: {
    greeting: string;
    question: string;
    inputPlaceholder: string;
    voiceInput: string;
    sendQuestion: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1: {
      number: string;
      title: string;
      desc: string;
    };
    step2: {
      number: string;
      title: string;
      desc: string;
    };
    step3: {
      number: string;
      title: string;
      desc: string;
    };
  };
  features: {
    title: string;
    subtitle: string;
    card1: {
      title: string;
      desc: string;
    };
    card2: {
      title: string;
      desc: string;
    };
    card3: {
      title: string;
      desc: string;
    };
    card4: {
      title: string;
      desc: string;
    };
  };
  trust: {
    title: string;
    description: string;
    badgeOfficial: string;
    badgeUpdated: string;
    badgeLanguages: string;
    badgeNoLogin: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    exploreSchemes: string;
    yojanaAi: string;
    about: string;
    privacy: string;
    contact: string;
    rights: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    emailOrPhone: string;
    password: string;
    rememberMe: string;
    signInBtn: string;
    signingIn: string;
    useDemo: string;
    guestNotice: string;
    or: string;
    invalidCredentials: string;
  };
  profile: {
    title: string;
    subtitle: string;
    age: string;
    state: string;
    occupation: string;
    annualIncome: string;
    preferredLanguage: string;
    saveChanges: string;
    saving: string;
    saveSuccess: string;
    saveError: string;
    loginRequired: string;
    loginToView: string;
    viewSaved: string;
  };
  saved: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    removeBtn: string;
    viewOfficial: string;
    stateCentral: string;
    loginRequired: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav: {
      schemes: "Schemes",
      about: "About",
      contact: "Contact",
      citizenPortal: "Citizen Portal",
      getStarted: "Get Started",
      login: "Login",
      signIn: "Sign In",
      signOut: "Sign Out",
      profile: "Citizen Profile",
      savedSchemes: "Saved Schemes",
      logout: "Log Out",
    },
    hero: {
      badge: "Citizen Services Gateway",
      title: "Connecting Every Citizen to the Right Opportunities",
      subtitle: "Discover, verify eligibility, and apply for government initiatives with zero friction.",
      exploreBtn: "Explore Schemes",
      askAiBtn: "Ask Yojana AI",
      suggestions: {
        eligible: "Which schemes am I eligible for?",
        farmers: "Show me schemes for farmers",
        scholarships: "What scholarships can I apply for?",
        state: "Which schemes are available in my state?",
      },
    },
    yojanaAi: {
      greeting: "Hi, I'm Yojana AI.",
      question: "What can I help you find?",
      inputPlaceholder: "Ask about government schemes...",
      voiceInput: "Voice input",
      sendQuestion: "Send question",
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Three simple steps between you and the benefits you're entitled to.",
      step1: {
        number: "01",
        title: "Tell us about you",
        desc: "Share your age, state, and occupation — no login required to get started.",
      },
      step2: {
        number: "02",
        title: "Find schemes that match",
        desc: "Yojana AI matches your profile against government schemes and explains why each one fits.",
      },
      step3: {
        number: "03",
        title: "Understand and apply",
        desc: "See eligibility, required documents, and next steps, then head to the official portal to apply.",
      },
    },
    features: {
      title: "Built for every citizen",
      subtitle: "Everything you need to find, understand, and act on government schemes.",
      card1: {
        title: "PERSONALIZED RECOMMENDATIONS",
        desc: "Find government schemes based on the user's age, state and occupation.",
      },
      card2: {
        title: "MULTILINGUAL AI",
        desc: "English, Hindi, Hinglish, Marathi and Tamil.",
      },
      card3: {
        title: "VOICE ASSISTANCE",
        desc: "Speak your question and listen to AI responses.",
      },
      card4: {
        title: "OFFICIAL INFORMATION",
        desc: "Get scheme information and official government application links.",
      },
    },
    trust: {
      title: "Built around official government scheme information.",
      description: "Yojana Connect helps you discover and understand government schemes and directs you to official government portals to apply. We are a citizen-facing information platform — not a government department, and we do not process applications ourselves.",
      badgeOfficial: "🔗 Official Sources",
      badgeUpdated: "🏛️ Regularly Updated",
      badgeLanguages: "🌐 Multiple Languages",
      badgeNoLogin: "🔒 No Login Required",
    },
    cta: {
      title: "Your benefits shouldn't be hard to find.",
      subtitle: "Find the schemes meant for you.",
      button: "Get Started",
    },
    footer: {
      exploreSchemes: "Explore Schemes",
      yojanaAi: "Yojana AI",
      about: "About",
      privacy: "Privacy",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    auth: {
      loginTitle: "Citizen Login",
      loginSubtitle: "Sign in to access personalized scheme recommendations & bookmarks",
      emailOrPhone: "Email or Phone Number",
      password: "Password",
      rememberMe: "Remember me",
      signInBtn: "Sign In",
      signingIn: "Signing in...",
      useDemo: "Quick Demo Citizen Login",
      guestNotice: "No account? You can freely explore schemes as a guest without signing in.",
      or: "or",
      invalidCredentials: "Invalid credentials. Please verify and try again.",
    },
    profile: {
      title: "Citizen Profile",
      subtitle: "Manage your demographic details to receive tailored scheme recommendations.",
      age: "Age",
      state: "State / UT",
      occupation: "Occupation",
      annualIncome: "Annual Income (₹)",
      preferredLanguage: "Preferred Language",
      saveChanges: "Save Profile",
      saving: "Saving...",
      saveSuccess: "Profile updated successfully!",
      saveError: "Failed to update profile. Please try again.",
      loginRequired: "Authentication Required",
      loginToView: "Please sign in to view and edit your citizen profile.",
      viewSaved: "View Saved Schemes",
    },
    saved: {
      title: "Saved Schemes",
      subtitle: "Bookmark schemes to track application deadlines, requirements, and links.",
      emptyTitle: "No saved schemes yet",
      emptyDesc: "Browse available government initiatives and tap the bookmark icon to save them here.",
      exploreBtn: "Explore Schemes",
      removeBtn: "Remove",
      viewOfficial: "Official Portal",
      stateCentral: "Central / State",
      loginRequired: "Please sign in to view your saved schemes.",
    },
  },

  hi: {
    nav: {
      schemes: "योजनाएं",
      about: "हमारे बारे में",
      contact: "संपर्क",
      citizenPortal: "नागरिक पोर्टल",
      getStarted: "शुरू करें",
      login: "लॉगिन",
      signIn: "साइन इन",
      signOut: "साइन आउट",
      profile: "नागरिक प्रोफ़ाइल",
      savedSchemes: "सहेजी गई योजनाएं",
      logout: "लॉग आउट",
    },
    hero: {
      badge: "नागरिक सेवा प्रवेशद्वार",
      title: "हर नागरिक को सही अवसरों से जोड़ना",
      subtitle: "बिना किसी बाधा के सरकारी योजनाओं की खोज करें, पात्रता जांचें और आवेदन करें।",
      exploreBtn: "योजनाएं देखें",
      askAiBtn: "योजना AI से पूछें",
      suggestions: {
        eligible: "मैं किन योजनाओं के लिए पात्र हूँ?",
        farmers: "मुझे किसानों की योजनाएं दिखाएं",
        scholarships: "मैं किन छात्रवृत्तियों के लिए आवेदन कर सकता हूँ?",
        state: "मेरे राज्य में कौन सी योजनाएं उपलब्ध हैं?",
      },
    },
    yojanaAi: {
      greeting: "नमस्ते, मैं योजना AI हूँ।",
      question: "मैं आपको क्या खोजने में मदद कर सकता हूँ?",
      inputPlaceholder: "सरकारी योजनाओं के बारे में पूछें...",
      voiceInput: "आवाज़ इनपुट",
      sendQuestion: "प्रश्न भेजें",
    },
    howItWorks: {
      title: "यह कैसे काम करता है",
      subtitle: "आपके और आपके हक के लाभों के बीच केवल तीन आसान कदम।",
      step1: {
        number: "01",
        title: "अपने बारे में बताएं",
        desc: "अपनी आयु, राज्य और व्यवसाय साझा करें — शुरू करने के लिए लॉगिन की आवश्यकता नहीं है।",
      },
      step2: {
        number: "02",
        title: "अनुकूल योजनाएं खोजें",
        desc: "योजना AI आपकी प्रोफ़ाइल का सरकारी योजनाओं से मिलान करता है और समझाता है कि कौन सी आपके लिए सही है।",
      },
      step3: {
        number: "03",
        title: "समझें और आवेदन करें",
        desc: "पात्रता, आवश्यक दस्तावेज़ और आगे के कदम देखें, फिर आवेदन के लिए आधिकारिक पोर्टल पर जाएं।",
      },
    },
    features: {
      title: "हर नागरिक के लिए निर्मित",
      subtitle: "सरकारी योजनाओं को खोजने, समझने और लाभ उठाने के लिए आवश्यक सब कुछ।",
      card1: {
        title: "व्यक्तिगत सिफारिशें",
        desc: "नागरिक की आयु, राज्य और व्यवसाय के आधार पर सरकारी योजनाएं खोजें।",
      },
      card2: {
        title: "बहुभाषी AI",
        desc: "अंग्रेजी, हिन्दी, हिंग्लिश, मराठी और तमिल भाषा समर्थन।",
      },
      card3: {
        title: "आवाज सहायता",
        desc: "बोलकर सवाल पूछें और AI की आवाज में जवाब सुनें।",
      },
      card4: {
        title: "आधिकारिक जानकारी",
        desc: "योजना की सटीक जानकारी और आधिकारिक सरकारी आवेदन लिंक प्राप्त करें।",
      },
    },
    trust: {
      title: "आधिकारिक सरकारी योजनाओं की जानकारी पर आधारित।",
      description: "योजना कनेक्ट आपको सरकारी योजनाओं को खोजने और समझने में मदद करता है तथा आवेदन के लिए आधिकारिक पोर्टल पर निर्देशित करता है। हम एक नागरिक सूचना मंच हैं — कोई सरकारी विभाग नहीं, और हम स्वयं आवेदनों को संसाधित नहीं करते हैं।",
      badgeOfficial: "🔗 आधिकारिक स्रोत",
      badgeUpdated: "🏛️ नियमित अपडेट",
      badgeLanguages: "🌐 अनेक भाषाएं",
      badgeNoLogin: "🔒 लॉगिन अनिवार्य नहीं",
    },
    cta: {
      title: "आपके लाभ ढूंढना कठिन नहीं होना चाहिए।",
      subtitle: "अपने लिए बनी सही योजनाएं खोजें।",
      button: "शुरू करें",
    },
    footer: {
      exploreSchemes: "योजनाएं देखें",
      yojanaAi: "योजना AI",
      about: "हमारे बारे में",
      privacy: "गोपनीयता",
      contact: "संपर्क",
      rights: "सर्वाधिकार सुरक्षित।",
    },
    auth: {
      loginTitle: "नागरिक लॉगिन",
      loginSubtitle: "व्यक्तिगत योजनाओं और सहेजी गई जानकारी के लिए साइन इन करें",
      emailOrPhone: "ईमेल या मोबाइल नंबर",
      password: "पासवर्ड",
      rememberMe: "मुझे याद रखें",
      signInBtn: "साइन इन करें",
      signingIn: "साइन इन हो रहा है...",
      useDemo: "त्वरित डेमो नागरिक लॉगिन",
      guestNotice: "खाता नहीं है? आप बिना लॉगिन किए एक अतिथि के रूप में योजनाएं देख सकते हैं।",
      or: "या",
      invalidCredentials: "अमान्य विवरण। कृपया जांचें और पुनः प्रयास करें।",
    },
    profile: {
      title: "नागरिक प्रोफ़ाइल",
      subtitle: "सटीक योजना सिफारिशों के लिए अपनी जनसांख्यिकीय जानकारी प्रबंधित करें।",
      age: "आयु",
      state: "राज्य / केंद्र शासित प्रदेश",
      occupation: "व्यवसाय",
      annualIncome: "वार्षिक आय (₹)",
      preferredLanguage: "पसंदीदा भाषा",
      saveChanges: "प्रोफ़ाइल सहेजें",
      saving: "सहेजा जा रहा है...",
      saveSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
      saveError: "प्रोफ़ाइल अपडेट करने में विफल। पुनः प्रयास करें।",
      loginRequired: "लॉगिन आवश्यक है",
      loginToView: "अपनी प्रोफ़ाइल देखने और संपादित करने के लिए कृपया साइन इन करें।",
      viewSaved: "सहेजी गई योजनाएं देखें",
    },
    saved: {
      title: "सहेजी गई योजनाएं",
      subtitle: "आवेदन की समय-सीमा और पात्रता का ध्यान रखने के लिए योजनाओं को सहेजें।",
      emptyTitle: "अभी तक कोई योजना सहेजी नहीं गई",
      emptyDesc: "योजनाएं देखें और उन्हें यहां सुरक्षित रखने के लिए बुकमार्क आइकन पर क्लिक करें।",
      exploreBtn: "योजनाएं खोजें",
      removeBtn: "हटाएं",
      viewOfficial: "आधिकारिक पोर्टल",
      stateCentral: "केंद्र / राज्य",
      loginRequired: "सहेजी गई योजनाएं देखने के लिए कृपया साइन इन करें।",
    },
  },

  hinglish: {
    nav: {
      schemes: "Schemes",
      about: "About Us",
      contact: "Contact",
      citizenPortal: "Citizen Portal",
      getStarted: "Shuru Karein",
      login: "Login",
      signIn: "Sign In",
      signOut: "Sign Out",
      profile: "Citizen Profile",
      savedSchemes: "Saved Schemes",
      logout: "Log Out",
    },
    hero: {
      badge: "Citizen Services Gateway",
      title: "Har Citizen ko Sahi Opportunities se Connect Karna",
      subtitle: "Bina kisi pareshani ke sarkari schemes khojein, eligibility check karein aur apply karein.",
      exploreBtn: "Explore Schemes",
      askAiBtn: "Yojana AI se Poochhein",
      suggestions: {
        eligible: "Main kin schemes ke liye eligible hoon?",
        farmers: "Mujhe kisaano ki schemes dikhao",
        scholarships: "Main kaunsi scholarships ke liye apply kar sakta hoon?",
        state: "Mere state mein kaunsi schemes available hain?",
      },
    },
    yojanaAi: {
      greeting: "Namaste, Main Yojana AI hoon.",
      question: "Main aapki kya dhoondhne mein help kar sakta hoon?",
      inputPlaceholder: "Government schemes ke baare mein poochhein...",
      voiceInput: "Voice input",
      sendQuestion: "Sawaal bhejein",
    },
    howItWorks: {
      title: "Yeh Kaise Kaam Karta Hai",
      subtitle: "Aapke aur aapke benefits ke beech sirf 3 simple steps.",
      step1: {
        number: "01",
        title: "Apne baare mein batayein",
        desc: "Apni age, state, aur occupation share karein — shuru karne ke liye login zaroori nahi hai.",
      },
      step2: {
        number: "02",
        title: "Matching schemes dhoondhein",
        desc: "Yojana AI aapki profile ko government schemes ke saath match karta hai aur batata hai ki kaunsi best fit hai.",
      },
      step3: {
        number: "03",
        title: "Samjhein aur apply karein",
        desc: "Eligibility, documents aur next steps dekhein, phir official portal par apply karein.",
      },
    },
    features: {
      title: "Har Citizen Ke Liye Banaya Gaya",
      subtitle: "Sarkari schemes dhoondhne, samajhne aur faayda uthaane ke liye sab kuch ek jagah.",
      card1: {
        title: "PERSONALIZED RECOMMENDATIONS",
        desc: "Age, state aur occupation ke hisaab se schemes recommendations paayein.",
      },
      card2: {
        title: "MULTILINGUAL AI",
        desc: "English, Hindi, Hinglish, Marathi aur Tamil ka full support.",
      },
      card3: {
        title: "VOICE ASSISTANCE",
        desc: "Bol kar sawaal poochhein aur AI se accurate jawaab sunein.",
      },
      card4: {
        title: "OFFICIAL INFORMATION",
        desc: "Verified government scheme info aur official application links.",
      },
    },
    trust: {
      title: "Official Government Information Par Based.",
      description: "Yojana Connect aapko schemes dhoondhne aur samajhne mein help karta hai aur direct official government portals par bhejta hai. Hum ek citizen information portal hain — koi government department nahi, aur hum applications process nahi karte.",
      badgeOfficial: "🔗 Official Sources",
      badgeUpdated: "🏛️ Regularly Updated",
      badgeLanguages: "🌐 Multiple Languages",
      badgeNoLogin: "🔒 No Login Required",
    },
    cta: {
      title: "Aapke benefits dhoondhna mushkil nahi hona chahiye.",
      subtitle: "Apne liye sahi schemes aaj hi discover karein.",
      button: "Shuru Karein",
    },
    footer: {
      exploreSchemes: "Explore Schemes",
      yojanaAi: "Yojana AI",
      about: "About",
      privacy: "Privacy",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    auth: {
      loginTitle: "Citizen Login",
      loginSubtitle: "Personalized scheme recommendations aur saved items access karein",
      emailOrPhone: "Email ya Mobile Number",
      password: "Password",
      rememberMe: "Mujhe yaad rakhein",
      signInBtn: "Sign In Karein",
      signingIn: "Signing in...",
      useDemo: "Quick Demo Citizen Login",
      guestNotice: "Account nahi hai? Aap as a guest schemes browse kar sakte hain.",
      or: "ya",
      invalidCredentials: "Wrong credentials. Please check karke dubara try karein.",
    },
    profile: {
      title: "Citizen Profile",
      subtitle: "Accurate scheme matches ke liye apni profile details update karein.",
      age: "Age",
      state: "State / UT",
      occupation: "Occupation",
      annualIncome: "Annual Income (₹)",
      preferredLanguage: "Preferred Language",
      saveChanges: "Profile Save Karein",
      saving: "Save ho raha hai...",
      saveSuccess: "Profile successfully update ho gayi!",
      saveError: "Profile update nahi ho paayi. Dobara try karein.",
      loginRequired: "Login Zaroori Hai",
      loginToView: "Apni profile dekhne aur edit karne ke liye sign in karein.",
      viewSaved: "Saved Schemes Dekhein",
    },
    saved: {
      title: "Saved Schemes",
      subtitle: "Deadlines aur apply links track karne ke liye schemes bookmark karein.",
      emptyTitle: "Abhi koi scheme save nahi hai",
      emptyDesc: "Schemes explore karein aur unhe bookmark icon par click karke save karein.",
      exploreBtn: "Schemes Dhoondhein",
      removeBtn: "Remove Karein",
      viewOfficial: "Official Portal",
      stateCentral: "Central / State",
      loginRequired: "Saved schemes dekhne ke liye please sign in karein.",
    },
  },

  mr: {
    nav: {
      schemes: "योजना",
      about: "आमच्याबद्दल",
      contact: "संपर्क",
      citizenPortal: "नागरिक पोर्टल",
      getStarted: "सुरू करा",
      login: "लॉगिन",
      signIn: "साइन इन",
      signOut: "साइन आउट",
      profile: "नागरिक प्रोफाइल",
      savedSchemes: "जतन केलेल्या योजना",
      logout: "लॉग आउट",
    },
    hero: {
      badge: "नागरिक सेवा प्रवेशद्वार",
      title: "प्रत्येक नागरिकाला योग्य संधींशी जोडणे",
      subtitle: "कोणत्याही अडचणीशिवाय सरकारी योजना शोधा, पात्रता तपासा आणि अर्ज करा.",
      exploreBtn: "योजना शोधा",
      askAiBtn: "योजना AI ला विचारा",
      suggestions: {
        eligible: "मी कोणत्या योजनांसाठी पात्र आहे?",
        farmers: "मला शेतकऱ्यांच्या योजना दाखवा",
        scholarships: "मी कोणत्या शिष्यवृत्तींसाठी अर्ज करू शकतो?",
        state: "माझ्या राज्यात कोणत्या योजना उपलब्ध आहेत?",
      },
    },
    yojanaAi: {
      greeting: "नमस्कार, मी योजना AI आहे.",
      question: "मी आपल्याला काय शोधण्यात मदत करू शकतो?",
      inputPlaceholder: "सरकारी योजनांबद्दल विचारा...",
      voiceInput: "व्हॉइस इनपुट",
      sendQuestion: "प्रश्न विचारा",
    },
    howItWorks: {
      title: "हे कसे कार्य करते",
      subtitle: "आपण आणि आपल्या हक्कांच्या लाभांमधील तीन सोप्या पायऱ्या.",
      step1: {
        number: "०१",
        title: "आपल्याबद्दल सांगा",
        desc: "आपले वय, राज्य आणि व्यवसाय सांगा — सुरुवात करण्यासाठी लॉगिनची आवश्यकता नाही.",
      },
      step2: {
        number: "०२",
        title: "योग्य योजना शोधा",
        desc: "योजना AI आपल्या प्रोफाइलची सरकारी योजनांशी जुळवणी करते आणि कोणती योजना योग्य आहे ते स्पष्ट करते.",
      },
      step3: {
        number: "०३",
        title: "समजून घ्या आणि अर्ज करा",
        desc: "पात्रता, आवश्यक कागदपत्रे आणि पुढील पायऱ्या पहा, नंतर अर्ज करण्यासाठी अधिकृत पोर्टलवर जा.",
      },
    },
    features: {
      title: "प्रत्येक नागरिकासाठी तयार केलेले",
      subtitle: "सरकारी योजना शोधण्यासाठी, समजून घेण्यासाठी आणि लाभ घेण्यासाठी सर्वकाही एकाच ठिकाणी.",
      card1: {
        title: "वैयक्तिकृत शिफारसी",
        desc: "नागरिकाचे वय, राज्य आणि व्यवसायावर आधारित सरकारी योजना शोधा.",
      },
      card2: {
        title: "बहुभाषिक AI",
        desc: "इंग्रजी, हिंदी, हिंग्लिश, मराठी आणि तमिळ भाषा सहाय्य.",
      },
      card3: {
        title: "व्हॉइस सहाय्य",
        desc: "बोलून प्रश्न विचारा आणि AI कडून उत्तरे ऐका.",
      },
      card4: {
        title: "अधिकृत माहिती",
        desc: "योजनेची अचूक माहिती आणि अधिकृत सरकारी अर्ज लिंक्स मिळवा.",
      },
    },
    trust: {
      title: "अधिकृत सरकारी योजनांच्या माहितीवर आधारित.",
      description: "योजना कनेक्ट आपल्याला सरकारी योजना शोधण्यात आणि समजून घेण्यात मदत करते आणि अर्जासाठी अधिकृत पोर्टलवर निर्देशित करते. आम्ही एक नागरिक माहिती मंच आहोत — कोणताही सरकारी विभाग नाही.",
      badgeOfficial: "🔗 अधिकृत स्रोत",
      badgeUpdated: "🏛️ नियमित अद्यतने",
      badgeLanguages: "🌐 अनेक भाषा",
      badgeNoLogin: "🔒 लॉगिन आवश्यक नाही",
    },
    cta: {
      title: "आपले लाभ शोधणे कठीण नसावे.",
      subtitle: "आपल्यासाठी असलेल्या योग्य योजना आजच शोधा.",
      button: "सुरू करा",
    },
    footer: {
      exploreSchemes: "योजना शोधा",
      yojanaAi: "योजना AI",
      about: "आमच्याबद्दल",
      privacy: "गोपनीयता",
      contact: "संपर्क",
      rights: "सर्व हक्क राखीव.",
    },
    auth: {
      loginTitle: "नागरिक लॉगिन",
      loginSubtitle: "वैयक्तिक शिफारसी आणि जतन केलेल्या योजनांसाठी साइन इन करा",
      emailOrPhone: "ईमेल किंवा मोबाइल क्रमांक",
      password: "पासवर्ड",
      rememberMe: "माझी आठवण ठेवा",
      signInBtn: "साइन इन करा",
      signingIn: "साइन इन होत आहे...",
      useDemo: "जलद डेमो नागरिक लॉगिन",
      guestNotice: "खाते नाही? आपण अतिथी म्हणून योजना पाहू शकता.",
      or: "किंवा",
      invalidCredentials: "अवैध तपशील. कृपया तपासून पुन्हा प्रयत्न करा.",
    },
    profile: {
      title: "नागरिक प्रोफाइल",
      subtitle: "अचूक योजना शिफारसींसाठी आपले तपशील अद्यतनित करा.",
      age: "वय",
      state: "राज्य / केंद्रशासित प्रदेश",
      occupation: "व्यवसाय",
      annualIncome: "वार्षिक उत्पन्न (₹)",
      preferredLanguage: "पसंतीची भाषा",
      saveChanges: "प्रोफाइल जतन करा",
      saving: "जतन होत आहे...",
      saveSuccess: "प्रोफाइल यशस्वीरित्या अद्यतनित झाली!",
      saveError: "प्रोफाइल अद्यतनित करण्यात अयशस्वी. पुन्हा प्रयत्न करा.",
      loginRequired: "लॉगिन आवश्यक आहे",
      loginToView: "आपली प्रोफाइल पाहण्यासाठी आणि संपादित करण्यासाठी कृपया साइन इन करा.",
      viewSaved: "जतन केलेल्या योजना पहा",
    },
    saved: {
      title: "जतन केलेल्या योजना",
      subtitle: "मुदत आणि पात्रता लक्षात ठेवण्यासाठी योजना बुकमार्क करा.",
      emptyTitle: "अद्याप कोणतीही योजना जतन केलेली नाही",
      emptyDesc: "योजना एक्सप्लोर करा आणि त्या येथे ठेवण्यासाठी बुकमार्क चिन्हावर क्लिक करा.",
      exploreBtn: "योजना शोधा",
      removeBtn: "काढून टाका",
      viewOfficial: "अधिकृत पोर्टल",
      stateCentral: "केंद्र / राज्य",
      loginRequired: "जतन केलेल्या योजना पाहण्यासाठी कृपया साइन इन करा.",
    },
  },

  ta: {
    nav: {
      schemes: "திட்டங்கள்",
      about: "எங்களைப் பற்றி",
      contact: "தொடர்பு",
      citizenPortal: "குடிமக்கள் போர்ட்டல்",
      getStarted: "தொடங்குங்கள்",
      login: "உள்நுழைவு",
      signIn: "உள்நுழைக",
      signOut: "வெளியேறு",
      profile: "குடிமகன் சுயவிவரம்",
      savedSchemes: "சேமிக்கப்பட்ட திட்டங்கள்",
      logout: "வெளியேறு",
    },
    hero: {
      badge: "குடிமக்கள் சேவை நுழைவாயில்",
      title: "ஒவ்வொரு குடிமகனையும் சரியான வாய்ப்புகளுடன் இணைத்தல்",
      subtitle: "எந்தவித சிரமமுமின்றி அரசுத் திட்டங்களைக் கண்டறியவும், தகுதியைச் சரிபார்க்கவும், விண்ணப்பிக்கவும்.",
      exploreBtn: "திட்டங்களை ஆராயுங்கள்",
      askAiBtn: "யோஜனா AI-யிடம் கேளுங்கள்",
      suggestions: {
        eligible: "நான் எந்த திட்டங்களுக்கு தகுதியானவன்?",
        farmers: "விவசாயிகளுக்கான திட்டங்களைக் காட்டுங்கள்",
        scholarships: "நான் எந்த கல்வி உதவித்தொகைக்கு விண்ணப்பிக்கலாம்?",
        state: "எனது மாநிலத்தில் என்ன திட்டங்கள் உள்ளன?",
      },
    },
    yojanaAi: {
      greeting: "வணக்கம், நான் யோஜனா AI.",
      question: "நீங்கள் எதைத் தேட நான் உதவ முடியும்?",
      inputPlaceholder: "அரசு திட்டங்கள் பற்றி கேளுங்கள்...",
      voiceInput: "குரல் உள்ளீடு",
      sendQuestion: "கேள்வி அனுப்பு",
    },
    howItWorks: {
      title: "இது எவ்வாறு செயல்படுகிறது",
      subtitle: "உங்களுக்கும் உங்களுக்குரிய நன்மைகளுக்கும் இடையே மூன்று எளிய படிகள்.",
      step1: {
        number: "01",
        title: "உங்களைப் பற்றி கூறுங்கள்",
        desc: "உங்கள் வயது, மாநிலம், மற்றும் தொழிலைப் பகிருங்கள் — தொடங்குவதற்கு உள்நுழைவு தேவையில்லை.",
      },
      step2: {
        number: "02",
        title: "பொருத்தமான திட்டங்களைக் கண்டறியவும்",
        desc: "யோஜனா AI உங்கள் சுயவிவரத்தை அரசு திட்டங்களுடன் ஒப்பிட்டு, எது பொருத்தமானது என்பதை விளக்குகிறது.",
      },
      step3: {
        number: "03",
        title: "புரிந்து விண்ணப்பிக்கவும்",
        desc: "தகுதி, தேவையான ஆவணங்கள் மற்றும் அடுத்த கட்டங்களைப் பார்த்து அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்கவும்.",
      },
    },
    features: {
      title: "ஒவ்வொரு குடிமகனுக்காகவும் உருவாக்கப்பட்டது",
      subtitle: "அரசுத் திட்டங்களைக் கண்டறிய, புரிந்து கொள்ள மற்றும் விண்ணப்பிக்க தேவையான அனைத்தும்.",
      card1: {
        title: "தனிப்பயனாக்கப்பட்ட பரிந்துரைகள்",
        desc: "வயது, மாநிலம் மற்றும் தொழிலின் அடிப்படையில் அரசுத் திட்டங்களைக் கண்டறியவும்.",
      },
      card2: {
        title: "பன்மொழி AI",
        desc: "ஆங்கிலம், இந்தி, ஹிங்கிலிஷ், மராத்தி மற்றும் தமிழ் மொழி ஆதரவு.",
      },
      card3: {
        title: "குரல் உதவி",
        desc: "குரல் மூலம் கேள்விகளைக் கேட்டு AI பதில்களைக் கேட்கவும்.",
      },
      card4: {
        title: "அதிகாரப்பூர்வ தகவல்",
        desc: "அரசுத் திட்ட விவரங்கள் மற்றும் அதிகாரப்பூர்வ விண்ணப்ப இணைப்புகளைப் பெறுங்கள்.",
      },
    },
    trust: {
      title: "அதிகாரப்பூர்வ அரசு திட்டத் தகவல்களின் அடிப்படையில் உருவாக்கப்பட்டது.",
      description: "யோஜனா கனெக்ட் உங்களுக்கு அரசுத் திட்டங்களைக் கண்டறியவும், புரிந்து கொள்ளவும், அதிகாரப்பூர்வ தளங்களுக்கு வழிகாட்டவும் உதவுகிறது. நாங்கள் ஒரு குடிமக்கள் தகவல் தளம் மட்டுமே — அரசுத் துறை அல்ல.",
      badgeOfficial: "🔗 அதிகாரப்பூர்வ ஆதாரங்கள்",
      badgeUpdated: "🏛️ வழக்கமான புதுப்பிப்புகள்",
      badgeLanguages: "🌐 பல மொழிகள்",
      badgeNoLogin: "🔒 உள்நுழைவு தேவையில்லை",
    },
    cta: {
      title: "உங்கள் நன்மைகளைக் கண்டறிவது கடினமாக இருக்கக்கூடாது.",
      subtitle: "உங்களுக்கான திட்டங்களை இன்றே கண்டறியுங்கள்.",
      button: "தொடங்குங்கள்",
    },
    footer: {
      exploreSchemes: "திட்டங்களை ஆராயுங்கள்",
      yojanaAi: "யோஜனா AI",
      about: "எங்களைப் பற்றி",
      privacy: "தனியுரிமை",
      contact: "தொடர்பு",
      rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    },
    auth: {
      loginTitle: "குடிமக்கள் உள்நுழைவு",
      loginSubtitle: "பரிந்துரைகள் மற்றும் சேமித்த திட்டங்களை அணுக உள்நுழைக",
      emailOrPhone: "மின்னஞ்சல் அல்லது தொலைபேசி எண்",
      password: "கடவுச்சொல்",
      rememberMe: "என்னை நினைவில் கொள்க",
      signInBtn: "உள்நுழைக",
      signingIn: "உள்நுழைகிறது...",
      useDemo: "விரைவு டெமோ குடிமகன் உள்நுழைவு",
      guestNotice: "கணக்கு இல்லையா? உள்நுழையாமல் விருந்தினராக திட்டங்களை பார்க்கலாம்.",
      or: "அல்லது",
      invalidCredentials: "தவறான விவரங்கள். சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    },
    profile: {
      title: "குடிமகன் சுயவிவரம்",
      subtitle: "துல்லியமான திட்ட பரிந்துரைகளைப் பெற உங்கள் விவரங்களைப் புதுப்பிக்கவும்.",
      age: "வயது",
      state: "மாநிலம் / யூனியன் பிரதேசம்",
      occupation: "தொழில்",
      annualIncome: "ஆண்டு வருமானம் (₹)",
      preferredLanguage: "விருப்பமான மொழி",
      saveChanges: "சுயவிவரத்தைச் சேமி",
      saving: "சேமிக்கப்படுகிறது...",
      saveSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      saveError: "புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      loginRequired: "உள்நுழைவு தேவை",
      loginToView: "உங்கள் சுயவிவரத்தைப் பார்க்கவும் திருத்தவும் உள்நுழையவும்.",
      viewSaved: "சேமிக்கப்பட்ட திட்டங்களைக் காண்க",
    },
    saved: {
      title: "சேமிக்கப்பட்ட திட்டங்கள்",
      subtitle: "விண்ணப்ப காலக்கெடு மற்றும் இணைப்புகளைக் கண்காணிக்க திட்டங்களை புக்மார்க் செய்யவும்.",
      emptyTitle: "இன்னும் திட்டங்கள் எதுவும் சேமிக்கப்படவில்லை",
      emptyDesc: "திட்டங்களை உலாவவும் மற்றும் இங்கே சேமிக்க புக்மார்க் ஐகானைக் கிளிக் செய்யவும்.",
      exploreBtn: "திட்டங்களை ஆராயுங்கள்",
      removeBtn: "நீக்கு",
      viewOfficial: "அதிகாரப்பூர்வ போர்ட்டல்",
      stateCentral: "மத்திய / மாநில",
      loginRequired: "சேமித்த திட்டங்களைப் பார்க்க உள்நுழைக.",
    },
  },
};

export const LANGUAGE_OPTIONS: { id: Language; label: string; nativeLabel: string }[] = [
  { id: "en", label: "English", nativeLabel: "English" },
  { id: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { id: "hinglish", label: "Hinglish", nativeLabel: "Hinglish" },
  { id: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { id: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

