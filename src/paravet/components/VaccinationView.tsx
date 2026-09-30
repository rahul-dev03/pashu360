import React, { useState } from 'react';
import {
  Syringe,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  Clock,
  ShieldCheck,
  Building,
  Download,
} from 'lucide-react';
import { ParaVetVaccinationRecord } from '../data/paravetMockData';
import { useApp } from '../../context/AppContext';

export const VaccinationView: React.FC = () => {
  const { paravetVaccinations, logVaccineDose, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ParaVetVaccinationRecord | null>(null);
  const [administeredBatch, setAdministeredBatch] = useState('FMD-26-92C');

  const filtered = paravetVaccinations.filter(
    (v) =>
      v.cattleName.toLowerCase().includes(search.toLowerCase()) ||
      v.tag.toLowerCase().includes(search.toLowerCase()) ||
      v.vaccineName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdminister = (record: ParaVetVaccinationRecord) => {
    setSelectedRecord(record);
    setShowLogModal(true);
  };

  const handleConfirmAdminister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    logVaccineDose(selectedRecord.id, administeredBatch);
    setShowLogModal(false);
  };

  const handleExportCSV = () => {
    try {
      const headers = "Record ID,Cattle Name,Tag,Breed,Farmer Name,Village,Vaccine Name,Last Given Date,Next Due Date,Status,Batch Number\n";
      const rows = paravetVaccinations
        .map(
          (v) =>
            `"${v.id}","${v.cattleName}","${v.tag}","${v.breed}","${v.farmerName}","${v.village}","${v.vaccineName}","${v.lastGivenDate}","${v.nextDueDate}","${v.status}","${v.batchNumber}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NADCP_Vaccination_Ledger_2026.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Vaccination CSV Exported successfully', 'success');
    } catch (err) {
      console.warn('Export error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Immunization Ledger & Ring Vaccination
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            National Animal Disease Control Programme (NADCP) tracking for FMD, Brucellosis, HS, and BQ
          </p>
        </div>

        {/* Actions: Export CSV & Search */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-[#166534] text-stone-700 hover:text-white border border-stone-200 hover:border-[#166534] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Download full vaccination ledger as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by animal or vaccine..."
              className="pl-8 pr-3 py-1.5 bg-[#F8FAF7] border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Vaccination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((vax) => (
          <div
            key={vax.id}
            className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4 hover:border-[#166534]/40 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Target Disease Vaccine
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-0.5">{vax.vaccineName}</h3>
                <p className="text-xs text-stone-500 font-mono">Batch: {vax.batchNumber}</p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  vax.status === 'due_soon'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : vax.status === 'overdue'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {vax.status === 'due_soon'
                  ? 'Due Soon'
                  : vax.status === 'overdue'
                  ? 'Overdue'
                  : 'Up to Date'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 block font-medium">Animal</span>
                <span className="font-bold text-stone-900">{vax.cattleName}</span>
                <span className="text-[10px] text-stone-500 font-mono block">
                  {vax.tag} • {vax.breed}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 block font-medium">Farmer & Block</span>
                <span className="font-bold text-stone-900">{vax.farmerName}</span>
                <span className="text-[10px] text-stone-500 block">{vax.village} Block</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-stone-100">
                <span className="text-[10px] text-stone-400 block font-medium">Last Given</span>
                <span className="font-semibold text-stone-800">{vax.lastGivenDate}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] text-amber-700 block font-medium">Next Due Date</span>
                <span className="font-bold text-amber-900">{vax.nextDueDate}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-[11px] text-stone-400">NADCP Cold Chain Verified</span>
              <button
                type="button"
                onClick={() => handleAdminister(vax)}
                className="px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Log Administration Dose
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Log Administration Modal */}
      {showLogModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[20px] p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                Record Vaccine: {selectedRecord.vaccineName}
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Administering dose to <span className="font-bold">{selectedRecord.cattleName}</span> ({selectedRecord.tag}) for farmer {selectedRecord.farmerName}.
            </p>

            <form onSubmit={handleConfirmAdminister} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-600 block mb-1">
                  Vaccine Batch Number
                </label>
                <input
                  type="text"
                  value={administeredBatch}
                  onChange={(e) => setAdministeredBatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAF7] border border-stone-200 font-mono text-xs"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next immunity booster will automatically recalculate to 6 months later.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#166534] text-white font-bold text-xs shadow-2xs hover:bg-[#14532D] cursor-pointer"
                >
                  Confirm & Update Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
