/**
 * Firestore helpers with robust guards for missing configuration.
 */
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { TriageReport } from '@/types/triage';

export interface TriageHistoryEntry {
  id?: string;
  intent: string;
  urgency_score: number;
  incident_type: string;
  immediate_action: string;
  dispatch_code: string;
  timestamp: Timestamp | null;
}

/** Saves a triage result summary to Firestore. Only executes if db is initialized. */
export async function saveTriageToHistory(
  report: TriageReport
): Promise<string | null> {
  if (!db) return null;

  try {
    const entry: Omit<TriageHistoryEntry, 'id'> = {
      intent: report.intent,
      urgency_score: report.urgency_score,
      incident_type: report.incident_type,
      immediate_action: report.immediate_action,
      dispatch_code: report.dispatch_code,
      timestamp: null,
    };

    const docRef = await addDoc(collection(db, 'triage_history'), {
      ...entry,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.warn('Failed to save to Firestore:', err);
    return null;
  }
}

/** Fetches latest triage entries. Returns empty array if db is null. */
export async function getTriageHistory(
  maxEntries = 5
): Promise<TriageHistoryEntry[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, 'triage_history'),
      orderBy('timestamp', 'desc'),
      limit(maxEntries)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<TriageHistoryEntry, 'id'>),
    }));
  } catch (err) {
    console.warn('Failed to fetch triage history:', err);
    return [];
  }
}
