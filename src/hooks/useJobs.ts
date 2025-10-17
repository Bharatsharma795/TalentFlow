// Importing React Query hooks for fetching, mutating, and caching data
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Importing Job type definition for strong typing
import { Job } from "../types/job";
// Importing custom API fetch utility to make HTTP requests
import { apiFetch } from "../api/client";

// Defining the base API endpoint for job-related operations
const JOBS_URL = "/api/jobs";

// Type definition for the React Query key used to fetch job lists
type JobsQueryKey = ["jobs", { search: string; status: string }];

// Function to generate a consistent query key for caching based on filters
const jobsQueryKey = (search: string, status: string): JobsQueryKey => [
  "jobs",
  { search, status },
];

// Custom React hook to handle fetching, creating, updating, and reordering jobs
export function useJobs(search = "", status = "") {
  // Creating a query client instance to interact with React Query's cache
  const queryClient = useQueryClient();

  // --- 1️⃣ Fetch jobs from the API ---
  const jobsQuery = useQuery<Job[], Error>({
    queryKey: jobsQueryKey(search, status), // Cache key with filters
    queryFn: () =>
      apiFetch<Job[]>(
        // Constructing the URL dynamically with query parameters
        `${JOBS_URL}?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`
      ),
    staleTime: 5000, // Cached data stays fresh for 5 seconds before refetching
  });

  // --- 2️⃣ Create a new job ---
  const createJob = useMutation({
    // Mutation function that sends POST request to create a new job
    mutationFn: (job: Job) =>
      apiFetch<Job>(JOBS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job), // Send job data in request body
      }),
    // After successful creation, invalidate all job queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey("", "") });
    },
  });

  // --- 3️⃣ Update an existing job ---
  const updateJob = useMutation({
    // Mutation function that updates a job using PATCH request
    mutationFn: (job: Partial<Job> & { id: string }) =>
      apiFetch<Job>(`${JOBS_URL}/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job), // Send only the updated fields
      }),
    // Invalidate job queries after successful update to ensure UI sync
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey("", "") });
    },
  });

  // --- 4️⃣ Reorder a job (change its position/order) ---
  const reorderJob = useMutation({
    // Mutation function to reorder a job based on new order index
    mutationFn: ({ fromId, fromOrder, toOrder }: { fromId: string; fromOrder: number; toOrder: number }) =>
      apiFetch<Job>(`${JOBS_URL}/${fromId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromOrder, toOrder }),
      }),

    // Optimistic update before server confirmation (for smoother UX)
    onMutate: async ({ fromId, toOrder }) => {
      // Pause any ongoing queries to prevent overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ["jobs"] });

      // Store the previous state for rollback if needed
      const previous = queryClient.getQueryData<Job[]>(["jobs"]);

      // Immediately update job order locally
      if (previous) {
        queryClient.setQueryData<Job[]>(
          ["jobs"],
          previous.map((j) =>
            j.id === fromId ? { ...j, order: toOrder } : j
          )
        );
      }

      // Return context for rollback in case of error
      return { previous };
    },

    // Rollback to previous state if mutation fails
    onError: (_err, _variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(["jobs"], context.previous);
      }
    },

    // After mutation settles (success or error), refetch latest job data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey("", "") });
    },
  });

  // Return all hooks for use in components
  return { jobsQuery, createJob, updateJob, reorderJob };
}
