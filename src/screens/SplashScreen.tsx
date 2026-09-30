import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { PashuLogo } from '../components/common/PashuLogo';

interface SplashScreenProps {
  onComplete: () => void;
  onSkipToHome?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onSkipToHome }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col justify-between bg-gradient-to-b from-[#0B2319] via-[#166534] to-[#0d2b1f] text-white overflow-hidden">
      <StatusBar dark />

      {/* Decorative subtle ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#22C55E]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Minimal Pashu360 Circular Identity */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center z-10">
        <div className="mb-5 transform transition-transform hover:scale-105 duration-300">
          <PashuLogo size={88} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1">
          <span>Pashu</span>
          <span className="text-[#4ADE80]">360</span>
        </h1>

        <p className="text-[11px] font-semibold text-emerald-100/90 mt-2 tracking-widest uppercase">
          Livestock Healthcare & Voice AI
        </p>

        <div className="mt-6 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] text-emerald-200">
          Intelligent Early Disease Warning • Offline-First
        </div>
      </div>

      {/* Bottom philosophy & action */}
      <div className="px-8 pb-10 z-10 text-center">
        <p className="text-xs text-emerald-200/70 italic mb-6">
          “Complexity inside the system. Simplicity for the farmer.”
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3.5 px-6 rounded-[18px] bg-[#22C55E] hover:bg-[#16a34a] active:scale-98 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onSkipToHome && (
            <button
              type="button"
              onClick={onSkipToHome}
              className="text-xs text-emerald-300/80 hover:text-white underline py-1"
            >
              Skip to Farm Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
