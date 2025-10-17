// -----------------------------------------------------------------------------
// File: JobModal.tsx
// Purpose: Modal form for creating or editing job postings.
// Provides fields for title, tags, skills, dates, package, and type.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Job, JobType } from "../../types/job";

// -----------------------------------------------------------------------------
// Props Interface
// -----------------------------------------------------------------------------
interface JobModalProps {
  isOpen: boolean;                      // Modal visibility
  onClose: () => void;                  // Close handler
  onSave: (job: Partial<Job>) => void;  // Save handler (create/update)
  jobToEdit?: Job;                      // Optional job for editing mode
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const JOB_TYPES: JobType[] = ["Full-Time", "Part-Time", "Intern", "Contract"];

// -----------------------------------------------------------------------------
// Component: JobModal
// -----------------------------------------------------------------------------
export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  jobToEdit,
}) => {
  // ---------------------------------------------------------------------------
  // Local State (controlled form fields)
  // ---------------------------------------------------------------------------
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [skills, setSkills] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pkg, setPkg] = useState("");
  const [type, setType] = useState<JobType>("Full-Time");

  // ---------------------------------------------------------------------------
  // Effect: Prefill form fields if editing an existing job
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setTags(jobToEdit.tags?.join(", ") || "");
      setSkills(jobToEdit.skills?.join(", ") || "");
      setStartDate(jobToEdit.startDate || "");
      setEndDate(jobToEdit.endDate || "");
      setPkg(jobToEdit.package || "");
      setType(jobToEdit.type || "Full-Time");
    } else {
      // Reset form for new job creation
      setTitle("");
      setTags("");
      setSkills("");
      setStartDate("");
      setEndDate("");
      setPkg("");
      setType("Full-Time");
    }
  }, [jobToEdit]);

  // ---------------------------------------------------------------------------
  // Close modal immediately if not open
  // ---------------------------------------------------------------------------
  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // Handle Save: Validate inputs, normalize data, and trigger save callback
  // ---------------------------------------------------------------------------
  const handleSave = () => {
    if (!title.trim()) return alert("Title is required");

    const normalizedJob: Partial<Job> = {
      ...jobToEdit,
      title: title.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      package: pkg || undefined,
      type,
    };

    onSave(normalizedJob);
    onClose();
  };

  // ---------------------------------------------------------------------------
  // Render modal layout
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-96 space-y-4 shadow-xl border border-gray-700">
        {/* Modal Header */}
        <h2 className="text-xl font-bold text-white mb-2">
          {jobToEdit ? "Edit Job" : "Create Job"}
        </h2>

        {/* Job Title */}
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Skills */}
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dates */}
        <div className="flex gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Package */}
        <input
          type="text"
          placeholder="Package"
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
          className="w-full border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Job Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as JobType)}
          className="w-full border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
