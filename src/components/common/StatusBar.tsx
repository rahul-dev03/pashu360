import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ dark = false }) => {
  return (
    <div
      className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-medium select-none ${
        dark ? 'text-white/80' : 'text-gray-800'
      }`}
    >
      <span className="font-semibold tracking-tight text-[13px]">9:41</span>
      <div className="flex items-center space-x-1.5">
        {/* Cellular signal bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <div className={`w-0.5 h-1.5 rounded-xs ${dark ? 'bg-white' : 'bg-gray-800'}`} />
          <div className={`w-0.5 h-2 rounded-xs ${dark ? 'bg-white' : 'bg-gray-800'}`} />
          <div className={`w-0.5 h-2.5 rounded-xs ${dark ? 'bg-white' : 'bg-gray-800'}`} />
          <div className={`w-0.5 h-3 rounded-xs ${dark ? 'bg-white' : 'bg-gray-800'}`} />
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center">
          <Battery className="w-4 h-4 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};
