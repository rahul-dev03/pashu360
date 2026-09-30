import React from 'react';
import {
  Calendar,
  Heart,
  Syringe,
  Milk,
  ShieldCheck,
  Stethoscope,
  SquarePen,
} from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { StatusChip } from '../components/common/StatusChip';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useApp } from '../context/AppContext';
import fallbackCowPhoto from '../assets/images/champa_cow_portrait_1790444600765.jpg';

interface CattleProfileScreenProps {
  onBack: () => void;
  onStartHealthCheck: () => void;
  onViewHistory?: () => void;
}

export const CattleProfileScreen: React.FC<CattleProfileScreenProps> = ({
  onBack,
  onStartHealthCheck,
  onViewHistory,
}) => {
  const { selectedCattle, t } = useApp();

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-6">
      <div>
        <AppHeader
          title={t.cattleProfileTitle}
          onBack={onBack}
          rightAction={
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80 shadow-2xs flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Edit Profile"
              onClick={() => {}}
            >
              <SquarePen className="w-4 h-4 stroke-[2]" />
            </button>
          }
        />

        <div className="px-5 pt-1 space-y-4">
          {/* Hero cattle card with photo */}
          <div className="relative w-full h-56 rounded-[22px] overflow-hidden shadow-sm border border-gray-100 bg-gray-200">
            <img
              src={selectedCattle.photoUrl}
              alt={selectedCattle.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackCowPhoto;
              }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Top-left status chip */}
            <div className="absolute top-3.5 left-3.5">
              <StatusChip status={selectedCattle.status} />
            </div>

            {/* Bottom text: Name, Breed & Tag */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold tracking-tight leading-tight">
                {selectedCattle.name}
              </h2>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {selectedCattle.breed} • Tag {selectedCattle.tag}
              </p>
            </div>
          </div>

          {/* Cattle Info Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-gray-100/90 divide-y divide-gray-100">
            {/* Age */}
            <div className="flex items-center space-x-3.5 pb-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#166534] shrink-0 border border-[#C6F1D5]">
                <Calendar className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">{t.age}</span>
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {selectedCattle.age}
                </span>
              </div>
            </div>

            {/* Pregnancy */}
            <div className="flex items-center space-x-3.5 py-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#166534] shrink-0 border border-[#C6F1D5]">
                <Heart className="w-4 h-4 stroke-[2.2] fill-[#166534]/15" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">{t.pregnancy}</span>
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {selectedCattle.pregnancy}
                </span>
              </div>
            </div>

            {/* Vaccination */}
            <div className="flex items-center space-x-3.5 py-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#166534] shrink-0 border border-[#C6F1D5]">
                <Syringe className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">{t.vaccination}</span>
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {selectedCattle.vaccination}
                </span>
              </div>
            </div>

            {/* Milk baseline */}
            <div className="flex items-center space-x-3.5 pt-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#166534] shrink-0 border border-[#C6F1D5]">
                <Milk className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">{t.milkBaseline}</span>
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {selectedCattle.baselineMilk} {t.dailyLiters}
                </span>
              </div>
            </div>
          </div>

          {/* Last health check banner */}
          <div
            onClick={onViewHistory}
            className="bg-[#E8F8EE] hover:bg-[#ddf4e5] transition-colors rounded-[16px] p-3.5 border border-[#C6F1D5] flex items-center space-x-3 cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#166534] shrink-0 border border-[#C6F1D5]">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-900">
                {t.lastHealthCheck}
              </div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                {selectedCattle.lastHealthCheck.status} • {selectedCattle.lastHealthCheck.date}, {selectedCattle.lastHealthCheck.time}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-5 pt-4">
        <PrimaryButton
          onClick={onStartHealthCheck}
          icon={<Stethoscope className="w-5 h-5 stroke-[2.2]" />}
        >
          {t.startHealthCheck}
        </PrimaryButton>
      </div>
    </div>
  );
};
