import React from 'react';
import {
  Search,
  Bell,
  Building2,
  PhoneCall,
  Calendar,
  AlertOctagon,
  Stethoscope,
  Smartphone,
  Shield,
  Layers,
} from 'lucide-react';

interface GovHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedVillageName?: string;
  outbreakCount: number;
  onSwitchToFarmerApp: () => void;
  onSwitchToParaVetApp: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedVillageName,
  outbreakCount,
  onSwitchToFarmerApp,
  onSwitchToParaVetApp,
}) => {
  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
      {/* Left: Search Bar & District Scope */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search village, disease alert (FMD, Mastitis), or block..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAF7] border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#166534] focus:outline-hidden transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Center: Selected Village Scope & District Badge */}
      <div className="hidden lg:flex items-center gap-5 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#166534]" />
          <div>
            <span className="font-bold text-stone-900">Karnal District</span>
            <span className="text-stone-400 mx-1.5">•</span>
            <span className="text-stone-600 font-medium">Haryana State Surveillance Node</span>
          </div>
        </div>

        {selectedVillageName && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#14532D] border border-emerald-200 font-semibold text-[11px]">
            <Layers className="w-3 h-3 text-[#166534]" />
            <span>Scope: {selectedVillageName}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-stone-500 border-l border-stone-200 pl-4">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Thu, 24 Sep 2026</span>
        </div>
      </div>

      {/* Right: Emergency Outbreak Hotline & App View Switchers */}
      <div className="flex items-center gap-3">
        {/* Outbreak Alert Flag */}
        {outbreakCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-2xs">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>{outbreakCount} Outbreak Clusters</span>
          </div>
        )}

        {/* Emergency District Control Room */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F7F2] border border-[#E3ECE0] text-[11px] font-semibold text-[#14532D]">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>HQ Helpline: 0184-2253401</span>
        </div>

        {/* Switch to Para-Vet Dashboard */}
        <button
          type="button"
          onClick={onSwitchToParaVetApp}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-all cursor-pointer"
          title="Open Para-Vet Clinic Dashboard"
        >
          <Stethoscope className="w-3.5 h-3.5 text-[#166534]" />
          <span>Para-Vet View</span>
        </button>

        {/* Switch to Farmer Mobile App */}
        <button
          type="button"
          onClick={onSwitchToFarmerApp}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          title="Switch view to Farmer Mobile App"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Farmer App View</span>
        </button>
      </div>
    </header>
  );
};
