import React from 'react';
import { Activity, Stethoscope, Pill, Syringe, ClipboardCheck } from 'lucide-react';
import { TimelineItemData } from '../../types';

interface TimelineItemProps {
  item: TimelineItemData;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast = false }) => {
  const getIcon = () => {
    switch (item.iconType) {
      case 'heart':
        return <Activity className="w-4 h-4 text-[#166534]" />;
      case 'stethoscope':
        return <Stethoscope className="w-4 h-4 text-[#166534]" />;
      case 'pill':
        return <Pill className="w-4 h-4 text-[#D97706]" />;
      case 'syringe':
        return <Syringe className="w-4 h-4 text-[#166534]" />;
      case 'clipboard':
        return <ClipboardCheck className="w-4 h-4 text-[#166534]" />;
      default:
        return <Activity className="w-4 h-4 text-[#166534]" />;
    }
  };

  const getIconBg = () => {
    switch (item.iconColor) {
      case 'amber':
        return 'bg-[#FEF3C7] border-[#FDE68A]';
      case 'green':
      default:
        return 'bg-[#E8F8EE] border-[#C6F1D5]';
    }
  };

  return (
    <div className="relative flex items-start space-x-3.5 group">
      {/* Node & Connecting Line */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-2xs z-10 transition-transform group-hover:scale-105 ${getIconBg()}`}
        >
          {getIcon()}
        </div>
        {!isLast && <div className="w-[1.5px] bg-gray-200 my-1 h-12" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 pt-0.5">
        <div className="flex items-center text-xs text-gray-500 font-medium">
          <span>{item.date}</span>
          <span className="mx-1.5">•</span>
          <span>{item.time}</span>
        </div>
        <h4 className="font-semibold text-sm text-gray-900 mt-0.5 tracking-tight">
          {item.title}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
};
