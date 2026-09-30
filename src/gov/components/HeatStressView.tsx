import React from 'react';
import {
  Flame,
  Thermometer,
  TrendingDown,
  AlertTriangle,
  Droplets,
  Wind,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { mockHeatStressData } from '../data/govMockData';

export const HeatStressView: React.FC = () => {
  const data = mockHeatStressData;
  const series = data.temperature14Days;

  // SVG Chart calculation for 14-day Temperature & THI
  const maxTemp = 42;
  const minTemp = 28;
  const maxThi = 86;
  const minThi = 68;

  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getX = (index: number) =>
    paddingX + (index / (series.length - 1)) * (chartWidth - paddingX * 2);

  const getTempY = (temp: number) => {
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const getThiY = (thi: number) => {
    const ratio = (thi - minThi) / (maxThi - minThi);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const tempPoints = series.map((d, i) => `${getX(i)},${getTempY(d.temp)}`).join(' ');
  const thiPoints = series.map((d, i) => `${getX(i)},${getThiY(d.thi)}`).join(' ');

  // Danger threshold line at THI 78
  const thiDangerY = getThiY(78);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Livestock Thermal Stress & THI Advisory
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Temperature-Humidity Index (THI) surveillance, lactation drop forecasting, and heat mitigation directives
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Alert: Heatwave Advisory Active in Sector 14</span>
        </div>
      </div>

      {/* TOP 4 HEAT STRESS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's THI */}
        <div className="p-4 rounded-[16px] bg-white border border-amber-200 shadow-xs bg-gradient-to-br from-white to-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Today's District THI
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{data.todayThi}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-sm">
              Moderate Stress
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Normal comfort threshold is THI &lt; 72
          </p>
        </div>

        {/* Card 2: High-Risk Villages */}
        <div className="p-4 rounded-[16px] bg-white border border-red-200 shadow-xs bg-gradient-to-br from-white to-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
              High-Risk Villages
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">3 Villages</span>
            <span className="text-[11px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-sm">
              THI &gt; 78
            </span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium mt-1 truncate">
            {data.highRiskVillages.join(' • ')}
          </p>
        </div>

        {/* Card 3: Milk Yield Loss Estimate */}
        <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Est. Milk Yield Loss
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{data.estimatedMilkLossDaily}</span>
          </div>
          <p className="text-[11px] text-red-600 font-medium mt-1">
            Approx -1.2L per high-producing crossbred cow
          </p>
        </div>

        {/* Card 4: Financial Loss Impact */}
        <div className="p-4 rounded-[16px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              District Revenue Impact
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{data.estimatedFinancialLoss}</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Mitigable with shed ventilation & electrolyte feeds
          </p>
        </div>
      </div>

      {/* TEMPERATURE & THI TREND LINE CHART */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                14-Day Microclimate & THI Trend
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Dual plot mapping daily peak ambient temperature (°C) against humidity-weighted THI index
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span>THI Index (Thermal Stress)</span>
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Ambient Temp (°C)</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-3 h-0.5 border-t border-dashed border-red-500" />
              <span>THI 78 Danger Line</span>
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none">
            {/* THI Danger Reference line at 78 */}
            <line
              x1={paddingX}
              y1={thiDangerY}
              x2={chartWidth - paddingX}
              y2={thiDangerY}
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text
              x={chartWidth - paddingX - 10}
              y={thiDangerY - 6}
              textAnchor="end"
              className="text-[10px] font-bold fill-red-600"
            >
              THI 78 Danger Baseline
            </text>

            {/* Ambient Temperature Line (Red) */}
            <polyline
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={tempPoints}
            />

            {/* THI Index Line (Amber) */}
            <polyline
              fill="none"
              stroke="#D97706"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={thiPoints}
            />

            {/* Data Points */}
            {series.map((d, i) => {
              const cx = getX(i);
              const cyTemp = getTempY(d.temp);
              const cyThi = getThiY(d.thi);
              const isLast = i === series.length - 1;
              return (
                <g key={i}>
                  {/* Temp point */}
                  <circle cx={cx} cy={cyTemp} r={3} className="fill-red-500 stroke-white stroke-2" />
                  {/* THI point */}
                  <circle
                    cx={cx}
                    cy={cyThi}
                    r={isLast ? 5.5 : 3.5}
                    className="fill-amber-600 stroke-white stroke-2"
                  />
                  {isLast && (
                    <text
                      x={cx}
                      y={cyThi - 10}
                      textAnchor="middle"
                      className="text-[10px] font-black fill-amber-800"
                    >
                      THI {d.thi}
                    </text>
                  )}
                  {/* Date labels */}
                  {(i === 0 || i === 3 || i === 7 || i === 10 || i === 13) && (
                    <text
                      x={cx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[10px] fill-stone-400 font-medium"
                    >
                      {d.date}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Heatwave ProtocolDirectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-1">Sprinkler Timing</span>
            <p className="text-stone-600 leading-relaxed">
              Activate coarse-droplet roof water sprinklers for 3 minutes every 15 minutes between 11:00 AM and 3:30 PM.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-1">Ration Buffers</span>
            <p className="text-stone-600 leading-relaxed">
              Add sodium bicarbonate (100g/cow) and magnesium oxide to offset subacute ruminal acidosis (SARA) during panting.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-1">Shade Management</span>
            <p className="text-stone-600 leading-relaxed">
              Ensure minimum 4.5 m² shaded thatch area per adult cow with continuous cross-ventilation in all block sheds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
