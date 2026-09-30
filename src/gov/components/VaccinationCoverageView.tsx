import React from 'react';
import {
  Syringe,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Layers,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { mockVaccinationCoverage } from '../data/govMockData';

export const VaccinationCoverageView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              National Animal Disease Control Programme (NADCP)
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            District-wide bovine immunization coverage, cold-chain audits, and missed booster followups
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cold Chain (2°C-8°C) Compliant</span>
        </div>
      </div>

      {/* 3 VACCINATION COVERAGE CARDS WITH PROGRESS BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {mockVaccinationCoverage.map((item) => {
          return (
            <div
              key={item.id}
              className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4 hover:border-[#166534]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Mandatory Vaccine
                  </span>
                  <span className="text-xs font-black text-[#166534]">
                    {item.completionPercentage}% Done
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-2">{item.diseaseName}</h3>
                <p className="text-[11px] text-stone-500">
                  Target Herd: {item.targetPopulation.toLocaleString()} registered cattle
                </p>

                {/* Main Progress Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className="bg-gradient-to-r from-[#166534] to-[#22C55E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.completionPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500">
                    <span>0%</span>
                    <span>Target: 100% (NADCP Phase II)</span>
                  </div>
                </div>

                {/* 3 Metric Stats: Vaccinated, Due, Missed */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Vaccinated
                    </span>
                    <span className="text-base font-black text-emerald-900 mt-0.5">
                      {item.vaccinated.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                    <span className="text-[10px] text-amber-700 font-bold block uppercase">
                      Due
                    </span>
                    <span className="text-base font-black text-amber-900 mt-0.5">
                      {item.due.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100">
                    <span className="text-[10px] text-red-700 font-bold block uppercase">
                      Missed
                    </span>
                    <span className="text-base font-black text-red-900 mt-0.5">
                      {item.missed.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-stone-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Cold Chain:</span>
                  <span className="font-semibold text-stone-800">{item.coldChainAudit}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Next Mop-Up Drive:</span>
                  <span className="font-bold text-[#166534]">{item.nextDriveDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Village Vaccination Breakdown Table */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#166534]" />
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Village-Level NADCP Immunization Ledger
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            6 Villages in Karnal Sub-Divisions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] border-b border-stone-200 text-stone-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Village & Block</th>
                <th className="py-3 px-4">Total Cattle</th>
                <th className="py-3 px-4">FMD Status</th>
                <th className="py-3 px-4">Brucellosis Status</th>
                <th className="py-3 px-4">LSD Status</th>
                <th className="py-3 px-4 text-right">Overall Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Karnal Central</td>
                <td className="py-3 px-4 font-mono">1,420</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">86.4%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">91.0%</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">81.8%</td>
                <td className="py-3 px-4 text-right font-black text-[#166534]">86.4%</td>
              </tr>
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Assandh</td>
                <td className="py-3 px-4 font-mono">980</td>
                <td className="py-3 px-4 text-red-600 font-semibold">78.0% (Urgent Mop-up)</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">88.5%</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">71.2%</td>
                <td className="py-3 px-4 text-right font-black text-amber-700">79.2%</td>
              </tr>
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Nilokheri</td>
                <td className="py-3 px-4 font-mono">1,150</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">91.5%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">94.0%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">87.5%</td>
                <td className="py-3 px-4 text-right font-black text-[#166534]">91.0%</td>
              </tr>
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Gharaunda</td>
                <td className="py-3 px-4 font-mono">890</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">89.2%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">92.0%</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">84.3%</td>
                <td className="py-3 px-4 text-right font-black text-[#166534]">88.5%</td>
              </tr>
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Taraori</td>
                <td className="py-3 px-4 font-mono">760</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">96.0%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">97.2%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">94.1%</td>
                <td className="py-3 px-4 text-right font-black text-emerald-700">95.8%</td>
              </tr>
              <tr className="hover:bg-[#F8FAF7]">
                <td className="py-3 px-4 font-bold text-stone-900">Indri</td>
                <td className="py-3 px-4 font-mono">910</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">97.0%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">98.0%</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">94.5%</td>
                <td className="py-3 px-4 text-right font-black text-emerald-700">96.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
