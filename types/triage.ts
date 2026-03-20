export interface SuggestedAction {
  label: string;
  type: 'call' | 'navigate' | 'info' | 'action';
  value: string; // phone number, destination, or instruction
}

export interface TriageReport {
  intent: 'emergency' | 'informational' | 'actionable';
  urgency_score: number;
  incident_type: string;
  detected_location: string;
  confidence_score: number;
  extracted_vitals: string[];
  medical_flags: string[];
  immediate_action: string;
  dispatch_code: string;
  suggested_actions: SuggestedAction[];
  trust_sources: string[];
}
