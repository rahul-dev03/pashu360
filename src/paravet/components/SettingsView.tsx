import React, { useState } from 'react';
import {
  Settings,
  Building,
  User,
  Bell,
  Shield,
  Download,
  Database,
  Radio,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();
  const [officerName, setOfficerName] = useState('Dr. Satish Sharma');
  const [clinicName, setClinicName] = useState('Karnal Block Polyclinic & Hospital');
  const [urgentThreshold, setUrgentThreshold] = useState('2.5 L drop / >40°C');
  const [ambulanceHotline, setAmbulanceHotline] = useState('1962');
  const [autoSmsAlerts, setAutoSmsAlerts] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      showToast('Configuration Saved: Preferences updated across clinics', 'success');
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 700);
  };

  const handleExportCsv = () => {
    if (isExportingCsv) return;
    setIsExportingCsv(true);
    setTimeout(() => {
      setIsExportingCsv(false);
      showToast('Block Ledger Exported: karnal_clinical_records.csv', 'success');
    }, 850);
  };

  const handleGeneratePdf = () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      showToast('Report Generated: karnal_nadcp_summary.pdf', 'success');
    }, 950);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Para-Vet Polyclinic Configuration
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational triage parameters, emergency dispatch contacts, and clinical integration rules
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Preferences Saved
          </span>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Clinical Officer Profile */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#166534]" />
            <span>Designated Veterinary Officer</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-600 font-bold block mb-1">Officer Name & Title</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="text-stone-600 font-bold block mb-1">Hospital / Polyclinic</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-stone-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AARVI Triage & Inbound Referral Thresholds */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#166534]" />
            <span>AARVI Voice Triage Integration</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF7] border border-stone-100">
              <div>
                <p className="font-bold text-stone-900">Automatic SMS Alert to On-Duty Para-Vet</p>
                <p className="text-[11px] text-stone-500">
                  Sends automated SMS with farmer GPS coordinates when AARVI flags an Urgent case
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoSmsAlerts}
                onChange={(e) => setAutoSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-[#166534] rounded-sm cursor-pointer accent-[#166534]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-600 font-bold block mb-1">Emergency Ambulance Line</label>
                <input
                  type="text"
                  value={ambulanceHotline}
                  onChange={(e) => setAmbulanceHotline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-stone-900 font-medium"
                />
              </div>
              <div>
                <label className="text-stone-600 font-bold block mb-1">Urgent Escalation Trigger</label>
                <input
                  type="text"
                  value={urgentThreshold}
                  onChange={(e) => setUrgentThreshold(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-200 text-stone-900 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Export & Offline Backup */}
        <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-3 text-xs">
          <h2 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#166534]" />
            <span>Block Data Export & Reports</span>
          </h2>
          <p className="text-stone-500">
            Export anonymized block epidemiological reports and vaccination coverage audits for district commissioner.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExportingCsv}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExportingCsv ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
                  <span>Exporting CSV...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate PDF Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Configuration...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
