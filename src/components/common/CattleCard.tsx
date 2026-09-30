import React from 'react';
import { Milk } from 'lucide-react';
import { Cattle } from '../../types';
import { StatusChip } from './StatusChip';
import { useApp } from '../../context/AppContext';
import fallbackCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';

interface CattleCardProps {
  cattle: Cattle;
  onClick: (cattle: Cattle) => void;
  className?: string;
}

export const CattleCard: React.FC<CattleCardProps> = ({
  cattle,
  onClick,
  className = '',
}) => {
  const { t, language } = useApp();

  const displayName =
    language !== 'en' && cattle.nameHindi ? `${cattle.name} (${cattle.nameHindi})` : cattle.name;

  return (
    <div
      onClick={() => onClick(cattle)}
      className={`bg-white rounded-[18px] p-3.5 border border-gray-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-gray-200 active:scale-[0.99] cursor-pointer ${className}`}
    >
      <div className="flex items-center space-x-3.5">
        {/* Cow photo */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-100">
          <img
            src={cattle.photoUrl}
            alt={cattle.name}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackCowPhoto;
            }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-base text-gray-900 tracking-tight leading-tight">
            {displayName}
          </h3>
          <span className="text-xs text-gray-500 mt-0.5">{cattle.breed}</span>
          <div className="flex items-center space-x-1.5 text-xs text-gray-600 font-medium mt-1">
            <Milk className="w-3.5 h-3.5 text-[#166534]" />
            <span>
              {t.milkToday} {cattle.todayMilk} L
            </span>
          </div>
        </div>
      </div>

      {/* Status Chip */}
      <div className="shrink-0 pl-2">
        <StatusChip status={cattle.status} />
      </div>
    </div>
  );
};
