export const DEMO_MODE = true;

export type HealthStatus = 'Healthy' | 'Recovering' | 'Attention' | 'Veterinary Review' | 'Urgent';

export type LanguageCode = 'hi' | 'en' | 'hinglish' | 'mr';

export type VoiceState = 'ready' | 'listening' | 'thinking' | 'speaking';

export interface Cattle {
  id: string;
  name: string;
  nameHindi: string;
  breed: string;
  tag: string;
  age: string;
  pregnancy: string;
  vaccination: string;
  nextVaccinationDate: string;
  baselineMilk: number; // liters
  todayMilk: number; // liters
  status: HealthStatus;
  photoUrl: string;
  lastHealthCheck: {
    status: HealthStatus;
    date: string;
    time: string;
  };
}

export interface TimelineItemData {
  id: string;
  cattleId: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  category: 'checks' | 'care';
  iconType: 'heart' | 'stethoscope' | 'pill' | 'syringe' | 'clipboard';
  iconColor: 'green' | 'amber' | 'blue' | 'red';
}

export interface PendingSyncItem {
  id: string;
  cattleName: string;
  recordType: string;
  timestamp: string;
  status: 'pending' | 'synced';
}

export interface SyncedItem {
  id: string;
  title: string;
  cattleName?: string;
  timestamp: string;
  status: 'synced';
}

export interface MilkYieldRecord {
  date: string;
  dayShort: string;
  yieldLiters: number;
}

export interface FarmerProfile {
  name: string;
  nameHindi?: string;
  photoUrl?: string;
  village: string;
  district: string;
  state: string;
  phone: string;
  locationCoords?: { lat: number; lng: number } | null;
  locationStatus: 'detected' | 'denied' | 'prompt' | 'unavailable';
  weatherTemp: number;
  heatIndex: string;
  totalCattle: number;
  preferredLanguage: LanguageCode;
}

export interface ReasonCard {
  icon: 'thermometer' | 'milk' | 'feed' | 'activity' | 'breathing';
  title: string;
  description: string;
  severity: 'mild' | 'moderate' | 'high';
}

export interface HealthAssessmentResult {
  cattleId: string;
  cattleName: string;
  breed: string;
  tag: string;
  riskLevel: HealthStatus;
  headline: string;
  description: string;
  reasons: ReasonCard[];
  recommendation: string;
  checkedAt: string;
  referralId?: string;
}

export interface HealthCheck {
  id: string;
  cattleId: string;
  cattleName: string;
  timestamp: string;
  milkReported: number;
  baselineMilk: number;
  milkDeviation: number;
  appetiteStatus?: 'normal' | 'reduced' | 'none';
  temperatureStatus?: 'normal' | 'mild_rise' | 'high_fever';
  respiratoryStatus?: 'normal' | 'labored';
  visualSymptomPhotoUrl?: string;
  symptomsDescription?: string;
  riskLevel: HealthStatus;
  reasons: ReasonCard[];
  recommendation: string;
  referralId?: string;
}

export interface VetReferral {
  id: string;
  cattleId: string;
  cattleName: string;
  breed: string;
  tag: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  createdAt: string;
  riskLevel: 'Veterinary Review' | 'Urgent';
  urgencyLevel: 'High' | 'Immediate';
  chiefComplaints: string[];
  vitalsSummary: string;
  photoUrl?: string;
  assignedClinic: string;
  status: 'dispatched' | 'pending_review' | 'attending' | 'completed';
}
