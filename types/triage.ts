export interface TriageReport {
  urgency_score: number;
  incident_type: string;
  extracted_vitals: string[];
  medical_flags: string[];
  immediate_action: string;
  dispatch_code: string;
}
