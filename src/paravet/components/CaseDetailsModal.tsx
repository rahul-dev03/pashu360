import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Pill,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Send,
  Plus,
  Trash2,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingDown,
  Loader2,
  Lock,
} from 'lucide-react';
import { CaseClinicalDetails } from '../data/paravetMockData';
import { Cattle, HealthStatus } from '../../types';
import champaCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';
import farmerPhoto from '../../assets/images/farmer_rahul_avatar_1790603410179.jpg';

interface CaseDetailsModalProps {
  caseData: CaseClinicalDetails;
  cattleProfile?: Cattle;
  onClose: () => void;
  onUpdateTreatmentNotes: (caseId: string, notes: string) => void;
  onAddPrescription: (
    caseId: string,
    rx: { medicineName: string; dosage: string; route: any; duration: string; instructions: string }
  ) => void;
  onScheduleVisit: (caseId: string, date: string, time: string, ambulanceUnit: string) => void;
  onMarkVisitedAndTreated?: (caseId: string, notes?: string) => void;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  caseData,
  cattleProfile,
  onClose,
  onUpdateTreatmentNotes,
  onAddPrescription,
  onScheduleVisit,
  onMarkVisitedAndTreated,
}) => {
  const [activeTabCenter, setActiveTabCenter] = useState<'transcript' | 'symptoms' | 'photos' | 'precautions'>('transcript');
  const [notes, setNotes] = useState(caseData.treatmentNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [isTreating, setIsTreating] = useState(false);

  // New Prescription form state
  const [showAddRx, setShowAddRx] = useState(false);
  const [rxMedicine, setRxMedicine] = useState('Meloxicam 5mg/ml');
  const [rxDosage, setRxDosage] = useState('15 ml');
  const [rxRoute, setRxRoute] = useState<'IM' | 'SC' | 'Oral' | 'Intramammary' | 'Topical'>('IM');
  const [rxDuration, setRxDuration] = useState('Once daily for 3 days');
  const [rxInstructions, setRxInstructions] = useState('Administer deep intramuscularly with sterile needle.');

  // Schedule visit state
  const [visitDate, setVisitDate] = useState('Today (24 Sep)');
  const [visitTime, setVisitTime] = useState('11:30 AM');
  const [visitUnit, setVisitUnit] = useState('Ambulance Unit 2 (Dr. Satish)');
  const [visitScheduledSuccess, setVisitScheduledSuccess] = useState(false);

  const isCompleted = caseData.status === 'completed';

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    caseData.treatmentNotes = notes;
    onUpdateTreatmentNotes(caseData.id, notes);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2500);
  };

  const handleAddRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine.trim() || isCompleted) return;
    onAddPrescription(caseData.id, {
      medicineName: rxMedicine,
      dosage: rxDosage,
      route: rxRoute,
      duration: rxDuration,
      instructions: rxInstructions,
    });
    setShowAddRx(false);
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleVisit(caseData.id, visitDate, visitTime, visitUnit);
    setVisitScheduledSuccess(true);
    setTimeout(() => setVisitScheduledSuccess(false), 3000);
  };

  const handleMarkTreated = () => {
    if (isCompleted || isTreating) return;
    setIsTreating(true);
    setTimeout(() => {
      if (onMarkVisitedAndTreated) {
        onMarkVisitedAndTreated(caseData.id, notes);
      }
      setIsTreating(false);
    }, 600);
  };

  // Profile fallbacks with prompt consistency
  const breed = cattleProfile?.breed || caseData.breed;
  const age = cattleProfile?.age || (caseData.cattleId === 'champa' ? '5 years 1 month' : caseData.cattleId === 'laxmi' ? '3 years 2 months' : '4 years 7 months');
  const pregnancy = cattleProfile?.pregnancy || (caseData.cattleId === 'champa' ? '2 months pregnant' : caseData.cattleId === 'laxmi' ? 'Not pregnant' : '5 months pregnant');
  const vaccination = cattleProfile?.vaccination || (caseData.cattleId === 'champa' ? 'HS due 30 Oct 2026' : caseData.cattleId === 'laxmi' ? 'Brucellosis completed' : 'FMD due 18 Oct 2026');
  const baselineMilk = cattleProfile?.baselineMilk || (caseData.cattleId === 'champa' || caseData.id.includes('8601') ? 8.6 : caseData.cattleId === 'laxmi' || caseData.id.includes('8933') ? 10.8 : 12.4);
  const todayMilk = cattleProfile?.todayMilk || (caseData.cattleId === 'champa' || caseData.id.includes('8601') ? 6.8 : caseData.cattleId === 'laxmi' || caseData.id.includes('8933') ? 9.7 : 10.2);
  const milkDiff = (todayMilk - baselineMilk).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAFBF9] w-full max-w-7xl h-[92vh] max-h-[920px] rounded-[24px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header of Modal */}
        <div className="px-6 py-3.5 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Case File: {caseData.cattleName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-700">
                  Ticket #{caseData.id}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : caseData.riskLevel === 'Urgent'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isCompleted ? 'Completed' : caseData.riskLevel}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Dispatched by AARVI Clinical Engine • {caseData.createdAt} • {caseData.assignedClinic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Case File"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* SECTION 8: Compact Referral Lifecycle Progress Tracker */}
        <div className="px-6 py-2 bg-[#F4F7F2] border-b border-stone-200 flex items-center justify-between overflow-x-auto text-xs shrink-0 select-none">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-4">
            <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
            <span>Referral Lifecycle</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Stage 1 */}
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 text-[11px]">
              <span className="w-4.5 h-4.5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>Voice Screening</span>
            </div>
            <span className="text-stone-300">→</span>

            {/* Stage 2 */}
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 text-[11px]">
              <span className="w-4.5 h-4.5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>AI Triage</span>
            </div>
            <span className="text-stone-300">→</span>

            {/* Stage 3 */}
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 text-[11px]">
              <span className="w-4.5 h-4.5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>Veterinary Review</span>
            </div>
            <span className="text-stone-300">→</span>

            {/* Stage 4 */}
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 text-[11px]">
              <span className="w-4.5 h-4.5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>Ambulance Assigned</span>
            </div>
            <span className="text-stone-300">→</span>

            {/* Stage 5 */}
            <div className={`flex items-center gap-1.5 font-semibold text-[11px] ${isCompleted ? 'text-emerald-800' : 'text-stone-500'}`}>
              <span
                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isCompleted
                    ? 'bg-[#166534] text-white shadow-2xs'
                    : 'border-2 border-stone-300 bg-white text-stone-400'
                }`}
              >
                {isCompleted ? '✓' : '○'}
              </span>
              <span>Treatment Completed</span>
            </div>
          </div>
        </div>

        {/* 3-Column Desktop Grid Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          {/* =============================================================== */}
          {/* LEFT PANEL: Cattle Profile (Col 1-3, 25% width) */}
          {/* =============================================================== */}
          <div className="lg:col-span-3 p-5 overflow-y-auto space-y-4 bg-white/60">
            {/* Large Cattle Photo */}
            <div className="relative w-full aspect-4/3 rounded-[16px] overflow-hidden border border-stone-200 shadow-xs bg-stone-100">
              <img
                src={cattleProfile?.photoUrl || caseData.photoUrl}
                alt={caseData.cattleName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = champaCowPhoto;
                }}
              />
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-white text-xs font-bold">
                Tag: {caseData.tag}
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider pb-2 border-b border-stone-100">
                Animal Profile
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Breed</span>
                  <span className="font-semibold text-stone-800">{breed}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Age</span>
                  <span className="font-semibold text-stone-800">{age}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Pregnancy</span>
                  <span className="font-semibold text-stone-800">{pregnancy}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Vaccination</span>
                  <span className="font-semibold text-stone-800 truncate block">{vaccination}</span>
                </div>
              </div>
            </div>

            {/* Milk Yield Comparison Card */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Milk Production
                </span>
                <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {milkDiff} L
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                  <span className="text-[10px] text-stone-500 font-medium">7-Day Baseline</span>
                  <p className="text-lg font-black text-stone-900 mt-0.5">{baselineMilk} L</p>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                  <span className="text-[10px] text-red-600 font-medium">Today's Milk</span>
                  <p className="text-lg font-black text-red-700 mt-0.5">{todayMilk} L</p>
                </div>
              </div>
            </div>

            {/* Farmer Contact Card */}
            <div className="p-4 rounded-[16px] bg-[#FDFBF7] border border-stone-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Farmer Details
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Farmer
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600/30 shrink-0 bg-stone-100 shadow-2xs">
                  <img
                    src={farmerPhoto}
                    alt={caseData.farmerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{caseData.farmerName} (राहुल यादव)</p>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#166534]" />
                    <span>{caseData.location}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${caseData.farmerPhone}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold shadow-2xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {caseData.farmerPhone}</span>
              </a>
            </div>
          </div>

          {/* =============================================================== */}
          {/* CENTER PANEL: AI Transcript, Symptoms, Photos, Precautions (Col 4-8, 42% width) */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 flex flex-col h-full overflow-hidden bg-white">
            {/* Center Tabs Header */}
            <div className="p-3 bg-[#F8FAF7] border-b border-stone-200 shrink-0">
              <div className="flex items-center gap-1.5 bg-stone-200/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTabCenter('transcript')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTabCenter === 'transcript'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  AI Transcript ({caseData.aiTranscript.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabCenter('symptoms')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTabCenter === 'symptoms'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Symptoms ({caseData.symptomsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabCenter('photos')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTabCenter === 'photos'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Photos ({caseData.uploadedPhotos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabCenter('precautions')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTabCenter === 'precautions'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Precautions
                </button>
              </div>
            </div>

            {/* Center Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* TAB 1: AI Transcript */}
              {activeTabCenter === 'transcript' && (
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">AARVI Clinical Dialogue History</span>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Transcribed speech conversation between farmer and AARVI with clinical diagnostic branching.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {caseData.aiTranscript.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          msg.speaker === 'Farmer' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1">
                          <span className="font-bold text-stone-700">{msg.speaker}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            msg.speaker === 'Farmer'
                              ? 'bg-[#166534] text-white rounded-tr-xs'
                              : 'bg-[#F4F7F2] text-stone-900 border border-[#E3ECE0] rounded-tl-xs'
                          }`}
                        >
                          <p className="font-medium">{msg.textHindi}</p>
                          <p
                            className={`text-[11px] mt-1 pt-1 border-t ${
                              msg.speaker === 'Farmer'
                                ? 'text-emerald-100 border-white/20'
                                : 'text-stone-600 border-stone-200'
                            }`}
                          >
                            {msg.textEnglish}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Symptoms */}
              {activeTabCenter === 'symptoms' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                    <span className="font-bold text-stone-900">Vitals & Clinical Observation Summary:</span>
                    <p className="text-xs font-mono text-stone-800 mt-1 font-semibold">{caseData.vitalsSummary}</p>
                  </div>

                  <div className="space-y-2.5">
                    {caseData.symptomsList.map((sym, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-stone-900">{sym.title}</h4>
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600">
                              {sym.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{sym.description}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            sym.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : sym.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sym.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Uploaded Photos */}
              {activeTabCenter === 'photos' && (
                <div className="space-y-4">
                  {caseData.uploadedPhotos.length === 0 ? (
                    <div className="py-12 text-center text-stone-400 text-xs">
                      No photos uploaded for this case.
                    </div>
                  ) : (
                    caseData.uploadedPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{photo.title}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#166534]/10 text-[#166534]">
                            Verified Visual
                          </span>
                        </div>
                        <div className="w-full h-64 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = champaCowPhoto;
                            }}
                          />
                        </div>
                        <p className="text-xs text-stone-600 italic bg-[#F8FAF7] p-2.5 rounded-xl border border-stone-100">
                          "{photo.caption}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: Precautions Already Given */}
              {activeTabCenter === 'precautions' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">First-Aid Precautions Advised to Farmer</span>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        These instructions were communicated by AARVI to prevent contamination and disease escalation.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {caseData.precautionsGiven.map((prec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-2.5 text-xs text-stone-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{prec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT PANEL: Clinical Actions, Notes, Rx, Schedule (Col 9-12, 33% width) */}
          {/* =============================================================== */}
          <div className="lg:col-span-4 p-5 overflow-y-auto space-y-5 bg-[#FAFBF9]">
            {/* Risk Assessment Banner */}
            <div
              className={`p-4 rounded-[16px] border shadow-2xs ${
                caseData.riskLevel === 'Urgent'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Clinical Risk Level
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    caseData.riskLevel === 'Urgent' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {caseData.riskLevel}
                </span>
              </div>
              <h3 className="text-sm font-bold mt-1.5">{caseData.chiefComplaints[0]}</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Urgency Level: <span className="font-bold">{caseData.urgencyLevel}</span>
              </p>
            </div>

            {/* Suggested Clinical Next Steps */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Suggested Clinical Protocol
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {caseData.suggestedClinicalSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Notes */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Para-Vet Treatment Notes
                </h4>
                {isNotesSaved && (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveNotes} className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record palpation findings, CMT results, medication administered..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#166534] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl bg-stone-100 hover:bg-[#166534] text-stone-700 hover:text-white text-xs font-semibold border border-stone-200 hover:border-[#166534] transition-colors cursor-pointer"
                >
                  Save Treatment Notes
                </button>
              </form>
            </div>

            {/* Prescribe Medication */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Prescriptions ({caseData.prescriptions.length})</span>
                </h4>
                {isCompleted ? (
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-stone-200">
                    <Lock className="w-3 h-3 text-stone-400" /> Locked (Dispensed)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddRx(!showAddRx)}
                    className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Rx</span>
                  </button>
                )}
              </div>

              {/* Existing Prescriptions List */}
              <div className="space-y-2">
                {caseData.prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>{rx.medicineName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-200 text-stone-700">
                        {rx.route}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Dosage: {rx.dosage} • {rx.duration}
                    </p>
                    <p className="text-[10px] text-stone-500 italic">{rx.instructions}</p>
                  </div>
                ))}
              </div>

              {/* Add Prescription Form (only if not completed) */}
              {!isCompleted && showAddRx && (
                <form
                  onSubmit={handleAddRxSubmit}
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs"
                >
                  <div>
                    <label className="text-[10px] font-bold text-stone-700 block mb-0.5">Medicine Name</label>
                    <input
                      type="text"
                      value={rxMedicine}
                      onChange={(e) => setRxMedicine(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-700 block mb-0.5">Dosage</label>
                      <input
                        type="text"
                        value={rxDosage}
                        onChange={(e) => setRxDosage(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-700 block mb-0.5">Route</label>
                      <select
                        value={rxRoute}
                        onChange={(e: any) => setRxRoute(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                      >
                        <option value="IM">IM (Intramuscular)</option>
                        <option value="SC">SC (Subcutaneous)</option>
                        <option value="Oral">Oral</option>
                        <option value="Intramammary">Intramammary</option>
                        <option value="Topical">Topical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-700 block mb-0.5">Duration</label>
                    <input
                      type="text"
                      value={rxDuration}
                      onChange={(e) => setRxDuration(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-1.5 rounded-lg bg-[#166534] text-white font-bold text-xs cursor-pointer shadow-2xs"
                    >
                      Issue Prescription
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddRx(false)}
                      className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SECTION 6: Cross-Portal Synchronization Action */}
            <div className="p-4 rounded-[16px] bg-gradient-to-br from-emerald-50 to-white border-2 border-[#166534]/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#14532D] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#166534]" />
                  <span>Clinical Intervention Action</span>
                </h4>
                {isCompleted && (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Completed
                  </span>
                )}
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                {isCompleted
                  ? 'Treatment administered by attending veterinary officer. Prescriptions dispensed and synchronized with Farmer App & Government Intelligence Node.'
                  : 'Clicking Mark Visited & Treated completes clinical intervention, updates farmer health status to Recovering, and syncs epidemiological resolution to the Government portal.'}
              </p>

              <button
                type="button"
                onClick={handleMarkTreated}
                disabled={isCompleted || isTreating}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed opacity-90'
                    : 'bg-[#166534] hover:bg-[#14532D] text-white active:scale-[0.98]'
                }`}
              >
                {isTreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving & Syncing Ecosystem...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Visited & Treated (Ecosystem Synced)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Visited & Treated</span>
                  </>
                )}
              </button>
            </div>

            {/* Schedule Field Visit */}
            <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Schedule Farm Visit</span>
                </h4>
                {visitScheduledSuccess && (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Scheduled
                  </span>
                )}
              </div>

              <form onSubmit={handleConfirmVisit} className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Visit Slot</label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8FAF7] border border-stone-200 text-xs text-stone-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Assigned Unit</label>
                  <input
                    type="text"
                    value={visitUnit}
                    onChange={(e) => setVisitUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8FAF7] border border-stone-200 text-xs text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Dispatch Ambulance / Confirm Visit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
