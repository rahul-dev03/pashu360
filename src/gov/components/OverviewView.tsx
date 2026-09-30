import React from 'react';
import {
  Activity,
  AlertOctagon,
  ShieldCheck,
  Building,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Users,
  Clock,
  Bug,
} from 'lucide-react';
import { VillageData, VillageRiskLevel } from '../data/govMockData';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';

interface OverviewViewProps {
  villages: VillageData[];
  selectedVillageId: string | null;
  onSelectVillage: (villageId: string | null) => void;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  villages,
  selectedVillageId,
  onSelectVillage,
  onNavigateToTab,
}) => {
  // Aggregate KPIs
  const totalCattle = villages.reduce((acc, v) => acc + v.totalCattle, 0);
  const activeAlerts = villages.reduce((acc, v) => acc + v.activeCases, 0);
  const avgVaccination = (
    villages.reduce((acc, v) => acc + v.vaccinationRate, 0) / villages.length
  ).toFixed(1);
  const reportingVillagesToday = villages.filter((v) => v.reportingFarmsToday > 0).length;

  const selectedVillage = villages.find((v) => v.id === selectedVillageId);

  // Village color helper
  const getRiskColors = (risk: VillageRiskLevel) => {
    switch (risk) {
      case 'Outbreak':
        return {
          bg: 'bg-red-500',
          border: 'border-red-600',
          badge: 'bg-red-100 text-red-800 border-red-200',
          ring: 'ring-red-400',
          text: 'text-red-700',
        };
      case 'Attention':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-600',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          ring: 'ring-amber-400',
          text: 'text-amber-700',
        };
      case 'Healthy':
      default:
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-600',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          ring: 'ring-emerald-400',
          text: 'text-emerald-700',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[16px] bg-gradient-to-r from-[#166534] to-[#14532D] text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              Government Disease Intelligence Portal
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              Department of Animal Husbandry, Haryana
            </span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Real-time epidemiological surveillance, AARVI voice triage aggregation, and NADCP vaccination compliance monitoring across Karnal district.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedVillageId && (
            <button
              type="button"
              onClick={() => onSelectVillage(null)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer"
            >
              Reset to All District
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigateToTab('surveillance')}
            className="px-3.5 py-2 rounded-xl bg-white text-[#166534] hover:bg-stone-50 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Disease Surveillance View
          </button>
        </div>
      </div>

      {/* TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Registered Cattle */}
        <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Registered Cattle
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              <AnimatedCounter
                value={selectedVillage ? selectedVillage.totalCattle : totalCattle}
                duration={750}
              />
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              Tag Audited
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {selectedVillage ? `${selectedVillage.name} herd census` : 'Across 6 monitored village blocks'}
          </p>
        </div>

        {/* KPI 2: Active Disease Alerts */}
        <div className="p-4 rounded-[16px] bg-white border border-red-200 shadow-xs bg-gradient-to-br from-white to-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
              Active Disease Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">
              <AnimatedCounter
                value={selectedVillage ? selectedVillage.activeCases : activeAlerts}
                duration={750}
              />
            </span>
            <span className="text-[11px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-sm">
              {selectedVillage ? selectedVillage.riskLevel : '12 New Today'}
            </span>
          </div>
          <p className="text-[11px] text-red-600 font-medium mt-1 truncate">
            {selectedVillage
              ? `Diseases: ${selectedVillage.activeDiseases.join(', ')}`
              : 'FMD (29), Mastitis (42), LSD (22)'}
          </p>
        </div>

        {/* KPI 3: Vaccination Coverage % */}
        <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Vaccination Coverage %
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              <AnimatedCounter
                value={selectedVillage ? selectedVillage.vaccinationRate : parseFloat(avgVaccination)}
                decimals={1}
                suffix="%"
                duration={750}
              />
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              NADCP Phase II
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            Cold chain batch compliance verified
          </p>
        </div>

        {/* KPI 4: Villages Reporting Today */}
        <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Villages Reporting Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#166534]/10 text-[#166534] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              {selectedVillage ? '1 Village' : (
                <AnimatedCounter
                  value={reportingVillagesToday}
                  suffix=" / 6"
                  duration={750}
                />
              )}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              100% Active
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {selectedVillage
              ? `${selectedVillage.reportingFarmsToday} dairy farms screened`
              : '181 dairy farms screened today'}
          </p>
        </div>
      </div>

      {/* DISTRICT RISK HEATMAP SECTION */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#166534]" />
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                District Risk Heatmap — Karnal Division
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Interactive geographic cluster visualization of epidemiological alerts. Select any village to filter district charts.
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span>Green = Healthy</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
              <span>Amber = Attention</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-red-700">
              <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200 animate-pulse" />
              <span>Red = Outbreak</span>
            </span>
          </div>
        </div>

        {/* Heatmap Grid & Geographic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive Geographic Map View (7 cols) */}
          <div className="lg:col-span-7 bg-[#F4F7F2] rounded-[20px] border border-stone-200 p-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-inner select-none">
            {/* Top map controls */}
            <div className="flex items-center justify-between z-10 text-xs">
              <span className="font-mono text-[11px] font-bold text-stone-600 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200">
                Lat: 29.68° N • Lon: 76.99° E • Zone 4
              </span>
              <span className="text-[11px] font-semibold text-[#166534] bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200">
                Click pin to scope analytics
              </span>
            </div>

            {/* Stylized Topographic District Map Graphic */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 600 400">
                {/* District boundary outline */}
                <path
                  d="M100 80 Q 250 40 450 60 T 520 200 Q 500 320 380 360 T 150 320 Q 80 220 100 80 Z"
                  fill="#166534"
                  stroke="#166534"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Canal Network */}
                <path
                  d="M120 40 Q 200 180 320 220 T 540 340"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                />
                <path
                  d="M260 20 Q 280 150 300 380"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Interactive Village Pins placed across the Map */}
            <div className="relative w-full h-80 my-2">
              {villages.map((village) => {
                const colors = getRiskColors(village.riskLevel);
                const isSelected = selectedVillageId === village.id;
                return (
                  <button
                    key={village.id}
                    type="button"
                    onClick={() => onSelectVillage(isSelected ? null : village.id)}
                    style={{ left: `${village.coordinates.x}%`, top: `${village.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Pulsing Aura if Outbreak */}
                    {village.riskLevel === 'Outbreak' && (
                      <span className="absolute -inset-2 rounded-full bg-red-400 opacity-60 animate-ping pointer-events-none" />
                    )}

                    {/* Pin Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#166534] text-white border-white ring-4 ring-[#166534]/30'
                          : 'bg-white text-stone-900 border-stone-300 hover:border-[#166534]'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                      <span>{village.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          village.riskLevel === 'Outbreak'
                            ? 'bg-red-100 text-red-800'
                            : village.riskLevel === 'Attention'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {village.activeCases}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom status of map */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 z-10 bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-stone-200">
              <span>Grand Trunk Road Corridor & Western Yamuna Canal Belt</span>
              <span className="font-semibold text-stone-800">
                Showing {villages.length} Monitored Blocks
              </span>
            </div>
          </div>

          {/* Village Quick Selector & Deep Dive Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {/* Selected Village Detail Panel or Prompt */}
            {selectedVillage ? (
              <div className="p-4 rounded-[16px] bg-[#FAFBF9] border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">{selectedVillage.name}</h3>
                      <span className="text-xs text-stone-400">({selectedVillage.hindiName})</span>
                    </div>
                    <p className="text-xs text-stone-500">{selectedVillage.block}</p>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      getRiskColors(selectedVillage.riskLevel).badge
                    }`}
                  >
                    {selectedVillage.riskLevel}
                  </span>
                </div>

                {/* Village specific vital metrics: All 6 required fields */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Active Cases
                    </span>
                    <span className="text-base font-black text-stone-900">
                      {selectedVillage.activeCases} Cases
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block flex items-center gap-1">
                      <Bug className="w-3 h-3 text-red-600" /> Dominant Disease
                    </span>
                    <span className="text-sm font-bold text-red-700 truncate block mt-0.5">
                      {selectedVillage.activeDiseases[0] || 'Mastitis'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Vaccination %
                    </span>
                    <span className="text-base font-black text-emerald-700">
                      {selectedVillage.vaccinationRate}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" /> THI Index
                    </span>
                    <span
                      className={`text-base font-bold ${
                        selectedVillage.thiIndex >= 80 ? 'text-red-600' : 'text-amber-700'
                      }`}
                    >
                      THI {selectedVillage.thiIndex}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Assigned Para-Vets
                    </span>
                    <span className="text-base font-bold text-stone-900">
                      {selectedVillage.paraVetsAssigned} Officers
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" /> Last Report
                    </span>
                    <span className="text-xs font-semibold text-stone-800 block mt-0.5 truncate">
                      Thu, 24 Sep • 10:45 AM
                    </span>
                  </div>
                </div>

                {/* Primary Alert */}
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Latest Field Intelligence:
                  </span>
                  <p className="text-[11px] leading-relaxed">{selectedVillage.recentAlert}</p>
                </div>

                {/* Quick actions for this village */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('resources')}
                    className="flex-1 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    Deploy Para-Vet Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectVillage(null)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-[16px] bg-[#F8FAF7] border border-dashed border-stone-300 text-center py-6">
                <MapPin className="w-8 h-8 text-[#166534] mx-auto opacity-70 mb-2" />
                <h4 className="text-xs font-bold text-stone-900">District-Wide View Active</h4>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto mt-1">
                  Click on any village pin on the heatmap or choose from the list below to focus district surveillance.
                </p>
              </div>
            )}

            {/* List of 6 Villages with quick click */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-1">
                Monitored Villages (6)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {villages.map((v) => {
                  const colors = getRiskColors(v.riskLevel);
                  const isSel = selectedVillageId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onSelectVillage(isSel ? null : v.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSel
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSel ? 'bg-white' : colors.bg
                            }`}
                          />
                          <span className="font-bold truncate">{v.name}</span>
                        </div>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            isSel ? 'text-emerald-100' : 'text-stone-400'
                          }`}
                        >
                          {v.activeCases} active cases
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSel ? 'text-white' : 'text-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
