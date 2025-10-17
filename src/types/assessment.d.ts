// ============================
// Define possible types of questions in an assessment
// ============================
// Each type represents the kind of input expected from a candidate
// - "single" → Single-choice (radio button)
// - "multi" → Multiple-choice (checkboxes)
// - "short" → Short text input
// - "long" → Long descriptive answer
// - "numeric" → Number input (e.g., range or score)
// - "file" → File upload question
// - "multiple-choice" → Another variant of multiple options
export type QuestionType =
  | "single"
  | "multi"
  | "short"
  | "long"
  | "numeric"
  | "file"
  | "multiple-choice";

// ============================
// Interface: Question
// ============================
// Represents an individual question within an assessment
export interface Question {
  id: string; // Unique identifier for each question
  label: string; // The text of the question
  type: QuestionType; // Type of question (e.g., single, multi, etc.)
  required?: boolean; // Whether answering this question is mandatory
  options?: string[]; // Available options (for single/multi choice questions)
  answer?: string; // Candidate's answer (can be text or value)
  range?: { min: number; max: number }; // Applicable for numeric questions
  condition?: { questionId: string; value: string }; // Conditional logic (show based on another question's answer)
}

// ============================
// Interface: Section
// ============================
// Represents a section in an assessment that groups multiple related questions
export interface Section {
  id: string; // Unique identifier for the section
  title: string; // Title of the section (e.g., "Technical Skills")
  questions: Question[]; // List of questions under this section
}

// ============================
// Interface: Assessment
// ============================
// Represents the full assessment structure for a job
export interface Assessment {
  id: string; // Unique ID for the assessment
  jobId: string; // ID of the related job posting
  title: string; // Title of the assessment
  sections: Section[]; // Organized sections within the assessment
  questions: Question[]; // Flattened list of all questions (optional convenience)
}

// ============================
// Interface: AssessmentResponse
// ============================
// Represents a candidate's response submission for an assessment
export interface AssessmentResponse {
  id: string; // Unique response ID
  jobId: string; // Associated job ID
  assessmentId: string; // ID of the assessment answered
  candidateId: string; // ID of the candidate who submitted
  answers: Record<string, any>; // Mapping of question IDs to candidate answers
  submittedAt: string; // Timestamp when the response was submitted
}
