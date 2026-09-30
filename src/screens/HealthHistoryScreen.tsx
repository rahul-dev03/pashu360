import React, { useState } from 'react';
import { SlidersHorizontal, Milk } from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { StatusChip } from '../components/common/StatusChip';
import { TimelineItem } from '../components/common/TimelineItem';
import { PashuLogo } from '../components/common/PashuLogo';
import { useApp } from '../context/AppContext';
import { mockMilkYield14Days } from '../data/mockData';

interface HealthHistoryScreenProps {
  onBack: () => void;
}

export const HealthHistoryScreen: React.FC<HealthHistoryScreenProps> = ({
  onBack,
}) => {
  const { selectedCattle, timelineRecords, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'checks' | 'care'>('all');

  const filteredRecords = timelineRecords.filter((rec) => {
    if (rec.cattleId !== selectedCattle.id) return false;
    if (filter === 'all') return true;
    return rec.category === filter;
  });

  const milkData =
    mockMilkYield14Days[selectedCattle.id] || mockMilkYield14Days['gauri'];
  const avgYield = (
    milkData.reduce((acc, curr) => acc + curr.yieldLiters, 0) / milkData.length
  ).toFixed(1);

  // Find min and max for minimal sparkline height calculation
  const yields = milkData.map((d) => d.yieldLiters);
  const minYield = Math.min(...yields) * 0.9;
  const maxYield = Math.max(...yields) * 1.05;

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-20">
      <div>
        <AppHeader
          title={t.healthHistoryTitle}
          onBack={onBack}
          rightAction={
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80 shadow-2xs flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Filter"
              onClick={() => {
                setFilter((prev) =>
                  prev === 'all' ? 'checks' : prev === 'checks' ? 'care' : 'all'
                );
              }}
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
            </button>
          }
        />

        <div className="px-5 pt-1 space-y-4">
          {/* Selected Cattle Header Card */}
          <div className="bg-white rounded-[20px] p-3.5 border border-gray-100/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PashuLogo size={38} />
              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">
                  {selectedCattle.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {selectedCattle.breed} • {t.completeCareRecord}
                </p>
              </div>
            </div>
            <StatusChip status={selectedCattle.status} />
          </div>

          {/* Compact 14-Day Milk Yield History (Minimal Sparkline + List) */}
          <div className="bg-white rounded-[20px] p-4 border border-gray-100/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#166534]">
                  <Milk className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">
                  {t.milkYield14DayTitle}
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-[#166534] bg-[#E8F8EE] px-2 py-0.5 rounded-full border border-[#C6F1D5]">
                {t.averageYield}: {avgYield} {t.litersShort}
              </span>
            </div>

            {/* Minimal Sparkline Micro-Bars */}
            <div className="flex items-end justify-between gap-1 h-14 pt-2 px-1 border-b border-gray-100 pb-2">
              {milkData.map((item, index) => {
                const heightPercent = Math.max(
                  15,
                  Math.min(
                    100,
                    ((item.yieldLiters - minYield) / (maxYield - minYield)) * 100
                  )
                );
                const isLatest = index === milkData.length - 1;
                return (
                  <div
                    key={item.date}
                    className="flex flex-col items-center flex-1 group relative cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 hidden group-hover:flex bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap z-20">
                      {item.date}: {item.yieldLiters}L
                    </div>
                    <div
                      className={`w-full max-w-[14px] rounded-t-sm transition-all ${
                        isLatest
                          ? 'bg-[#166534]'
                          : 'bg-[#22C55E]/60 group-hover:bg-[#22C55E]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-gray-400 mt-1">
                      {item.dayShort}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Compact 3-day recent yield summary list */}
            <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 px-1">
              <span>
                {milkData[milkData.length - 3].date}:{' '}
                <strong className="text-gray-900">
                  {milkData[milkData.length - 3].yieldLiters} L
                </strong>
              </span>
              <span>
                {milkData[milkData.length - 2].date}:{' '}
                <strong className="text-gray-900">
                  {milkData[milkData.length - 2].yieldLiters} L
                </strong>
              </span>
              <span>
                {milkData[milkData.length - 1].date}:{' '}
                <strong className="text-[#166534]">
                  {milkData[milkData.length - 1].yieldLiters} L
                </strong>
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5]'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              {t.allRecords}
            </button>
            <button
              type="button"
              onClick={() => setFilter('checks')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filter === 'checks'
                  ? 'bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5]'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              {t.checks}
            </button>
            <button
              type="button"
              onClick={() => setFilter('care')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filter === 'care'
                  ? 'bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5]'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              {t.care}
            </button>
          </div>

          {/* Current Medical Timeline Section */}
          <div className="pt-2 px-1">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((item, idx) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  isLast={idx === filteredRecords.length - 1}
                />
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                No records found for this category
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
