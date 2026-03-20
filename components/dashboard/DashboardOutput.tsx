import React from 'react';
import { Activity, Hospital, AlertTriangle, AlertCircle } from 'lucide-react';
import { TriageReport } from '@/types/triage';

interface DashboardOutputProps {
  report: TriageReport | null;
  loading: boolean;
}

export function DashboardOutput({ report, loading }: DashboardOutputProps) {
  const getUrgencyColorText = (score: number) => {
    if (score >= 8) return 'text-red-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUrgencyColorBg = (score: number) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <section className="h-full">
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white border-b border-neutral-800 pb-4">
           Output Dashboard
        </h2>

        {!report && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 space-y-4">
            <Activity className="w-16 h-16 opacity-20" />
            <p className="text-center max-w-sm">
              Waiting for incident data. Upload a photo and provide context on the left to generate the structured report.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-blue-400 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Hospital className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-lg text-white">AI Processing...</p>
              <p className="text-sm text-neutral-400">Extracting JSON payload from inputs</p>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-[0.03] ${getUrgencyColorBg(report.urgency_score)}`}></div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-1 z-10">Urgency</span>
                <span className={`text-6xl font-black tabular-nums transition-colors relative z-10 ${getUrgencyColorText(report.urgency_score)}`}>
                  {report.urgency_score}
                  <span className="text-2xl text-neutral-600">/10</span>
                </span>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-center">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Dispatch Code</span>
                <span className="text-3xl font-bold text-white mb-2 leading-none">{report.dispatch_code}</span>
                <span className="text-sm text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 inline-block px-2.5 py-1 rounded w-max">
                  {report.incident_type}
                </span>
              </div>
            </div>

            <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Immediate Action
              </h3>
              <p className="text-xl font-medium text-white leading-snug relative z-10">
                {report.immediate_action}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" /> Medical Flags
                </h3>
                <ul className="space-y-3">
                  {report.medical_flags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-sm text-neutral-200">{flag}</span>
                    </li>
                  ))}
                  {report.medical_flags.length === 0 && (
                    <li className="text-sm text-neutral-500 italic">No flags extracted.</li>
                  )}
                </ul>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" /> Vitals
                </h3>
                <ul className="space-y-3">
                  {report.extracted_vitals.map((vital, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm text-neutral-200">{vital}</span>
                    </li>
                  ))}
                  {report.extracted_vitals.length === 0 && (
                    <li className="text-sm text-neutral-500 italic">No vitals estimated.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
