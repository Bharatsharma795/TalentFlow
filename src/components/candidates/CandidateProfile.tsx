import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../db/dexie";
import {
  Candidate,
  CandidateTimelineEntry,
  CandidateNote,
  Stage,
} from "../../types/candidate.d";
import { faker } from "@faker-js/faker";

const mockUsers = ["@alice", "@bob", "@carol", "@dave", "@eve"];

export const CandidateProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<CandidateTimelineEntry[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    stage: "",
  });

  // ✅ Load candidate data
  useEffect(() => {
    async function load() {
      if (!id) return;
      const found = await db.candidates.get(id);
      if (!found) return;

      setCandidate(found);
      setForm({
        name: found.name,
        email: found.email,
        stage: found.stage,
      });

      // fake timeline
      const t: CandidateTimelineEntry[] = [
        { timestamp: faker.date.past().toISOString(), from: "applied", to: "screen" },
        { timestamp: faker.date.recent().toISOString(), from: "screen", to: found.stage },
      ];
      setTimeline(t);

      const n = (await db.table("notes").toArray()).filter(
        (note: CandidateNote) => note.candidateId === id
      );
      setNotes(n);
    }
    load();
  }, [id]);

  // ✅ Add Note
  const addNote = async () => {
    if (!noteText.trim() || !id) return;
    const newNote: CandidateNote = {
      id: faker.string.uuid(),
      candidateId: id,
      text: noteText,
      createdAt: new Date().toISOString(),
      author: "",
      mentions: [],
    };
    await db.table("notes").add(newNote);
    setNotes((prev) => [...prev, newNote]);
    setNoteText("");
  };

  // ✅ Save Candidate Edits
  const handleSave = async () => {
    if (!candidate) return;
    const updated: Candidate = {
      ...candidate,
      ...form,
      stage: form.stage as Stage,
    };
    await db.candidates.put(updated);
    setCandidate(updated);
    setEditing(false);
    alert("✅ Candidate updated successfully!");
  };

  // ✅ Delete Candidate
  const handleDelete = async () => {
    if (!candidate) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );
    if (!confirmDelete) return;
    await db.candidates.delete(candidate.id);
    alert("🗑 Candidate deleted successfully!");
    navigate("/candidates");
  };

  // ✅ Back Navigation
  const handleBack = () => {
    navigate("/candidates");
  };

  // ⏳ Loading state
  if (!candidate) {
    return <div className="p-6 text-center text-gray-400">Loading candidate...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{candidate.name}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition"
          >
            {editing ? "Cancel Edit" : " Edit Candidate"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition"
          >
            🗑 Delete
          </button>
          {/* ✅ Back Button */}
          <button
            onClick={handleBack}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* EDIT FORM */}
      {editing && (
        <div className="bg-gray-800 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-3">Edit Candidate Info</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name"
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full"
            />
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full"
            >
              <option value="">Select stage</option>
              {["applied", "screen", "tech", "offer", "hired", "rejected"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Timeline</h2>
        <ul className="space-y-2">
          {timeline.map((t, i) => (
            <li key={i} className="bg-gray-800 p-3 rounded flex justify-between">
              <span>
                {t.from} → {t.to}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(t.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* NOTES */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="bg-gray-800 p-3 rounded">
              <p>{n.text}</p>
              <small className="text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note with @mentions..."
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-gray-100"
          />
          <div className="mt-2 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Suggestions: {mockUsers.join(", ")}
            </div>
            <button
              onClick={addNote}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition"
            >
              Add Note
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
