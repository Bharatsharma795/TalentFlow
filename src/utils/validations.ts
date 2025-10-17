// Import Zod library for schema validation
import { z } from "zod";

// ============================
// Schema: jobSchema
// ============================
// Validates the structure of a Job object
export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"), // Job title must be a non-empty string
  slug: z.string(),                              // URL-friendly slug string
  status: z.enum(["active", "archived"]),       // Job status must be either "active" or "archived"
  tags: z.array(z.string()).optional(),         // Optional array of tags
});

// ============================
// Schema: questionSchema
// ============================
// Validates the structure of a Question object
export const questionSchema = z.object({
  label: z.string().min(1),                      // Question label must be non-empty
  type: z.enum(["single", "multi", "short", "long", "numeric", "file"]), // Type must be one of the predefined question types
  required: z.boolean().optional(),             // Optional boolean indicating if the question is mandatory
});
