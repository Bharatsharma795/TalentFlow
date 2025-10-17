import React, { useState, useMemo } from "react";
import { useJobs } from "../../hooks/useJobs";
import { JobRow } from "./JobRow";
import { JobModal } from "./JobModal";
import { Job } from "../../types/job";

export const JobsBoard: React.FC = () => {
  const { jobsQuery, createJob, updateJob } = useJobs();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Job>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ✅ Move useMemo ABOVE any return
  const jobs = useMemo(() => {
    if (!jobsQuery.data) return [];
    let filtered = jobsQuery.data;

    filtered = filtered.filter((job) =>
      (job.title || "").toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return filtered;
  }, [jobsQuery.data, search, sortField, sortOrder]);

  // ✅ Handle loading state *after* all hooks are declared
  if (jobsQuery.isLoading) return <div className="p-6 text-center">Loading jobs...</div>;
  if (jobsQuery.isError) return <div>Error: {jobsQuery.error.message}</div>;

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / pageSize);
  const paginatedJobs = jobs.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (job: Job) => {
    setJobToEdit(job);
    setModalOpen(true);
  };

  const handleArchiveToggle = (job: Job) => {
    const confirmMsg =
      job.status === "active"
        ? "Are you sure you want to archive this job?"
        : "Unarchive this job?";
    if (window.confirm(confirmMsg)) {
      updateJob.mutate({
        ...job,
        status: job.status === "active" ? "archived" : "active",
      });
    }
  };

  const handleSave = (job: Partial<Job>) => {
    if (job.id) updateJob.mutate(job as Job);
    else
      createJob.mutate({
        ...job,
        id: crypto.randomUUID(),
        status: "active",
        order: jobs.length,
      } as Job);
    setModalOpen(false);
  };

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => {
            setModalOpen(true);
            setJobToEdit(undefined);
          }}
        >
          + Create Job
        </button>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No jobs found.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setModalOpen(true)}
          >
            Create your first job
          </button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto border rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "title",
                    "status",
                    "tags",
                    "skills",
                    "startDate",
                    "package",
                    "type",
                  ].map((field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field as keyof Job)}
                      className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    onEdit={handleEdit}
                    onArchiveToggle={handleArchiveToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 mb-6 space-x-6">
  {/* Prev Button */}
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className={`px-5 py-2 rounded-md font-medium transition-all duration-300
      ${page === 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-blue-500 text-white shadow-md hover:shadow-blue-400 hover:scale-105 active:scale-95"
      }`}
  >
    ← Prev
  </button>

  {/* Page Info */}
  <span className="text-gray-700 font-semibold text-lg">
    Page {page} of {totalPages}
  </span>

  {/* Next Button */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className={`px-5 py-2 rounded-md font-medium transition-all duration-300
      ${page === totalPages
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-blue-500 text-white shadow-md hover:shadow-blue-400 hover:scale-105 active:scale-95"
      }`}
  >
    Next →
  </button>
</div>

        </>
      )}

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        jobToEdit={jobToEdit}
      />
    </div>
  );
};
