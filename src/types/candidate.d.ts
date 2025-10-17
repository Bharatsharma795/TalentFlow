// ============================
// Define possible stages of a candidate in the hiring process
// ============================
// - "applied" → Candidate has applied
// - "screen" → Screening stage
// - "tech" → Technical interview stage
// - "offer" → Offer extended
// - "hired" → Candidate hired
// - "rejected" → Candidate rejected
export type Stage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected";

// ============================
// Interface: Candidate
// ============================
// Represents a candidate applying for a job
export interface Candidate {
  id: string; // Unique candidate ID
  jobId: string; // ID of the job the candidate applied for
  name: string; // Candidate's full name
  email: string; // Candidate's email
  stage: Stage; // Current stage in the hiring pipeline
  createdAt?: string; // Optional timestamp when the candidate record was created
}

// ============================
// Interface: CandidateTimelineEntry
// ============================
// Represents a single stage transition in the candidate's history
export interface CandidateTimelineEntry {
  timestamp: string; // When the stage change occurred
  from: Stage; // Previous stage
  to: Stage; // New stage
}

// ============================
// Interface: CandidateNote
// ============================
// Represents a note or comment added by a recruiter or team member
export interface CandidateNote {
  id: string; // Unique note ID
  candidateId: string; // ID of the candidate this note belongs to
  author: string; // Name of the note's author
  text: string; // Content of the note
  mentions: string[]; // List of mentioned users in the note
  createdAt: string; // Timestamp when the note was created
}
