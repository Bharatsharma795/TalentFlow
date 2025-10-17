// src/api/browser.ts

// --- Import MSW setup and request handlers ---
import { setupWorker } from "msw";
import { handlers } from "../msw/handlers";

// --- Create a Service Worker instance with all request handlers ---
// This allows intercepting API calls and mocking responses (no real backend required)
export const worker = setupWorker(...handlers);

// --- Start the MSW worker only in development mode ---
// This ensures API mocking is active only during local development,
// and bypassed in production for performance and realism.

  worker.start({ onUnhandledRequest: "bypass" });

