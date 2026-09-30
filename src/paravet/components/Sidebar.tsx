import React from 'react';
import {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  CalendarDays,
  Syringe,
  BarChart3,
  Settings,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { PashuLogo } from '../../components/common/PashuLogo';

export type ParaVetTab =
  | 'dashboard'
  | 'referrals'
  | 'cattle'
  | 'appointments'
  | 'vaccination'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: ParaVetTab;
  onSelectTab: (tab: ParaVetTab) => void;
  onSwitchToFarmerApp: () => void;
  onSwitchToGovApp?: () => void;
  urgentCount: number;
  totalReferralsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onSwitchToFarmerApp,
  onSwitchToGovApp,
  urgentCount,
  totalReferralsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ParaVetTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'referrals' as ParaVetTab,
      label: 'Live Referrals',
      icon: Radio,
      badge: urgentCount > 0 ? `${urgentCount} Urgent` : `${totalReferralsCount}`,
      badgeColor: urgentCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'cattle' as ParaVetTab,
      label: 'Cattle Records',
      icon: FileSpreadsheet,
      badge: '3 Registered',
      badgeColor: 'bg-stone-100 text-stone-600',
    },
    {
      id: 'appointments' as ParaVetTab,
      label: 'Appointments',
      icon: CalendarDays,
      badge: '4 Today',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'vaccination' as ParaVetTab,
      label: 'Vaccination',
      icon: Syringe,
      badge: '2 Due Soon',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'analytics' as ParaVetTab,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as ParaVetTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col justify-between h-screen shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <PashuLogo size={30} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#166534] text-lg tracking-tight">Pashu360</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#166534]/10 text-[#166534] uppercase tracking-wider">
                  Para-Vet
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate max-w-[170px]">
                Karnal Block Polyclinic
              </p>
            </div>
          </div>

          <div className="mt-3.5 px-3 py-2 rounded-xl bg-[#F4F7F2] border border-[#E3ECE0] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-[#14532D]">
              AARVI Triage Link Active
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Clinical Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#166534] text-white shadow-sm font-semibold'
                    : 'text-stone-700 hover:bg-[#F8FAF7] hover:text-[#166534]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Doctor Profile + Switchers */}
      <div className="p-3.5 border-t border-stone-100 bg-[#FCFDFB] space-y-2">
        {/* Switch to Government Disease Intelligence Portal */}
        {onSwitchToGovApp && (
          <button
            type="button"
            onClick={onSwitchToGovApp}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#166534] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
            title="Open Government Disease Intelligence Portal"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Gov Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Switch to Farmer Mobile App button */}
        <button
          type="button"
          onClick={onSwitchToFarmerApp}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#166534] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
          title="Switch view to Farmer Mobile Application"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#166534]" />
            <span>Farmer Mobile App</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Para-Vet Profile card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-100 mt-1">
          <div className="w-9 h-9 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-stone-900 truncate">Dr. Satish Sharma</p>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[10px] text-stone-500 truncate">M.V.Sc • Karnal Central</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
