// -----------------------------------------------------------------------------
// File: AddCandidateModal.tsx
// Purpose: Provides a modal for adding or editing candidate details in the system.
// Supports name, email, job assignment, and stage selection.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { db } from "../../db/dexie";
import { Candidate, Stage } from "../../types/candidate.d";

// -----------------------------------------------------------------------------
// Props Interface
// -----------------------------------------------------------------------------
interface AddCandidateModalProps {
  isOpen: boolean;                            // Controls visibility of modal
  onClose: () => void;                        // Called when modal is closed
  onSaved: (candidate: Candidate) => void;    // Callback triggered after saving
  candidateToEdit?: Candidate | null;         // Optional existing candidate for editing
}

// -----------------------------------------------------------------------------
// Component: AddCandidateModal
// -----------------------------------------------------------------------------
export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  candidateToEdit,
}) => {

  // ---------------------------------------------------------------------------
  // Local state for form input fields
  // ---------------------------------------------------------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    stage: "applied",
    jobId: "",
  });

  // ---------------------------------------------------------------------------
  // Load candidate data into form when editing, otherwise reset form
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (candidateToEdit) {
      // Populate form with candidate data for editing
      setForm({
        name: candidateToEdit.name,
        email: candidateToEdit.email,
        stage: candidateToEdit.stage,
        jobId: candidateToEdit.jobId,
      });
    } else {
      // Reset form when adding a new candidate
      setForm({
        name: "",
        email: "",
        stage: "applied",
        jobId: "",
      });
    }
  }, [candidateToEdit]);

  // ---------------------------------------------------------------------------
  // Handle input field changes
  // ---------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------------------------
  // Handle form submission for both Add and Edit modes
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for required fields
    if (!form.name || !form.email) {
      alert("Please fill all required fields");
      return;
    }

    if (candidateToEdit) {
      // Update existing candidate record
      const updated = { ...candidateToEdit, ...form, stage: form.stage as Stage };
      await db.candidates.put(updated);
      onSaved(updated);
    } else {
      // Create and add a new candidate record
      const newCandidate: Candidate = {
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        stage: form.stage as Candidate["stage"],
        jobId: form.jobId || "unassigned",
        createdAt: new Date().toISOString(),
      };
      await db.candidates.add(newCandidate);
      onSaved(newCandidate);
    }

    // Close modal after save
    onClose();
  };

  // ---------------------------------------------------------------------------
  // Hide modal when not open
  // ---------------------------------------------------------------------------
  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // Render modal structure
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md text-gray-100 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {candidateToEdit ? "Edit Candidate" : "Add Candidate"}
        </h2>

        {/* Candidate Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
          />

          {/* Email Field */}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
          />

          {/* Stage Selector */}
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          >
            {["applied", "screen", "tech", "offer", "hired", "rejected"].map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Job ID Field (optional) */}
          <input
            name="jobId"
            placeholder="Job ID (optional)"
            value={form.jobId}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
            >
              {candidateToEdit ? "Save Changes" : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
