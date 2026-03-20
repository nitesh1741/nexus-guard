import { useState } from 'react';
import { TriageReport } from '@/types/triage';

export function useTriage() {
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TriageReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!image) {
      setError("Please upload an accident photo.");
      return;
    }
    if (!notes.trim()) {
      setError("Please provide emergency notes or context.");
      return;
    }

    setError(null);
    setLoading(true);
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

      const data = await response.json();
      setReport(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { image, setImage, notes, setNotes, loading, report, error, generateReport };
}
