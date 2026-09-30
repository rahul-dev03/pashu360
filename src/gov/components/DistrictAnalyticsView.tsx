import React from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Layers,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { mockDistrictAnalytics } from '../data/govMockData';

export const DistrictAnalyticsView: React.FC = () => {
  const data = mockDistrictAnalytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              District Epidemiological & Production Analytics
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Cross-sectional analysis of morbidity distribution, bovine genetics, milk output, and triage velocity
          </p>
        </div>

        <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          Total Screened Herd: 6,110 Bovines
        </div>
      </div>

      {/* 2x2 Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Disease Distribution */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Active Disease Distribution</h3>
              <p className="text-xs text-stone-500">Morbidity breakdown of 131 active clinical cases</p>
            </div>
            <span className="text-xs font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Triage Monitored
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-4 rounded-full bg-stone-100 overflow-hidden flex border border-stone-200">
            {data.diseaseDistribution.map((d, i) => (
              <div
                key={i}
                style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                title={`${d.name}: ${d.percentage}% (${d.cases} cases)`}
                className="h-full transition-all hover:opacity-90"
              />
            ))}
          </div>

          {/* Disease List with counts and percentages */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.diseaseDistribution.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#F8FAF7] border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <div>
                    <span className="font-bold text-stone-900 block">{d.name}</span>
                    <span className="text-[10px] text-stone-500">{d.cases} cases</span>
                  </div>
                </div>
                <span className="font-black text-stone-900 text-sm">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Breed Distribution */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Bovine Breed Demographics</h3>
              <p className="text-xs text-stone-500">Indigenous indigenous vs crossbred dairy distribution</p>
            </div>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              6,110 Head
            </span>
          </div>

          <div className="space-y-2.5">
            {data.breedDistribution.map((b, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <div className="flex items-center gap-1.5">
                    <span>{b.breed}</span>
                    <span className="text-[10px] font-normal text-stone-400">
                      ({b.count.toLocaleString()} head)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500">Avg: {b.yieldAvg}</span>
                    <span className="font-black text-[#166534]">{b.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#166534] h-full rounded-full"
                    style={{ width: `${b.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: Milk Production Trend (6-Month Kilo-Litres) */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">6-Month Milk Production Trend</h3>
              <p className="text-xs text-stone-500">Monthly aggregate yield in Kilo-Litres (kL)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              1,110 kL (Sep 2026)
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full h-44 flex items-end justify-between gap-3 pt-4 px-2 select-none">
            {data.monthlyProductionTrend.map((m, i) => {
              const maxKilo = 1250;
              const heightPct = Math.round((m.yieldKiloLiters / maxKilo) * 100);
              const isSep = m.month === 'Sep';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-stone-600 font-mono">
                    {m.yieldKiloLiters}
                  </span>
                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                      isSep
                        ? 'bg-gradient-to-t from-[#166534] to-[#22C55E]'
                        : 'bg-stone-200 hover:bg-stone-300'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-bold text-stone-500 mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-500 border-t border-stone-100 pt-2 text-center">
            Peak yield observed in May (1,190 kL) with seasonal dip in July due to summer monsoon heat index.
          </p>
        </div>

        {/* CHART 4: Referral Volume by Village */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Referral Volume by Village</h3>
              <p className="text-xs text-stone-500">Inbound case files triggered through AARVI voice triage</p>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
              157 Total Referrals
            </span>
          </div>

          <div className="space-y-2.5">
            {data.referralVolumeByVillage.map((v, i) => {
              const maxRef = 50;
              const pct = (v.referrals / maxRef) * 100;
              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{v.village}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                          v.rate === 'Outbreak'
                            ? 'bg-red-100 text-red-800'
                            : v.rate === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {v.rate}
                      </span>
                      <span className="font-mono font-bold text-stone-800">
                        {v.referrals} referrals
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        v.rate === 'Outbreak'
                          ? 'bg-red-600'
                          : v.rate === 'High'
                          ? 'bg-amber-500'
                          : 'bg-[#166534]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
