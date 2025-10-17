// ============================
// Define possible status values for a job
// ============================
// - "active" → Job is currently open for applications
// - "archived" → Job is closed or archived
export type JobStatus = "active" | "archived";

// ============================
// Define possible types of job employment
// ============================
// - "Full-Time" → Standard full-time employment
// - "Part-Time" → Part-time employment
// - "Intern" → Internship position
// - "Contract" → Contract-based employment
export type JobType = "Full-Time" | "Part-Time" | "Intern" | "Contract";

// ============================
// Interface: Job
// ============================
// Represents a job posting in the system
export interface Job {
  id: string;          // Unique job ID
  title: string;       // Job title
  tags?: string[];     // Optional tags, e.g., "remote", "onsite"
  skills?: string[];   // Optional list of required skills
  startDate?: string;  // Optional start date in YYYY-MM-DD format
  endDate?: string;    // Optional end date in YYYY-MM-DD format
  package?: string;    // Optional salary or compensation package
  type?: JobType;      // Optional type of job (full-time, intern, etc.)
  status: JobStatus;   // Current status of the job (active/archived)
  order: number;       // Order/index for sorting or display
}
