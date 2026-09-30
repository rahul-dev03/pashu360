import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertOctagon,
  Calendar,
  Activity,
  CheckCircle2,
  Users,
  ChevronRight,
  Flame,
  Stethoscope,
} from 'lucide-react';
import { mockDiseaseSurveillance, DiseaseSurveillanceMetric } from '../data/govMockData';

interface DiseaseSurveillanceViewProps {
  selectedVillageName?: string;
}

export const DiseaseSurveillanceView: React.FC<DiseaseSurveillanceViewProps> = ({
  selectedVillageName,
}) => {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('fmd');

  const selectedDisease =
    mockDiseaseSurveillance.find((d) => d.id === selectedDiseaseId) ||
    mockDiseaseSurveillance[0];

  // SVG Chart points calculation for 14-day epidemic timeline
  const timeline = selectedDisease.epidemicTimeline;
  const maxCases = Math.max(...timeline.map((t) => t.cases)) + 8;
  const minCases = Math.max(0, Math.min(...timeline.map((t) => t.cases)) - 4);

  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getX = (index: number) =>
    paddingX + (index / (timeline.length - 1)) * (chartWidth - paddingX * 2);

  const getY = (val: number) => {
    const ratio = (val - minCases) / (maxCases - minCases);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const points = timeline.map((d, i) => `${getX(i)},${getY(d.cases)}`).join(' ');
  const peakIndex = timeline.reduce(
    (maxIdx, curr, idx, arr) => (curr.cases > arr[maxIdx].cases ? idx : maxIdx),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              District Disease Surveillance & Early Warning
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Aggregated AARVI voice triage alerts, field Para-Vet CMT validations, and epidemic curve projections
            {selectedVillageName ? ` • Scoped to ${selectedVillageName}` : ' • All Karnal Blocks'}
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
          Epidemiological Week 39 Active
        </div>
      </div>

      {/* 4 INTERACTIVE DISEASE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDiseaseSurveillance.map((disease) => {
          const isSelected = selectedDiseaseId === disease.id;
          return (
            <div
              key={disease.id}
              onClick={() => setSelectedDiseaseId(disease.id)}
              className={`p-5 rounded-[16px] border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#166534] ring-2 ring-[#166534]/20 shadow-md'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      disease.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : disease.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {disease.severity} Alert
                  </span>

                  {/* Trend Arrow */}
                  <div className="flex items-center gap-1 text-xs font-bold">
                    {disease.trend === 'up' && (
                      <span className="text-red-600 flex items-center gap-0.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>Up</span>
                      </span>
                    )}
                    {disease.trend === 'down' && (
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <TrendingDown className="w-4 h-4" />
                        <span>Down</span>
                      </span>
                    )}
                    {disease.trend === 'stable' && (
                      <span className="text-stone-500 flex items-center gap-0.5">
                        <Minus className="w-4 h-4" />
                        <span>Stable</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-2.5">{disease.name}</h3>
                <p className="text-[11px] text-stone-500">{disease.hindiName}</p>

                {/* 3 Metrics: Active Cases, New Today, Recovered */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">
                      Active
                    </span>
                    <span className="text-lg font-black text-stone-900">{disease.activeCases}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-red-50/60 border border-red-100">
                    <span className="text-[10px] text-red-600 font-bold block uppercase">
                      New Today
                    </span>
                    <span className="text-lg font-black text-red-700">+{disease.newToday}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Recovered
                    </span>
                    <span className="text-lg font-black text-emerald-700">{disease.recovered}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 font-medium">{disease.trendPercentage}</span>
                <span className="font-bold text-[#166534] flex items-center">
                  View Timeline <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* EPIDEMIC TIMELINE FOR LAST 14 DAYS */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#166534]" />
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                14-Day Epidemic Curve: {selectedDisease.name}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Daily incidence cases detected via automated farmer voice screenings across Karnal
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-red-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Active Morbidity Incidence</span>
            </span>
            <span className="text-stone-400">•</span>
            <span className="font-semibold text-stone-700">
              Peak: {maxCases - 8} Cases (26 Sep)
            </span>
          </div>
        </div>

        {/* SVG Epidemic Curve Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none">
            <defs>
              <linearGradient id="diseaseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0.25, 0.5, 0.75].map((pct, idx) => {
              const yPos = paddingY + pct * (chartHeight - paddingY * 2);
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={yPos}
                  x2={chartWidth - paddingX}
                  y2={yPos}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Gradient area fill */}
            <polygon
              points={`${paddingX},${chartHeight - paddingY} ${points} ${
                chartWidth - paddingX
              },${chartHeight - paddingY}`}
              fill="url(#diseaseGrad)"
            />

            {/* Path line */}
            <polyline
              fill="none"
              stroke="#DC2626"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data points */}
            {timeline.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.cases);
              const isLast = i === timeline.length - 1;
              const isPeak = i === peakIndex;
              return (
                <g key={i}>
                  {/* Peak annotation above point */}
                  {isPeak && (
                    <g transform={`translate(${cx - 40}, ${cy - 30})`}>
                      <rect
                        x="0"
                        y="0"
                        width="80"
                        height="18"
                        rx="4"
                        fill="#991B1B"
                        className="shadow-sm"
                      />
                      <polygon points="36,18 44,18 40,22" fill="#991B1B" />
                      <text
                        x="40"
                        y="12"
                        textAnchor="middle"
                        className="text-[9px] font-black fill-white tracking-wide"
                      >
                        ▲ Peak: {d.cases}
                      </text>
                    </g>
                  )}

                  {/* Larger last point with animated pulse aura */}
                  {isLast && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={11}
                      className="fill-red-600/25 animate-ping"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isLast ? 7.5 : isPeak ? 5 : 3.5}
                    className={
                      isLast
                        ? 'fill-red-600 stroke-white stroke-2 shadow-md'
                        : isPeak
                        ? 'fill-red-700 stroke-white stroke-2'
                        : 'fill-stone-600 stroke-white stroke-2'
                    }
                  />

                  {/* Smooth number label for last point */}
                  {isLast && (
                    <g transform={`translate(${cx - 22}, ${cy - 22})`}>
                      <rect
                        x="0"
                        y="0"
                        width="44"
                        height="16"
                        rx="4"
                        fill="#FEF2F2"
                        stroke="#FCA5A5"
                      />
                      <text
                        x="22"
                        y="12"
                        textAnchor="middle"
                        className="text-[10px] font-black fill-red-700"
                      >
                        {d.cases}
                      </text>
                    </g>
                  )}

                  {/* Date labels */}
                  {(i === 0 || i === 3 || i === 7 || i === 10 || i === 13) && (
                    <text
                      x={cx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[10px] fill-stone-400 font-medium"
                    >
                      {d.day}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Clinical Containment Protocol Box */}
        <div className="p-4 rounded-[16px] bg-[#F8FAF7] border border-stone-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#166534]" />
              Active Protocol for {selectedDisease.name}:
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono">
              ICAR-NDRI Clinical Guidelines
            </span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {selectedDisease.id === 'fmd' &&
              'Mandatory 5km ring vaccination around Assandh & Karnal Central corridors. Veterinary ambulances equipped with potassium permanganate and antipyretics dispatched. Dairy milk tanker collection restricted in quarantine zones.'}
            {selectedDisease.id === 'mastitis' &&
              'Strip-cup California Mastitis Test (CMT) distributed to milk societies. Farmers advised on post-milking teat dip (iodophore 0.5%) and immediate cold compress for tense quarters.'}
            {selectedDisease.id === 'lsd' &&
              'Vector control fogging active in Nilokheri & Gharaunda. Strict isolation of cattle with circumscribed skin nodules. Supportive multivitamins and neem oil application advised.'}
            {selectedDisease.id === 'heat_stress' &&
              'Electrolyte supplementation in community troughs. Sprinkler cooling and thatch shed shading advised during peak 11:00 AM - 3:00 PM hours.'}
          </p>
        </div>
      </div>
    </div>
  );
};
