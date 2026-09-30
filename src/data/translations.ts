import { LanguageCode } from '../types';

export interface Translations {
  // Login
  loginWelcome: string;
  loginSubtitle: string;
  mobileNumberLabel: string;
  resendOtp: string;
  otpResent: string;
  validFor: string;
  continueSecurely: string;
  chooseLanguage: string;
  requestingLocation: string;
  locationPermissionTitle: string;
  locationPermissionDesc: string;

  // Home
  greeting: string;
  offlineReady: string;
  talkToAarvi: string;
  askAboutPrompt: string;
  myCattle: string;
  animalsCount: string;
  milkToday: string;
  healthProfilesUpdated: string;
  viewCattle: string;
  online: string;
  offline: string;

  // Cattle Profile
  cattleProfileTitle: string;
  age: string;
  pregnancy: string;
  vaccination: string;
  milkBaseline: string;
  lastHealthCheck: string;
  startHealthCheck: string;
  dailyLiters: string;

  // Voice UI
  aarviTitle: string;
  listeningOffline: string;
  talkingAbout: string;
  aarviIsSpeaking: string;
  aarviIsListening: string;
  aarviIsAnalyzing: string;
  aarviIsReady: string;
  speechPrompt: string;
  speechTranslation: string;
  speakNaturally: string;
  transcriptLabel: string;
  typeAnswerPlaceholder: string;
  send: string;

  // Health Result
  healthResultTitle: string;
  checkedJustNow: string;
  whyAarviSaysThis: string;
  contactParaVet: string;
  markAsVerified: string;
  saveRecord: string;
  recordSavedOffline: string;
  connectingToVet: string;
  callNow: string;
  cancel: string;

  // Health History
  healthHistoryTitle: string;
  completeCareRecord: string;
  allRecords: string;
  checks: string;
  care: string;
  milkYield14DayTitle: string;
  averageYield: string;
  litersShort: string;

  // Offline Sync
  offlineSyncTitle: string;
  youAreOffline: string;
  recordsSafeOnPhone: string;
  recordsSynchronized: string;
  syncAutoNotice: string;
  pendingRecords: string;
  waitingCount: string;
  retrySync: string;
  syncingRecords: string;
  recentlySynced: string;
  allSafe: string;
  noPendingRecords: string;

  // Navigation & Common
  homeTab: string;
  aarviTab: string;
  historyTab: string;
  profileTab: string;
  healthy: string;
  attention: string;
  veterinaryReview: string;
  urgent: string;
  pending: string;
  synced: string;
  locationUnavailable: string;
  heatIndexLabel: string;
}

export const translations: Record<LanguageCode, Translations> = {
  hi: {
    // Login
    loginWelcome: 'स्वस्थ पशुधन में आपका स्वागत है',
    loginSubtitle: 'अपने मोबाइल नंबर से सुरक्षित रूप से लॉग इन करें',
    mobileNumberLabel: 'मोबाइल नंबर',
    resendOtp: 'ओटीपी पुनः भेजें',
    otpResent: 'ओटीपी पुनः भेजा गया!',
    validFor: 'मान्य समय',
    continueSecurely: 'सुरक्षित रूप से आगे बढ़ें',
    chooseLanguage: 'अपनी भाषा चुनें',
    requestingLocation: 'स्थान की जानकारी जांची जा रही है...',
    locationPermissionTitle: 'स्थान अनुमति',
    locationPermissionDesc: 'निकटतम पशु-चिकित्सक और मौसम जानकारी के लिए स्थान साझा करें',

    // Home
    greeting: 'नमस्ते',
    offlineReady: 'ऑफ़लाइन • तैयार',
    talkToAarvi: 'आरवी (AARVI) से बात करें',
    askAboutPrompt: 'दूध, चारा या स्वास्थ्य के बारे में पूछें',
    myCattle: 'मेरे पशु',
    animalsCount: 'पशु',
    milkToday: 'आज का दूध',
    healthProfilesUpdated: 'सभी स्वास्थ्य प्रोफ़ाइल आज अपडेट हैं',
    viewCattle: 'देखें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',

    // Cattle Profile
    cattleProfileTitle: 'पशु प्रोफ़ाइल',
    age: 'आयु',
    pregnancy: 'गर्भावस्था',
    vaccination: 'टीकाकरण',
    milkBaseline: 'दूध मानक',
    lastHealthCheck: 'अंतिम स्वास्थ्य जांच',
    startHealthCheck: 'स्वास्थ्य जांच शुरू करें',
    dailyLiters: 'लीटर प्रतिदिन',

    // Voice UI
    aarviTitle: 'आरवी (AARVI)',
    listeningOffline: 'ऑफ़लाइन सुन रही है',
    talkingAbout: 'के बारे में बात कर रहे हैं',
    aarviIsSpeaking: 'आरवी बोल रही है',
    aarviIsListening: 'आरवी सुन रही है...',
    aarviIsAnalyzing: 'आरवी समझ रही है...',
    aarviIsReady: 'आरवी तैयार है',
    speechPrompt: '“आज गौरी ने कितना दूध दिया?”',
    speechTranslation: 'गौरी ने आज कितना दूध दिया?',
    speakNaturally: 'हिंदी या अंग्रेजी में स्वाभाविक रूप से बोलें',
    transcriptLabel: 'लिखित विवरण (TRANSCRIPT)',
    typeAnswerPlaceholder: 'हिंदी या अंग्रेजी में उत्तर लिखें...',
    send: 'भेजें',

    // Health Result
    healthResultTitle: 'स्वास्थ्य परिणाम',
    checkedJustNow: 'अभी जांच की गई',
    whyAarviSaysThis: 'आरवी का यह सुझाव क्यों है',
    contactParaVet: 'पैरा-वेट से संपर्क करें',
    markAsVerified: 'सत्यापित चिह्नित करें',
    saveRecord: 'रिकॉर्ड सहेजें',
    recordSavedOffline: 'रिकॉर्ड फ़ोन पर सहेजा गया',
    connectingToVet: 'पैरा-वेट से संपर्क हो रहा है',
    callNow: 'अभी कॉल करें',
    cancel: 'रद्द करें',

    // Health History
    healthHistoryTitle: 'स्वास्थ्य इतिहास',
    completeCareRecord: 'पूर्ण देखभाल रिकॉर्ड',
    allRecords: 'सभी रिकॉर्ड',
    checks: 'जांच',
    care: 'उपचार व टीका',
    milkYield14DayTitle: '14-दिवसीय दूध उत्पादन रिकॉर्ड',
    averageYield: 'औसत उत्पादन',
    litersShort: 'ली.',

    // Offline Sync
    offlineSyncTitle: 'ऑफ़लाइन सिंक',
    youAreOffline: 'आप ऑफ़लाइन हैं',
    recordsSafeOnPhone: 'रिकॉर्ड इस फ़ोन में सुरक्षित हैं',
    recordsSynchronized: 'सभी रिकॉर्ड सिंक हो चुके हैं',
    syncAutoNotice: 'इंटरनेट चालू होते ही अपने आप सिंक हो जाएंगे।',
    pendingRecords: 'लंबित रिकॉर्ड',
    waitingCount: 'प्रतीक्षारत',
    retrySync: 'पुनः सिंक करें',
    syncingRecords: 'सिंक हो रहा है...',
    recentlySynced: 'हाल ही में सिंक किए गए',
    allSafe: 'सब सुरक्षित',
    noPendingRecords: 'कोई रिकॉर्ड लंबित नहीं है। सब सुरक्षित है!',

    // Navigation & Common
    homeTab: 'होम',
    aarviTab: 'आरवी',
    historyTab: 'इतिहास',
    profileTab: 'प्रोफ़ाइल',
    healthy: 'स्वस्थ',
    attention: 'सावधानी',
    veterinaryReview: 'पशु चिकित्सक समीक्षा',
    urgent: 'आपातकालीन',
    pending: 'लंबित',
    synced: 'सिंक हो गया',
    locationUnavailable: 'स्थान अनुपलब्ध',
    heatIndexLabel: 'ताप सूचकांक',
  },
  en: {
    // Login
    loginWelcome: 'Welcome to healthier cattle',
    loginSubtitle: 'Log in securely with your mobile number',
    mobileNumberLabel: 'Mobile number',
    resendOtp: 'Resend OTP',
    otpResent: 'OTP Resent Successfully!',
    validFor: 'Valid for',
    continueSecurely: 'Continue securely',
    chooseLanguage: 'Choose your language',
    requestingLocation: 'Detecting device location...',
    locationPermissionTitle: 'Location Access',
    locationPermissionDesc: 'Used to locate nearest para-vet and regional weather conditions',

    // Home
    greeting: 'Good morning, Namaste',
    offlineReady: 'OFFLINE • READY',
    talkToAarvi: 'Talk to AARVI',
    askAboutPrompt: 'Ask about milk, feed or health',
    myCattle: 'My cattle',
    animalsCount: 'animals',
    milkToday: 'Milk today',
    healthProfilesUpdated: 'All health profiles updated today',
    viewCattle: 'View',
    online: 'Online',
    offline: 'Offline',

    // Cattle Profile
    cattleProfileTitle: 'Cattle profile',
    age: 'Age',
    pregnancy: 'Pregnancy',
    vaccination: 'Vaccination',
    milkBaseline: 'Milk baseline',
    lastHealthCheck: 'Last health check',
    startHealthCheck: 'Start Health Check',
    dailyLiters: 'L daily',

    // Voice UI
    aarviTitle: 'AARVI',
    listeningOffline: 'Listening offline',
    talkingAbout: 'Talking about',
    aarviIsSpeaking: 'AARVI IS SPEAKING',
    aarviIsListening: 'AARVI IS LISTENING...',
    aarviIsAnalyzing: 'AARVI IS THINKING...',
    aarviIsReady: 'AARVI IS READY',
    speechPrompt: '“Aaj Gauri ne kitna doodh diya?”',
    speechTranslation: 'How much milk did Gauri give today?',
    speakNaturally: 'Speak naturally in Hindi or English',
    transcriptLabel: 'TRANSCRIPT',
    typeAnswerPlaceholder: 'Type answer in Hindi or English...',
    send: 'Send',

    // Health Result
    healthResultTitle: 'Health result',
    checkedJustNow: 'Checked just now',
    whyAarviSaysThis: 'Why AARVI says this',
    contactParaVet: 'Contact Para-Vet',
    markAsVerified: 'Mark as Verified',
    saveRecord: 'Save Record',
    recordSavedOffline: 'Record Saved Offline',
    connectingToVet: 'Connecting to Para-Vet',
    callNow: 'Call Now',
    cancel: 'Cancel',

    // Health History
    healthHistoryTitle: 'Health history',
    completeCareRecord: 'Complete care record',
    allRecords: 'All records',
    checks: 'Checks',
    care: 'Care',
    milkYield14DayTitle: '14-Day Milk Yield History',
    averageYield: 'Average Yield',
    litersShort: 'L',

    // Offline Sync
    offlineSyncTitle: 'Offline sync',
    youAreOffline: "You're offline",
    recordsSafeOnPhone: 'Records are safe on this phone',
    recordsSynchronized: 'All records synchronized',
    syncAutoNotice: "We'll sync automatically when your internet returns.",
    pendingRecords: 'Pending records',
    waitingCount: 'waiting',
    retrySync: 'Retry sync',
    syncingRecords: 'Syncing Records...',
    recentlySynced: 'Recently synced',
    allSafe: 'All safe',
    noPendingRecords: 'No pending records. Everything is securely stored!',

    // Navigation & Common
    homeTab: 'Home',
    aarviTab: 'AARVI',
    historyTab: 'History',
    profileTab: 'Profile',
    healthy: 'Healthy',
    attention: 'Attention',
    veterinaryReview: 'Veterinary Review',
    urgent: 'Urgent',
    pending: 'Pending',
    synced: 'Synced',
    locationUnavailable: 'Location unavailable',
    heatIndexLabel: 'Heat Index',
  },
  hinglish: {
    // Login
    loginWelcome: 'Swasth Pashudhan mein aapka swagat hai',
    loginSubtitle: 'Apne mobile number se login karein',
    mobileNumberLabel: 'Mobile Number',
    resendOtp: 'OTP dobara bhejein',
    otpResent: 'OTP bheja gaya!',
    validFor: 'Valid time',
    continueSecurely: 'Aage badhein',
    chooseLanguage: 'Language chunein',
    requestingLocation: 'Location detect ho raha hai...',
    locationPermissionTitle: 'Location Access',
    locationPermissionDesc: 'Para-vet aur weather info ke liye location share karein',

    // Home
    greeting: 'Namaste',
    offlineReady: 'OFFLINE • READY',
    talkToAarvi: 'AARVI se baat karein',
    askAboutPrompt: 'Milk production, feed ya health ke baare mein poochein',
    myCattle: 'Mere Pashu',
    animalsCount: 'pashu',
    milkToday: 'Aaj ka milk',
    healthProfilesUpdated: 'Sabhi health profiles updated hain',
    viewCattle: 'Dekhein',
    online: 'Online',
    offline: 'Offline',

    // Cattle Profile
    cattleProfileTitle: 'Cattle Profile',
    age: 'Age',
    pregnancy: 'Pregnancy',
    vaccination: 'Vaccination',
    milkBaseline: 'Milk Baseline',
    lastHealthCheck: 'Last Health Check',
    startHealthCheck: 'Health Check shuru karein',
    dailyLiters: 'Litre daily',

    // Voice UI
    aarviTitle: 'AARVI',
    listeningOffline: 'Offline sun rahi hai',
    talkingAbout: 'ke baare mein baat ho rahi hai',
    aarviIsSpeaking: 'AARVI bol rahi hai',
    aarviIsListening: 'AARVI sun rahi hai...',
    aarviIsAnalyzing: 'AARVI samajh rahi hai...',
    aarviIsReady: 'AARVI ready hai',
    speechPrompt: '“Aaj Gauri ne kitna milk production diya?”',
    speechTranslation: 'How much milk did Gauri give today?',
    speakNaturally: 'Hindi ya Hinglish mein naturally bolein',
    transcriptLabel: 'TRANSCRIPT',
    typeAnswerPlaceholder: 'Hinglish ya Hindi mein type karein...',
    send: 'Bhejein',

    // Health Result
    healthResultTitle: 'Health Result',
    checkedJustNow: 'Just abhi check hua',
    whyAarviSaysThis: 'AARVI yeh kyun bolti hai',
    contactParaVet: 'Para-Vet ko contact karein',
    markAsVerified: 'Verified mark karein',
    saveRecord: 'Record save karein',
    recordSavedOffline: 'Record phone mein save hua',
    connectingToVet: 'Para-Vet se connect ho raha hai',
    callNow: 'Abhi call karein',
    cancel: 'Cancel',

    // Health History
    healthHistoryTitle: 'Health History',
    completeCareRecord: 'Complete Care Record',
    allRecords: 'Sabhi records',
    checks: 'Checks',
    care: 'Care',
    milkYield14DayTitle: '14-Day Milk Production History',
    averageYield: 'Average Yield',
    litersShort: 'L',

    // Offline Sync
    offlineSyncTitle: 'Offline Sync',
    youAreOffline: 'Aap offline hain',
    recordsSafeOnPhone: 'Records phone mein safe hain',
    recordsSynchronized: 'Sabhi records sync ho chuke hain',
    syncAutoNotice: 'Internet aate hi automatically sync ho jayega.',
    pendingRecords: 'Pending records',
    waitingCount: 'waiting',
    retrySync: 'Dobara sync karein',
    syncingRecords: 'Sync ho raha hai...',
    recentlySynced: 'Recently synced records',
    allSafe: 'Sab safe hai',
    noPendingRecords: 'Koi record pending nahi hai. Sabhi safely saved hain!',

    // Navigation & Common
    homeTab: 'Home',
    aarviTab: 'AARVI',
    historyTab: 'History',
    profileTab: 'Profile',
    healthy: 'Healthy',
    attention: 'Attention',
    veterinaryReview: 'Veterinary Review',
    urgent: 'Urgent',
    pending: 'Pending',
    synced: 'Synced',
    locationUnavailable: 'Location unavailable',
    heatIndexLabel: 'Heat Index',
  },
  mr: {
    // Login
    loginWelcome: 'निरोगी जनावरांसाठी आपले स्वागत आहे',
    loginSubtitle: 'आपल्या मोबाईल नंबरने सुरक्षितपणे लॉग इन करा',
    mobileNumberLabel: 'मोबाईल नंबर',
    resendOtp: 'ओटीपी पुन्हा पाठवा',
    otpResent: 'ओटीपी यशस्वीरित्या पाठवला!',
    validFor: 'वैध वेळ',
    continueSecurely: 'सुरक्षितपणे पुढे जा',
    chooseLanguage: 'आपली भाषा निवडा',
    requestingLocation: 'स्थान तपासले जात आहे...',
    locationPermissionTitle: 'स्थान परवानगी',
    locationPermissionDesc: 'जवळचे पशुवैद्य आणि हवामान माहिती मिळवण्यासाठी स्थान आवश्यक आहे',

    // Home
    greeting: 'शुभ प्रभात, नमस्ते',
    offlineReady: 'ऑफलाइन • तयार',
    talkToAarvi: 'आरवीशी (AARVI) बोला',
    askAboutPrompt: 'दूध, चारा किंवा आरोग्याबद्दल विचारा',
    myCattle: 'माझी जनावरे',
    animalsCount: 'जनावरे',
    milkToday: 'आजचे दूध',
    healthProfilesUpdated: 'सर्व आरोग्य माहिती आज अद्ययावत आहे',
    viewCattle: 'पहा',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',

    // Cattle Profile
    cattleProfileTitle: 'जनावराची प्रोफाइल',
    age: 'वय',
    pregnancy: 'गाभण काळ',
    vaccination: 'लसीकरण',
    milkBaseline: 'सरासरी दूध',
    lastHealthCheck: 'शेवटची आरोग्य तपासणी',
    startHealthCheck: 'आरोग्य तपासणी सुरू करा',
    dailyLiters: 'लिटर दररोज',

    // Voice UI
    aarviTitle: 'आरवी (AARVI)',
    listeningOffline: 'ऑफलाइन ऐकत आहे',
    talkingAbout: 'बद्दल बोलत आहोत',
    aarviIsSpeaking: 'आरवी बोलत आहे',
    aarviIsListening: 'आरवी ऐकत आहे...',
    aarviIsAnalyzing: 'आरोग्य लक्षणांचे विश्लेषण सुरू आहे...',
    aarviIsReady: 'आरवी तयार आहे',
    speechPrompt: '“गौरीने आज किती दूध दिले?”',
    speechTranslation: 'How much milk did Gauri give today?',
    speakNaturally: 'मराठी, हिंदी किंवा इंग्रजीत बोला',
    transcriptLabel: 'लिखित माहिती (TRANSCRIPT)',
    typeAnswerPlaceholder: 'मराठी किंवा हिंदीत उत्तर लिहा...',
    send: 'पाठवा',

    // Health Result
    healthResultTitle: 'आरोग्य निकाल',
    checkedJustNow: 'आत्ताच तपासले',
    whyAarviSaysThis: 'आरवी असे का सांगते आहे',
    contactParaVet: 'पशुवैद्यकाशी संपर्क साधा',
    markAsVerified: 'तपासलेले म्हणून नोंदवा',
    saveRecord: 'नोंद जतन करा',
    recordSavedOffline: 'नोंद फोनमध्ये जतन झाली',
    connectingToVet: 'पशुवैद्यकाशी संपर्क होत आहे',
    callNow: 'आता कॉल करा',
    cancel: 'रद्द करा',

    // Health History
    healthHistoryTitle: 'आरोग्य इतिहास',
    completeCareRecord: 'संपूर्ण उपचार नोंद',
    allRecords: 'सर्व नोंदी',
    checks: 'तपासण्या',
    care: 'उपचार व लस',
    milkYield14DayTitle: '१४ दिवसांची दूध उत्पादन नोंद',
    averageYield: 'सरासरी उत्पादन',
    litersShort: 'ली.',

    // Offline Sync
    offlineSyncTitle: 'ऑफलाइन सिंक',
    youAreOffline: 'आपण ऑफलाइन आहात',
    recordsSafeOnPhone: 'नोंदी या फोनमध्ये सुरक्षित आहेत',
    recordsSynchronized: 'सर्व नोंदी सिंक झाल्या आहेत',
    syncAutoNotice: 'इंटरनेट सुरू होताच आपोआप सिंक होईल.',
    pendingRecords: 'प्रलंबित नोंदी',
    waitingCount: 'प्रतीक्षेत',
    retrySync: 'पुन्हा सिंक करा',
    syncingRecords: 'सिंक होत आहे...',
    recentlySynced: 'अलीकडे सिंक झालेल्या नोंदी',
    allSafe: 'सर्व सुरक्षित',
    noPendingRecords: 'कोणतीही नोंद प्रलंबित नाही. सर्व सुरक्षित आहे!',

    // Navigation & Common
    homeTab: 'होम',
    aarviTab: 'आरवी',
    historyTab: 'इतिहास',
    profileTab: 'प्रोफाइल',
    healthy: 'निरोगी',
    attention: 'सावधगिरी',
    veterinaryReview: 'पशुवैद्यक पुनरावलोकन',
    urgent: 'तातडीचे',
    pending: 'प्रलंबित',
    synced: 'सिंक झाले',
    locationUnavailable: 'स्थान अनुपलब्ध',
    heatIndexLabel: 'उष्णता निर्देशांक',
  },
};
