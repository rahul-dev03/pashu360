import { VetReferral } from '../../types';
import champaCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';
import girCowPhoto from '../../assets/images/gir_cow_gauri_1790603427631.jpg';
import sahiwalCowPhoto from '../../assets/images/sahiwal_cow_lakshmi_1790603441182.jpg';
import farmerPhoto from '../../assets/images/farmer_rahul_avatar_1790603410179.jpg';

export { champaCowPhoto, girCowPhoto, sahiwalCowPhoto, farmerPhoto };

export interface ParaVetAppointment {
  id: string;
  referralId?: string;
  cattleName: string;
  breed: string;
  tag: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  date: string;
  timeSlot: string;
  purpose: string;
  urgency: 'Immediate' | 'High' | 'Routine';
  status: 'scheduled' | 'en_route' | 'completed' | 'cancelled';
  assignedOfficer: string;
}

export interface ParaVetVaccinationRecord {
  id: string;
  cattleId: string;
  cattleName: string;
  tag: string;
  breed: string;
  farmerName: string;
  village: string;
  vaccineName: string;
  lastGivenDate: string;
  nextDueDate: string;
  status: 'due_soon' | 'up_to_date' | 'overdue';
  batchNumber: string;
}

export interface CaseClinicalDetails extends VetReferral {
  // Center panel data
  aiTranscript: {
    speaker: 'AARVI' | 'Farmer';
    textHindi: string;
    textEnglish: string;
    timestamp: string;
  }[];
  symptomsList: {
    title: string;
    description: string;
    severity: 'high' | 'moderate' | 'mild';
    category: 'udder' | 'systemic' | 'respiratory' | 'oral' | 'skin';
  }[];
  uploadedPhotos: {
    title: string;
    url: string;
    caption: string;
    type: 'udder' | 'mouth' | 'skin';
  }[];
  precautionsGiven: string[];

  // Right panel data
  suggestedClinicalSteps: string[];
  treatmentNotes: string;
  prescriptions: {
    id: string;
    medicineName: string;
    dosage: string;
    route: 'IM' | 'SC' | 'Oral' | 'Intramammary' | 'Topical';
    duration: string;
    instructions: string;
  }[];
}

// Initial rich referrals for Gauri, Champa, and Laxmi
export const initialParaVetReferrals: CaseClinicalDetails[] = [
  {
    id: 'REF-2026-8196',
    cattleId: 'gauri',
    cattleName: 'Gauri',
    breed: 'Gir',
    tag: 'P360-021',
    farmerName: 'Rahul Yadav',
    farmerPhone: '+91 98765 43210',
    location: 'Karnal, Haryana',
    createdAt: 'Today, 7:45 AM',
    riskLevel: 'Veterinary Review',
    urgencyLevel: 'High',
    chiefComplaints: [
      'Significant milk drop: Down 2.2 L from regular baseline',
      'Udder heat & quarter firmness: Left rear quarter swelling and resistance during milking',
      'Appetite intact: Feeding normally despite milk output collapse',
    ],
    vitalsSummary: 'Milk: 10.2L (-17.7%) | Temp: 39.4°C | Ear Base: Warm | Udder: Left Rear Quarter Firm',
    photoUrl: girCowPhoto,
    assignedClinic: 'Karnal Block Veterinary Hospital',
    status: 'dispatched',

    aiTranscript: [
      {
        speaker: 'AARVI',
        textHindi: 'नमस्ते। आज गौरी ने सुबह कितना दूध दिया?',
        textEnglish: 'Hello. How much milk did Gauri give this morning? (Baseline: 12.4 L)',
        timestamp: '7:41 AM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'आज सुबह सिर्फ 10.2 लीटर दूध निकला, हमेशा से 2 लीटर से ज्यादा कम है।',
        textEnglish: 'Only 10.2 litres came out this morning, more than 2 litres down from usual.',
        timestamp: '7:42 AM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'दूध में 2.2L की गिरावट आई है। क्या गौरी ने चारा-पानी कम लिया, या थन में कोई कड़ापन दिखा?',
        textEnglish: 'Milk dropped by 2.2L (17.7% below baseline). Did Gauri reduce feed/water, or is there udder hardness?',
        timestamp: '7:42 AM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'चारा-पानी तो ठीक खा रही है, लेकिन पिछला बायां थन बहुत कड़ा और गर्म लग रहा है, हाथ लगाने पर लात मार रही है।',
        textEnglish: 'Feed and water are fine, but left rear teat is very firm, hot, and she kicks when touched.',
        timestamp: '7:43 AM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'लक्षण प्रारंभिक मैस्टाइटिस (थन में सूजन) की ओर संकेत कर रहे हैं। क्या आप थन की एक साफ तस्वीर साझा कर सकते हैं?',
        textEnglish: 'Symptoms indicate early mastitis. Can you share a clear photo of the udder quarters?',
        timestamp: '7:44 AM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'हाँ, मैंने थन की तस्वीर खींच ली है।',
        textEnglish: 'Yes, captured the photo of the udder.',
        timestamp: '7:44 AM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'तस्वीर और लक्षणों के आधार पर स्थिति "Veterinary Review" है। करनाल ब्लॉक वेटरनरी अस्पताल को रेफरल भेजा गया है।',
        textEnglish: 'Based on signs, status is Veterinary Review. Referral dispatched to Karnal Block Vet Hospital.',
        timestamp: '7:45 AM',
      },
    ],

    symptomsList: [
      {
        title: 'Left Rear Quarter Swelling',
        description: 'Palpation indicates acute firmness, erythema, and localized temperature spike.',
        severity: 'high',
        category: 'udder',
      },
      {
        title: 'Acute Milk Yield Deficit',
        description: 'Yield decreased from 12.4 L to 10.2 L (-17.7% deviation).',
        severity: 'moderate',
        category: 'udder',
      },
      {
        title: 'Milking Discomfort & Guarding',
        description: 'Animal shows teat withdrawal reflex and pain on touch.',
        severity: 'moderate',
        category: 'udder',
      },
      {
        title: 'Systemic Appetite Intact',
        description: 'Green fodder rumination active, no general recumbency.',
        severity: 'mild',
        category: 'systemic',
      },
    ],

    uploadedPhotos: [
      {
        title: 'Udder Clinical Inspection Photo',
        url: girCowPhoto,
        caption: 'Farmer photo submitted via AARVI voice check: Left rear teat asymmetry and localized quarter tension.',
        type: 'udder',
      },
    ],

    precautionsGiven: [
      'Immediately isolate milk from affected quarter; do not mix into dairy collection tank.',
      'Apply cold compress (ice packs wrapped in clean cloth) for 10-15 minutes after milking.',
      'Strip affected quarter completely into a separate disinfectant cup to reduce bacterial load.',
      'Ensure clean, dry bedding with lime powder dusting to prevent secondary environmental infection.',
    ],

    suggestedClinicalSteps: [
      'Perform California Mastitis Test (CMT) strip cup screening upon arrival.',
      'Check milk pH and somatic cell count (SCC) reagent reaction.',
      'Administer NSAID (Flunixin Meglumine or Meloxicam) for anti-inflammatory pain relief.',
      'Evaluate for broad-spectrum intramammary antibiotic infusion (e.g. Cefquinome or Amoxicillin-Clavulanic acid).',
    ],

    treatmentNotes:
      'Farmer reports symptoms started at early 6:00 AM milking. Quarter is hot and tense. Farmer advised on teat dipping and cold compress. Ambulance visit scheduled for 10:30 AM.',

    prescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Meloxicam 5mg/ml Injection',
        dosage: '15 ml (0.5 mg/kg body weight)',
        route: 'IM',
        duration: 'Single dose',
        instructions: 'Administer deep intramuscularly for inflammation and pain relief.',
      },
      {
        id: 'rx-2',
        medicineName: 'Mammitel Intramammary Infusion',
        dosage: '1 syringe per affected quarter',
        route: 'Intramammary',
        duration: 'Once daily for 3 days',
        instructions: 'Thoroughly strip quarter, disinfect teat orifice, infuse and massage upward.',
      },
    ],
  },
  {
    id: 'REF-2026-8601',
    cattleId: 'champa',
    cattleName: 'Champa',
    breed: 'HF Cross',
    tag: 'P360-089',
    farmerName: 'Rahul Yadav',
    farmerPhone: '+91 98765 43210',
    location: 'Karnal, Haryana',
    createdAt: 'Today, 6:30 AM',
    riskLevel: 'Urgent',
    urgencyLevel: 'Immediate',
    chiefComplaints: [
      'High fever detected: 40.6°C acute temperature indicator',
      'Oral frothing and stringy salivation with mucosal soreness',
      'Severe milk drop: Yield dropped from 8.6 L to 6.8 L (-21% drop)',
      'Limping & walking reluctance: Shifting weight on hooves',
    ],
    vitalsSummary: 'Temp: 40.6°C | Saliva: Stringy Froth | Milk: 6.8L (-21%) | Hoof: Interdigital soreness',
    photoUrl: champaCowPhoto,
    assignedClinic: 'Karnal Block Veterinary Hospital',
    status: 'dispatched',

    aiTranscript: [
      {
        speaker: 'AARVI',
        textHindi: 'नमस्ते। आज चंपा ने सुबह कितना दूध दिया?',
        textEnglish: 'Hello. How much milk did Champa give today? (Baseline: 8.6 L)',
        timestamp: '6:25 AM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'चंपा बहुत बीमार लग रही है, सिर्फ 6.8 लीटर दूध दिया और मुँह से झागदार लार गिर रही है।',
        textEnglish: 'Champa looks very sick, only gave 6.8L and frothy saliva is falling from mouth.',
        timestamp: '6:26 AM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'यह गंभीर लक्षण है। क्या चंपा के पैरों में लंगड़ापन है और क्या तेज बुखार लग रहा है?',
        textEnglish: 'This is a serious sign. Is Champa limping on her hooves, and does she have high fever?',
        timestamp: '6:27 AM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'हाँ, शरीर जल रहा है (40.6°C) और पैर हिलाने में दर्द से कराह रही है। मुँह के अंदर छाले दिख रहे हैं।',
        textEnglish: 'Yes, body is burning hot (40.6°C) and groaning in foot pain. Blisters visible inside mouth.',
        timestamp: '6:28 AM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'कृपया तुरंत मुँह और खुर की तस्वीर खींचें। आपातकालीन पैरा-वेट अलर्ट भेजा जा रहा है।',
        textEnglish: 'Please immediately capture photo of mouth and hooves. Emergency para-vet alert dispatched.',
        timestamp: '6:29 AM',
      },
    ],

    symptomsList: [
      {
        title: 'Oral Vesicular Lesions & Drooling',
        description: 'Abundant ropy frothy salivation with rupture of oral mucous membrane blisters.',
        severity: 'high',
        category: 'oral',
      },
      {
        title: 'Hyperthermia (Acute Fever)',
        description: 'Core body temperature 40.6°C (Normal: 38.5°C).',
        severity: 'high',
        category: 'systemic',
      },
      {
        title: 'Interdigital Hoof Soreness',
        description: 'Reluctance to bear weight, constant stamping of feet.',
        severity: 'high',
        category: 'respiratory',
      },
    ],

    uploadedPhotos: [
      {
        title: 'Oral Mucosa & Muzzle Photo',
        url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
        caption: 'Muzzle inspection: Stringy saliva accumulation and early mucosal erosion.',
        type: 'mouth',
      },
    ],

    precautionsGiven: [
      'STRICT QUARANTINE: Keep Champa strictly isolated from Gauri, Laxmi, and neighborhood cattle.',
      'Do not move any animal, fodder, or milking equipment out of the farm premises.',
      'Wash oral cavity gently with 1:1000 potassium permanganate (KMnO4) pink solution or sodium bicarbonate.',
      'Apply boric acid in glycerin mixture over oral ulcers.',
      'Provide soft, palatable gruel (boiled rice/maize with jaggery) instead of dry fodder.',
    ],

    suggestedClinicalSteps: [
      'Collect vesicular fluid and epithelial tags in virus transport medium for ELISA confirmation.',
      'Administer high-dose antipyretic (Paracetamol / Flunixin) to control 40.6°C fever.',
      'Inject broad-spectrum antibiotic (Enrofloxacin or Oxytetracycline) to prevent secondary bacterial septicemia.',
      'Inspect all other cattle in Karnal block within 5km radius for ring vaccination protocol.',
    ],

    treatmentNotes:
      'High alert: Suspected Foot-and-Mouth Disease (FMD) flareup. Animal isolated in south pen. Mobile veterinary unit dispatched with ring vaccination stock.',

    prescriptions: [
      {
        id: 'rx-3',
        medicineName: 'Flunixin Meglumine 50mg/ml',
        dosage: '10 ml (2.2 mg/kg body weight)',
        route: 'IM',
        duration: 'Once daily for 2 days',
        instructions: 'Rapid reduction of severe inflammation and pyrexia.',
      },
      {
        id: 'rx-4',
        medicineName: 'Potassium Permanganate (KMnO4)',
        dosage: '1g in 1000ml clean water',
        route: 'Topical',
        duration: '3 times daily',
        instructions: 'Gently wash mouth and hooves to disinfect erosions.',
      },
    ],
  },
  {
    id: 'REF-2026-8933',
    cattleId: 'laxmi',
    cattleName: 'Laxmi',
    breed: 'Sahiwal',
    tag: 'P360-044',
    farmerName: 'Rahul Yadav',
    farmerPhone: '+91 98765 43210',
    location: 'Karnal, Haryana',
    createdAt: 'Yesterday, 5:10 PM',
    riskLevel: 'Veterinary Review',
    urgencyLevel: 'High',
    chiefComplaints: [
      'Cutaneous nodular lesions: 2-5 cm circumscribed round lumps on neck and shoulder',
      'Mild fever: 39.7°C with lacrimation and nasal discharge',
      'Slight milk yield reduction: Down 1.1 L',
    ],
    vitalsSummary: 'Temp: 39.7°C | Nodules: Neck/Shoulder | Milk: 9.7L (-10.1%) | Appetite: Slow',
    photoUrl: sahiwalCowPhoto,
    assignedClinic: 'Karnal Block Veterinary Hospital',
    status: 'completed',

    aiTranscript: [
      {
        speaker: 'AARVI',
        textHindi: 'नमस्ते राहुल जी, आज लक्ष्मी की तबीयत कैसी है?',
        textEnglish: 'Hello Rahul ji, how is Laxmi feeling today?',
        timestamp: '5:05 PM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'लक्ष्मी की गर्दन और पीठ पर गोल-गोल कठोर गिल्टियां (गांठें) निकल आई हैं।',
        textEnglish: 'Hard round lumps and nodules have appeared across Laxmi\'s neck and back.',
        timestamp: '5:06 PM',
      },
      {
        speaker: 'AARVI',
        textHindi: 'क्या इन गांठों के साथ बुखार या आंखों से पानी आ रहा है?',
        textEnglish: 'Is there fever or watery discharge from eyes along with these nodules?',
        timestamp: '5:07 PM',
      },
      {
        speaker: 'Farmer',
        textHindi: 'हाँ, कान छूने पर गर्म हैं और आंख से हल्का पानी बह रहा है।',
        textEnglish: 'Yes, ears are hot and slight lacrimation from eyes.',
        timestamp: '5:08 PM',
      },
    ],

    symptomsList: [
      {
        title: 'Circumscribed Skin Nodules',
        description: 'Firm round 2-5cm painful skin nodules involving dermis and epidermis.',
        severity: 'high',
        category: 'skin',
      },
      {
        title: 'Mild Fever & Lacrimation',
        description: 'Body temperature 39.7°C with mild serous nasal discharge.',
        severity: 'moderate',
        category: 'systemic',
      },
    ],

    uploadedPhotos: [
      {
        title: 'Skin Nodules Inspection Photo',
        url: sahiwalCowPhoto,
        caption: 'Cutaneous nodules along neck and shoulder consistent with Lumpy Skin Disease (LSD).',
        type: 'skin',
      },
    ],

    precautionsGiven: [
      'Isolate animal in mosquito-proof shaded stall.',
      'Apply 5% Neem oil or herbal antiseptic spray over unbroken nodules twice daily.',
      'Control vectors: Spray fly and tick repellent in cattle shed.',
    ],

    suggestedClinicalSteps: [
      'Supportive antibiotic therapy to avert secondary skin necrosis.',
      'Administer Ivermectin injection to eradicate biting vectors.',
      'Monitor for respiratory nodules or leg edema.',
    ],

    treatmentNotes:
      'Laxmi evaluated by Para-Vet team yesterday. Neem oil applied. Antibiotic course Day 2 underway. Animal stable.',

    prescriptions: [
      {
        id: 'rx-5',
        medicineName: 'Enrofloxacin 100mg/ml',
        dosage: '15 ml (5 mg/kg body weight)',
        route: 'SC',
        duration: 'Once daily for 3 days',
        instructions: 'Administer subcutaneously in divided sites.',
      },
    ],
  },
];

// Scheduled appointments for the Para-Vet officer
export const mockParaVetAppointments: ParaVetAppointment[] = [
  {
    id: 'apt-1',
    referralId: 'REF-2026-8601',
    cattleName: 'Champa',
    breed: 'HF Cross',
    tag: 'P360-089',
    farmerName: 'Rahul Yadav',
    farmerPhone: '+91 98765 43210',
    village: 'Karnal Sector 14 Farm',
    date: 'Today',
    timeSlot: '10:30 AM',
    purpose: 'FMD Emergency Triage & Quarantine Protocol',
    urgency: 'Immediate',
    status: 'en_route',
    assignedOfficer: 'Dr. Satish Sharma (Ambulance Unit 2)',
  },
  {
    id: 'apt-2',
    referralId: 'REF-2026-8196',
    cattleName: 'Gauri',
    breed: 'Gir',
    tag: 'P360-021',
    farmerName: 'Rahul Yadav',
    farmerPhone: '+91 98765 43210',
    village: 'Karnal Sector 14 Farm',
    date: 'Today',
    timeSlot: '11:15 AM',
    purpose: 'CMT Mastitis Test & Intramammary Infusion',
    urgency: 'High',
    status: 'scheduled',
    assignedOfficer: 'Dr. Satish Sharma',
  },
  {
    id: 'apt-3',
    cattleName: 'Nandi',
    breed: 'Murrah Buffalo',
    tag: 'P360-112',
    farmerName: 'Baldev Singh',
    farmerPhone: '+91 94160 12345',
    village: 'Kachhwa Village',
    date: 'Today',
    timeSlot: '2:00 PM',
    purpose: 'Pregnancy Confirmation & Deworming Followup',
    urgency: 'Routine',
    status: 'scheduled',
    assignedOfficer: 'Dr. Satish Sharma',
  },
  {
    id: 'apt-4',
    cattleName: 'Kamdhenu',
    breed: 'Sahiwal',
    tag: 'P360-077',
    farmerName: 'Virender Kumar',
    farmerPhone: '+91 98120 67890',
    village: 'Nilokheri Block',
    date: 'Today',
    timeSlot: '4:30 PM',
    purpose: 'Post-Calving Calcium Deficiency Followup',
    urgency: 'Routine',
    status: 'scheduled',
    assignedOfficer: 'Dr. Satish Sharma',
  },
];

// Vaccination drive records
export const mockParaVetVaccinations: ParaVetVaccinationRecord[] = [
  {
    id: 'vax-1',
    cattleId: 'gauri',
    cattleName: 'Gauri',
    tag: 'P360-021',
    breed: 'Gir',
    farmerName: 'Rahul Yadav',
    village: 'Karnal',
    vaccineName: 'FMD (Raksha-Ovac)',
    lastGivenDate: '28 Aug 2026',
    nextDueDate: '18 Oct 2026',
    status: 'due_soon',
    batchNumber: 'FMD-26-89B',
  },
  {
    id: 'vax-2',
    cattleId: 'champa',
    cattleName: 'Champa',
    tag: 'P360-089',
    breed: 'HF Cross',
    farmerName: 'Rahul Yadav',
    village: 'Karnal',
    vaccineName: 'HS (Haemorrhagic Septicaemia)',
    lastGivenDate: '30 Apr 2026',
    nextDueDate: '30 Oct 2026',
    status: 'due_soon',
    batchNumber: 'HS-26-44C',
  },
  {
    id: 'vax-3',
    cattleId: 'laxmi',
    cattleName: 'Laxmi',
    tag: 'P360-044',
    breed: 'Sahiwal',
    farmerName: 'Rahul Yadav',
    village: 'Karnal',
    vaccineName: 'Brucellosis (Bruvax-S19)',
    lastGivenDate: '12 Dec 2025',
    nextDueDate: '12 Dec 2026',
    status: 'up_to_date',
    batchNumber: 'BRU-25-102',
  },
  {
    id: 'vax-4',
    cattleId: 'ganga',
    cattleName: 'Ganga',
    tag: 'P360-155',
    breed: 'Murrah',
    farmerName: 'Baldev Singh',
    village: 'Kachhwa',
    vaccineName: 'Black Quarter (BQ)',
    lastGivenDate: '15 Jul 2025',
    nextDueDate: '15 Sep 2026',
    status: 'overdue',
    batchNumber: 'BQ-25-919',
  },
];
