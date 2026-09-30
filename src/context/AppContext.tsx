import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Cattle,
  FarmerProfile,
  HealthAssessmentResult,
  LanguageCode,
  PendingSyncItem,
  SyncedItem,
  VoiceState,
  HealthStatus,
  HealthCheck,
  VetReferral,
  DEMO_MODE,
} from '../types';
import {
  mockCattle,
  mockDefaultAssessment,
  mockFarmer,
  mockPendingRecords,
  mockRiskAssessments,
  mockSyncedRecords,
  mockTimelineRecords,
} from '../data/mockData';
import {
  initialParaVetReferrals,
  mockParaVetAppointments,
  mockParaVetVaccinations,
  CaseClinicalDetails,
  ParaVetAppointment,
  ParaVetVaccinationRecord,
} from '../paravet/data/paravetMockData';
import {
  mockVillages,
  mockDiseaseSurveillance,
  VillageData,
  DiseaseSurveillanceMetric,
} from '../gov/data/govMockData';
import { ToastItem, ToastContainer } from '../components/common/ToastContainer';
import { translations, Translations } from '../data/translations';

export interface TreatmentSuccessCardData {
  visible: boolean;
  animalName: string;
  message: string;
  recoveryPrediction: string;
  timestamp: string;
}

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  selectedCattleId: string;
  setSelectedCattleId: (id: string) => void;
  selectedCattle: Cattle;
  cattleList: Cattle[];
  setCattleList: React.Dispatch<React.SetStateAction<Cattle[]>>;
  farmer: FarmerProfile;
  setFarmer: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  requestLocationPermission: (onComplete?: () => void) => void;
  isLocationLoading: boolean;
  isOffline: boolean;
  isOnline: boolean;
  pendingRecords: PendingSyncItem[];
  syncedRecords: SyncedItem[];
  isSyncing: boolean;
  retrySync: () => void;
  currentAssessment: HealthAssessmentResult;
  setCurrentAssessment: (assessment: HealthAssessmentResult) => void;
  setAssessmentRisk: (risk: HealthStatus) => void;
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  timelineRecords: typeof mockTimelineRecords;
  addHealthRecord: (record: typeof mockTimelineRecords[0]) => void;
  vetReferrals: VetReferral[];
  recentHealthChecks: HealthCheck[];
  applyHealthCheck: (healthCheck: HealthCheck, referral?: VetReferral) => void;

  // Unified Ecosystem Synchronized State (Prompt 5.5)
  paravetReferrals: CaseClinicalDetails[];
  setParavetReferrals: React.Dispatch<React.SetStateAction<CaseClinicalDetails[]>>;
  paravetAppointments: ParaVetAppointment[];
  setParavetAppointments: React.Dispatch<React.SetStateAction<ParaVetAppointment[]>>;
  paravetVaccinations: ParaVetVaccinationRecord[];
  setParavetVaccinations: React.Dispatch<React.SetStateAction<ParaVetVaccinationRecord[]>>;
  villagesData: VillageData[];
  setVillagesData: React.Dispatch<React.SetStateAction<VillageData[]>>;
  surveillanceData: DiseaseSurveillanceMetric[];
  setSurveillanceData: React.Dispatch<React.SetStateAction<DiseaseSurveillanceMetric[]>>;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  treatmentSuccessCard: TreatmentSuccessCardData | null;
  dismissTreatmentSuccessCard: () => void;
  markCaseVisitedAndTreated: (caseId: string, notes?: string) => void;
  dispatchAppointment: (appointmentId: string) => void;
  isReportsBadgeUpdated: boolean;
  setIsReportsBadgeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  addPrescriptionToCase: (caseId: string, rx: any) => void;
  updateTreatmentNotes: (caseId: string, notes: string) => void;
  scheduleCaseVisit: (caseId: string, date: string, time: string, unit: string) => void;
  logVaccineDose: (recordId: string, batchNumber: string) => void;
  DEMO_MODE: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('hi');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [selectedCattleId, setSelectedCattleId] = useState<string>('gauri');
  const [cattleList, setCattleList] = useState<Cattle[]>(mockCattle);
  
  // Farmer profile data with location & language
  const [farmer, setFarmer] = useState<FarmerProfile>({
    ...mockFarmer,
    village: 'Karnal',
    district: 'Karnal',
    state: 'Haryana',
    preferredLanguage: 'hi',
  });
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);

  // Automatic network status detection
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial non-intrusive Release Candidate Ready toast
    const rcToastKey = 'pashu360_rc_toast_shown';
    if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(rcToastKey)) {
      sessionStorage.setItem(rcToastKey, 'true');
      const timer = setTimeout(() => {
        showToast('Pashu360 v1.0 Release Candidate Ready', 'success');
      }, 700);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOffline = !isOnline;

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setFarmer((prev) => ({
      ...prev,
      preferredLanguage: lang,
    }));
  };

  const t = translations[language];

  // Location permission workflow
  const requestLocationPermission = (onComplete?: () => void) => {
    setIsLocationLoading(true);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFarmer((prev) => ({
            ...prev,
            district: 'Karnal',
            state: 'Haryana',
            locationCoords: { lat: latitude, lng: longitude },
            locationStatus: 'detected',
            weatherTemp: 27,
            heatIndex: 'THI 72 • Optimal',
          }));
          setIsLocationLoading(false);
          if (onComplete) onComplete();
        },
        (error) => {
          console.warn('Location permission issue:', error.message);
          setFarmer((prev) => ({
            ...prev,
            locationStatus: 'denied',
            locationCoords: null,
          }));
          setIsLocationLoading(false);
          if (onComplete) onComplete();
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      setFarmer((prev) => ({
        ...prev,
        locationStatus: 'unavailable',
        locationCoords: null,
      }));
      setIsLocationLoading(false);
      if (onComplete) onComplete();
    }
  };

  const [pendingRecords, setPendingRecords] = useState<PendingSyncItem[]>(mockPendingRecords);
  const [syncedRecords, setSyncedRecords] = useState<SyncedItem[]>(mockSyncedRecords);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentAssessment, setCurrentAssessment] = useState<HealthAssessmentResult>(mockDefaultAssessment);
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [timelineRecords, setTimelineRecords] = useState(mockTimelineRecords);
  const [vetReferrals, setVetReferrals] = useState<VetReferral[]>([]);
  const [recentHealthChecks, setRecentHealthChecks] = useState<HealthCheck[]>([]);

  // Unified Ecosystem State (Prompt 5.5)
  const [paravetReferrals, setParavetReferrals] = useState<CaseClinicalDetails[]>(initialParaVetReferrals);
  const [paravetAppointments, setParavetAppointments] = useState<ParaVetAppointment[]>(mockParaVetAppointments);
  const [paravetVaccinations, setParavetVaccinations] = useState<ParaVetVaccinationRecord[]>(mockParaVetVaccinations);
  const [villagesData, setVillagesData] = useState<VillageData[]>(mockVillages);
  const [surveillanceData, setSurveillanceData] = useState<DiseaseSurveillanceMetric[]>(mockDiseaseSurveillance);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [treatmentSuccessCard, setTreatmentSuccessCard] = useState<TreatmentSuccessCardData | null>(null);
  const [isReportsBadgeUpdated, setIsReportsBadgeUpdated] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissTreatmentSuccessCard = () => {
    setTreatmentSuccessCard(null);
  };

  // Cross-portal Synchronized Clinical Treatment Event
  const markCaseVisitedAndTreated = (caseId: string, notes?: string) => {
    const targetCase = paravetReferrals.find((c) => c.id === caseId) || paravetReferrals[0];
    const targetCattleId = targetCase?.cattleId || 'gauri';
    const targetCattleName = targetCase?.cattleName || 'Gauri';

    // 1. Farmer App updates:
    setCattleList((prev) =>
      prev.map((c) => {
        if (c.id === targetCattleId || c.name.toLowerCase() === targetCattleName.toLowerCase()) {
          return {
            ...c,
            status: 'Recovering',
            vaccination: 'FMD booster up to date (Valid till Mar 2027)',
            nextVaccinationDate: '24 Mar 2027',
            lastHealthCheck: {
              status: 'Recovering',
              date: '24 Sep',
              time: '11:15 AM',
            },
          };
        }
        return c;
      })
    );

    // Update vaccination records in Para-Vet ledger
    setParavetVaccinations((prev) =>
      prev.map((v) => {
        if (
          v.cattleId === targetCattleId ||
          v.cattleName.toLowerCase() === targetCattleName.toLowerCase()
        ) {
          return {
            ...v,
            status: 'up_to_date',
            lastGivenDate: 'Today (24 Sep 2026)',
            nextDueDate: '24 Mar 2027',
          };
        }
        return v;
      })
    );

    // Add treatment and booster records to health history timeline
    const treatmentRecord: typeof mockTimelineRecords[0] = {
      id: `tx-completed-${Date.now()}`,
      cattleId: targetCattleId,
      date: '24 Sep',
      time: '11:15 AM',
      title: 'Veterinary treatment completed successfully',
      subtitle:
        notes ||
        'Dr. Satish Sharma administered Flunixin & cold compress • Expected recovery within 3 days',
      category: 'care',
      iconType: 'stethoscope',
      iconColor: 'green',
    };

    const vaxRecord: typeof mockTimelineRecords[0] = {
      id: `vax-completed-${Date.now()}`,
      cattleId: targetCattleId,
      date: '24 Sep',
      time: '11:20 AM',
      title: 'FMD Ring Vaccination & Booster Administered',
      subtitle: 'Lot #FMD-2026-B81 • Next due: 24 Mar 2027 (NADCP Verified)',
      category: 'care',
      iconType: 'syringe',
      iconColor: 'green',
    };
    setTimelineRecords((prev) => [treatmentRecord, vaxRecord, ...prev]);

    // Show persistent recovery card in Farmer App
    setTreatmentSuccessCard({
      visible: true,
      animalName: targetCattleName,
      message: 'Veterinary treatment completed successfully by Dr. Satish Sharma.',
      recoveryPrediction: 'Expected recovery within 3 days',
      timestamp: 'Today (24 Sep), 11:15 AM',
    });

    // 2. Para-Vet Portal updates:
    setParavetReferrals((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'completed',
            treatmentNotes: notes
              ? `${c.treatmentNotes}\n[11:15 AM - COMPLETED]: ${notes}`
              : `${c.treatmentNotes}\n[11:15 AM - COMPLETED]: Clinical treatment administered. Flunixin Meglumine & antiseptic teat dip applied. Full recovery expected within 3 days.`,
          };
        }
        return c;
      })
    );

    // Linked appointment marked complete
    setParavetAppointments((prev) =>
      prev.map((apt) => {
        if (
          apt.referralId === caseId ||
          apt.cattleName.toLowerCase() === targetCattleName.toLowerCase()
        ) {
          return { ...apt, status: 'completed' };
        }
        return apt;
      })
    );

    // 3. Government Disease Intelligence updates:
    // Decrement Karnal Central active cases (34 -> 33)
    setVillagesData((prev) =>
      prev.map((v) => {
        if (v.id === 'karnal' || v.name.includes('Karnal')) {
          return {
            ...v,
            activeCases: Math.max(0, v.activeCases - 1),
          };
        }
        return v;
      })
    );

    // Surveillance: Active cases -1, Recovered +1
    setSurveillanceData((prev) =>
      prev.map((d) => {
        if (
          d.id === 'mastitis' ||
          targetCase?.chiefComplaints.some((c) => c.toLowerCase().includes(d.id))
        ) {
          return {
            ...d,
            activeCases: Math.max(0, d.activeCases - 1),
            recovered: d.recovered + 1,
          };
        }
        return d;
      })
    );

    // Reports badge flashes "Updated"
    setIsReportsBadgeUpdated(true);

    // Show toast
    showToast(`Treatment Recorded: ${targetCattleName} visit completed successfully`, 'success');
  };

  const addPrescriptionToCase = (caseId: string, rx: any) => {
    setParavetReferrals((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            prescriptions: [...c.prescriptions, { id: `rx-${Date.now()}`, ...rx }],
          };
        }
        return c;
      })
    );
    showToast('Prescription Recorded in Digital Ledger', 'success');
  };

  const updateTreatmentNotes = (caseId: string, notes: string) => {
    setParavetReferrals((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, treatmentNotes: notes } : c))
    );
    showToast('Treatment Notes Saved', 'success');
  };

  const scheduleCaseVisit = (caseId: string, date: string, time: string, unit: string) => {
    setParavetReferrals((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              treatmentNotes: `${c.treatmentNotes}\n[VISIT SCHEDULED]: ${date} at ${time} via ${unit}`,
            }
          : c
      )
    );
    showToast(`Ambulance Dispatched: Scheduled for ${time}`, 'success');
  };

  const dispatchAppointment = (appointmentId: string) => {
    setParavetAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'en_route' } : apt
      )
    );
    showToast('Mobile Ambulance Unit Dispatched (En Route)', 'info');
  };

  const logVaccineDose = (recordId: string, batchNumber: string) => {
    setParavetVaccinations((prev) =>
      prev.map((v) =>
        v.id === recordId
          ? {
              ...v,
              status: 'up_to_date',
              lastGivenDate: 'Today (24 Sep 2026)',
              nextDueDate: '24 Mar 2027',
              batchNumber,
            }
          : v
      )
    );
    showToast(`Vaccine Logged: Lot #${batchNumber} recorded into NADCP ledger`, 'success');
  };

  const selectedCattle = cattleList.find((c) => c.id === selectedCattleId) || cattleList[0];

  const retrySync = () => {
    if (pendingRecords.length === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      const newlySynced: SyncedItem[] = pendingRecords.map((item) => ({
        id: `synced-${Date.now()}-${item.id}`,
        title: `${item.cattleName} • ${item.recordType}`,
        timestamp: 'Just now',
        status: 'synced' as const,
      }));

      setSyncedRecords((prev) => [...newlySynced, ...prev]);
      setPendingRecords([]);
      setIsSyncing(false);
      showToast('Offline Sync Complete: All records synchronized with central ledger', 'success');
    }, 1200);
  };

  const setAssessmentRisk = (risk: HealthStatus) => {
    if (mockRiskAssessments[risk]) {
      setCurrentAssessment({
        ...mockRiskAssessments[risk],
        cattleId: selectedCattle.id,
        cattleName: selectedCattle.name,
        breed: selectedCattle.breed,
        tag: selectedCattle.tag,
      });
    }
  };

  const addHealthRecord = (record: typeof mockTimelineRecords[0]) => {
    setTimelineRecords((prev) => [record, ...prev]);
  };

  // RULE 7, 8, 9: Process generated HealthCheck, update profile, history & referral
  const applyHealthCheck = (healthCheck: HealthCheck, referral?: VetReferral) => {
    setRecentHealthChecks((prev) => [healthCheck, ...prev]);

    // 1. Automatically update cattle profile
    setCattleList((prev) =>
      prev.map((c) => {
        if (c.id === healthCheck.cattleId) {
          return {
            ...c,
            status: healthCheck.riskLevel,
            todayMilk: healthCheck.milkReported,
            lastHealthCheck: {
              status: healthCheck.riskLevel,
              date: 'Today',
              time: 'Just now',
            },
          };
        }
        return c;
      })
    );

    // 2. Set current assessment for Result screen
    setCurrentAssessment({
      cattleId: healthCheck.cattleId,
      cattleName: healthCheck.cattleName,
      breed: selectedCattle.breed,
      tag: selectedCattle.tag,
      riskLevel: healthCheck.riskLevel,
      headline:
        healthCheck.riskLevel === 'Healthy'
          ? `${healthCheck.cattleName} is in great health today`
          : healthCheck.riskLevel === 'Urgent'
          ? 'Urgent medical attention needed'
          : healthCheck.riskLevel === 'Veterinary Review'
          ? 'Veterinary review recommended'
          : `${healthCheck.cattleName} needs a closer look today`,
      description:
        healthCheck.riskLevel === 'Healthy'
          ? 'All vital signs, appetite, and milk yield match expected benchmarks.'
          : 'Early symptom deviation observed during health evaluation.',
      reasons: healthCheck.reasons,
      recommendation: healthCheck.recommendation,
      checkedAt: 'Checked just now',
      referralId: healthCheck.referralId,
    });

    // 3. Automatically add to Health History timeline
    const historyEntry: typeof mockTimelineRecords[0] = {
      id: `check-${Date.now()}`,
      cattleId: healthCheck.cattleId,
      date: 'Today',
      time: 'Just now',
      title: `Daily health check (AARVI)`,
      subtitle: `${healthCheck.riskLevel} • Milk ${healthCheck.milkReported} L (Baseline ${healthCheck.baselineMilk} L)`,
      category: 'checks',
      iconType: 'heart',
      iconColor: healthCheck.riskLevel === 'Healthy' ? 'green' : healthCheck.riskLevel === 'Urgent' ? 'red' : 'amber',
    };
    addHealthRecord(historyEntry);

    // 4. If Veterinary Review or Urgent, save referral & add referral ticket to timeline & refresh Para-Vet and Govt
    if (referral) {
      setVetReferrals((prev) => [referral, ...prev]);

      const referralEntry: typeof mockTimelineRecords[0] = {
        id: `ref-entry-${Date.now()}`,
        cattleId: healthCheck.cattleId,
        date: 'Today',
        time: 'Just now',
        title: 'Para-vet referral dispatched',
        subtitle: `Ticket #${referral.id} • ${referral.assignedClinic}`,
        category: 'care',
        iconType: 'stethoscope',
        iconColor: referral.riskLevel === 'Urgent' ? 'red' : 'amber',
      };
      addHealthRecord(referralEntry);

      // Refresh Para-Vet Portal referrals ledger
      const newClinicalCase: CaseClinicalDetails = {
        id: referral.id,
        cattleId: referral.cattleId,
        cattleName: referral.cattleName,
        breed: referral.breed,
        tag: referral.tag,
        farmerName: referral.farmerName,
        farmerPhone: referral.farmerPhone,
        location: `${farmer.district}, ${farmer.state}`,
        createdAt: 'Today, Just now',
        riskLevel: referral.riskLevel,
        urgencyLevel: referral.urgencyLevel,
        chiefComplaints: referral.chiefComplaints,
        vitalsSummary: referral.vitalsSummary,
        photoUrl: referral.photoUrl,
        assignedClinic: referral.assignedClinic,
        status: 'dispatched',
        aiTranscript: [
          {
            speaker: 'AARVI',
            textHindi: 'नमस्ते। आज कितना दूध दिया?',
            textEnglish: `Hello. How much milk did ${healthCheck.cattleName} give today? (Baseline: ${healthCheck.baselineMilk} L)`,
            timestamp: 'Just now',
          },
          {
            speaker: 'Farmer',
            textHindi: `आज सुबह ${healthCheck.milkReported} लीटर दूध निकला।`,
            textEnglish: `Reported ${healthCheck.milkReported} L this morning.`,
            timestamp: 'Just now',
          },
        ],
        symptomsList: healthCheck.reasons.map((r) => ({
          title: r.title,
          description: r.description,
          severity: r.severity || 'mild',
          category: 'systemic' as const,
        })),
        uploadedPhotos: [
          {
            title: 'Farmer Inspection Photo',
            url: referral.photoUrl || '',
            caption: `Submitted via AARVI voice check for ${referral.cattleName}.`,
            type: 'udder' as const,
          },
        ],
        precautionsGiven: [
          'Isolate animal in clean dry bedding.',
          'Provide fresh clean water and soft digestible fodder.',
          'Withhold affected milk from dairy bulk tank.',
        ],
        suggestedClinicalSteps: [
          'Field clinical evaluation & vitals verification.',
          'Administer antipyretic/anti-inflammatory support as clinically indicated.',
        ],
        treatmentNotes: `New referral generated via AARVI voice check. Vitals: ${referral.vitalsSummary}.`,
        prescriptions: [],
      };
      setParavetReferrals((prev) => [newClinicalCase, ...prev]);

      // Add corresponding appointment in Para-Vet schedule
      const newAppointment: ParaVetAppointment = {
        id: `apt-auto-${Date.now()}`,
        referralId: referral.id,
        cattleName: referral.cattleName,
        breed: referral.breed,
        tag: referral.tag,
        farmerName: referral.farmerName,
        farmerPhone: referral.farmerPhone,
        village: `${farmer.village} Farm`,
        date: 'Today',
        timeSlot: 'Within 2 hours',
        purpose: `${referral.riskLevel} Triage: ${referral.chiefComplaints[0] || 'Clinical Examination'}`,
        urgency: referral.urgencyLevel as any,
        status: 'scheduled',
        assignedOfficer: 'Dr. Satish Sharma (Ambulance Unit 2)',
      };
      setParavetAppointments((prev) => [newAppointment, ...prev]);

      // Increment Government surveillance counters
      setVillagesData((prev) =>
        prev.map((v) => {
          if (v.id === 'karnal' || v.name.includes('Karnal')) {
            return {
              ...v,
              activeCases: v.activeCases + 1,
            };
          }
          return v;
        })
      );

      setSurveillanceData((prev) =>
        prev.map((d) => {
          if (d.id === 'mastitis') {
            return {
              ...d,
              activeCases: d.activeCases + 1,
              newToday: d.newToday + 1,
            };
          }
          return d;
        })
      );

      setIsReportsBadgeUpdated(true);
      showToast(`Referral Logged: Ticket #${referral.id} dispatched to Block Vet Hospital`, 'info');
    }

    // 5. Add to Pending Sync list for offline queue
    setPendingRecords((prev) => [
      {
        id: `sync-${Date.now()}`,
        cattleName: healthCheck.cattleName,
        recordType: `Health check (${healthCheck.riskLevel})`,
        timestamp: 'Today, Just now',
        status: 'pending',
      },
      ...prev,
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLoggedIn,
        setIsLoggedIn,
        selectedCattleId,
        setSelectedCattleId,
        selectedCattle,
        cattleList,
        setCattleList,
        farmer,
        setFarmer,
        requestLocationPermission,
        isLocationLoading,
        isOffline,
        isOnline,
        pendingRecords,
        syncedRecords,
        isSyncing,
        retrySync,
        currentAssessment,
        setCurrentAssessment,
        setAssessmentRisk,
        voiceState,
        setVoiceState,
        timelineRecords,
        addHealthRecord,
        vetReferrals,
        recentHealthChecks,
        applyHealthCheck,
        paravetReferrals,
        setParavetReferrals,
        paravetAppointments,
        setParavetAppointments,
        paravetVaccinations,
        setParavetVaccinations,
        villagesData,
        setVillagesData,
        surveillanceData,
        setSurveillanceData,
        toasts,
        showToast,
        dismissToast,
        treatmentSuccessCard,
        dismissTreatmentSuccessCard,
        markCaseVisitedAndTreated,
        dispatchAppointment,
        isReportsBadgeUpdated,
        setIsReportsBadgeUpdated,
        addPrescriptionToCase,
        updateTreatmentNotes,
        scheduleCaseVisit,
        logVaccineDose,
        DEMO_MODE,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
