import React, { useState } from 'react';
import {
  TrendingUp,
  Thermometer,
  Calendar,
  Activity,
  History,
  ShieldCheck,
  Stethoscope,
  Pill,
  Syringe,
  ClipboardList,
} from 'lucide-react';
import { mockMilkYield14Days } from '../../data/mockData';
import { Cattle, TimelineItemData } from '../../types';
import champaCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';

interface AnalyticsViewProps {
  cattleList: Cattle[];
  timelineRecords: TimelineItemData[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  cattleList,
  timelineRecords,
}) => {
  const [selectedCowId, setSelectedCowId] = useState<string>('gauri');

  const selectedCattle = cattleList.find((c) => c.id === selectedCowId) || cattleList[0];
  const yield14Days = mockMilkYield14Days[selectedCowId] || mockMilkYield14Days.gauri;

  // Mock 14-day temperature readings (°C)
  const temperatureData: Record<string, { date: string; temp: number; isFever: boolean }[]> = {
    gauri: [
      { date: '11 Sep', temp: 38.5, isFever: false },
      { date: '12 Sep', temp: 38.6, isFever: false },
      { date: '13 Sep', temp: 38.4, isFever: false },
      { date: '14 Sep', temp: 38.5, isFever: false },
      { date: '15 Sep', temp: 38.6, isFever: false },
      { date: '16 Sep', temp: 38.5, isFever: false },
      { date: '17 Sep', temp: 38.7, isFever: false },
      { date: '18 Sep', temp: 38.6, isFever: false },
      { date: '19 Sep', temp: 38.5, isFever: false },
      { date: '20 Sep', temp: 38.6, isFever: false },
      { date: '21 Sep', temp: 38.5, isFever: false },
      { date: '22 Sep', temp: 38.6, isFever: false },
      { date: '23 Sep', temp: 38.8, isFever: false },
      { date: '24 Sep', temp: 39.4, isFever: true }, // Localized mastitis temp elevation
    ],
    laxmi: [
      { date: '11 Sep', temp: 38.5, isFever: false },
      { date: '12 Sep', temp: 38.5, isFever: false },
      { date: '13 Sep', temp: 38.6, isFever: false },
      { date: '14 Sep', temp: 38.4, isFever: false },
      { date: '15 Sep', temp: 38.5, isFever: false },
      { date: '16 Sep', temp: 38.5, isFever: false },
      { date: '17 Sep', temp: 38.6, isFever: false },
      { date: '18 Sep', temp: 38.5, isFever: false },
      { date: '19 Sep', temp: 38.6, isFever: false },
      { date: '20 Sep', temp: 38.5, isFever: false },
      { date: '21 Sep', temp: 38.7, isFever: false },
      { date: '22 Sep', temp: 38.6, isFever: false },
      { date: '23 Sep', temp: 39.7, isFever: true }, // LSD fever onset
      { date: '24 Sep', temp: 38.9, isFever: false },
    ],
    champa: [
      { date: '11 Sep', temp: 38.6, isFever: false },
      { date: '12 Sep', temp: 38.5, isFever: false },
      { date: '13 Sep', temp: 38.6, isFever: false },
      { date: '14 Sep', temp: 38.7, isFever: false },
      { date: '15 Sep', temp: 38.5, isFever: false },
      { date: '16 Sep', temp: 38.6, isFever: false },
      { date: '17 Sep', temp: 38.8, isFever: false },
      { date: '18 Sep', temp: 38.9, isFever: false },
      { date: '19 Sep', temp: 38.7, isFever: false },
      { date: '20 Sep', temp: 38.9, isFever: false },
      { date: '21 Sep', temp: 39.2, isFever: true },
      { date: '22 Sep', temp: 39.8, isFever: true },
      { date: '23 Sep', temp: 40.2, isFever: true },
      { date: '24 Sep', temp: 40.6, isFever: true }, // FMD acute hyperthermia
    ],
  };

  const currentTempSeries = temperatureData[selectedCowId] || temperatureData.gauri;

  // Chart coordinate calculations
  const maxYield = Math.max(...yield14Days.map((d) => d.yieldLiters), selectedCattle.baselineMilk + 2);
  const minYield = Math.max(0, Math.min(...yield14Days.map((d) => d.yieldLiters)) - 2);

  // SVG Chart points
  const chartWidth = 680;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const getYieldX = (index: number) =>
    paddingX + (index / (yield14Days.length - 1)) * (chartWidth - paddingX * 2);

  const getYieldY = (yieldLiters: number) => {
    const ratio = (yieldLiters - minYield) / (maxYield - minYield);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  const pointsString = yield14Days
    .map((d, i) => `${getYieldX(i)},${getYieldY(d.yieldLiters)}`)
    .join(' ');

  const baselineY = getYieldY(selectedCattle.baselineMilk);

  // Temperature chart calculations
  const maxTemp = 41.5;
  const minTemp = 37.5;
  const getTempY = (temp: number) => {
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };
  const tempPointsString = currentTempSeries
    .map((d, i) => `${getYieldX(i)},${getTempY(d.temp)}`)
    .join(' ');
  const normalTempY = getTempY(38.5);

  const filterTimeline = timelineRecords.filter(
    (r) => r.cattleId === selectedCowId || r.cattleId === selectedCattle.id
  );

  return (
    <div className="space-y-6">
      {/* Header with Cattle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-stone-900 tracking-tight">
            Clinical Longitudinal Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            14-day production variance, thermal vitals tracking, and chronological intervention timeline
          </p>
        </div>

        {/* Cow Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#F8FAF7] p-1.5 rounded-xl border border-stone-200">
          {cattleList.map((cow) => (
            <button
              key={cow.id}
              type="button"
              onClick={() => setSelectedCowId(cow.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCowId === cow.id
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white'
              }`}
            >
              <img
                src={cow.photoUrl}
                alt={cow.name}
                className="w-5 h-5 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = champaCowPhoto;
                }}
              />
              <span>{cow.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({cow.breed})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: 14-Day Milk Yield Line Chart */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">14-Day Milk Yield Trend</h3>
                <p className="text-xs text-stone-500">
                  Daily recorded yield (L) vs 7-day rolling baseline
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block">Baseline</span>
              <span className="text-sm font-black text-[#166534]">{selectedCattle.baselineMilk} L</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 select-none">
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#166534" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Baseline reference line */}
              <line
                x1={paddingX}
                y1={baselineY}
                x2={chartWidth - paddingX}
                y2={baselineY}
                stroke="#166534"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              {/* Separate baseline label on the left to avoid overlapping today's value */}
              <g transform={`translate(${paddingX + 8}, ${baselineY - 18})`}>
                <rect x="0" y="0" width="105" height="15" rx="4" fill="#E8F8EE" stroke="#C6F1D5" />
                <text
                  x="52"
                  y="11"
                  textAnchor="middle"
                  className="text-[9px] font-extrabold fill-[#166534]"
                >
                  Baseline: {selectedCattle.baselineMilk} L
                </text>
              </g>

              {/* Area fill */}
              <polygon
                points={`${paddingX},${chartHeight - paddingY} ${pointsString} ${
                  chartWidth - paddingX
                },${chartHeight - paddingY}`}
                fill="url(#yieldGrad)"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#166534"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {/* Data points */}
              {yield14Days.map((d, i) => {
                const cx = getYieldX(i);
                const cy = getYieldY(d.yieldLiters);
                const isLatest = i === yield14Days.length - 1;
                const isDrop = d.yieldLiters < selectedCattle.baselineMilk - 1.0;
                return (
                  <g key={i}>
                    {isLatest && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={9}
                        className="fill-red-500/25 animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isLatest ? 6 : 3.5}
                      className={
                        isLatest
                          ? 'fill-red-600 stroke-white stroke-2'
                          : isDrop
                          ? 'fill-amber-600 stroke-white stroke-2'
                          : 'fill-[#166534] stroke-white stroke-2'
                      }
                    />
                    {/* Offset today's value label cleanly above final point */}
                    {isLatest && (
                      <g transform={`translate(${cx - 36}, ${cy - 22})`}>
                        <rect x="0" y="0" width="46" height="16" rx="4" fill="#FEF2F2" stroke="#FCA5A5" />
                        <text
                          x="23"
                          y="12"
                          textAnchor="middle"
                          className="text-[10px] font-black fill-red-700"
                        >
                          {d.yieldLiters} L
                        </text>
                      </g>
                    )}
                    {/* X-axis date labels */}
                    {(i === 0 || i === 4 || i === 8 || i === 13) && (
                      <text
                        x={cx}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        className="text-[9px] fill-stone-400 font-medium"
                      >
                        {d.date}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#166534] inline-block" />
              <span>Daily Recorded Milk</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t border-dashed border-[#166534] inline-block" />
              <span>7-Day Rolling Baseline</span>
            </span>
          </div>
        </div>

        {/* CHART 2: Body Temperature History */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Body Temperature History</h3>
                <p className="text-xs text-stone-500">
                  Thermal vitals (°C) vs Normal reference baseline (38.5°C)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block">Current Temp</span>
              <span className="text-sm font-black text-red-700">
                {currentTempSeries[currentTempSeries.length - 1].temp}°C
              </span>
            </div>
          </div>

          {/* SVG Temperature Chart */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 select-none">
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* 38.5°C Normal benchmark line */}
              <line
                x1={paddingX}
                y1={normalTempY}
                x2={chartWidth - paddingX}
                y2={normalTempY}
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {/* Separate benchmark label on left side to remove overlapping right labels */}
              <g transform={`translate(${paddingX + 8}, ${normalTempY - 18})`}>
                <rect x="0" y="0" width="95" height="15" rx="4" fill="#E8F8EE" stroke="#C6F1D5" />
                <text
                  x="47"
                  y="11"
                  textAnchor="middle"
                  className="text-[9px] font-extrabold fill-[#166534]"
                >
                  Normal: 38.5°C
                </text>
              </g>

              {/* Area fill */}
              <polygon
                points={`${paddingX},${chartHeight - paddingY} ${tempPointsString} ${
                  chartWidth - paddingX
                },${chartHeight - paddingY}`}
                fill="url(#tempGrad)"
              />

              {/* Temperature line */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={tempPointsString}
              />

              {/* Points */}
              {currentTempSeries.map((d, i) => {
                const cx = getYieldX(i);
                const cy = getTempY(d.temp);
                const isLatest = i === currentTempSeries.length - 1;
                const isFever = d.temp >= 39.2;
                return (
                  <g key={i}>
                    {isLatest && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        className="fill-red-600/25 animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isLatest ? 6.5 : isFever ? 4.5 : 3.5}
                      className={
                        isLatest
                          ? 'fill-red-600 stroke-white stroke-2 shadow-md'
                          : isFever
                          ? 'fill-red-500 stroke-white stroke-2'
                          : 'fill-stone-600 stroke-white stroke-2'
                      }
                    />
                    {/* Final point highlighted label */}
                    {isLatest ? (
                      <g transform={`translate(${cx - 36}, ${cy - 22})`}>
                        <rect x="0" y="0" width="48" height="16" rx="4" fill="#FEF2F2" stroke="#FCA5A5" />
                        <text
                          x="24"
                          y="12"
                          textAnchor="middle"
                          className="text-[10px] font-black fill-red-700"
                        >
                          {d.temp}°C
                        </text>
                      </g>
                    ) : isFever && i % 3 === 0 ? (
                      <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-red-700"
                      >
                        {d.temp}°
                      </text>
                    ) : null}
                    {/* X-axis date labels */}
                    {(i === 0 || i === 4 || i === 8 || i === 13) && (
                      <text
                        x={cx}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        className="text-[9px] fill-stone-400 font-medium"
                      >
                        {d.date}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span className="flex items-center gap-1.5 text-red-700 font-semibold">
              <span className="w-2.5 h-0.5 bg-red-600 inline-block" />
              <span>Core Body Temperature</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-0.5 border-t border-dashed border-emerald-600 inline-block" />
              <span>Normal Benchmark 38.5°C</span>
            </span>
          </div>
        </div>
      </div>

      {/* Health Event Timeline */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Health Event Timeline ({selectedCattle.name})
              </h3>
              <p className="text-xs text-stone-500">
                Chronological ledger of clinical checks, vaccinations, prescriptions, and field visits
              </p>
            </div>
          </div>
        </div>

        {/* Timeline items list */}
        <div className="space-y-3 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {filterTimeline.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              No timeline records found for this animal.
            </div>
          ) : (
            filterTimeline.map((item) => (
              <div key={item.id} className="flex items-start gap-4 relative pl-1">
                {/* Icon marker */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white ${
                    item.iconColor === 'green'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.iconColor === 'red'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.iconType === 'heart' && <Activity className="w-4 h-4" />}
                  {item.iconType === 'stethoscope' && <Stethoscope className="w-4 h-4" />}
                  {item.iconType === 'pill' && <Pill className="w-4 h-4" />}
                  {item.iconType === 'syringe' && <Syringe className="w-4 h-4" />}
                  {item.iconType === 'clipboard' && <ClipboardList className="w-4 h-4" />}
                </div>

                {/* Content Card */}
                <div className="flex-1 p-3.5 rounded-xl bg-[#F8FAF7] border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="text-[11px] text-stone-400 font-medium shrink-0 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{item.date}, {item.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
