// JobRow.tsx
// Renders a single job entry row inside the jobs table with edit and archive actions.

import React from "react";
import { Job } from "../../types/job";

// Props definition for the JobRow component.
interface JobRowProps {
  job: Job; // The job data to display.
  onEdit: (job: Job) => void; // Function triggered when editing a job.
  onArchiveToggle: (job: Job) => void; // Function triggered to archive or unarchive a job.
}

export const JobRow: React.FC<JobRowProps> = ({ job, onEdit, onArchiveToggle }) => {
  // Determine if the job end date has already passed.
  const today = new Date();
  const isPast = job.endDate ? new Date(job.endDate) < today : false;

  // Helper function to format date values into MM/DD/YYYY format.
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    // Table row for each job.
    // Adds visual feedback on hover and slightly dims past jobs.
    <tr className={`transition-all hover:bg-gray-400 ${isPast ? "opacity-90" : ""}`}>
      {/* Job title */}
      <td className="px-4 py-3 font-semibold">{job.title}</td>

      {/* Job status column with conditional color */}
      <td
        className={`px-4 py-3 font-semibold ${
          job.status === "active" ? "text-yellow-400" : "text-purple-900"
        }`}
      >
        {job.status}
      </td>

      {/* Job tags */}
      <td className="px-4 py-3 text-gray-900 rounded font-semibold">
        {job.tags?.join(", ") || "-"}
      </td>

      {/* Job skills */}
      <td className="px-4 py-3 font-semibold">
        {job.skills?.join(", ") || "-"}
      </td>

      {/* Start and end date */}
      <td className="px-4 py-3 font-semibold">
        {formatDate(job.startDate)} → {formatDate(job.endDate)}
      </td>

      {/* Package or salary info */}
      <td className="px-4 py-3 font-semibold">{job.package || "-"}</td>

      {/* Job type badge with different background colors */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-black font-semibold
            ${job.type === "Full-Time" ? "bg-blue-600" : ""}
            ${job.type === "Part-Time" ? "bg-yellow-500" : ""}
            ${job.type === "Intern" ? "bg-green-500" : ""}
            ${job.type === "Contract" ? "bg-purple-600" : ""}`}
        >
          {job.type || "-"}
        </span>
      </td>

      {/* Action buttons for Edit and Archive */}
      <td className="px-4 py-3 flex gap-2">
        {/* Edit job button */}
        <button
          className="text-blue-900 hover:underline font-medium"
          onClick={() => onEdit(job)}
        >
          Edit
        </button>

        {/* Archive or unarchive button with color toggle */}
        <button
          className={`font-medium ${
            job.status === "archived" ? "text-green-600" : "text-red-600"
          } hover:underline`}
          onClick={() => onArchiveToggle(job)}
        >
          {job.status === "archived" ? "Unarchive" : "Archive"}
        </button>
      </td>
    </tr>
  );
};
