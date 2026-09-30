import React, { useState } from 'react';
import { X, Check, MapPin, Loader2 } from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { PashuLogo } from '../components/common/PashuLogo';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onClose?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onClose }) => {
  const { language, setLanguage, setIsLoggedIn, t, requestLocationPermission, isLocationLoading, farmer } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [otp] = useState('482910');
  const [isResent, setIsResent] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const handleContinue = () => {
    // Request location permission after OTP verification
    setShowLocationDialog(true);
    requestLocationPermission(() => {
      setTimeout(() => {
        setIsLoggedIn(true);
        setShowLocationDialog(false);
        onLoginSuccess();
      }, 700);
    });
  };

  const handleResend = () => {
    setIsResent(true);
    setTimeout(() => setIsResent(false), 2500);
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hi', label: 'Hindi' },
    { code: 'en', label: 'English' },
    { code: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 relative">
      <div>
        <StatusBar />

        <div className="px-6 pt-4 pb-2">
          {/* Top row with circular PashuLogo and close button */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose || onLoginSuccess}
              className="w-11 h-11 rounded-2xl bg-[#166534] hover:bg-[#14532D] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Official circular Pashu360 logo */}
            <PashuLogo size={38} />
          </div>

          {/* Header Typography with dynamic localization */}
          <div className="mb-6">
            <span className="text-xs font-bold text-[#166534] tracking-wider uppercase">
              PASHU360
            </span>
            <h1 className="text-[26px] font-bold text-gray-900 leading-[1.2] mt-1.5 tracking-tight">
              {t.loginWelcome}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {t.loginSubtitle}
            </p>
          </div>

          {/* Form Fields Container */}
          <div className="space-y-4">
            {/* Mobile number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t.mobileNumberLabel}
              </label>
              <div className="flex items-center bg-white border border-gray-200/90 rounded-[14px] px-3.5 py-3 shadow-2xs focus-within:border-[#166534] focus-within:ring-1 focus-within:ring-[#166534] transition-all">
                <span className="text-sm font-semibold text-gray-900 pr-3 border-r border-gray-200">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-3 text-sm font-medium text-gray-900 outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* OTP Field with 6 dots */}
            <div>
              <div className="flex items-center justify-between bg-white border border-gray-200/90 rounded-[14px] px-4 py-3 shadow-2xs">
                <div className="flex items-center space-x-3 tracking-[0.4em] text-lg font-bold text-gray-800">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-semibold text-[#166534] hover:underline cursor-pointer"
                >
                  {isResent ? t.otpResent : t.resendOtp}
                </button>
                <span className="text-[11px] text-gray-400">{t.validFor} 02:45</span>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <PrimaryButton onClick={handleContinue} disabled={isLocationLoading}>
                {isLocationLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.requestingLocation}</span>
                  </span>
                ) : (
                  t.continueSecurely
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector at bottom - fully functional across the entire app */}
      <div className="px-6 pb-8 pt-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2.5">
          {t.chooseLanguage}
        </label>
        <div className="space-y-2">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`w-full py-3 px-4 rounded-[14px] text-sm font-medium text-center transition-all cursor-pointer flex items-center justify-center relative ${
                  isSelected
                    ? 'bg-[#E8F8EE] border border-[#22C55E] text-[#166534] font-semibold shadow-2xs'
                    : 'bg-white border border-gray-200/90 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#166534] absolute right-4 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Permission Feedback Overlay */}
      {showLocationDialog && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs text-center border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-[#E8F8EE] text-[#166534] flex items-center justify-center mx-auto mb-3 border border-[#C6F1D5]">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {t.locationPermissionTitle}
            </h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {t.locationPermissionDesc}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#166534]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.requestingLocation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
