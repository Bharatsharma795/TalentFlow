// src/db/dexie.ts

// Importing Dexie (a wrapper library for IndexedDB) and the 'Table' type
import Dexie, { Table } from "dexie";

// Importing data types used for typing the database tables
import { Job } from "../types/job";
import { Candidate } from "../types/candidate.d";
import { Assessment } from "../types/assessment.d";
import { AssessmentResponse } from "../types/assessment.d";

// Creating a custom database class 'TalentflowDB' that extends Dexie
export class TalentflowDB extends Dexie {
  // Declaring typed tables for different entities
  jobs!: Table<Job, string>; // Table for job data, keyed by string 'id'
  candidates!: Table<Candidate, string>; // Table for candidate data
  assessments!: Table<Assessment, string>; // Table for assessments
  responses!: Table<AssessmentResponse, string>; // Table for assessment responses

  // Constructor to define and initialize database schema
  constructor() {
    super("TalentflowDB"); // Calling the parent Dexie constructor with database name

    // Defining version and schema of the database
    this.version(4).stores({
      // Defining object stores (tables) with their indexed fields
      jobs: "id, title, slug, status, order", // Indexing job fields for queries
      candidates: "id, jobId, stage", // Candidate table with job relation
      assessments: "jobId", // Assessment table linked to job
      notes: "id, candidateId , createdAt", // Notes related to candidate
      timelines: "id, candidateId, timestamp", // Candidate activity timeline
      responses: "id, jobId, candidateId, submittedAt", // Assessment responses
      assessmentResponses: "id, assessmentId, candidateId", // Linking assessments to candidates
    });
  }
}

// Creating and exporting a single instance of the database to be used across the app
export const db = new TalentflowDB();
