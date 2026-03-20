import React, { useRef } from 'react';
import { Upload, AlertTriangle, Activity, AlertCircle, FileText, Loader2 } from 'lucide-react';

interface IncidentFormProps {
  image: string | null;
  setImage: (image: string | null) => void;
  notes: string;
  setNotes: (notes: string) => void;
  loading: boolean;
  error: string | null;
  onGenerateReport: () => void;
}

export function IncidentForm({
  image,
  setImage,
  notes,
  setNotes,
  loading,
  error,
  onGenerateReport,
}: IncidentFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex-1">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Incoming Incident Data
        </h2>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Visual Evidence (Photo)</label>
            <div 
              className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                image ? 'border-blue-500/50 bg-blue-500/5' : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {image ? (
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Preview" className="h-40 object-cover rounded-lg shadow-md mb-3 border border-neutral-700" />
                  <p className="text-sm text-blue-400 font-medium group-hover:text-blue-300">Image attached. Click or drag to replace.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <Upload className="w-10 h-10 mb-3" />
                  <p className="text-base font-medium text-white mb-1">Upload Accident Photo</p>
                  <p className="text-sm">Click or drag & drop (JPG, PNG)</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Messy Notes / Context Text
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Patient found semi-conscious at construction site. Heavy bleeding from right leg. Breathing is rapid. Needs immediate attention."
              className="w-full h-40 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none font-mono text-sm leading-relaxed"
            />
          </div>

          <button
            onClick={onGenerateReport}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing multi-modal data...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Generate Triage Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
