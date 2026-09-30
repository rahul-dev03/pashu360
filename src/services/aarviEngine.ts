import { Cattle, FarmerProfile, HealthCheck, HealthStatus, LanguageCode, ReasonCard, VetReferral } from '../types/index.ts';

export type AarviStep =
  | 'milk'
  | 'wellness_check'
  | 'wellness_alertness'
  | 'differential_symptoms'
  | 'temperature_check'
  | 'photo_request'
  | 'completed';

export type ClinicalDiseaseFocus = 'mastitis' | 'fmd' | 'lsd' | 'dietary_fever' | 'none';

export interface AarviConversationState {
  cattleId: string;
  step: AarviStep;
  language: LanguageCode;
  milkReported?: number;
  milkDeviation?: number;
  milkDeviationPercent?: number;
  diseaseFocus: ClinicalDiseaseFocus;
  feedIntake?: 'normal' | 'reduced' | 'refused';
  waterIntake?: 'normal' | 'reduced';
  bodyTemperature?: 'normal' | 'mild_rise' | 'high_fever';
  udderSwelling?: boolean;
  mouthLesions?: boolean;
  skinNodules?: boolean;
  walkingDifficulty?: boolean;
  visualSymptomPhotoUrl?: string;
  symptomsDescription?: string;
  currentPromptHindi: string;
  currentPromptEnglish: string;
  currentPromptHinglish: string;
  currentSpokenText: string;
  currentSubtitle: string;
  currentSecondarySubtitle: string;
  fillerStepIndex: number;
  transcriptHistory: { sender: 'aarvi' | 'farmer'; text: string; time: string }[];
  suggestedAnswers: { label: string; text: string; action?: () => void }[];
  requiresPhoto: boolean;
  photoType?: 'mastitis' | 'fmd' | 'lsd';
}

/**
 * Clean farmer first name helper
 */
function getFarmerFirstName(farmer?: FarmerProfile): string {
  if (!farmer?.name) return 'राहुल';
  const first = farmer.name.split(' ')[0].trim();
  return first || 'राहुल';
}

/**
 * Generates spoken dialogue strictly adhering to the PROMPT 6.0 Language Lock rules:
 * - Hindi: Every spoken sentence entirely in Hindi (Devanagari). No random English words.
 * - English: Entirely English.
 * - Hinglish: Hindi sentence structure with common English technical terms only.
 * - Never randomly mix languages.
 * - Max 2 short sentences per reply.
 * - One question at a time.
 * - Farmer-friendly clinical terms:
 *     Mastitis → थन में सूजन
 *     FMD → खुरपका-मुंहपका
 *     Temperature → बुखार
 *     Milk yield → दूध उत्पादन
 */
export function buildAarviDialogue(
  key: string,
  lang: LanguageCode,
  params: {
    farmerName?: string;
    cattleName: string;
    dropAmount?: string;
    reportedMilk?: number;
    baselineMilk?: number;
    diseaseFocus?: ClinicalDiseaseFocus;
  }
): { spokenText: string; subtitleHindi: string; subtitleEnglish: string; subtitleHinglish: string } {
  const { farmerName = 'राहुल', cattleName, dropAmount = '2.2', baselineMilk = 12 } = params;

  switch (key) {
    case 'greeting': {
      const spokenHindi = `नमस्ते ${farmerName} जी। आज सुबह ${cattleName} ने कितना दूध दिया?`;
      const spokenEnglish = `Namaste ${farmerName} ji. How much milk did ${cattleName} give this morning?`;
      const spokenHinglish = `नमस्ते ${farmerName} ji. आज सुबह ${cattleName} ने कितना milk production दिया?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'wellness_check': {
      // Normal milk (within 10%)
      const spokenHindi = `अच्छी बात है, दूध सामान्य है। क्या आज चारा-पानी और जुगाली ठीक रही?`;
      const spokenEnglish = `That's good news, milk production is normal. Did she take her feed and water normally today?`;
      const spokenHinglish = `अच्छी बात है, milk production normal है। क्या आज feed और पानी normal रहा?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'wellness_alertness': {
      // Feed slightly less, check alertness / mild fever
      const spokenHindi = `एक और सवाल। क्या शरीर में हल्का बुखार या सुस्ती लग रही है?`;
      const spokenEnglish = `One more question. Does she have any mild fever or sluggishness?`;
      const spokenHinglish = `एक और सवाल। क्या हल्का fever या सुस्ती लग रही है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'differential_udder': {
      const spokenHindi = `दूध सामान्य से कम है। क्या थन में सूजन, कड़ापन या दर्द महसूस हो रहा है?`;
      const spokenEnglish = `Milk production is lower than usual. Does the udder feel warm or swollen?`;
      const spokenHinglish = `Milk production normal से कम है। क्या थन में swelling या कड़ापन महसूस हो रहा है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'differential_fmd': {
      const spokenHindi = `दूध उत्पादन में गिरावट है। क्या मुँह से लार टपक रही है या खुरपका-मुंहपका के लक्षण हैं?`;
      const spokenEnglish = `Milk production has dropped. Is there drooling saliva or foot soreness?`;
      const spokenHinglish = `Milk production कम हुआ है। क्या mouth से drooling या पैर में दर्द दिख रहा है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'differential_lsd': {
      const spokenHindi = `दूध उत्पादन में गिरावट है। क्या गर्दन या शरीर पर उभरी गांठें और बुखार है?`;
      const spokenEnglish = `Milk production has dropped. Are there round firm nodules on her skin with fever?`;
      const spokenHinglish = `Milk production कम हुआ है। क्या skin पर nodules और fever दिख रहा है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'differential_general_drop': {
      // Prompt 6.0 Example: "समझ गई। लगभग 2.2 लीटर की गिरावट है। मैं कुछ और लक्षण पूछूंगी।"
      // Max 2 short sentences per reply! One question at a time.
      const spokenHindi = `समझ गई, लगभग ${dropAmount} लीटर की गिरावट है। क्या थन में सूजन या कड़ापन महसूस हो रहा है?`;
      const spokenEnglish = `Understood, that is a drop of about ${dropAmount} litres. Does her udder feel warm or swollen?`;
      const spokenHinglish = `समझ गई, लगभग ${dropAmount} litre का drop है। क्या थन में swelling या कड़ापन लग रहा है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'photo_udder': {
      const spokenHindi = `ठीक है। थन में सूजन की पुष्टि के लिए क्या आप थन की एक तस्वीर खींच सकते हैं?`;
      const spokenEnglish = `Understood. Could you please take a photo of the udder to verify the swelling?`;
      const spokenHinglish = `ठीक है। Swelling confirm karne ke liye kya aap udder ki photo le sakte hain?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'photo_fmd': {
      const spokenHindi = `ठीक है। छालों और लार की पुष्टि के लिए क्या आप मुँह की एक तस्वीर ले सकते हैं?`;
      const spokenEnglish = `Understood. Could you please take a photo of her mouth to verify lesions?`;
      const spokenHinglish = `ठीक है। Lesions confirm karne ke liye kya aap mouth ki photo le sakte hain?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'photo_lsd': {
      const spokenHindi = `ठीक है। त्वचा पर उभरी गांठों की पुष्टि के लिए क्या आप प्रभावित जगह की तस्वीर ले सकते हैं?`;
      const spokenEnglish = `Understood. Could you please take a photo of the skin nodules to confirm?`;
      const spokenHinglish = `ठीक है। Skin nodules confirm karne ke liye kya aap photo le sakte hain?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'temperature_check': {
      const spokenHindi = `एक और सवाल। क्या कान छूने पर गर्म लग रहा है और सुस्ती है?`;
      const spokenEnglish = `One more question. Does her ear base feel warm and is she feeling sluggish?`;
      const spokenHinglish = `एक और सवाल। क्या ear base छूने पर गर्म लग रहा है और fever है?`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'complete_urgent': {
      // Emotional Intelligence: Urgent
      const spokenHindi = `यह मामला थोड़ा गंभीर लग रहा है। घबराइए नहीं, मैं पैरा-वेट टीम को सूचित कर रही हूँ।`;
      const spokenEnglish = `This seems a bit serious. Please don't worry, I am alerting the para-vet team.`;
      const spokenHinglish = `यह मामला थोड़ा serious लग रहा है। घबराइए नहीं, मैं para-vet team को inform कर रही हूँ।`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'complete_review': {
      // Emotional Intelligence: Veterinary Review
      const spokenHindi = `दूध में गिरावट और लक्षण जांच योग्य हैं। मैंने नजदीकी पशु-चिकित्सक को सूचित कर दिया है।`;
      const spokenEnglish = `The symptoms and milk drop need medical review. I have notified your designated para-vet.`;
      const spokenHinglish = `Milk drop aur symptoms par veterinary review chahiye. Maine para-vet ko details share kar di hain.`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }

    case 'complete_normal':
    default: {
      // Emotional Intelligence: Normal
      const spokenHindi = `अच्छी बात है। फिलहाल सभी संकेत सामान्य लग रहे हैं।`;
      const spokenEnglish = `That's good news. Right now all signs look healthy and normal.`;
      const spokenHinglish = `अच्छी बात है। फिलहाल सभी signals normal लग रहे हैं।`;

      return {
        spokenText: lang === 'en' ? spokenEnglish : lang === 'hinglish' ? spokenHinglish : spokenHindi,
        subtitleHindi: spokenHindi,
        subtitleEnglish: spokenEnglish,
        subtitleHinglish: spokenHinglish,
      };
    }
  }
}

/**
 * Builds suggested answer chips tailored to active language
 */
function buildSuggestedAnswers(
  step: AarviStep,
  cattle: Cattle,
  lang: LanguageCode,
  diseaseFocus?: ClinicalDiseaseFocus
): { label: string; text: string }[] {
  const baseline = cattle.baselineMilk;
  const normalStr = `${baseline} L`;
  const dropStr = `${(baseline - 2.2).toFixed(1)} L`;
  const sharpDropStr = `${(baseline - 3.8).toFixed(1)} L`;

  if (step === 'milk') {
    if (lang === 'en') {
      return [
        { label: `✅ ${normalStr} (Normal milk)`, text: `${cattle.name} gave her normal ${baseline} litres.` },
        { label: `⚠️ ${dropStr} (Milk drop)`, text: `Milk production was lower today, gave ${dropStr}.` },
        { label: `🚨 ${sharpDropStr} (Heavy drop)`, text: `Only gave ${sharpDropStr}, significant drop.` },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: `✅ ${normalStr} (Normal milk)`, text: `${cattle.name} ne normal ${baseline} litre milk diya.` },
        { label: `⚠️ ${dropStr} (Kam hua)`, text: `Milk drop hua hai, lagbhag ${dropStr} diya.` },
        { label: `🚨 ${sharpDropStr} (Bhari girawat)`, text: `Sirf ${sharpDropStr} diya, kafi zyada girawat hai.` },
      ];
    }
    // Hindi default
    return [
      { label: `✅ ${normalStr} (सामान्य दूध)`, text: `${cattle.name} ने आज सामान्य ${baseline} लीटर दूध दिया।` },
      { label: `⚠️ ${dropStr} (दूध कम हुआ)`, text: `दूध उत्पादन कम हुआ है, लगभग ${dropStr} दिया।` },
      { label: `🚨 ${sharpDropStr} (भारी गिरावट)`, text: `सिर्फ ${sharpDropStr} दिया, बहुत ज्यादा गिरावट है।` },
    ];
  }

  if (step === 'wellness_check') {
    if (lang === 'en') {
      return [
        { label: 'Yes, feed and water are normal', text: 'Feed intake, water and cud chewing are completely normal.' },
        { label: 'Ate slightly less fodder', text: 'Feed intake was slightly less this morning.' },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: 'Feed aur paani normal hai', text: 'Feed intake aur paani bilkul normal hai.' },
        { label: 'Feed thoda kam khaya hai', text: 'Feed thoda kam khaya hai subah.' },
      ];
    }
    return [
      { label: 'हाँ, चारा-पानी और जुगाली ठीक है', text: 'चारा, पानी और जुगाली पूरी तरह सामान्य है।' },
      { label: 'चारा थोड़ा कम खाया है', text: 'सुबह चारा थोड़ा कम खाया है।' },
    ];
  }

  if (step === 'wellness_alertness') {
    if (lang === 'en') {
      return [
        { label: 'Active and alert', text: 'No fever or lethargy, she is alert and walking fine.' },
        { label: 'Slightly sluggish / mild warm', text: 'Mild sluggishness observed, resting more than usual.' },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: 'Alert aur active hai', text: 'Koi fever nahi hai, active aur normal hai.' },
        { label: 'Thoda sluggish lag rahi hai', text: 'Thodi susti aur mild fever lag raha hai.' },
      ];
    }
    return [
      { label: 'नहीं, बिल्कुल चुस्त है', text: 'कोई बुखार या सुस्ती नहीं है, बिल्कुल ठीक है।' },
      { label: 'हल्की सुस्ती दिख रही है', text: 'हल्की सुस्ती है और सामान्य से अधिक बैठी है।' },
    ];
  }

  if (step === 'differential_symptoms') {
    if (lang === 'en') {
      return [
        { label: 'Udder feels swollen & firm', text: 'Udder feels firm, warm and sensitive during milking.' },
        { label: 'Drooling saliva and limping', text: 'Frothy salivation observed and limping with foot soreness.' },
        { label: 'Firm skin nodules on body', text: 'Firm round nodules observed across neck and body skin.' },
        { label: 'Eating less and sluggish', text: 'Eating less fodder since morning, feeling sluggish.' },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: 'Than mein swelling aur dard hai', text: 'Udder mein swelling, garmahat aur dard hai.' },
        { label: 'Mouth se drooling aur limping hai', text: 'Mouth se drooling ho rahi hai aur chalne mein limping hai.' },
        { label: 'Skin par nodules ubhre hain', text: 'Body aur neck par nodules ubhre hain.' },
        { label: 'Feed kam liya hai aur suste hai', text: 'Feed kam liya hai aur sluggish baithi hai.' },
      ];
    }
    return [
      { label: 'थन में सूजन और छूने पर दर्द है', text: 'थन कड़ा, गर्म और छूने पर दर्द महसूस हो रहा है।' },
      { label: 'मुँह से लार और लंगड़ापन है', text: 'मुँह से लार टपक रही है और चलने में लंगड़ा रही है।' },
      { label: 'त्वचा पर गोल कठोर गांठें हैं', text: 'त्वचा और गर्दन पर गोल गांठें उभरी हुई हैं।' },
      { label: 'चारा कम लिया है और सुस्त है', text: 'चारा-पानी कम लिया है और सुस्त बैठी है।' },
    ];
  }

  if (step === 'photo_request') {
    if (lang === 'en') {
      return [
        { label: '📷 Capture Photo', text: 'Captured photo of symptoms for verification.' },
        { label: 'Skip photo & view result', text: 'Skip photo and show clinical assessment result.' },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: '📷 Photo lein', text: 'Symptoms ki photo capture kar li hai.' },
        { label: 'Photo skip karein & result dekhein', text: 'Photo skip karein aur assessment result dekhein.' },
      ];
    }
    return [
      { label: '📷 फोटो खींचें', text: 'लक्षणों की फोटो खींच ली गई है।' },
      { label: 'फोटो छोड़ें और परिणाम देखें', text: 'फोटो छोड़ें और स्वास्थ्य परिणाम देखें।' },
    ];
  }

  if (step === 'temperature_check') {
    if (lang === 'en') {
      return [
        { label: 'Mild warmth & resting', text: 'Ear base feels warm and she is lying down lethargic.' },
        { label: 'High fever detected', text: 'High fever detected with burning ear base and heavy breathing.' },
        { label: 'Normal temperature', text: 'Body temperature feels normal, no fever detected.' },
      ];
    }
    if (lang === 'hinglish') {
      return [
        { label: 'Halka warm aur suste hai', text: 'Ear base halka warm lag raha hai aur suste hai.' },
        { label: 'High fever lag raha hai', text: 'High fever lag raha hai aur tej saans le rahi hai.' },
        { label: 'Temperature normal hai', text: 'Temperature bilkul normal lag raha hai.' },
      ];
    }
    return [
      { label: 'हल्का गर्म है और सुस्त बैठी है', text: 'कान का आधार हल्का गर्म लग रहा है और सुस्त बैठी है।' },
      { label: 'तेज़ बुखार लग रहा है', text: 'तेज़ बुखार लग रहा है और गहरी सांस ले रही है।' },
      { label: 'तापमान सामान्य है', text: 'शरीर का तापमान सामान्य लग रहा है, बुखार नहीं है।' },
    ];
  }

  return [];
}

/**
 * Initializes conversation for the selected cattle using their baseline profile
 */
export function initAarviConversation(
  cattle: Cattle,
  farmer?: FarmerProfile,
  lang: LanguageCode = 'hi'
): AarviConversationState {
  const dialogue = buildAarviDialogue('greeting', lang, {
    farmerName: getFarmerFirstName(farmer),
    cattleName: cattle.name,
    baselineMilk: cattle.baselineMilk,
  });

  const suggested = buildSuggestedAnswers('milk', cattle, lang);

  return {
    cattleId: cattle.id,
    step: 'milk',
    language: lang,
    diseaseFocus: 'none',
    currentPromptHindi: dialogue.subtitleHindi,
    currentPromptEnglish: dialogue.subtitleEnglish,
    currentPromptHinglish: dialogue.subtitleHinglish,
    currentSpokenText: dialogue.spokenText,
    currentSubtitle: lang === 'en' ? dialogue.subtitleEnglish : lang === 'hinglish' ? dialogue.subtitleHinglish : dialogue.subtitleHindi,
    currentSecondarySubtitle: lang === 'en' ? dialogue.subtitleHindi : dialogue.subtitleEnglish,
    fillerStepIndex: 0,
    transcriptHistory: [
      {
        sender: 'aarvi',
        text: dialogue.spokenText,
        time: 'Just now',
      },
    ],
    suggestedAnswers: suggested,
    requiresPhoto: false,
  };
}

/**
 * Dynamic Clinical Interview Engine
 * 
 * Rules:
 * 1. Always begins with milk yield vs baseline profile.
 * 2. If today's milk is within ±10% of baseline:
 *    - Ask only 2–3 questions.
 *    - Finish early.
 *    - Mark Healthy.
 * 3. If deviation exceeds the ±10% threshold:
 *    - Ask only relevant follow-up questions.
 *    - Never ask every disease question.
 * 4. Conditional Camera:
 *    - Mastitis → Udder photo
 *    - FMD → Mouth photo
 *    - LSD → Skin lesion photo
 *    - Otherwise never ask for images.
 * 5. Structured Vet Referral: Generated ONLY when Risk is Veterinary Review or Urgent.
 * 6. Natural Language Lock: Hindi, English, Hinglish - no random mixing.
 * 7. Farmer-friendly terms: Mastitis -> थन में सूजन, FMD -> खुरपका-मुंहपका, etc.
 */
export function advanceAarviConversation(
  currentState: AarviConversationState,
  farmerInput: string,
  cattle: Cattle,
  farmer: FarmerProfile,
  preferredLanguage?: LanguageCode
): {
  nextState: AarviConversationState;
  finalHealthCheck?: HealthCheck;
  referral?: VetReferral;
} {
  const lang: LanguageCode = preferredLanguage || currentState.language || farmer.preferredLanguage || 'hi';
  const next: AarviConversationState = { ...currentState, language: lang };
  next.transcriptHistory = [
    ...next.transcriptHistory,
    { sender: 'farmer', text: farmerInput, time: 'Just now' },
  ];

  const lower = farmerInput.toLowerCase();
  const farmerFirstName = getFarmerFirstName(farmer);

  // Helper to commit new dialogue state
  const setDialogueState = (key: string, step: AarviStep, params: any) => {
    next.step = step;
    const dlg = buildAarviDialogue(key, lang, {
      farmerName: farmerFirstName,
      cattleName: cattle.name,
      ...params,
    });
    next.currentPromptHindi = dlg.subtitleHindi;
    next.currentPromptEnglish = dlg.subtitleEnglish;
    next.currentPromptHinglish = dlg.subtitleHinglish;
    next.currentSpokenText = dlg.spokenText;
    next.currentSubtitle = lang === 'en' ? dlg.subtitleEnglish : lang === 'hinglish' ? dlg.subtitleHinglish : dlg.subtitleHindi;
    next.currentSecondarySubtitle = lang === 'en' ? dlg.subtitleHindi : dlg.subtitleEnglish;
    next.suggestedAnswers = buildSuggestedAnswers(step, cattle, lang, next.diseaseFocus);
    next.transcriptHistory.push({
      sender: 'aarvi',
      text: dlg.spokenText,
      time: 'Just now',
    });
  };

  // =========================================================================
  // STEP 1: Milk Yield vs Cattle Baseline Profile
  // =========================================================================
  if (currentState.step === 'milk') {
    let reported = cattle.baselineMilk;
    const match = farmerInput.match(/(\d+(\.\d+)?)/);
    if (match) {
      reported = parseFloat(match[1]);
    } else if (
      lower.includes('kam') ||
      lower.includes('drop') ||
      lower.includes('less') ||
      lower.includes('gira') ||
      lower.includes('ghata') ||
      lower.includes('कम')
    ) {
      reported = parseFloat((cattle.baselineMilk - 2.2).toFixed(1));
    }

    const deviation = parseFloat((reported - cattle.baselineMilk).toFixed(1));
    const deviationPercent = parseFloat(((deviation / cattle.baselineMilk) * 100).toFixed(1));
    next.milkReported = reported;
    next.milkDeviation = deviation;
    next.milkDeviationPercent = deviationPercent;

    // Detect if farmer already volunteered specific symptoms in their first sentence
    const hasUdderClue =
      lower.includes('than') || lower.includes('थन') || lower.includes('mastitis') || lower.includes('kada') || lower.includes('कड़ा') || lower.includes('swelling') || lower.includes('सूजन');
    const hasFmdClue =
      lower.includes('lar') || lower.includes('लार') || lower.includes('fmd') || lower.includes('khur') || lower.includes('खुर') || lower.includes('langda') || lower.includes('लंगड़ा') || lower.includes('drool') || lower.includes('limp');
    const hasLsdClue =
      lower.includes('ganth') || lower.includes('गांठ') || lower.includes('gilti') || lower.includes('गिल्टी') || lower.includes('lsd') || lower.includes('nodule') || lower.includes('lump');

    // PATHWAY A: Milk is within ±10% of baseline (Finish in 2-3 questions, Mark Healthy!)
    const isWithin10Percent = Math.abs(deviationPercent) <= 10.0 && !hasUdderClue && !hasFmdClue && !hasLsdClue;

    if (isWithin10Percent) {
      setDialogueState('wellness_check', 'wellness_check', { reportedMilk: reported });
      return { nextState: next };
    }

    // PATHWAY B: Deviation exceeds ±10% threshold
    const dropAmount = Math.abs(deviation).toFixed(1);

    if (hasUdderClue) {
      next.diseaseFocus = 'mastitis';
      next.udderSwelling = true;
      setDialogueState('differential_udder', 'differential_symptoms', { dropAmount });
    } else if (hasFmdClue) {
      next.diseaseFocus = 'fmd';
      next.mouthLesions = true;
      next.walkingDifficulty = true;
      setDialogueState('differential_fmd', 'differential_symptoms', { dropAmount });
    } else if (hasLsdClue) {
      next.diseaseFocus = 'lsd';
      next.skinNodules = true;
      setDialogueState('differential_lsd', 'differential_symptoms', { dropAmount });
    } else {
      setDialogueState('differential_general_drop', 'differential_symptoms', { dropAmount });
    }

    return { nextState: next };
  }

  // =========================================================================
  // NORMAL PATHWAY: Question 2 (Wellness Confirmation)
  // =========================================================================
  if (currentState.step === 'wellness_check') {
    const isSlightlyLess =
      lower.includes('kam') || lower.includes('thoda') || lower.includes('less') || lower.includes('कम') || lower.includes('थोड़ा');

    if (!isSlightlyLess) {
      // Completely normal! Conclude immediately in 2 questions!
      return completeHealthCheck(
        {
          ...next,
          feedIntake: 'normal',
          waterIntake: 'normal',
          bodyTemperature: 'normal',
          step: 'completed',
        },
        cattle,
        farmer,
        lang,
        'Healthy'
      );
    } else {
      // Question 3: Quick physical alertness check for slight dip
      next.feedIntake = 'reduced';
      setDialogueState('wellness_alertness', 'wellness_alertness', {});
      return { nextState: next };
    }
  }

  // NORMAL PATHWAY: Question 3 (Wellness Alertness Followup) -> Concludes in 3 questions!
  if (currentState.step === 'wellness_alertness') {
    const isLethargic =
      lower.includes('sust') || lower.includes('सुस्त') || lower.includes('sluggish') || lower.includes('warm') || lower.includes('गर्म');

    const risk: HealthStatus = isLethargic ? 'Attention' : 'Healthy';
    return completeHealthCheck(
      {
        ...next,
        bodyTemperature: isLethargic ? 'mild_rise' : 'normal',
        step: 'completed',
      },
      cattle,
      farmer,
      lang,
      risk
    );
  }

  // =========================================================================
  // DEVIATION PATHWAY: Differential Symptoms Analysis & CONDITIONAL CAMERA
  // =========================================================================
  if (currentState.step === 'differential_symptoms') {
    const isMastitis =
      lower.includes('than') ||
      lower.includes('थन') ||
      lower.includes('mastitis') ||
      lower.includes('kada') ||
      lower.includes('कड़ा') ||
      lower.includes('sujan') ||
      lower.includes('सूजन') ||
      lower.includes('firm') ||
      lower.includes('swelling') ||
      lower.includes('dard') ||
      lower.includes('दर्द');

    const isFmd =
      lower.includes('lar') ||
      lower.includes('लार') ||
      lower.includes('fmd') ||
      lower.includes('saliv') ||
      lower.includes('drool') ||
      lower.includes('khur') ||
      lower.includes('खुर') ||
      lower.includes('langda') ||
      lower.includes('लंगड़ा') ||
      lower.includes('limp') ||
      lower.includes('blister') ||
      lower.includes('छाले');

    const isLsd =
      lower.includes('ganth') ||
      lower.includes('गांठ') ||
      lower.includes('gilti') ||
      lower.includes('गिल्टी') ||
      lower.includes('lsd') ||
      lower.includes('nodule') ||
      lower.includes('lump') ||
      lower.includes('लंपी') ||
      lower.includes('दाने');

    // CONDITIONAL CAMERA CASE 1: Mastitis → Udder photo
    if (isMastitis) {
      next.diseaseFocus = 'mastitis';
      next.udderSwelling = true;
      next.requiresPhoto = true;
      next.photoType = 'mastitis';
      setDialogueState('photo_udder', 'photo_request', {});
      return { nextState: next };
    }

    // CONDITIONAL CAMERA CASE 2: FMD → Mouth photo
    if (isFmd) {
      next.diseaseFocus = 'fmd';
      next.mouthLesions = true;
      next.walkingDifficulty = true;
      next.requiresPhoto = true;
      next.photoType = 'fmd';
      setDialogueState('photo_fmd', 'photo_request', {});
      return { nextState: next };
    }

    // CONDITIONAL CAMERA CASE 3: LSD → Skin lesion photo
    if (isLsd) {
      next.diseaseFocus = 'lsd';
      next.skinNodules = true;
      next.requiresPhoto = true;
      next.photoType = 'lsd';
      setDialogueState('photo_lsd', 'photo_request', {});
      return { nextState: next };
    }

    // NON-VISUAL CASE: Dietary / Systemic Fever (NO LESIONS, NO UDDER SWELLING)
    next.diseaseFocus = 'dietary_fever';
    next.requiresPhoto = false;
    next.photoType = undefined;
    setDialogueState('temperature_check', 'temperature_check', {});
    return { nextState: next };
  }

  // =========================================================================
  // NON-VISUAL TEMPERATURE CHECK
  // =========================================================================
  if (currentState.step === 'temperature_check') {
    const isHighFever =
      lower.includes('high') || lower.includes('40') || lower.includes('tez') || lower.includes('तेज़') || lower.includes('तेज') || lower.includes('burning');
    const isMildWarmth =
      lower.includes('warm') || lower.includes('39') || lower.includes('halka') || lower.includes('हल्का') || lower.includes('garm') || lower.includes('गर्म');

    next.bodyTemperature = isHighFever ? 'high_fever' : isMildWarmth ? 'mild_rise' : 'normal';
    next.requiresPhoto = false;
    return completeHealthCheck(next, cattle, farmer, lang);
  }

  // =========================================================================
  // PHOTO CONFIRMATION
  // =========================================================================
  if (currentState.step === 'photo_request') {
    if (lower.includes('photo') || lower.includes('captured') || lower.includes('camera') || lower.includes('फोटो') || lower.includes('lein')) {
      next.visualSymptomPhotoUrl = cattle.photoUrl;
      if (next.photoType === 'mastitis') {
        next.symptomsDescription = 'Visual verification confirms localized quarter udder swelling and firmness.';
      } else if (next.photoType === 'fmd') {
        next.symptomsDescription = 'Visual verification confirms oral mucosa vesicles, frothy salivation, and foot tenderness.';
      } else if (next.photoType === 'lsd') {
        next.symptomsDescription = 'Visual verification confirms multiple circumscribed 2-5cm cutaneous skin nodules.';
      }
    }
    return completeHealthCheck(next, cattle, farmer, lang);
  }

  return { nextState: next };
}

/**
 * Concludes clinical assessment with structured Vet Referral and natural conclusion dialogue
 */
function completeHealthCheck(
  state: AarviConversationState,
  cattle: Cattle,
  farmer: FarmerProfile,
  lang: LanguageCode,
  forcedRisk?: HealthStatus
): {
  nextState: AarviConversationState;
  finalHealthCheck: HealthCheck;
  referral?: VetReferral;
} {
  state.step = 'completed';

  const deviation = state.milkDeviation ?? 0.0;
  const isMastitis = state.diseaseFocus === 'mastitis';
  const isFmd = state.diseaseFocus === 'fmd';
  const isLsd = state.diseaseFocus === 'lsd';
  const isHighFever = state.bodyTemperature === 'high_fever';

  let riskLevel: HealthStatus = forcedRisk || 'Attention';
  let headline = `${cattle.name} needs a closer look today`;
  let description = 'These signs may point to early illness. A para-vet can help you check her safely.';
  let recommendation = 'Keep fresh water nearby and monitor her until help arrives.';
  let reasons: ReasonCard[] = [];

  // 1. HEALTHY CASE
  if (forcedRisk === 'Healthy' || (state.diseaseFocus === 'none' && Math.abs(deviation) <= 1.0)) {
    riskLevel = 'Healthy';
    headline = `${cattle.name} is in great health today`;
    description = `All vital signs, feed intake, and milk yield (${state.milkReported ?? cattle.baselineMilk} L) match expected benchmarks.`;
    recommendation = 'Continue regular green fodder mix and routine milking schedule.';
    reasons = [
      {
        icon: 'milk',
        title: 'Milk yield on target',
        description: `${state.milkReported ?? cattle.baselineMilk} L produced today (Baseline: ${cattle.baselineMilk} L)`,
        severity: 'mild',
      },
      {
        icon: 'feed',
        title: 'Feed intake optimal',
        description: 'Routine rumination, active digestion and regular hydration reported',
        severity: 'mild',
      },
    ];
  }
  // 2. URGENT CASE (FMD or acute distress)
  else if (isFmd || isHighFever || Math.abs(deviation) >= 3.5) {
    riskLevel = 'Urgent';
    headline = isFmd ? 'FMD Contagious Disease Alert' : 'Urgent veterinary attention needed';
    description = isFmd
      ? 'Oral frothing, vesicles, and walking difficulty indicate suspected Foot-and-Mouth Disease (FMD).'
      : 'Acute fever spike and severe yield collapse detected. Emergency para-vet alert dispatched.';
    recommendation = isFmd
      ? 'Isolate animal immediately from herd. Do not move off farm. Apply mild potassium permanganate wash on mouth/feet and await emergency Para-Vet.'
      : 'Isolate cow in a cool shaded area. Ensure water access. Emergency alert sent to Para-Vet.';
    reasons = [
      {
        icon: 'breathing',
        title: isFmd ? 'Oral frothing & vesicles' : 'High fever detected',
        description: isFmd ? 'Copious stringy drooling and foot soreness' : '40.6°C — acute fever indicator',
        severity: 'high',
      },
      {
        icon: 'milk',
        title: 'Severe milk yield drop',
        description: `Down ${Math.abs(deviation)} L below baseline (${Math.abs(state.milkDeviationPercent || 0)}% drop)`,
        severity: 'high',
      },
      {
        icon: 'activity',
        title: isFmd ? 'Walking difficulty & limping' : 'Refusal of fodder',
        description: isFmd ? 'Painful hoof lesions and reluctance to stand' : 'Complete cessation of cud chewing',
        severity: 'high',
      },
    ];
  }
  // 3. VETERINARY REVIEW CASE (Mastitis or LSD)
  else if (isMastitis || isLsd || Math.abs(deviation) >= 2.0) {
    riskLevel = 'Veterinary Review';
    headline = isMastitis
      ? 'Subclinical Mastitis Check Recommended'
      : isLsd
      ? 'Lumpy Skin Disease (LSD) Suspect'
      : 'Veterinary review recommended';

    description = isMastitis
      ? 'Quarter swelling, firmness and acute milk drop indicate early-stage mastitis.'
      : isLsd
      ? 'Circumscribed cutaneous nodules and fever indicate suspected Lumpy Skin Disease.'
      : 'Persistent yield reduction and appetite disruption observed.';

    recommendation = isMastitis
      ? 'Strip teats into strip cup. Apply cold compress and notify designated Para-Vet for California Mastitis Test (CMT).'
      : isLsd
      ? 'Isolate animal. Apply neem oil/antiseptic on nodules and notify Para-Vet for supportive therapy.'
      : 'Keep animal comfortable and notify designated Karnal block Para-Vet.';

    reasons = [
      {
        icon: 'milk',
        title: 'Significant milk drop',
        description: `Down ${Math.abs(deviation)} L from regular baseline`,
        severity: 'moderate',
      },
      {
        icon: 'thermometer',
        title: isMastitis ? 'Udder heat & quarter firmness' : isLsd ? 'Cutaneous nodular lesions' : 'Elevated body temperature',
        description: isMastitis
          ? 'Swelling and milking resistance observed'
          : isLsd
          ? '2-5 cm nodules across body'
          : '39.8°C with warm ear base',
        severity: 'moderate',
      },
      {
        icon: 'feed',
        title: 'Feed intake affected',
        description: 'Feeding reduced compared to baseline average',
        severity: 'moderate',
      },
    ];
  }
  // 4. ATTENTION CASE
  else {
    riskLevel = 'Attention';
    headline = `${cattle.name} needs a closer look today`;
    description = 'Slight yield reduction and minor appetite variation observed.';
    recommendation = 'Monitor evening milking output and ensure clean mineral water access.';
    reasons = [
      {
        icon: 'milk',
        title: 'Milk output is slightly lower',
        description: `Down ${Math.abs(deviation)} L from her 7-day average`,
        severity: 'moderate',
      },
      {
        icon: 'thermometer',
        title: 'Mild temperature rise',
        description: '39.4°C — slightly above her usual range',
        severity: 'mild',
      },
      {
        icon: 'feed',
        title: 'Reduced appetite reported',
        description: 'Slow rumination observed today',
        severity: 'mild',
      },
    ];
  }

  // Structured Vet Referral for Vet Portal ONLY
  let referral: VetReferral | undefined;
  let referralId: string | undefined;

  if (riskLevel === 'Veterinary Review' || riskLevel === 'Urgent') {
    referralId = `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    referral = {
      id: referralId,
      cattleId: cattle.id,
      cattleName: cattle.name,
      breed: cattle.breed,
      tag: cattle.tag,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      location: `${farmer.district}, ${farmer.state}`,
      createdAt: 'Just now',
      riskLevel: riskLevel as 'Veterinary Review' | 'Urgent',
      urgencyLevel: riskLevel === 'Urgent' ? 'Immediate' : 'High',
      chiefComplaints: reasons.map((r) => `${r.title}: ${r.description}`),
      vitalsSummary: `Milk drop: ${deviation}L (${state.milkDeviationPercent || 0}%) | Breed: ${cattle.breed} | Pregnancy: ${cattle.pregnancy} | Vaccination: ${cattle.vaccination} | Clinical Focus: ${state.diseaseFocus}`,
      photoUrl: state.visualSymptomPhotoUrl,
      assignedClinic: 'Karnal Block Veterinary Hospital',
      status: 'dispatched',
    };
  }

  const finalHealthCheck: HealthCheck = {
    id: `check-${Date.now()}`,
    cattleId: cattle.id,
    cattleName: cattle.name,
    timestamp: 'Just now',
    milkReported: state.milkReported ?? cattle.baselineMilk,
    baselineMilk: cattle.baselineMilk,
    milkDeviation: deviation,
    appetiteStatus: state.feedIntake === 'refused' ? 'none' : state.feedIntake === 'reduced' ? 'reduced' : 'normal',
    temperatureStatus: state.bodyTemperature,
    visualSymptomPhotoUrl: state.visualSymptomPhotoUrl,
    symptomsDescription: state.symptomsDescription,
    riskLevel,
    reasons,
    recommendation,
    referralId,
  };

  // Conclusion spoken dialogue selection
  const dialogueKey = riskLevel === 'Urgent' ? 'complete_urgent' : riskLevel === 'Veterinary Review' ? 'complete_review' : 'complete_normal';
  const dlg = buildAarviDialogue(dialogueKey, lang, {
    farmerName: getFarmerFirstName(farmer),
    cattleName: cattle.name,
  });

  state.currentPromptHindi = dlg.subtitleHindi;
  state.currentPromptEnglish = dlg.subtitleEnglish;
  state.currentPromptHinglish = dlg.subtitleHinglish;
  state.currentSpokenText = dlg.spokenText;
  state.currentSubtitle = lang === 'en' ? dlg.subtitleEnglish : lang === 'hinglish' ? dlg.subtitleHinglish : dlg.subtitleHindi;
  state.currentSecondarySubtitle = lang === 'en' ? dlg.subtitleHindi : dlg.subtitleEnglish;
  state.suggestedAnswers = [];
  state.transcriptHistory.push({
    sender: 'aarvi',
    text: dlg.spokenText,
    time: 'Just now',
  });

  return { nextState: state, finalHealthCheck, referral };
}
