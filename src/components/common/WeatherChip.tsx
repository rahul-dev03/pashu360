import React from 'react';
import { Sun, MapPinOff } from 'lucide-react';

interface WeatherChipProps {
  temperature?: number;
  locationAvailable?: boolean;
  className?: string;
}

export const WeatherChip: React.FC<WeatherChipProps> = ({
  temperature = 27,
  locationAvailable = true,
  className = '',
}) => {
  if (!locationAvailable) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1 text-[11px] font-medium text-gray-500 ${className}`}
      >
        <MapPinOff className="w-3 h-3 text-gray-400" />
        <span>Location unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-gray-200/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-2xs ${className}`}
    >
      <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400/40" />
      <span className="font-semibold text-gray-800">{temperature}°C</span>
    </div>
  );
};
