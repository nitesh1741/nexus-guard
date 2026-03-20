import { useState, useCallback } from 'react';
import { TriageReport } from '@/types/triage';
import { saveTriageToHistory } from '@/lib/firestoreHistory';

export type ProcessingPhase = 'idle' | 'analyzing' | 'complete';

export function useTriage() {
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ProcessingPhase>('idle');
  const [report, setReport] = useState<TriageReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    if (!image && !notes.trim()) {
      setError("Please provide at least an image or some text context.");
      return;
    }

    setError(null);
    setLoading(true);
    setPhase('analyzing');
    setReport(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, text: notes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data: TriageReport = await response.json();
      setReport(data);
      setPhase('complete');

      // Persist to Firestore history (fire-and-forget — non-blocking)
      saveTriageToHistory(data).catch((err) => {
        console.warn('Firestore history save failed (non-critical):', err);
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setPhase('idle');
    } finally {
      setLoading(false);
    }
  }, [image, notes]);

  const reset = useCallback(() => {
    setImage(null);
    setNotes('');
    setReport(null);
    setError(null);
    setPhase('idle');
  }, []);

  return { image, setImage, notes, setNotes, loading, phase, report, error, generateReport, reset };
}

