import React from 'react';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

export function PersonalDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-16 mb-12">
      <div className="border-t border-neutral-800 pt-8 mt-8">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6">Personal Guardian</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-900 transition">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              <Clock className="w-4 h-4 text-blue-400" /> Recent History
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-white">Checked ingredients for allergic reaction</p>
                  <p className="text-xs text-neutral-500">2 days ago &bull; Safe</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-neutral-600 shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-white">Minor cut first-aid</p>
                  <p className="text-xs text-neutral-500">Last week &bull; Resolved</p>
                </div>
              </li>
            </ul>
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
}
