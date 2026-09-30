import React from 'react';
import { MapPin, Phone, Globe, Shield, RefreshCw, LogOut, Check, Navigation, Ambulance } from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { PashuLogo } from '../components/common/PashuLogo';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import farmerPhoto from '../assets/images/farmer_rahul_avatar_1790603410179.jpg';

interface FarmerProfileScreenProps {
  onLogout: () => void;
  onOpenSync: () => void;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  onLogout,
  onOpenSync,
}) => {
  const { language, setLanguage, pendingRecords, farmer, vetReferrals, t } = useApp();

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hi', label: 'Hindi' },
    { code: 'en', label: 'English' },
    { code: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-20">
      <div>
        <AppHeader title={t.profileTab} backIcon="none" />

        <div className="px-5 pt-2 space-y-4">
          {/* Farmer Card */}
          <div className="bg-white rounded-[22px] p-4.5 border border-gray-100 shadow-2xs flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#166534] shadow-xs shrink-0 bg-stone-100">
              <img
                src={farmer.photoUrl || farmerPhoto}
                alt="राहुल यादव"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                राहुल यादव
              </h2>
              {/* Profile Data: Karnal, Haryana */}
              <div className="flex items-center space-x-1.5 text-xs text-gray-600 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                <span>Karnal, Haryana</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-medium mt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                <span>+91 {farmer.phone}</span>
              </div>
            </div>
            <PashuLogo size={36} />
          </div>

          {/* Stored Location & Device Coordinates */}
          <div className="bg-white rounded-[20px] p-3.5 border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#166534]" />
                <span>Device Location & Para-Vet Lookup</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  farmer.locationStatus === 'detected'
                    ? 'bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {farmer.locationStatus === 'detected' ? 'Active' : t.locationUnavailable}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-gray-500 space-y-0.5">
              <div>
                Location:{' '}
                <strong className="text-gray-800">
                  Karnal, Haryana
                </strong>
              </div>
              <div>
                GPS Coordinates:{' '}
                <strong className="text-gray-800">
                  {farmer.locationCoords
                    ? `${farmer.locationCoords.lat.toFixed(4)}° N, ${farmer.locationCoords.lng.toFixed(4)}° E`
                    : t.locationUnavailable}
                </strong>
              </div>
            </div>
          </div>

          {/* Active Vet Referrals Object Section (RULE 9) */}
          {vetReferrals.length > 0 && (
            <div className="bg-white rounded-[20px] p-4 border border-red-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-red-700 font-bold text-xs uppercase tracking-wide">
                  <Ambulance className="w-4 h-4" />
                  <span>Dispatched Vet Referrals ({vetReferrals.length})</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Visible to Vet
                </span>
              </div>
              <div className="space-y-2 mt-2">
                {vetReferrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 text-xs text-gray-800"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>
                        {ref.cattleName} ({ref.breed})
                      </span>
                      <span className="text-[10px] font-bold text-red-600">
                        #{ref.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                      {ref.vitalsSummary}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-500">
                      <span>{ref.assignedClinic}</span>
                      <span className="font-semibold text-emerald-700">
                        Status: {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offline Sync Status Card */}
          <div
            onClick={onOpenSync}
            className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-200 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F8EE] text-[#166534] flex items-center justify-center border border-[#C6F1D5]">
                <RefreshCw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t.offlineSyncTitle}</h4>
                <p className="text-xs text-gray-500">
                  {pendingRecords.length > 0
                    ? `${pendingRecords.length} ${t.waitingCount}`
                    : t.recordsSynchronized}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#166534] underline">{t.viewCattle}</span>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-2xs">
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="w-4 h-4 text-[#166534]" />
              <h3 className="text-xs font-bold text-gray-800 tracking-tight uppercase">
                {t.chooseLanguage}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-center space-x-1 ${
                    language === l.code
                      ? 'bg-[#E8F8EE] text-[#166534] border border-[#22C55E] font-bold shadow-2xs'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{l.label}</span>
                  {language === l.code && <Check className="w-3 h-3 text-[#166534]" />}
                </button>
              ))}
            </div>
          </div>

          {/* System & Architecture Info */}
          <div className="bg-[#E8F8EE] rounded-[20px] p-4 border border-[#C6F1D5] shadow-2xs text-xs">
            <div className="flex items-center space-x-2 text-[#166534] font-bold mb-1">
              <Shield className="w-4 h-4 stroke-[2.2]" />
              <span>Pashu360 Architecture</span>
            </div>
            <p className="text-emerald-950/80 leading-relaxed font-normal">
              SIH MVP Foundation • Offline-First Edge Inferencing • Zero technical friction for farmers.
            </p>
          </div>

          {/* Logout Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-[18px] bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Farmer / Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
