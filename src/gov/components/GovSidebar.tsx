import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Syringe,
  Flame,
  PieChart,
  Truck,
  FileText,
  Building2,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Smartphone,
} from 'lucide-react';
import { PashuLogo } from '../../components/common/PashuLogo';

export type GovTab =
  | 'overview'
  | 'surveillance'
  | 'vaccination'
  | 'heat_stress'
  | 'analytics'
  | 'resources'
  | 'reports';

interface GovSidebarProps {
  activeTab: GovTab;
  onSelectTab: (tab: GovTab) => void;
  onSwitchToFarmerApp: () => void;
  onSwitchToParaVetApp: () => void;
  outbreakVillagesCount: number;
  isReportsBadgeUpdated?: boolean;
}

export const GovSidebar: React.FC<GovSidebarProps> = ({
  activeTab,
  onSelectTab,
  onSwitchToFarmerApp,
  onSwitchToParaVetApp,
  outbreakVillagesCount,
  isReportsBadgeUpdated = false,
}) => {
  const navItems = [
    {
      id: 'overview' as GovTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'surveillance' as GovTab,
      label: 'Disease Surveillance',
      icon: ShieldAlert,
      badge: outbreakVillagesCount > 0 ? `${outbreakVillagesCount} Outbreaks` : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
    },
    {
      id: 'vaccination' as GovTab,
      label: 'Vaccination Coverage',
      icon: Syringe,
      badge: '88.5%',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'heat_stress' as GovTab,
      label: 'Heat Stress Monitoring',
      icon: Flame,
      badge: 'THI 78.4',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'analytics' as GovTab,
      label: 'District Analytics',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'resources' as GovTab,
      label: 'Resource Allocation',
      icon: Truck,
      badge: '6 Villages',
      badgeColor: 'bg-stone-100 text-stone-600',
    },
    {
      id: 'reports' as GovTab,
      label: 'Reports',
      icon: FileText,
      badge: isReportsBadgeUpdated ? 'Updated' : '3 Ready',
      badgeColor: isReportsBadgeUpdated
        ? 'bg-emerald-600 text-white font-extrabold shadow-sm animate-pulse ring-2 ring-emerald-300'
        : 'bg-emerald-100 text-emerald-800',
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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-800 uppercase tracking-wider">
                  Gov Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate max-w-[170px]">
                Animal Husbandry Dept.
              </p>
            </div>
          </div>

          <div className="mt-3.5 px-3 py-2 rounded-xl bg-[#F4F7F2] border border-[#E3ECE0] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-[#14532D]">
              Karnal District HQ Live
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            District Intelligence
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

      {/* Bottom Section: Cross-Platform Switchers & Officer Card */}
      <div className="p-3.5 border-t border-stone-100 bg-[#FCFDFB] space-y-2">
        {/* Switch to Para-Vet Dashboard */}
        <button
          type="button"
          onClick={onSwitchToParaVetApp}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#166534] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
          title="Switch to Para-Vet Polyclinic Dashboard"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-[#166534]" />
            <span>Para-Vet Dashboard</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Switch to Farmer Mobile App */}
        <button
          type="button"
          onClick={onSwitchToFarmerApp}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#166534] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
          title="Switch view to Farmer Mobile App"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#166534]" />
            <span>Farmer Mobile App</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* District Officer Profile Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-100 mt-1">
          <div className="w-9 h-9 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-stone-900 truncate">Dr. R.K. Varma</p>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[10px] text-stone-500 truncate">Chief District Vet Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
