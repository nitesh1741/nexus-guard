import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Search, MapPin, AlertCircle } from 'lucide-react';

export const AIThinking = memo(function AIThinking() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto mt-12 sm:mt-24 p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-blue-500/5 pulse-slow mix-blend-overlay"></div>
      
      <div className="flex flex-col items-center justify-center space-y-8 relative z-10 text-center">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-24 h-24 rounded-full border-t-2 border-r-2 border-blue-500/30 opacity-50 absolute -inset-4"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="w-20 h-20 rounded-full border-b-2 border-l-2 border-purple-500/30 opacity-50 absolute -inset-2"
          />
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <BrainCircuit className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-wide flex items-center justify-center gap-2">
            Structuring Chaos
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >...</motion.span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            Converting multimodal inputs into actionable insights
          </p>
        </div>

        {/* Dynamic scanning steps */}
        <div className="flex flex-col gap-3 w-full max-w-sm mt-4 text-left">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/80"
          >
            <Search className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-neutral-300">Extracting Intent & Context</span>
            <Search className="w-3 h-3 text-blue-500/50 ml-auto animate-spin" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
            className="flex items-center gap-3 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/80"
          >
            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-sm font-medium text-neutral-300">Evaluating Urgency & Risk</span>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full ml-auto animate-ping" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }}
            className="flex items-center gap-3 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/80"
          >
            <MapPin className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-sm font-medium text-neutral-300">Verifying Location & Actions</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto animate-pulse" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
