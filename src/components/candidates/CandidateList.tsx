// -----------------------------------------------------------------------------
// File: CandidateList.tsx
// Purpose: Displays and manages the list of candidates with search, filter,
// selection, bulk delete, and add functionality.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useCandidates } from "../../hooks/useCandidates";
import { Link } from "react-router-dom";
import { Candidate, Stage } from "../../types/candidate";
import { faker } from "@faker-js/faker";
import { db } from "../../db/dexie";

// -----------------------------------------------------------------------------
// Component: CandidateList
// -----------------------------------------------------------------------------
export const CandidateList: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [search, setSearch] = useState("");                         // Search input value
  const [stage, setStage] = useState("");                           // Filter by stage
  const [showAddModal, setShowAddModal] = useState(false);          // Add modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);    // Delete modal visibility
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]); // Track selected IDs

  // ---------------------------------------------------------------------------
  // Load candidate data from Dexie using a custom hook
  // ---------------------------------------------------------------------------
  const { candidatesQuery } = useCandidates(search, stage);

  // Loading and error states
  if (candidatesQuery.isLoading) return <div>Loading...</div>;
  if (candidatesQuery.isError)
    return <div>Error: {(candidatesQuery.error as Error).message}</div>;

  const candidates: Candidate[] = candidatesQuery.data ?? [];
  const stages: Stage[] = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  // ---------------------------------------------------------------------------
  // Handle candidate selection (for multi-delete)
  // ---------------------------------------------------------------------------
  const toggleSelect = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ---------------------------------------------------------------------------
  // Confirm and perform bulk deletion
  // ---------------------------------------------------------------------------
  const confirmDelete = async () => {
    for (const id of selectedCandidates) {
      await db.candidates.delete(id);
    }
    setSelectedCandidates([]);
    setShowDeleteModal(false);
    window.location.reload(); // Refresh list after deletion
  };

  // ---------------------------------------------------------------------------
  // Row renderer for react-window virtualized list
  // ---------------------------------------------------------------------------
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const candidate = candidates[index];
    const isSelected = selectedCandidates.includes(candidate.id);

    return (
      <div
        style={style}
        className={`flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-2 border-b ${
          isSelected ? "bg-blue-900" : "hover:bg-gray-800"
        } hover:text-white transition`}
      >
        {/* Candidate info with selection checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(candidate.id)}
            className="accent-blue-600"
          />
          <Link
            to={`/candidates/${candidate.id}`}
            className="font-medium text-blue-400 hover:underline"
          >
            {candidate.name}
          </Link>
        </div>

        {/* Candidate email */}
        <span className="text-sm md:text-base">{candidate.email}</span>

        {/* Candidate stage */}
        <span className="capitalize px-2 py-1 rounded bg-gray-700 text-gray-200 text-xs md:text-sm mt-1 md:mt-0">
          {candidate.stage}
        </span>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Render component layout
  // ---------------------------------------------------------------------------
  return (
    <div className="p-4 md:p-6">

      {/* ---------------------------------------------------------------------
         Top Controls (Search, Filter, Add, Delete)
      --------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">

        {/* Search + Stage filter */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-gray-200 px-3 py-2 rounded w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-gray-200 px-3 py-2 rounded w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Add and Delete buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Candidate
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={selectedCandidates.length === 0}
            className={`${
              selectedCandidates.length === 0
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500"
            } text-white px-4 py-2 rounded`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
         Candidate List (Virtualized with react-window)
      --------------------------------------------------------------------- */}
      <List height={600} itemCount={candidates.length} itemSize={60} width="100%">
        {Row}
      </List>

      {/* ---------------------------------------------------------------------
         Add Candidate Modal
      --------------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-100">Add Candidate</h2>
            <AddCandidateForm
              onCancel={() => setShowAddModal(false)}
              onSave={() => {
                setShowAddModal(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
         Delete Confirmation Modal
      --------------------------------------------------------------------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 text-gray-100">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete {selectedCandidates.length} selected
              candidate(s)?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Subcomponent: AddCandidateForm
// Provides inline form inside Add Candidate modal
// -----------------------------------------------------------------------------
const AddCandidateForm: React.FC<{ onCancel: () => void; onSave: () => void }> = ({
  onCancel,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("applied");

  // ---------------------------------------------------------------------------
  // Handle candidate creation
  // ---------------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!name || !email) return;

    const newCandidate: Candidate = {
      id: faker.string.uuid(),
      name,
      email,
      stage,
      jobId: faker.string.uuid(),
    };

    await db.candidates.add(newCandidate);
    onSave();
  };

  // ---------------------------------------------------------------------------
  // Render form fields
  // ---------------------------------------------------------------------------
  return (
    <div>
      {/* Name */}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 bg-gray-900 border border-gray-700 text-gray-100 p-2 rounded"
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 bg-gray-900 border border-gray-700 text-gray-100 p-2 rounded"
      />

      {/* Stage selection */}
      <select
        value={stage}
        onChange={(e) => setStage(e.target.value as Stage)}
        className="w-full mb-4 bg-gray-900 border border-gray-700 text-gray-100 p-2 rounded"
      >
        <option value="applied">Applied</option>
        <option value="screen">Screen</option>
        <option value="tech">Tech</option>
        <option value="offer">Offer</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};
