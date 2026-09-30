import React from 'react';
import {
  WifiOff,
  Clock,
  CheckCircle2,
  RefreshCw,
  Wifi,
} from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { StatusChip } from '../components/common/StatusChip';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useApp } from '../context/AppContext';

interface OfflineSyncScreenProps {
  onBack: () => void;
}

export const OfflineSyncScreen: React.FC<OfflineSyncScreenProps> = ({ onBack }) => {
  const {
    isOffline,
    isOnline,
    pendingRecords,
    syncedRecords,
    isSyncing,
    retrySync,
    t,
  } = useApp();

  return (
    <div className="w-full h-full min-h-[700px] flex flex-col justify-between bg-[#F8FAF7] text-gray-900 pb-16">
      <div>
        {/* Header without the settings toggle button */}
        <AppHeader
          title={t.offlineSyncTitle}
          onBack={onBack}
        />

        <div className="px-5 pt-1 space-y-4">
          {/* Main Network & Sync Card - Displays automatic state */}
          <div className="bg-[#166534] rounded-[22px] p-5 text-white shadow-sm relative overflow-hidden">
            {/* Ambient decorative glow */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#22C55E]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-3">
              {isOffline ? (
                <WifiOff className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Wifi className="w-5 h-5 stroke-[2.2] text-[#86EFAC]" />
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight">
              {isOffline ? t.youAreOffline : t.online}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              {isOffline
                ? t.recordsSafeOnPhone
                : t.recordsSynchronized}
            </p>

            {pendingRecords.length > 0 ? (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold shadow-xs">
                {pendingRecords.length} {t.pending}
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold shadow-xs">
                {t.recordsSynchronized}
              </div>
            )}

            <p className="text-xs text-emerald-200/80 font-normal mt-3 leading-relaxed">
              {t.syncAutoNotice}
            </p>
          </div>

          {/* Pending records section */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                {t.pendingRecords}
              </h3>
              <span className="text-xs font-medium text-amber-600">
                {pendingRecords.length} {t.waitingCount}
              </span>
            </div>

            {pendingRecords.length > 0 ? (
              <div className="space-y-2.5">
                {pendingRecords.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[18px] p-3.5 border border-gray-100/90 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">
                          {item.cattleName} • {item.recordType}
                        </h4>
                        <span className="text-[11px] text-gray-500 font-normal">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                    <StatusChip status="Pending" />
                  </div>
                ))}

                {/* Retry sync CTA button */}
                <div className="pt-2">
                  <PrimaryButton
                    onClick={retrySync}
                    disabled={isSyncing}
                    icon={
                      <RefreshCw
                        className={`w-4 h-4 stroke-[2.2] ${isSyncing ? 'animate-spin' : ''}`}
                      />
                    }
                  >
                    {isSyncing ? t.syncingRecords : t.retrySync}
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-[18px] border border-gray-100 text-center text-xs text-gray-500">
                {t.noPendingRecords}
              </div>
            )}
          </div>

          {/* Recently synced section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                {t.recentlySynced}
              </h3>
              <span className="text-xs font-medium text-gray-500">{t.allSafe}</span>
            </div>

            <div className="space-y-2.5">
              {syncedRecords.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[18px] p-3.5 border border-gray-100/90 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-500 font-normal">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                  <StatusChip status="Synced" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
