import React from 'react';
import { Mic, ArrowRight, MapPin, CheckCircle2, X, Sparkles } from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { WeatherChip } from '../components/common/WeatherChip';
import { CattleCard } from '../components/common/CattleCard';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { PashuLogo } from '../components/common/PashuLogo';
import { useApp } from '../context/AppContext';
import { Cattle } from '../types';

interface HomeScreenProps {
  onSelectCattle: (cattle: Cattle) => void;
  onStartVoice: () => void;
  onOpenSync: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectCattle,
  onStartVoice,
  onOpenSync,
}) => {
  const {
    cattleList,
    selectedCattle,
    setSelectedCattleId,
    t,
    farmer,
    treatmentSuccessCard,
    dismissTreatmentSuccessCard,
  } = useApp();

  const handleCattleClick = (cattle: Cattle) => {
    setSelectedCattleId(cattle.id);
    onSelectCattle(cattle);
  };

  const isLocationDetected = farmer.locationStatus === 'detected';

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-20">
      <div className="flex-1">
        <StatusBar />

        {/* Header: Logo, Greeting & Weather */}
        <div className="px-5 pt-3 pb-3 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <PashuLogo size={42} />
            <div>
              <span className="text-xs text-gray-500 font-medium block">
                {t.greeting}
              </span>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                {farmer.name}
              </h1>
              {/* Location indication */}
              <div className="flex items-center space-x-1 text-[11px] text-gray-500 font-medium mt-0.5">
                <MapPin className="w-3 h-3 text-[#166534] shrink-0" />
                <span>
                  {isLocationDetected
                    ? `${farmer.district}, ${farmer.state}`
                    : t.locationUnavailable}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <WeatherChip
              temperature={farmer.weatherTemp}
              locationAvailable={isLocationDetected}
            />
            {isLocationDetected && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {farmer.heatIndex}
              </span>
            )}
          </div>
        </div>

        {/* Offline Banner indicator */}
        <OfflineBanner onOpenSync={onOpenSync} />

        {/* Treatment Success Card (Synchronized Ecosystem from Para-Vet treatment) */}
        {treatmentSuccessCard && treatmentSuccessCard.visible && (
          <div className="px-5 mb-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#E8F8EE] to-[#DCF5E3] border border-[#A7E8BC] shadow-xs relative">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#166534] uppercase tracking-wider block">
                      Treatment Completed ({treatmentSuccessCard.animalName})
                    </span>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
                      {treatmentSuccessCard.message}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={dismissTreatmentSuccessCard}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-black/5 cursor-pointer"
                  aria-label="Dismiss card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#C6F1D5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#14532D] font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
                  <span>{treatmentSuccessCard.recoveryPrediction}</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium">
                  {treatmentSuccessCard.timestamp}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA Card: "Talk to AARVI" */}
        <div className="px-5 mb-5">
          <div
            onClick={onStartVoice}
            className="w-full bg-[#166534] hover:bg-[#14532D] text-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(22,101,52,0.18)] transition-all duration-200 active:scale-[0.985] cursor-pointer flex items-center justify-between relative overflow-hidden"
          >
            {/* Subtle glow background */}
            <div className="absolute right-0 top-0 w-36 h-36 bg-[#22C55E]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex-1 pr-4">
              <span className="inline-block text-[11px] font-bold text-[#86EFAC] tracking-wider uppercase">
                {t.offlineReady}
              </span>
              <h2 className="text-xl font-bold text-white mt-1 tracking-tight">
                {t.talkToAarvi}
              </h2>
              <p className="text-xs text-emerald-100/85 mt-1 font-medium">
                {t.askAboutPrompt}
              </p>
            </div>

            {/* Glowing circular mic button */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0 group">
              <Mic className="w-6 h-6 stroke-[2.2] text-[#86EFAC] group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Cattle Section */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              {t.myCattle}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {cattleList.length} {t.animalsCount}
            </span>
          </div>

          <div className="space-y-3">
            {cattleList.map((cattle) => (
              <CattleCard
                key={cattle.id}
                cattle={cattle}
                onClick={handleCattleClick}
              />
            ))}
          </div>

          {/* Quick Info Tip */}
          <div className="mt-5 p-3.5 rounded-[16px] bg-white border border-gray-100/80 shadow-2xs flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="font-medium">{t.healthProfilesUpdated}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCattleClick(selectedCattle)}
              className="text-[#166534] font-semibold flex items-center space-x-0.5 hover:underline"
            >
              <span>{t.viewCattle}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
