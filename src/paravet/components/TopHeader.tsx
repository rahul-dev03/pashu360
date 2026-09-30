import React from 'react';
import {
  Search,
  Bell,
  Building2,
  PhoneCall,
  Smartphone,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  urgentCount: number;
  onSwitchToFarmerApp: () => void;
  onOpenUrgentFilter?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  urgentCount,
  onSwitchToFarmerApp,
  onOpenUrgentFilter,
}) => {
  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cattle, tag (e.g. P360-021), farmer, or disease..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAF7] border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#166534] focus:outline-hidden transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Center: Clinic & Regional Info */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#166534]" />
          <div>
            <span className="font-semibold text-stone-800">Karnal Block Hospital</span>
            <span className="text-stone-400 mx-1.5">•</span>
            <span className="text-stone-500">Zone 4 Polyclinic</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-500 border-l border-stone-200 pl-4">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Thu, 24 Sep 2026</span>
        </div>
      </div>

      {/* Right: Emergency Hotline, Alerts & Farmer App Switcher */}
      <div className="flex items-center gap-3">
        {/* Urgent Triage Banner Button if cases exist */}
        {urgentCount > 0 && (
          <button
            type="button"
            onClick={onOpenUrgentFilter}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span>{urgentCount} Urgent Alert{urgentCount > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Emergency Dispatch Helpline */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F7F2] border border-[#E3ECE0] text-[11px] font-semibold text-[#14532D]">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambulance: 1962</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 cursor-pointer transition-colors shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {urgentCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Switch to Farmer Mobile App */}
        <button
          type="button"
          onClick={onSwitchToFarmerApp}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          title="Switch view to Farmer Mobile App"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Farmer App View</span>
        </button>
      </div>
    </header>
  );
};
