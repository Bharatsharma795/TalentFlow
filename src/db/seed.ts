// src/db/seed.ts

// Importing the faker library to generate random fake data
import { faker } from "@faker-js/faker";
// Importing the database instance from dexie.ts
import { db } from "./dexie";
// Importing a utility function to generate slugs from strings
import { slugify } from "../utils/slugify";
// Importing TypeScript types for assessments
import { Assessment, Question, Section } from "../types/assessment";

// Main function to seed (populate) the database with fake data
export async function seedDatabase() {
  // Checking if jobs already exist in the database to avoid reseeding
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return; // If jobs exist, stop further execution

  // --- 1️⃣ Seeding Jobs ---
  // Defining some constant job-related data
  const jobTypes = ["Full-Time", "Part-Time", "Intern", "Contract"] as const;
  const experienceLevels = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];
  const salaryRanges = ["$40k - $60k", "$60k - $90k", "$90k - $120k", "$120k+"];

  // Creating an array of 25 fake jobs
  const jobs = Array.from({ length: 25 }).map((_, i) => {
    const title = faker.person.jobTitle(); // Generate a random job title
    return {
      id: faker.string.uuid(), // Unique job ID
      title, // Job title
      slug: slugify(title) + "-" + i, // Slugified title with index
      status: faker.helpers.arrayElement(["active", "archived"]), // Random status
      tags: faker.helpers.arrayElements(["remote", "onsite", "hybrid"], 2), // Random job tags
      skills: faker.helpers.arrayElements(
        ["React", "Node.js", "TypeScript", "SQL", "AWS", "Python", "Docker"],
        3
      ), // Random 3 skills
      package: faker.helpers.arrayElement(salaryRanges), // Random salary range
      startDate: faker.date
        .between({ from: "2024-01-01", to: "2024-12-31" })
        .toISOString()
        .split("T")[0], // Random start date within 2024
      endDate: faker.date
        .between({ from: "2025-01-01", to: "2025-12-31" })
        .toISOString()
        .split("T")[0], // Random end date within 2025
      type: faker.helpers.arrayElement(jobTypes), // Random job type
      order: i, // Position order
    };
  });

  // Adding all generated jobs to the database
  await db.jobs.bulkAdd(jobs);

  // --- 2️⃣ Seeding Candidates ---
  // Generating 1000 random candidates linked to the jobs
  const candidates = Array.from({ length: 1000 }).map(() => ({
    id: faker.string.uuid(), // Unique candidate ID
    name: faker.person.fullName(), // Random full name
    email: faker.internet.email(), // Random email
    jobId: faker.helpers.arrayElement(jobs).id, // Random job association
    stage: faker.helpers.arrayElement([
      "applied",
      "screen",
      "tech",
      "offer",
      "hired",
      "rejected",
    ]), // Random hiring stage
  }));
  
  // Logging generated candidate count for debugging
  console.log("Generated candidates:", candidates.length);
  // Adding all candidates to the database
  await db.candidates.bulkAdd(candidates);
  // Counting and logging how many candidates were added
  const count = await db.candidates.count();
  console.log("✅ Candidates added to DB:", count);

  // --- 3️⃣ Seeding Assessments ---
  // Creating mock assessments for the first 3 jobs
  const assessments: Assessment[] = jobs.slice(0, 3).map((job) => {
    // Creating a section with 10 random questions
    const sections: Section[] = [
      {
        id: faker.string.uuid(), // Unique section ID
        title: "General Knowledge", // Section title
        questions: Array.from({ length: 10 }).map(() => {
          const type = faker.helpers.arrayElement([
            "single",
            "multi",
            "short",
            "long",
            "numeric",
            "file",
          ]) as Question["type"]; // Random question type

          // Returning a generated question object
          return {
            id: faker.string.uuid(), // Unique question ID
            label: faker.lorem.sentence(), // Random question text
            type, // Question type
            required: faker.datatype.boolean(), // Randomly mark as required or not
            options:
              type === "single" || type === "multi"
                ? Array.from({ length: 4 }).map(() => faker.word.noun()) // Random options if applicable
                : undefined,
            min:
              type === "numeric" ? faker.number.int({ min: 0, max: 10 }) : undefined, // Min value for numeric questions
            max:
              type === "numeric" ? faker.number.int({ min: 20, max: 50 }) : undefined, // Max value for numeric questions
          };
        }),
      },
    ];

    // Flatten all questions from all sections
    const questions: Question[] = sections.flatMap((s) => s.questions);

    // Returning a valid Assessment object
    return {
      id: faker.string.uuid(), // Unique assessment ID
      jobId: job.id, // Associated job ID
      title: `${job.title} Assessment`, // Assessment title based on job title
      sections, // Sections containing questions
      questions, // Full question list
    };
  });

  // Adding all generated assessments to the database
  await db.assessments.bulkAdd(assessments);
}
