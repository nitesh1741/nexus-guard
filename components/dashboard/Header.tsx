import React from 'react';
import { Hospital } from 'lucide-react';

export function Header() {
  return (
    <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
      <div className="flex items-center gap-3">
        <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
          <Hospital className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">NexusGuard</h1>
          <p className="text-sm text-neutral-400 font-mono">Emergency Triage Dashboard v1.0</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full w-max">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-xs font-medium text-red-400 tracking-widest">SYSTEM ACTIVE</span>
      </div>
    </header>
  );
}
