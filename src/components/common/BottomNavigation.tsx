import React from 'react';
import { Home, Mic, Clock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 'home' | 'aarvi' | 'history' | 'profile' | 'sync';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const { t } = useApp();

  const tabs = [
    { id: 'home' as NavTab, label: t.homeTab, icon: Home },
    { id: 'aarvi' as NavTab, label: t.aarviTab, icon: Mic },
    { id: 'history' as NavTab, label: t.historyTab, icon: Clock },
    { id: 'profile' as NavTab, label: t.profileTab, icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`w-full bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#166534]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.4] scale-105' : 'stroke-[1.8]'
                }`}
              />
              {tab.id === 'aarvi' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22C55E] ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span
              className={`text-[11px] mt-1 font-medium tracking-tight ${
                isActive ? 'font-semibold text-[#166534]' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
