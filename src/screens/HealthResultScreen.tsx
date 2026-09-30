import React, { useState } from 'react';
import {
  Share2,
  AlertCircle,
  Thermometer,
  Milk,
  UtensilsCrossed,
  ShieldCheck,
  PhoneCall,
  Bookmark,
  Check,
  Wind,
  Activity,
  Ambulance,
  FileCheck,
  Download,
} from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { RiskBadge } from '../components/common/RiskBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useApp } from '../context/AppContext';
import { HealthStatus } from '../types';
import fallbackCowPhoto from '../assets/images/champa_cow_portrait_1790444600765.jpg';

interface HealthResultScreenProps {
  onBack: () => void;
  onContactVet: () => void;
  onSaveRecord: () => void;
}

export const HealthResultScreen: React.FC<HealthResultScreenProps> = ({
  onBack,
  onContactVet,
  onSaveRecord,
}) => {
  const {
    currentAssessment,
    selectedCattle,
    setAssessmentRisk,
    addHealthRecord,
    vetReferrals,
    showToast,
    t,
  } = useApp();
  const [isSaved, setIsSaved] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const handleDownloadHealthReportPdf = () => {
    try {
      const textContent =
        `%PDF-1.4\n%Pashu360 Official Veterinary Health Check Certificate\n` +
        `Animal: ${selectedCattle.name} (${selectedCattle.breed}) | Ear Tag: ${selectedCattle.tag}\n` +
        `Owner: Rahul Yadav | Location: Karnal, Haryana\n` +
        `Assessment Status: ${currentAssessment.riskLevel}\n` +
        `Headline: ${currentAssessment.headline}\n` +
        `Summary: ${currentAssessment.description}\n` +
        `Baseline Milk: ${selectedCattle.baselineMilk} L | Checked Today: ${selectedCattle.todayMilk} L\n` +
        `Observations:\n` +
        currentAssessment.reasons.map((r) => ` - [${r.severity.toUpperCase()}] ${r.title}: ${r.description}`).join('\n') +
        `\nRecommendation: ${currentAssessment.recommendation}\n` +
        `Checked: Today, 24 Sep 2026\n` +
        `Verified by: AARVI AI Engine & Karnal Block Animal Health Registry\n`;
      const blob = new Blob([textContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Health_Report_${selectedCattle.name}_${selectedCattle.tag}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Health Report PDF Downloaded', 'success');
    } catch (err) {
      console.warn('PDF download error:', err);
    }
  };

  // Check if a referral ticket exists for this check
  const activeReferral =
    vetReferrals.find(
      (r) =>
        r.id === currentAssessment.referralId ||
        (r.cattleId === selectedCattle.id && r.status === 'dispatched')
    ) ||
    (currentAssessment.referralId
      ? {
          id: currentAssessment.referralId,
          assignedClinic: 'Karnal Block Veterinary Hospital',
        }
      : null);

  const handleSave = () => {
    setIsSaved(true);
    addHealthRecord({
      id: `check-${Date.now()}`,
      cattleId: selectedCattle.id,
      date: 'Today',
      time: 'Just now',
      title: 'Health check assessment',
      subtitle: `${currentAssessment.headline} • Status: ${currentAssessment.riskLevel}`,
      category: 'checks',
      iconType: 'heart',
      iconColor: currentAssessment.riskLevel === 'Healthy' ? 'green' : 'amber',
    });
    setTimeout(() => {
      onSaveRecord();
    }, 800);
  };

  const getReasonIcon = (icon: string) => {
    switch (icon) {
      case 'thermometer':
        return <Thermometer className="w-4 h-4 text-[#166534]" />;
      case 'milk':
        return <Milk className="w-4 h-4 text-[#166534]" />;
      case 'feed':
        return <UtensilsCrossed className="w-4 h-4 text-[#166534]" />;
      case 'breathing':
        return <Wind className="w-4 h-4 text-red-600" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-red-600" />;
      default:
        return <Thermometer className="w-4 h-4 text-[#166534]" />;
    }
  };

  const isAttentionOrWorse = currentAssessment.riskLevel !== 'Healthy';
  const isVetReviewOrUrgent =
    currentAssessment.riskLevel === 'Veterinary Review' ||
    currentAssessment.riskLevel === 'Urgent';

  const riskLevels: {
    level: HealthStatus;
    label: string;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      level: 'Healthy',
      label: t.healthy,
      activeClass: 'bg-[#22C55E] text-white shadow-xs',
      inactiveClass:
        'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50',
    },
    {
      level: 'Attention',
      label: t.attention,
      activeClass: 'bg-[#D97706] text-white shadow-xs',
      inactiveClass:
        'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50',
    },
    {
      level: 'Veterinary Review',
      label: t.veterinaryReview,
      activeClass: 'bg-[#EA580C] text-white shadow-xs',
      inactiveClass:
        'bg-white text-orange-800 border border-orange-200 hover:bg-orange-50',
    },
    {
      level: 'Urgent',
      label: t.urgent,
      activeClass: 'bg-[#DC2626] text-white shadow-xs animate-pulse',
      inactiveClass:
        'bg-white text-red-800 border border-red-200 hover:bg-red-50',
    },
  ];

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-6">
      <div>
        <AppHeader
          title={t.healthResultTitle}
          onBack={onBack}
          rightAction={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-[#166534] border border-gray-200/80 shadow-2xs flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="Download Health Report PDF"
                title="Download Official Health Report PDF"
                onClick={handleDownloadHealthReportPdf}
              >
                <Download className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80 shadow-2xs flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="Share Result"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `Pashu360 Health Result: ${selectedCattle.name}`,
                        text: `${selectedCattle.name} assessment: ${currentAssessment.headline}`,
                      })
                      .catch(() => {});
                  }
                }}
              >
                <Share2 className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          }
        />

        <div className="px-5 pt-1 space-y-4">
          {/* Cow summary header row */}
          <div className="flex items-center space-x-3 bg-white p-3 rounded-[16px] border border-gray-100/90 shadow-2xs">
            <img
              src={selectedCattle.photoUrl}
              alt={selectedCattle.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackCowPhoto;
              }}
            />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-900 leading-tight">
                {selectedCattle.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {selectedCattle.breed} • {t.checkedJustNow}
              </p>
            </div>
          </div>

          {/* Full Risk Badges */}
          <div>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
              {riskLevels.map((item) => {
                const isActive = currentAssessment.riskLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setAssessmentRisk(item.level)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      isActive ? item.activeClass : item.inactiveClass
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attention / Status Card */}
          <div
            className={`rounded-[20px] p-4.5 border transition-all ${
              currentAssessment.riskLevel === 'Healthy'
                ? 'bg-[#E8F8EE]/80 border-[#C6F1D5]'
                : currentAssessment.riskLevel === 'Urgent'
                ? 'bg-red-50 border-red-200'
                : currentAssessment.riskLevel === 'Veterinary Review'
                ? 'bg-orange-50 border-orange-200'
                : 'bg-[#FFFBEB] border-[#FDE68A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  currentAssessment.riskLevel === 'Healthy'
                    ? 'bg-emerald-100 text-[#166534]'
                    : currentAssessment.riskLevel === 'Urgent'
                    ? 'bg-red-100 text-red-600'
                    : currentAssessment.riskLevel === 'Veterinary Review'
                    ? 'bg-orange-100 text-[#EA580C]'
                    : 'bg-amber-100 text-[#D97706]'
                }`}
              >
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
              <RiskBadge level={currentAssessment.riskLevel} />
            </div>

            <h2 className="text-base font-bold text-gray-900 leading-snug">
              {currentAssessment.headline}
            </h2>
            <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">
              {currentAssessment.description}
            </p>
          </div>

          {/* RULE 9: Structured Referral Object Banner (visible for Vet Review & Urgent) */}
          {isVetReviewOrUrgent && (
            <div className="bg-white rounded-[16px] p-3.5 border border-red-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-900">
                      Vet Referral Dispatched
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-red-100 text-red-700">
                      #{activeReferral?.id || 'REF-2026-9041'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Visible on Karnal Block Vet Dashboard • Priority Dispatched
                  </p>
                </div>
              </div>
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          )}

          {/* Why AARVI says this */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 tracking-tight uppercase mb-2 px-1">
              {t.whyAarviSaysThis}
            </h3>

            <div className="bg-white rounded-[20px] p-3.5 shadow-2xs border border-gray-100/90 divide-y divide-gray-100">
              {currentAssessment.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3.5 ${
                    idx === 0
                      ? 'pb-3'
                      : idx === currentAssessment.reasons.length - 1
                      ? 'pt-3'
                      : 'py-3'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#E8F8EE] border border-[#C6F1D5] flex items-center justify-center shrink-0 mt-0.5">
                    {getReasonIcon(reason.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 leading-tight">
                      {reason.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-normal mt-0.5 leading-tight">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice / Safeguard Box */}
          <div className="bg-[#E8F8EE] rounded-[16px] p-3.5 border border-[#C6F1D5] flex items-start space-x-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-white border border-[#C6F1D5] flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              {currentAssessment.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pt-4 space-y-2.5">
        <PrimaryButton
          onClick={() => {
            if (isAttentionOrWorse) {
              setShowCallModal(true);
            } else {
              handleSave();
            }
          }}
          icon={
            isAttentionOrWorse ? (
              <PhoneCall className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <Check className="w-4 h-4 stroke-[2.5]" />
            )
          }
        >
          {isAttentionOrWorse ? t.contactParaVet : t.markAsVerified}
        </PrimaryButton>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved}
          className="w-full py-3.5 px-5 rounded-[18px] bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 font-semibold text-sm flex items-center justify-center space-x-2 shadow-2xs cursor-pointer active:scale-98 transition-all"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span className="text-emerald-700">{t.recordSavedOffline}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-gray-600 stroke-[2]" />
              <span>{t.saveRecord}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadHealthReportPdf}
          className="w-full py-3 px-5 rounded-[18px] bg-[#F4F7F2] hover:bg-[#EAF1E7] text-[#166534] border border-[#D5E4D1] font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer active:scale-98 transition-all shadow-2xs"
          title="Download official PDF report for veterinary and milk cooperative records"
        >
          <Download className="w-4 h-4 stroke-[2.2]" />
          <span>Download Health Report (PDF)</span>
        </button>
      </div>

      {/* Para-Vet Direct Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-[#E8F8EE] text-[#166534] flex items-center justify-center mx-auto mb-3 border border-[#C6F1D5]">
              <PhoneCall className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {t.connectingToVet}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Dr. Suresh Verma • Karnal Block Veterinary Clinic
            </p>
            {activeReferral && (
              <div className="mt-2 py-1 px-2.5 rounded-lg bg-red-50 text-[11px] font-bold text-red-700 border border-red-200">
                Dispatched Referral Ticket #{activeReferral.id}
              </div>
            )}
            <div className="my-3 py-2 px-3 rounded-xl bg-gray-50 text-xs font-semibold text-gray-700 border border-gray-200">
              📞 +91 98120 44912
            </div>
            <div className="space-y-2">
              <a
                href="tel:9812044912"
                onClick={() => {
                  setShowCallModal(false);
                  onContactVet();
                }}
                className="block w-full py-3 rounded-xl bg-[#166534] text-white font-semibold text-xs shadow-sm hover:bg-[#14532D]"
              >
                {t.callNow}
              </a>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
