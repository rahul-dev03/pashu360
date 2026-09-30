import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  ChevronRight,
  CalendarCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ParaVetAppointment } from '../data/paravetMockData';
import farmerPhoto from '../../assets/images/farmer_rahul_avatar_1790603410179.jpg';

interface AppointmentsViewProps {
  onOpenCaseByReferralId?: (refId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenCaseByReferralId,
}) => {
  const { paravetAppointments, dispatchAppointment, markCaseVisitedAndTreated } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'en_route' | 'completed'>('all');

  const filtered = paravetAppointments.filter((apt) => {
    if (activeFilter === 'all') return true;
    return apt.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Para-Vet Field Visits & Mobile Dispensary
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Today's scheduled on-farm clinical visits, CMT screening, and mobile ambulance dispatch route
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'all' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
            }`}
          >
            All ({paravetAppointments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('en_route')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'en_route' ? 'bg-[#166534] text-white font-bold shadow-2xs' : 'text-stone-600'
            }`}
          >
            En Route
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('scheduled')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'scheduled' ? 'bg-amber-600 text-white font-bold shadow-2xs' : 'text-stone-600'
            }`}
          >
            Scheduled
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'completed' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-stone-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="p-6 rounded-[20px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/40 transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F4F7F2] text-[#166534] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E3ECE0]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">{apt.timeSlot}</span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs font-semibold text-stone-700">{apt.date}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        apt.urgency === 'Immediate'
                          ? 'bg-red-100 text-red-800'
                          : apt.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {apt.urgency}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    {apt.purpose}
                  </h3>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    apt.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'en_route'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {apt.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {apt.status === 'en_route' && <Truck className="w-3.5 h-3.5" />}
                  {apt.status === 'scheduled' && <Clock className="w-3.5 h-3.5" />}
                  <span className="capitalize">{apt.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Animal</span>
                <p className="font-bold text-stone-900 mt-0.5">{apt.cattleName}</p>
                <p className="text-stone-500 font-mono text-[11px]">{apt.tag} • {apt.breed}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Farmer & Location</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300 shrink-0 bg-stone-100">
                    <img src={farmerPhoto} alt={apt.farmerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 leading-tight">{apt.farmerName}</p>
                    <p className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#166534]" />
                      {apt.village}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Assigned Unit</span>
                <p className="font-semibold text-stone-800 mt-0.5">{apt.assignedOfficer}</p>
                <p className="text-stone-500 text-[11px] font-mono mt-0.5">{apt.farmerPhone}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              {apt.referralId ? (
                <button
                  type="button"
                  onClick={() => onOpenCaseByReferralId?.(apt.referralId!)}
                  className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Linked AARVI Referral #{apt.referralId}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-xs text-stone-400">Routine scheduled block visit</span>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${apt.farmerPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer</span>
                </a>

                {apt.status === 'scheduled' && (
                  <button
                    type="button"
                    onClick={() => dispatchAppointment(apt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch (En Route)</span>
                  </button>
                )}

                {apt.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() =>
                      markCaseVisitedAndTreated(
                        apt.referralId || 'REF-2026-8196',
                        `Field visit completed by ${apt.assignedOfficer} • Clinical treatment and booster administered`
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Visited & Treated</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
