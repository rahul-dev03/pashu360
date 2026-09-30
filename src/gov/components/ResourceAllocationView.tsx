import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Send,
  Users,
  Building2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { mockResourceAllocation, VillageResourceRow } from '../data/govMockData';

export const ResourceAllocationView: React.FC = () => {
  const [rows, setRows] = useState<VillageResourceRow[]>(mockResourceAllocation);
  const [notification, setNotification] = useState<string | null>(null);

  // Compute dynamic priority based on active cases and required visits vs available para-vets
  const calculatePriority = (cases: number, visits: number, vets: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    const deficit = visits - vets * 3;
    if (cases >= 25 || deficit >= 8) return 'Critical';
    if (cases >= 15 || deficit >= 4) return 'High';
    if (cases >= 8 || deficit >= 1) return 'Medium';
    return 'Low';
  };

  const handleAdjustParaVets = (villageName: string, delta: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.village === villageName) {
          const newVets = Math.max(1, row.paraVets + delta);
          const newPriority = calculatePriority(row.activeCases, row.requiredVisits, newVets);
          return {
            ...row,
            paraVets: newVets,
            priority: newPriority,
          };
        }
        return row;
      })
    );
    showNotice(`Updated veterinary staffing for ${villageName}`);
  };

  const handleToggleAmbulance = (villageName: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.village === villageName) {
          const newState = !row.ambulanceDispatched;
          return { ...row, ambulanceDispatched: newState };
        }
        return row;
      })
    );
    showNotice(`Ambulance dispatch status toggled for ${villageName}`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getPriorityBadge = (p: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (p) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-600" />
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Low
          </span>
        );
    }
  };

  const totalParaVets = rows.reduce((acc, r) => acc + r.paraVets, 0);
  const totalRequiredVisits = rows.reduce((acc, r) => acc + r.requiredVisits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Para-Veterinary Workforce & Mobile Unit Deployment
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Dynamic triage capacity matching active morbidity alerts against deployed Block Para-Veterinary Officers
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 rounded-xl bg-stone-100 text-stone-700 font-semibold border border-stone-200">
            Deployed Para-Vets: <span className="font-black text-[#166534]">{totalParaVets}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-900 font-semibold border border-amber-200">
            Pending Visits: <span className="font-black text-amber-800">{totalRequiredVisits}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* RESOURCE ALLOCATION TABLE */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Village Triage Capacity Matrix
            </h2>
            <p className="text-xs text-stone-500">
              Priority is automatically calculated based on active cases vs deployed clinical staff ratio
            </p>
          </div>
          <span className="text-[11px] font-semibold text-stone-400">
            Auto-Updates Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] border-b border-stone-200 text-stone-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Active Cases</th>
                <th className="py-3 px-4">Assigned Para-Vets</th>
                <th className="py-3 px-4">Required Visits</th>
                <th className="py-3 px-4">Calculated Priority</th>
                <th className="py-3 px-4 text-right">Mobile Ambulance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {rows.map((row) => (
                <tr key={row.village} className="hover:bg-[#F8FAF7] transition-colors">
                  {/* Village */}
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <div className="flex items-center gap-1.5">
                      <span>{row.village}</span>
                      {row.priority === 'Critical' && (
                        <AlertOctagon className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                      )}
                    </div>
                  </td>

                  {/* Active Cases */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {row.activeCases}
                    </span>
                    <span className="text-[10px] text-stone-400 ml-1">cases</span>
                  </td>

                  {/* Assigned Para-Vets with interactive +/- controls */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdjustParaVets(row.village, -1)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Decrease officer count"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-stone-900 min-w-[20px] text-center">
                        {row.paraVets}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustParaVets(row.village, 1)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Increase officer count"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Required Visits */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      {row.requiredVisits}
                    </span>
                    <span className="text-[10px] text-stone-400 ml-1">visits pending</span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">{getPriorityBadge(row.priority)}</td>

                  {/* Ambulance Status Toggle */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleAmbulance(row.village)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        row.ambulanceDispatched
                          ? 'bg-[#166534] text-white hover:bg-[#14532D]'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {row.ambulanceDispatched ? 'Ambulance En Route' : 'Dispatch Unit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
