// src/api/msw/handlers.ts

import { rest } from "msw";
import { db } from "../../db/dexie";
import { Job } from "../../types/job";
import type { Candidate } from "../../types/candidate";
import { Assessment, AssessmentResponse } from "../../types/assessment.d";
import { faker } from "@faker-js/faker";

/* -----------------------------------------------
    Helper Function
-------------------------------------------------- */

// Randomly simulate API failure (1% chance)
const maybeFail = () => Math.random() < 0.01;

/* -----------------------------------------------
    JOB HANDLERS
-------------------------------------------------- */

export const jobHandlers = [
  // GET: Fetch all jobs (supports search & status filter)
  rest.get("/api/jobs", async (req, res, ctx) => {
    const search = req.url.searchParams.get("search")?.toLowerCase() || "";
    const status = req.url.searchParams.get("status") || "";
    const allJobs: Job[] = await db.jobs.toArray();

    const filtered = allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search) &&
        (status ? job.status === status : true)
    );

    return res(ctx.delay(300), ctx.status(200), ctx.json(filtered));
  }),

  // POST: Create a new job posting
  rest.post("/api/jobs", async (req, res, ctx) => {
    if (maybeFail())
      return res(ctx.status(500), ctx.json({ message: "Simulated server error" }));

    const job = await req.json<Job>();

    // Auto-fill fields if missing
    const filledJob: Job = {
      ...job,
      id: job.id || faker.string.uuid(),
      title: job.title || faker.person.jobTitle(),
      skills:
        Array.isArray(job.skills) && job.skills.length > 0
          ? job.skills
          : faker.helpers.arrayElements(
              ["React", "Node.js", "TypeScript", "SQL", "AWS", "Python", "Docker"],
              3
            ),
      package:
        job.package ||
        faker.helpers.arrayElement([
          "$40k - $60k",
          "$60k - $90k",
          "$90k - $120k",
          "$120k+",
        ]),
      startDate:
        job.startDate || faker.date.future().toISOString().split("T")[0],
      endDate:
        job.endDate ||
        faker.date.future({ years: 1 }).toISOString().split("T")[0],
      type:
        job.type ||
        faker.helpers.arrayElement(["Full-Time", "Part-Time", "Intern", "Contract"]),
      order: job.order ?? (await db.jobs.count()),
      status: job.status || "active",
    };

    await db.jobs.add(filledJob);
    return res(ctx.delay(500), ctx.status(201), ctx.json(filledJob));
  }),
];

/* -----------------------------------------------
    CANDIDATE HANDLERS
-------------------------------------------------- */

const candidateHandlers = [
  // GET: Fetch candidates (supports search & stage filters)
  rest.get("/candidates", async (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const stage = req.url.searchParams.get("stage") || "";

    const all = await db.candidates.toArray();
    const filtered = all.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesStage = !stage || c.stage === stage;
      return matchesSearch && matchesStage;
    });

    await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));
    return res(ctx.status(200), ctx.json(filtered));
  }),

  // PATCH: Update candidate (e.g., stage change)
  rest.patch("/candidates/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    const update: Partial<Candidate> = {};

    if (body.stage) update.stage = body.stage;
    await db.candidates.update(id as string, update);
    const updated = await db.candidates.get(id as string);

    await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));

    if (Math.random() < 0.08)
      return res(ctx.status(500), ctx.json({ message: "Simulated write failure" }));

    return res(ctx.status(200), ctx.json(updated));
  }),

  // GET: Candidate timeline
  rest.get("/candidates/:id/timeline", async (req, res, ctx) => {
    const { id } = req.params;

    try {
      if ((db as any).timelines) {
        const timeline = await (db as any).timelines
          .where("candidateId")
          .equals(id as string)
          .toArray();
        return res(ctx.status(200), ctx.json(timeline));
      } else {
        const candidate = await db.candidates.get(id as string);
        const fallback = [
          {
            timestamp: new Date().toISOString(),
            from: "applied",
            to: candidate?.stage ?? "applied",
          },
        ];
        return res(ctx.status(200), ctx.json(fallback));
      }
    } catch {
      return res(ctx.status(500), ctx.json({ message: "Failed to load timeline" }));
    }
  }),

  // POST: Add a new candidate note
  rest.post("/candidates/:id/notes", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();

    const note = {
      id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      candidateId: id as string,
      text: body.text,
      createdAt: new Date().toISOString(),
      author: body.author || "unknown",
    };

    if ((db as any).notes) await (db as any).notes.add(note);

    await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));
    return res(ctx.status(201), ctx.json(note));
  }),

  // GET: Retrieve all notes for a candidate
  rest.get("/candidates/:id/notes", async (req, res, ctx) => {
    const { id } = req.params;

    if ((db as any).notes) {
      const notes = await (db as any).notes
        .where("candidateId")
        .equals(id as string)
        .toArray();
      return res(ctx.status(200), ctx.json(notes));
    }

    return res(ctx.status(200), ctx.json([]));
  }),
];

/* -----------------------------------------------
    ASSESSMENT HANDLERS
-------------------------------------------------- */

export const assessmentHandlers = [
  // GET: Fetch assessment by job ID (creates mock if missing)
  rest.get("/api/assessments/:jobId", async (req, res, ctx) => {
    const { jobId } = req.params;
    let assessment = await db.assessments.where("jobId").equals(jobId as string).first();

    if (!assessment) {
      // Auto-generate a mock assessment
      assessment = {
        id: faker.string.uuid(),
        jobId: jobId as string,
        title: `Assessment for ${faker.company.name()}`,
        sections: [
          {
            id: faker.string.uuid(),
            title: "General Knowledge",
            questions: [
              { id: faker.string.uuid(), label: "What is React?", type: "short", required: true },
              { id: faker.string.uuid(), label: "Explain hooks.", type: "long", required: true },
            ],
          },
        ],
        questions: [
          { id: faker.string.uuid(), label: "What is React?", type: "short", required: true },
          { id: faker.string.uuid(), label: "Explain hooks.", type: "long", required: true },
        ],
      };

      await db.assessments.add(assessment);
    }

    return res(ctx.delay(300), ctx.status(200), ctx.json(assessment));
  }),

  // PUT: Update assessment definition
  rest.put("/api/assessments/:jobId", async (req, res, ctx) => {
    if (maybeFail())
      return res(ctx.status(500), ctx.json({ message: "Simulated server error" }));

    const updatedAssessment = await req.json<Assessment>();
    await db.assessments.put(updatedAssessment);

    return res(ctx.delay(400), ctx.status(200), ctx.json(updatedAssessment));
  }),

  // POST: Submit assessment responses
  rest.post("/api/assessments/:jobId/submit", async (req, res, ctx) => {
    if (maybeFail())
      return res(ctx.status(500), ctx.json({ message: "Simulated server error" }));

    const { jobId } = req.params;
    const responseData = await req.json<Record<string, any>>();

    const response: AssessmentResponse = {
      id: faker.string.uuid(),
      jobId: jobId as string,
      assessmentId: faker.string.uuid(),
      candidateId: faker.string.uuid(), // mock candidate
      answers: responseData,
      submittedAt: new Date().toISOString(),
    };

    await db.responses.add(response);
    return res(ctx.delay(400), ctx.status(201), ctx.json({ success: true, response }));
  }),
];

/* -----------------------------------------------
    EXPORT ALL HANDLERS
-------------------------------------------------- */

export const handlers = [...jobHandlers, ...candidateHandlers, ...assessmentHandlers];
