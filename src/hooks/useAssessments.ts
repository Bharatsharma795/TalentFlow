// Importing required React Query hooks for data fetching and mutations
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Importing the IndexedDB instance from Dexie setup
import { db } from "../db/dexie";
// Importing the Assessment type for proper typing
import { Assessment } from "../types/assessment.d";

// Custom React hook to handle fetching and saving of assessments by job ID
export function useAssessments(jobId: string) {
  // Creating a query client instance to manage cached queries
  const queryClient = useQueryClient();

  // --- 1️⃣ Query: Fetch assessment from IndexedDB ---
  const assessmentQuery = useQuery({
    queryKey: ["assessments", jobId], // Unique cache key per job
    queryFn: async (): Promise<Assessment> => {
      // Try fetching the assessment from local IndexedDB
      const assessment = await db.assessments.get(jobId);

      // ✅ Always return an object, even if none exists
      if (!assessment) {
        // If not found, return a default minimal assessment object
        return {
          id: crypto.randomUUID(), // Generate unique ID for a new assessment
          jobId, // Associate with the given job
          title: "Untitled Assessment", // Default title
          sections: [], // Empty sections array
          questions: [], // Empty questions array
        };
      }

      // Return the existing assessment from DB
      return assessment;
    },
  });

  // --- 2️⃣ Mutation: Save or update an assessment in IndexedDB ---
  const saveAssessment = useMutation({
    // Function to perform the mutation (save operation)
    mutationFn: async (updated: Assessment) => {
      await db.assessments.put(updated); // Save or update assessment in IndexedDB
      return updated; // Return the saved data
    },
    // When mutation succeeds, update the cached data for real-time UI sync
    onSuccess: (updated) => {
      queryClient.setQueryData(["assessments", jobId], updated); // Update cache instantly
    },
  });

  // Return both the query and mutation hooks for use in components
  return { assessmentQuery, saveAssessment };
}
