// Import necessary hooks and libraries
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // React Query for data fetching, mutation, and cache management
import { Candidate } from "../types/candidate"; // Type definition for Candidate object
import { db } from "../db/dexie"; // Dexie instance for local IndexedDB database
import { Routes, Route } from "react-router-dom"; // React Router for navigation between pages
import { CandidateList } from "../components/candidates/CandidateList"; // Component that displays all candidates
import { CandidateProfile } from "../components/candidates/CandidateProfile"; // Component that displays individual candidate details
import { KanbanBoard } from "../components/candidates/KanbanBoard"; // Component that displays candidates in a Kanban-style board

// ====================
// ROUTE DEFINITION
// ====================
export const CandidatesRoute = () => {
  return (
    <Routes>
      {/* Default route — shows list of all candidates */}
      <Route path="/" element={<CandidateList />} />

      {/* Route to show a specific candidate’s profile based on their ID */}
      <Route path=":id" element={<CandidateProfile />} />

      {/* Route to display Kanban board view of candidates */}
      <Route path="kanban" element={<KanbanBoard />} />
    </Routes>
  );
};

// ====================
// CUSTOM HOOK: useCandidates
// Handles fetching and updating candidate data
// ====================
export function useCandidates(search = "", stage = "") {
  const queryClient = useQueryClient(); // React Query client for cache control and invalidation

  // --------------------
  // FETCH CANDIDATES
  // --------------------
  const candidatesQuery = useQuery({
    queryKey: ["candidates", search, stage], // Unique key based on filters (for caching)
    queryFn: async () => {
      // Build URL query parameters dynamically
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (stage) params.append("stage", stage);

      // Fetch candidate data from the backend API
      const res = await fetch(`/candidates?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch candidates"); // Error handling
      return res.json() as Promise<Candidate[]>; // Return list of candidates
    },
  });

  // --------------------
  // UPDATE CANDIDATE STAGE
  // --------------------
  const updateCandidate = useMutation({
    // Function to update candidate stage
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      // 1️⃣ Update locally in Dexie for faster UI feedback
      await db.candidates.update(id, { stage });

      // 2️⃣ Send PATCH request to API to update on server
      const res = await fetch(`/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }), // Send only the updated stage
      });

      // 3️⃣ Handle potential API failure
      if (!res.ok) throw new Error("Failed to update candidate");

      // 4️⃣ Return updated data
      return res.json();
    },

    // Invalidate query after success → refresh candidate list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });

  // Return both the query and mutation to components
  return { candidatesQuery, updateCandidate };
}
