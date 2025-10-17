// Import React and ReactDOM for rendering the app
import React from "react";
import ReactDOM from "react-dom/client";

// Import main App component and global CSS
import App from "./app";
import "./index.css";

// Import React Router for client-side routing
import { BrowserRouter } from "react-router-dom";

// Import React Query for data fetching and caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import database seeding and Dexie DB instance
import { seedDatabase } from "./db/seed";
import { db } from "./db/dexie";

// Expose Dexie DB instance globally for debugging
(window as any).db = db;

// Create a React Query client instance
const queryClient = new QueryClient();

// ============================
// Main application bootstrap
// ============================
async function main() {
  // If in development mode, start the Mock Service Worker (MSW)
  if (import.meta.env.DEV) {
  const { worker } = await import("./api/msw/browser");
  worker.start();
} else {
  const { worker } = await import("./api/msw/browser");
  worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
}


  // Seed the IndexedDB with initial data if empty
  await seedDatabase();
  console.log(" Database seeded successfully");

  // Render the React app into the root DOM element
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {/* Provide React Query client to the app */}
      <QueryClientProvider client={queryClient}>
        {/* Provide Router context for routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

// Call the main bootstrap function
main();
