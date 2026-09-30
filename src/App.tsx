/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CattleProfileScreen } from './screens/CattleProfileScreen';
import { VoiceScreen } from './screens/VoiceScreen';
import { HealthResultScreen } from './screens/HealthResultScreen';
import { HealthHistoryScreen } from './screens/HealthHistoryScreen';
import { OfflineSyncScreen } from './screens/OfflineSyncScreen';
import { FarmerProfileScreen } from './screens/FarmerProfileScreen';
import { BottomNavigation, NavTab } from './components/common/BottomNavigation';
import { Cattle, HealthStatus } from './types';
import { Smartphone, Monitor, RotateCcw, Stethoscope, Building2 } from 'lucide-react';
import { PashuLogo } from './components/common/PashuLogo';
import { ParaVetApp } from './paravet/ParaVetApp';
import { GovApp } from './gov/GovApp';

export type ScreenId =
  | 'splash'
  | 'login'
  | 'home'
  | 'cattle-profile'
  | 'voice'
  | 'result'
  | 'history'
  | 'sync'
  | 'profile';

export type AppViewMode = 'farmer' | 'paravet' | 'gov';

function MainApp() {
  const { isLoggedIn, setIsLoggedIn, selectedCattle, setSelectedCattleId, cattleList } = useApp();
  const [appView, setAppView] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#gov') return 'gov';
      if (window.location.hash === '#paravet') return 'paravet';
    }
    return 'farmer';
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [historyStack, setHistoryStack] = useState<ScreenId[]>(['home']);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Sync tab with screen
  useEffect(() => {
    if (currentScreen === 'home') setActiveTab('home');
    else if (currentScreen === 'voice') setActiveTab('aarvi');
    else if (currentScreen === 'history') setActiveTab('history');
    else if (currentScreen === 'profile') setActiveTab('profile');
  }, [currentScreen]);

  const navigateTo = (screen: ScreenId) => {
    setHistoryStack((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        navigateTo('home');
        break;
      case 'aarvi':
        navigateTo('voice');
        break;
      case 'history':
        navigateTo('history');
        break;
      case 'profile':
        navigateTo('profile');
        break;
    }
  };

  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'history' ||
    currentScreen === 'profile';

  if (appView === 'gov') {
    return (
      <GovApp
        onSwitchToFarmerApp={() => setAppView('farmer')}
        onSwitchToParaVetApp={() => setAppView('paravet')}
      />
    );
  }

  if (appView === 'paravet') {
    return (
      <ParaVetApp
        onSwitchToFarmerApp={() => setAppView('farmer')}
        onSwitchToGovApp={() => setAppView('gov')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2EB] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 relative">
      {/* Top Demo Toolbar for judges & reviewers */}
      <header className="w-full max-w-6xl mb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-xs px-4 py-2.5 hidden sm:flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <PashuLogo size={24} />
          <span className="font-bold text-[#166534] text-sm">Pashu360</span>
          <span className="text-gray-400">|</span>
          <span className="font-semibold text-gray-700">Portals:</span>
        </div>

        {/* View Switcher: Farmer vs Para-Vet vs Gov */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setAppView('farmer')}
            className="px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all bg-white text-stone-900 shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#166534]" />
            <span>Farmer App</span>
          </button>
          <button
            type="button"
            onClick={() => setAppView('paravet')}
            className="px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all text-stone-600 hover:text-stone-900"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#166534]" />
            <span>Para-Vet</span>
          </button>
          <button
            type="button"
            onClick={() => setAppView('gov')}
            className="px-3 py-1 rounded-lg font-bold bg-[#14532D] text-white shadow-2xs flex items-center gap-1.5 hover:bg-[#0f3d20] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-red-400" />
            <span>Gov Intelligence</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse ml-0.5" />
          </button>
        </div>

        {/* Quick Screen Switcher Buttons for Farmer App */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'splash' as ScreenId, label: '1. Splash' },
            { id: 'login' as ScreenId, label: '2. Login' },
            { id: 'home' as ScreenId, label: '3. Home' },
            { id: 'cattle-profile' as ScreenId, label: '4. Profile' },
            { id: 'voice' as ScreenId, label: '5. AARVI' },
            { id: 'result' as ScreenId, label: '6. Result' },
            { id: 'history' as ScreenId, label: '7. History' },
            { id: 'sync' as ScreenId, label: '8. Sync' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentScreen === item.id
                  ? 'bg-[#166534] text-white shadow-2xs font-bold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Toggle Frame View */}
        <div className="flex items-center space-x-1 border-l border-gray-200 pl-3">
          <button
            type="button"
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            title="Toggle device frame"
          >
            {isDeviceFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentScreen('home');
              setHistoryStack(['home']);
            }}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            title="Reset to Home"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Portal Switcher Pills on mobile: floats 8-12px ABOVE bottom navigation */}
      <div
        className={`fixed right-3.5 z-40 flex items-center gap-1.5 sm:hidden transition-all duration-200 ${
          showBottomNav
            ? 'bottom-[calc(76px+env(safe-area-inset-bottom,0px))]'
            : 'bottom-[calc(16px+env(safe-area-inset-bottom,0px))]'
        }`}
      >
        <button
          type="button"
          onClick={() => setAppView('paravet')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#166534] hover:bg-[#14532D] text-white font-bold text-[11px] shadow-xl border border-emerald-400/30 transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          title="Switch to Para-Vet Portal"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Para-Vet</span>
        </button>
        <button
          type="button"
          onClick={() => setAppView('gov')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14532D] hover:bg-[#0f3d20] text-white font-bold text-[11px] shadow-xl border border-emerald-400/30 transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          title="Switch to Government Intelligence Portal"
        >
          <Building2 className="w-3.5 h-3.5 text-red-300" />
          <span>Gov Portal</span>
        </button>
      </div>

      {/* Mobile Device Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrame
            ? 'sm:max-w-[412px] sm:h-[860px] sm:rounded-[36px] sm:shadow-[0_25px_60px_-15px_rgba(22,101,52,0.25)] sm:border-[8px] sm:border-gray-900 overflow-hidden'
            : 'max-w-md h-screen'
        } bg-[#F8FAF7] relative flex flex-col justify-between`}
      >
        {/* Active Screen View */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {currentScreen === 'splash' && (
            <SplashScreen
              onComplete={() => navigateTo('login')}
              onSkipToHome={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              onLoginSuccess={() => navigateTo('home')}
              onClose={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              onSelectCattle={(cattle: Cattle) => {
                setSelectedCattleId(cattle.id);
                navigateTo('cattle-profile');
              }}
              onStartVoice={() => navigateTo('voice')}
              onOpenSync={() => navigateTo('sync')}
            />
          )}

          {currentScreen === 'cattle-profile' && (
            <CattleProfileScreen
              onBack={handleBack}
              onStartHealthCheck={() => navigateTo('voice')}
              onViewHistory={() => navigateTo('history')}
            />
          )}

          {currentScreen === 'voice' && (
            <VoiceScreen
              onClose={handleBack}
              onNavigateToResult={(risk?: HealthStatus) => navigateTo('result')}
            />
          )}

          {currentScreen === 'result' && (
            <HealthResultScreen
              onBack={handleBack}
              onContactVet={() => navigateTo('history')}
              onSaveRecord={() => navigateTo('history')}
            />
          )}

          {currentScreen === 'history' && (
            <HealthHistoryScreen onBack={handleBack} />
          )}

          {currentScreen === 'sync' && (
            <OfflineSyncScreen onBack={handleBack} />
          )}

          {currentScreen === 'profile' && (
            <FarmerProfileScreen
              onLogout={() => {
                setIsLoggedIn(false);
                navigateTo('login');
              }}
              onOpenSync={() => navigateTo('sync')}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation for main tabs */}
        {showBottomNav && (
          <div className="sticky bottom-0 left-0 right-0 z-30">
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
