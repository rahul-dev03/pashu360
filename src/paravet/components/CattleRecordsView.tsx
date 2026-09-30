import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Heart,
  Calendar,
  Syringe,
  Filter,
} from 'lucide-react';
import { Cattle, HealthStatus } from '../../types';
import champaCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';

interface CattleRecordsViewProps {
  cattleList: Cattle[];
  onSelectCattle: (cattle: Cattle) => void;
}

export const CattleRecordsView: React.FC<CattleRecordsViewProps> = ({
  cattleList,
  onSelectCattle,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | HealthStatus>('all');

  const filtered = cattleList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.breed.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'Urgent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            Urgent
          </span>
        );
      case 'Veterinary Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Veterinary Review
          </span>
        );
      case 'Attention':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
            Attention
          </span>
        );
      case 'Healthy':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Healthy
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Registered Cattle Clinical Ledger
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete livestock medical records, lactation baselines, pregnancy stage, and vaccination history
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, tag or breed..."
              className="pl-8 pr-3 py-1.5 bg-[#F8FAF7] border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              All ({cattleList.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Healthy')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'Healthy' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              Healthy
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Attention')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'Attention' ? 'bg-yellow-600 text-white font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              Attention
            </button>
          </div>
        </div>
      </div>

      {/* Cattle Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cattle) => {
          const milkDiff = parseFloat((cattle.todayMilk - cattle.baselineMilk).toFixed(1));
          return (
            <div
              key={cattle.id}
              onClick={() => onSelectCattle(cattle)}
              className="p-6 rounded-[20px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/50 transition-all cursor-pointer space-y-4 group flex flex-col justify-between"
            >
              <div>
                {/* Photo & Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <img
                      src={cattle.photoUrl}
                      alt={cattle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = champaCowPhoto;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-[#166534] transition-colors truncate">
                        {cattle.name}
                      </h3>
                      {getStatusBadge(cattle.status)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <span className="font-mono font-medium text-stone-700">{cattle.tag}</span>
                      <span>•</span>
                      <span>{cattle.breed}</span>
                    </div>
                  </div>
                </div>

                {/* Vitals & Profile Details */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                    <span className="text-[10px] text-stone-400 block font-medium">Age & Stage</span>
                    <span className="font-semibold text-stone-800">{cattle.age}</span>
                    <span className="text-[11px] text-stone-500 block truncate">{cattle.pregnancy}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                    <span className="text-[10px] text-stone-400 block font-medium">Daily Milk Yield</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-bold text-stone-900 text-sm">{cattle.todayMilk} L</span>
                      <span className="text-[10px] text-stone-400">/ {cattle.baselineMilk} L</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        milkDiff < 0 ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {milkDiff > 0 ? `+${milkDiff} L` : `${milkDiff} L`}
                    </span>
                  </div>
                </div>

                {/* Vaccination notice */}
                <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2 text-xs text-stone-600">
                  <Syringe className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                  <span className="truncate">{cattle.vaccination}</span>
                </div>
              </div>

              {/* Bottom Last Check */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Last check: {cattle.lastHealthCheck.date}</span>
                <span className="text-[#166534] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
