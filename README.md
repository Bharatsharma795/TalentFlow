#  Recruitment Management Dashboard

A modern recruitment management system built with **React + TypeScript + Vite** that allows users to manage **Jobs, Candidates, and Assessments**.
The application is entirely **frontend-based** using **Mock Service Worker (MSW)** and **Dexie.js (IndexedDB)** — no backend is required.

---

##  Deployed Application

**Live Demo:** [https://talenteflow.netlify.app/]()

##  GitHub Repository

**Repo URL:** [https://github.com/Bharatsharma795/TalentFlow]()

---

##  Project Overview

This project simulates a complete recruitment workflow:

* **Job Management:** Create, edit, and archive job postings.
* **Candidate Tracking:** Manage candidates, view profiles, and update their progress.
* **Assessment Builder:** Build, preview, and assign assessments dynamically.

It demonstrates component-based architecture, local data persistence, and state management with React hooks.

---

##  Project Structure

```
src/
├── api/            # Mock API and MSW setup
│   ├── client.ts
│   ├── msw/
│      ├── browser.ts
│      ├── handlers.ts
│      
│
├── components/     # Reusable UI components
│   ├── job/              # Job board components
│   ├── candidates/       # Candidate management
│   ├── assessments/      # Assessment builder
│   └── home/             # Home dashboard
│
├── hooks/          # Custom hooks (Jobs, Candidates, Assessments)
│   ├── useJobs.ts
│   ├── useCandidates.ts
│   └── useAssessments.ts
│
├── db/             # Dexie local DB setup
│   ├── dexie.ts
│   └── seed.ts
│
├── routes/         # Route-based components
│   ├── JobsRoute.tsx
│   ├── CandidatesRoute.tsx
│   ├── AssessmentRoute.tsx
│   .
│
├── types/          # TypeScript interfaces
│   ├── job.ts
│   ├── candidate.d.ts
│   └── assessment.d.ts
│
├── utils/          # Utility functions (validation, slugify, etc.)
│   ├── validations.ts
│   ├── slugify.ts
│   └── conditionalEval.ts
│
├── app.tsx         # App layout and router
├── main.tsx        # App entry point
└── index.css       # Tailwind base styles

```

---

##  Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone [https://github.com/Bharatsharma795/TalentFlow]
cd [talentflow]

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the app in development
npm run dev

# 4️⃣ Build for production
npm run build

# 5️⃣ Preview the build locally
npm run preview
```

---

##  Technical Decisions

###  Framework & Tooling

* **React (with Vite):** Fast development, modern build tool.
* **TypeScript:** Type-safe code, better maintainability.
* **TailwindCSS:** Rapid UI design with utility classes.
* **MSW (Mock Service Worker):** Simulates API calls without a backend.
* **Dexie.js:** Wrapper for IndexedDB to persist data locally.

###  Data Handling

All data (Jobs, Candidates, Assessments) is stored in **IndexedDB** through Dexie and mocked via **MSW** handlers.
This allows CRUD operations without any real backend.

###  Architecture

* **Component-based:** Each feature (Jobs, Candidates, Assessments) has isolated modules.
* **Hooks for logic reuse:** Business logic is extracted into custom hooks.
* **Separation of concerns:** UI, logic, and data access layers are separated cleanly.

---

##  Environment Variables

If needed during deployment (e.g., Netlify or Vercel), set:

```
VITE_API_MOCKING=true
```

This ensures the mock service worker runs properly in production.

---

##  Known Issues

* MSW must be properly initialized for the mock data to load.
* Page reloads may temporarily show an empty state while Dexie re-hydrates.
* Some browsers restrict IndexedDB access in private/incognito mode.

---

##  Future Enhancements

* Add drag-and-drop candidate stage management.
* Integrate external API (e.g., for job posting).
* Add authentication for HR/Admin roles.

---

##  Developer

**Bharat Sharma**

---

## License

This project is licensed under the [MIT License](LICENSE).

---
