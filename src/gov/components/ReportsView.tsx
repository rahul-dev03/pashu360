import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Share2,
  Printer,
  Shield,
  FileCheck,
  QrCode,
  Sparkles,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { mockDistrictReports, DistrictReportCard } from '../data/govMockData';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { showToast } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const triggerMockDownload = (filename: string, content: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Download error:', e);
    }
  };

  const handleDownloadReport = (rep: DistrictReportCard, format: 'pdf' | 'csv' = 'pdf') => {
    const downloadKey = `${rep.id}-${format}`;
    setDownloadingId(downloadKey);
    setTimeout(() => {
      setDownloadingId(null);
      if (format === 'csv') {
        const csvContent =
          `Report ID,${rep.id}\nTitle,"${rep.title}"\nAudit Period,"${rep.period}"\nCategory,"${rep.category}"\nGenerated Date,"24 Sep 2026"\n\n` +
          `Metric Label,Audited Value\n` +
          rep.summaryMetrics.map((m) => `"${m.label}","${m.value}"`).join('\n');
        triggerMockDownload(`${rep.id}_dataset.csv`, csvContent, 'text/csv;charset=utf-8;');
      } else {
        const textContent =
          `%PDF-1.4\n%Official District Epidemiology & NADCP Audit Report\n` +
          `Title: ${rep.title}\nPeriod: ${rep.period}\nCategory: ${rep.category}\n` +
          `File Size: ${rep.fileSize}\nStatus: Verified\n\nExecutive Metrics:\n` +
          rep.summaryMetrics.map((m) => ` - ${m.label}: ${m.value}`).join('\n') +
          `\n\nDigital Ledger Signature: 0x9f82c091ad4b Karnal Central Block Vet Hospital`;
        triggerMockDownload(`${rep.id}_official_report.pdf`, textContent, 'application/pdf');
      }
      const msg = `Report Downloaded: "${rep.title}.${format.toUpperCase()}" (${rep.fileSize})`;
      setDownloadNotice(msg);
      showToast(msg, 'success');
      setTimeout(() => setDownloadNotice(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[16px] bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#166534]" />
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              Official District Epidemiology & NADCP Reports
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated monthly clinical audit reports prepared for District Veterinary Officer & Department of Animal Husbandry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Government Digital Ledger Verified</span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* 3 MOCK PDF REPORT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockDistrictReports.map((report) => {
          const isDownloading = downloadingId === report.id;
          return (
            <div
              key={report.id}
              className="p-6 rounded-[20px] bg-white border border-stone-200 shadow-xs hover:border-[#166534]/50 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* PDF Format Badge & Metadata */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        {report.category}
                      </span>
                      <span className="text-xs text-stone-600 font-mono font-bold">{report.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center border border-stone-200" title="QR Verification Token">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-stone-900 mt-3 group-hover:text-[#166534] transition-colors leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{report.subtitle}</p>

                {/* Provenance: AARVI AI & Digital Ledger Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Generated by AARVI AI
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#166534]" />
                    Digital Ledger Verified
                  </span>
                </div>

                {/* Audit Period, File Size & Generation Timestamp */}
                <div className="mt-3.5 p-3 rounded-xl bg-[#F8FAF7] border border-stone-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Audit Period:</span>
                    <span className="font-semibold text-stone-800">{report.period}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Generated Timestamp:</span>
                    <span className="font-semibold text-stone-700">Thu, 24 Sep 2026 • 09:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>File Size:</span>
                    <span className="font-mono text-stone-800 font-semibold">{report.fileSize}</span>
                  </div>
                </div>

                {/* Executive Summary Metrics Box */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Key Executive Metrics:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {report.summaryMetrics.map((met, i) => (
                      <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-500 block truncate">
                          {met.label}
                        </span>
                        <span className="font-bold text-stone-900 mt-0.5 block">{met.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: PDF + CSV + Print */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadReport(report, 'pdf')}
                  disabled={downloadingId === `${report.id}-pdf`}
                  className="flex-1 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Download Official PDF"
                >
                  {downloadingId === `${report.id}-pdf` ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Report</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadReport(report, 'csv')}
                  disabled={downloadingId === `${report.id}-csv`}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Export Raw Data (CSV)"
                >
                  {downloadingId === `${report.id}-csv` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-[#166534]" />
                      <span>CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showToast(`Printing ledger copy of ${report.title}...`, 'info');
                  }}
                  className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Print official copy"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
