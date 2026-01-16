export type AdmissionPhase = "foundation" | "differentiation" | "proof" | "leverage";
export type SubmissionStatus = "pending" | "approved" | "rejected" | "cooldown";

export interface PhaseProgress {
  id: string;
  user_id: string;
  current_phase: AdmissionPhase;
  foundation_unlocked: boolean;
  differentiation_unlocked: boolean;
  proof_unlocked: boolean;
  leverage_unlocked: boolean;
  foundation_completed: boolean;
  differentiation_completed: boolean;
  proof_completed: boolean;
  leverage_completed: boolean;
  user_baseline: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PhaseSubmission {
  id: string;
  user_id: string;
  phase: AdmissionPhase;
  submission_type: string;
  submission_data: Record<string, any>;
  status: SubmissionStatus;
  ai_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  cooldown_until: string | null;
}

export interface PhaseRequirement {
  id: string;
  user_id: string;
  phase: AdmissionPhase;
  requirement_key: string;
  requirement_label: string;
  completed: boolean;
  completed_at: string | null;
  proof_link: string | null;
  proof_data: Record<string, any> | null;
}

export interface PhaseDefinition {
  id: AdmissionPhase;
  number: number;
  name: string;
  subtitle: string;
  description: string;
  requirements: RequirementDefinition[];
  unlockConditions: string[];
  color: string;
  icon: string;
}

export interface RequirementDefinition {
  key: string;
  label: string;
  description: string;
  submissionType: string;
  fields: SubmissionField[];
}

export interface SubmissionField {
  name: string;
  label: string;
  type: "text" | "url" | "number" | "select" | "textarea";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
