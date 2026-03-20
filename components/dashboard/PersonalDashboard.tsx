'use client';

import React, { memo, useEffect, useState } from 'react';
import { Activity, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import { getTriageHistory, TriageHistoryEntry } from '@/lib/firestoreHistory';

function getUrgencyColor(score: number): string {
  if (score >= 8) return 'bg-red-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-blue-500';
}

function formatTimestamp(entry: TriageHistoryEntry): string {
  if (!entry.timestamp) return 'Just now';
  const date = entry.timestamp.toDate();
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

export const PersonalDashboard = memo(function PersonalDashboard() {
  const [history, setHistory] = useState<TriageHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTriageHistory(5)
      .then((entries) => {
        if (!cancelled) setHistory(entries);
      })
      .catch(() => {
        // Silently fail — user may not have configured Firebase yet
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-16 mb-12">
      <div className="border-t border-neutral-800 pt-8 mt-8">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6">Personal Guardian</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent History — powered by Firebase Firestore */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-900 transition">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              <Clock className="w-4 h-4 text-blue-400" /> Recent History
            </h3>
            {loading ? (
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
              </div>
            ) : history.length > 0 ? (
              <ul className="space-y-3">
                {history.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getUrgencyColor(entry.urgency_score)} shrink-0 mt-1.5`}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{entry.incident_type}</p>
                      <p className="text-xs text-neutral-500">
                        {formatTimestamp(entry)} &bull; {entry.dispatch_code}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">No history yet. Run your first analysis above.</p>
            )}
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-900 transition">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Proactive Alerts
            </h3>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-3">
              <p className="text-sm text-orange-400 font-medium">Heavy rain predicted in your area.</p>
              <p className="text-xs text-orange-500/70 mt-1">Drive safe and leave 15 mins early.</p>
            </div>
            <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-3">
              <p className="text-sm text-neutral-300 font-medium">Daily Steps: 2,400 / 10,000</p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-900 transition">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              <Activity className="w-4 h-4 text-green-400" /> Health Profile
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-medium rounded-full border border-neutral-700">Blood Type: O+</span>
              <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">Allergy: Penicillin</span>
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-medium rounded-full border border-neutral-700">Asthma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
