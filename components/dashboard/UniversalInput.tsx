import React, { useRef } from 'react';
import { Upload, Mic, LayoutGrid, Image as ImageIcon, Send } from 'lucide-react';

interface UniversalInputProps {
  image: string | null;
  setImage: (image: string | null) => void;
  notes: string;
  setNotes: (notes: string) => void;
  loading: boolean;
  onGenerateReport: () => void;
}

export function UniversalInput({
  image,
  setImage,
  notes,
  setNotes,
  loading,
  onGenerateReport,
}: UniversalInputProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerateReport();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 mt-12 sm:mt-24 px-4">
      {/* Dynamic Input Box */}
      <div className="w-full bg-neutral-900/60 backdrop-blur-xl border-2 border-neutral-800 focus-within:border-blue-500/50 rounded-3xl p-4 shadow-2xl transition-all relative overflow-hidden flex flex-col group">
        
        {image && (
          <div className="relative w-max mb-3 mt-2 ml-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Uploaded" className="h-24 w-24 object-cover rounded-xl border border-neutral-700" />
            <button 
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-full p-1 border border-neutral-700 transition"
            >
              <span className="sr-only">Remove Image</span>
              &times;
            </button>
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's happening? Type, speak, or upload..."
          className="w-full bg-transparent text-xl md:text-2xl text-white placeholder-neutral-500 resize-none p-4 focus:outline-none min-h-[120px]"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
              title="Upload Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
              title="Voice Input (Mock)"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button 
              className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors hidden sm:flex items-center justify-center shrink-0"
              title="Upload Document (Mock)"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onGenerateReport}
            disabled={loading || (!image && !notes.trim())}
            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>Analyze</span>
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions (Mock) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {['Medical Emergency', 'Travel Advice', 'Health Symptom', 'Daily Help'].map((chip) => (
          <button 
            key={chip}
            className="px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 text-sm font-medium transition flex items-center gap-2"
            onClick={() => setNotes(`I need help with: ${chip}`)}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
