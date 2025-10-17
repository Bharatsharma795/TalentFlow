// Importing necessary hooks from React Query for data fetching and mutations
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Importing the Candidate type for proper TypeScript typing
import { Candidate } from "../types/candidate.d";
// Importing a custom API fetch helper for making network requests
import { apiFetch } from "../api/client";

// Defining the base API endpoint for candidates
const CANDIDATES_URL = "/candidates";

// Custom hook to manage fetching and updating candidate data
export function useCandidates(search = "", stage = "") {
  // Getting the React Query client to manage cached data
  const queryClient = useQueryClient();

  // --- 1️⃣ Query: Fetch candidates based on search and stage filters ---
  const candidatesQuery = useQuery({
    queryKey: ["candidates", search, stage], // Unique cache key that depends on filters
    queryFn: async (): Promise<Candidate[]> => {
      const params = new URLSearchParams(); // Create query parameters for API request
      if (search) params.append("search", search); // Add search term if provided
      if (stage) params.append("stage", stage); // Add stage filter if provided

      // Fetch candidates from the API using constructed URL parameters
      return apiFetch<Candidate[]>(`${CANDIDATES_URL}?${params.toString()}`);
    },
  });

  // --- 2️⃣ Mutation: Update a candidate's stage (status) ---
  const updateCandidate = useMutation({
    // Mutation function to send an update request to the API
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      return apiFetch<Candidate>(`${CANDIDATES_URL}/${id}`, {
        method: "PATCH", // Partial update of candidate data
        body: JSON.stringify({ stage }), // Sending updated stage in request body
      });
    },
    // On success, invalidate related queries to refetch and sync updated data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] }); // Refresh the candidate list
    },
  });

  // Returning both the query (for fetching) and mutation (for updating)
  return { candidatesQuery, updateCandidate };
}
