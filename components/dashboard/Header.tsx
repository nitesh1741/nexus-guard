import React, { memo } from 'react';
import { Hospital } from 'lucide-react';

export const Header = memo(function Header() {
  return (
    <header className="w-full flex items-center justify-between p-6 absolute top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white text-black p-2 rounded-xl">
          <Hospital className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">NexusGuide</h1>
          <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase mt-1">Universal Decision Engine</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-medium text-blue-400 tracking-widest">SYSTEM ONLINE</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-400 hover:text-white cursor-pointer transition">
          US
        </div>
      </div>
    </header>
  );
});
