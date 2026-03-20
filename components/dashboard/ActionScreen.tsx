import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Phone, Navigation, Info, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';
import { TriageReport } from '@/types/triage';

interface ActionScreenProps {
  report: TriageReport;
  onReset: () => void;
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** Builds a Google Maps Embed iframe URL for a given query string. */
function getMapsEmbedUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query);
  if (MAPS_API_KEY && MAPS_API_KEY !== 'your-google-maps-api-key') {
    return `https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}&q=${encodedQuery}`;
  }
  return '';
}

export const ActionScreen = memo(function ActionScreen({ report, onReset }: ActionScreenProps) {
  const isEmergency = report.intent === 'emergency' || report.urgency_score >= 8;
  const isInfo = report.intent === 'informational';
  
  const themeColor = isEmergency ? 'red' : isInfo ? 'blue' : 'orange';
  const getThemeVars = () => {
    switch(themeColor) {
      case 'red': return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
      case 'orange': return { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' };
      case 'blue':
      default: return { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' };
    }
  };
  const theme = getThemeVars();

  // Find first navigate action for Maps embed; fall back to detected_location
  const navigateAction = report.suggested_actions?.find(a => a.type === 'navigate');
  const mapQuery = navigateAction?.value || report.detected_location;
  const showMap = mapQuery && mapQuery !== 'Unknown';
  const mapsEmbedUrl = showMap ? getMapsEmbedUrl(mapQuery) : '';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto mt-4 sm:mt-8 pb-12"
      aria-live={isEmergency ? "assertive" : "polite"}
      role="alert"
    >
      <button 
        onClick={onReset}
        className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition group"
        aria-label="Start a new request"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-sm font-medium">New Request</span>
      </button>

      <div className={`w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl ${theme.glow}`}>
        
        {/* Header / Urgency Bar */}
        <div className="p-6 border-b border-neutral-800 relative overflow-hidden bg-neutral-950/50">
          <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none`}></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded bg-neutral-800 border ${theme.border} text-xs font-bold uppercase tracking-wider ${theme.text}`}>
                  {report.dispatch_code}
                </span>
                <span className="text-neutral-500 text-sm font-mono">&bull; {report.incident_type}</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                {report.immediate_action}
              </h2>
            </div>
            
            <div className="flex items-center gap-6 bg-neutral-900/80 px-4 py-3 rounded-2xl border border-neutral-800 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest mb-1">Urgency</span>
                <span className={`text-2xl font-black ${theme.text}`}>{report.urgency_score}<span className="text-base text-neutral-600">/10</span></span>
              </div>
              <div className="w-px h-10 bg-neutral-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest mb-1">Confidence</span>
                <span className="text-2xl font-black text-green-400">{report.confidence_score}<span className="text-base text-neutral-600">%</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Context & Verification */}
          <div className="space-y-6 md:col-span-1">
            {/* Location & Context */}
            <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800">
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Detected Context
              </h3>
              <div className="text-white font-medium text-base mb-1">
                {report.detected_location}
              </div>
              <div className="text-neutral-400 text-sm flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Active Tracking
              </div>
            </div>

            {/* Google Maps Embed (when API key is configured) */}
            {mapsEmbedUrl ? (
              <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800">
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest p-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-green-400" /> Live Map
                </h3>
                <iframe
                  title="Google Maps — Incident Location"
                  src={mapsEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block"
                />
              </div>
            ) : showMap ? (
              /* Fallback: plain link when no Maps API key is configured */
              <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800">
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-green-400" /> Navigate To
                </h3>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery!)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors underline underline-offset-2"
                  aria-label={`Open Google Maps for ${mapQuery}`}
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  {mapQuery}
                </a>
              </div>
            ) : null}

            {/* Verification Layer */}
            <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800">
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Verification Layer
              </h3>
              <ul className="space-y-2">
                {report.trust_sources && report.trust_sources.length > 0 ? (
                  report.trust_sources.map((source, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span>{source}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-neutral-500">No external sources verified.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Suggested Actions (2/3) */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <AlertCircle className={`w-5 h-5 ${theme.text}`} /> Recommended Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {report.suggested_actions && report.suggested_actions.length > 0 ? (
                report.suggested_actions.map((action, idx) => {
                  // Make call actions use tel: links, navigate actions open Google Maps
                  const href =
                    action.type === 'call'
                      ? `tel:${action.value.replace(/[^0-9+]/g, '')}`
                      : action.type === 'navigate'
                      ? `https://maps.google.com/?q=${encodeURIComponent(action.value)}`
                      : undefined;

                  const buttonClass = `w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 group ${
                    idx === 0 
                      ? `${theme.bg} text-white hover:brightness-110 ${theme.border} shadow-lg ${theme.glow}`
                      : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-white'
                  }`;

                  const iconWrap = (
                    <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-white/20' : 'bg-neutral-800 group-hover:bg-neutral-700'}`}>
                      {action.type === 'call' && <Phone className="w-6 h-6" />}
                      {action.type === 'navigate' && <Navigation className="w-6 h-6" />}
                      {action.type === 'action' && <AlertCircle className="w-6 h-6" />}
                      {action.type === 'info' && <Info className="w-6 h-6" />}
                    </div>
                  );

                  const labelBlock = (
                    <div>
                      <div className={`font-bold text-lg mb-0.5 ${idx === 0 ? 'text-white' : 'text-neutral-100'}`}>
                        {action.label}
                      </div>
                      <div className={`text-sm ${idx === 0 ? 'text-white/80' : 'text-neutral-400'} font-mono`}>
                        {action.value}
                      </div>
                    </div>
                  );

                  return href ? (
                    <a
                      key={idx}
                      href={href}
                      target={action.type === 'navigate' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={buttonClass}
                    >
                      {iconWrap}
                      {labelBlock}
                    </a>
                  ) : (
                    <button key={idx} type="button" className={buttonClass}>
                      {iconWrap}
                      {labelBlock}
                    </button>
                  );
                })
              ) : (
                <div className="text-neutral-500 italic p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  No automated actions suggested. Please review manual instructions.
                </div>
              )}
            </div>

            {/* Minor Data Flags */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Clinical Flags</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                  {report.medical_flags?.map((f, i) => <li key={i} className="flex gap-2 items-start"><span className="text-orange-500">&bull;</span>{f}</li>)}
                  {(!report.medical_flags || report.medical_flags.length === 0) && <li className="text-neutral-600">None detected</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Vitals/Symptoms</h4>
                <ul className="text-sm text-neutral-300 space-y-1">
                  {report.extracted_vitals?.map((v, i) => <li key={i} className="flex gap-2 items-start"><span className="text-green-500">&bull;</span>{v}</li>)}
                  {(!report.extracted_vitals || report.extracted_vitals.length === 0) && <li className="text-neutral-600">None detected</li>}
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
});
