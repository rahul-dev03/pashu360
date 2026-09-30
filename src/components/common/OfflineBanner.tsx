import React from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OfflineBannerProps {
  onOpenSync?: () => void;
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  onOpenSync,
  className = '',
}) => {
  const { isOffline, isOnline, pendingRecords, t } = useApp();

  if (!isOffline && pendingRecords.length === 0) return null;

  return (
    <div
      className={`mx-5 mb-3 p-3 rounded-2xl border transition-all ${
        isOffline
          ? 'bg-[#0B2319] text-white border-emerald-900/60 shadow-xs'
          : 'bg-[#E8F8EE] text-[#166534] border-[#C6F1D5]'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              isOffline ? 'bg-white/10 text-emerald-300' : 'bg-white text-[#166534]'
            }`}
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5" />
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold">
                {isOffline ? t.offline : t.online}
              </span>
              {pendingRecords.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                  {pendingRecords.length} {t.waitingCount}
                </span>
              )}
            </div>
            <p
              className={`text-[11px] leading-tight ${
                isOffline ? 'text-gray-300' : 'text-emerald-800'
              }`}
            >
              {isOffline
                ? t.recordsSafeOnPhone
                : t.recordsSynchronized}
            </p>
          </div>
        </div>

        {onOpenSync && (
          <button
            type="button"
            onClick={onOpenSync}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
              isOffline
                ? 'bg-white/15 hover:bg-white/25 text-white'
                : 'bg-white hover:bg-emerald-50 text-[#166534] border border-[#C6F1D5]'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.retrySync}</span>
          </button>
        )}
      </div>
    </div>
  );
};
