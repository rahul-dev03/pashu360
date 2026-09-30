import React, { useState } from 'react';
import {
  Radio,
  Search,
  Filter,
  Eye,
  ChevronRight,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import { CaseClinicalDetails } from '../data/paravetMockData';
import { HealthStatus } from '../../types';
import champaCowPhoto from '../../assets/images/champa_cow_portrait_1790444600765.jpg';
import farmerPhoto from '../../assets/images/farmer_rahul_avatar_1790603410179.jpg';

interface LiveReferralsViewProps {
  referrals: CaseClinicalDetails[];
  onSelectReferral: (referral: CaseClinicalDetails) => void;
}

export const LiveReferralsView: React.FC<LiveReferralsViewProps> = ({
  referrals,
  onSelectReferral,
}) => {
  const [filter, setFilter] = useState<'all' | 'Urgent' | 'Veterinary Review'>('all');
  const [search, setSearch] = useState('');

  const filtered = referrals.filter((r) => {
    const matchesFilter = filter === 'all' || r.riskLevel === filter;
    const matchesSearch =
      r.cattleName.toLowerCase().includes(search.toLowerCase()) ||
      r.tag.toLowerCase().includes(search.toLowerCase()) ||
      r.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      r.chiefComplaints.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#166534] animate-pulse" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Live AARVI Inbound Referrals
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Active veterinary case files automatically submitted by farmers across Karnal block
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              All ({referrals.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('Urgent')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'Urgent' ? 'bg-red-600 text-white font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              Urgent ({referrals.filter((r) => r.riskLevel === 'Urgent').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('Veterinary Review')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'Veterinary Review' ? 'bg-amber-600 text-white font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              Review ({referrals.filter((r) => r.riskLevel === 'Veterinary Review').length})
            </button>
          </div>
        </div>
      </div>

      {/* Referrals Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((ref) => (
          <div
            key={ref.id}
            onClick={() => onSelectReferral(ref)}
            className="p-6 rounded-[20px] bg-white border border-stone-200/90 shadow-xs hover:border-[#166534]/50 transition-all cursor-pointer space-y-4 group"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={ref.photoUrl}
                    alt={ref.cattleName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = champaCowPhoto;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#166534] transition-colors">
                      {ref.cattleName}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                      {ref.tag}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">({ref.breed})</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Ticket #{ref.id} • {ref.assignedClinic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    ref.riskLevel === 'Urgent'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {ref.riskLevel}
                </span>

                <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {ref.createdAt}
                </span>
              </div>
            </div>

            {/* Middle: Chief complaints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-stone-100 text-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Farmer Details
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300 shrink-0 bg-stone-100">
                    <img src={farmerPhoto} alt={ref.farmerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 leading-tight">{ref.farmerName}</p>
                    <p className="text-[11px] text-stone-500">{ref.location}</p>
                  </div>
                </div>
                <p className="text-stone-600 font-mono mt-1 text-[11px]">{ref.farmerPhone}</p>
              </div>

              <div className="md:col-span-2 p-3 rounded-xl bg-[#F8FAF7] border border-stone-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  AARVI Clinical Findings
                </span>
                <ul className="space-y-1">
                  {ref.chiefComplaints.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-stone-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono font-medium text-stone-500">
                {ref.vitalsSummary}
              </span>

              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-xs hover:bg-[#14532D] transition-all cursor-pointer"
              >
                <span>Open Complete Case File</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
