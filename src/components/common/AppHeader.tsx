import React, { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { StatusBar } from './StatusBar';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  backIcon?: 'arrow' | 'close' | 'none';
  rightAction?: ReactNode;
  dark?: boolean;
  transparent?: boolean;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backIcon = 'arrow',
  rightAction,
  dark = false,
  transparent = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${transparent ? 'bg-transparent' : dark ? 'bg-[#0B2319]' : 'bg-[#F8FAF7]'} ${className}`}>
      <StatusBar dark={dark} />
      <div className="px-5 py-2.5 flex items-center justify-between min-h-[52px]">
        {/* Left Action / Back */}
        <div className="w-10 flex items-center">
          {backIcon !== 'none' && onBack && (
            <button
              onClick={onBack}
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                dark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200/70 shadow-2xs'
              }`}
              aria-label="Back"
            >
              {backIcon === 'close' ? (
                <X className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>
          )}
        </div>

        {/* Center Title & Subtitle */}
        <div className="flex-1 text-center px-2">
          {title && (
            <h1
              className={`text-base font-semibold tracking-tight ${
                dark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={`text-xs mt-0.5 ${dark ? 'text-emerald-300/80' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Action */}
        <div className="w-10 flex items-center justify-end">
          {rightAction ? (
            <div className="flex items-center justify-center">{rightAction}</div>
          ) : (
            <div className="w-9 h-9" />
          )}
        </div>
      </div>
    </div>
  );
};
