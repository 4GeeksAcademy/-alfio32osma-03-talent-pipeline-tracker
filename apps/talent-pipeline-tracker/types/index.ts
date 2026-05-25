export type Status = "received" | "in_progress" | "selected" | "discarded";

export type Stage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export interface Candidate {
  id: number | string;
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  linkedin?: string;
  cv_url?: string;
  years_of_experience?: number;
  status: Status;
  stage: Stage;
  application_date?: string;
}

export interface Note {
  id: number | string;
  content: string;
  created_at?: string;
}
