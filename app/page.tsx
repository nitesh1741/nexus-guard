"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/dashboard/Header';
import { UniversalInput } from '@/components/dashboard/UniversalInput';
import { AIThinking } from '@/components/dashboard/AIThinking';
import { ActionScreen } from '@/components/dashboard/ActionScreen';
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard';
import { useTriage } from '@/hooks/useTriage';

export default function EmergencyDashboard() {
  const { image, setImage, notes, setNotes, phase, report, error, generateReport, reset } = useTriage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30 overflow-x-hidden pt-24 relative">
      <Header />
      
      {/* Dynamic Background Glows based on state */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000 ${
        phase === 'analyzing' ? 'bg-blue-500' : report?.urgency_score && report.urgency_score >= 8 ? 'bg-red-500' : 'bg-transparent'
      }`}></div>

      <main className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl w-full max-w-3xl text-center shadow-lg"
          >
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <UniversalInput 
                image={image} setImage={setImage} 
                notes={notes} setNotes={setNotes} 
                loading={false} onGenerateReport={generateReport} 
              />
              <PersonalDashboard />
            </motion.div>
          )}

          {phase === 'analyzing' && (
            <motion.div 
              key="thinking"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="w-full mt-12"
            >
              <AIThinking />
            </motion.div>
          )}

          {phase === 'complete' && report && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full"
            >
              <ActionScreen report={report} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
