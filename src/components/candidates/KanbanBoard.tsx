// -----------------------------------------------------------------------------
// File: KanbanBoard.tsx
// Purpose: Visualize and manage candidate stages in a drag-and-drop Kanban board.
// -----------------------------------------------------------------------------

import React from "react";
import { useCandidates } from "../../hooks/useCandidates";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { Stage } from "../../types/candidate";

// -----------------------------------------------------------------------------
// Define available stages (columns in the Kanban board)
// -----------------------------------------------------------------------------
const stages: Stage[] = ["applied", "screen", "tech", "offer", "hired", "rejected"];

// -----------------------------------------------------------------------------
// Component: KanbanBoard
// -----------------------------------------------------------------------------
export const KanbanBoard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Load candidate data and provide mutation for updating candidate stage
  // ---------------------------------------------------------------------------
  const { candidatesQuery, updateCandidate } = useCandidates();
  const candidates = candidatesQuery.data || [];

  // ---------------------------------------------------------------------------
  // Configure drag sensors for mouse/touch interaction
  // ---------------------------------------------------------------------------
  const sensors = useSensors(useSensor(PointerSensor));

  // ---------------------------------------------------------------------------
  // Handle drag end event - triggered when a candidate is dropped into a new stage
  // ---------------------------------------------------------------------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id.toString();
    const newStage = over.id.toString() as Stage;

    // Update the candidate’s stage in the database
    updateCandidate.mutate({ id: candidateId, stage: newStage });
  };

  // ---------------------------------------------------------------------------
  // Render Kanban board layout
  // ---------------------------------------------------------------------------
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
        {/* Render each stage as a column */}
        {stages.map((stage) => (
          <div
            key={stage}
            id={stage}
            className="min-w-[250px] bg-gray-800 rounded p-2 flex-1"
          >
            {/* Stage header */}
            <h3 className="font-bold mb-2 text-gray-200 capitalize">{stage}</h3>

            {/* Candidate cards filtered by stage */}
            {candidates
              .filter((c) => c.stage === stage)
              .map((c) => (
                <div
                  key={c.id}
                  id={c.id}
                  className="bg-gray-700 text-gray-100 p-2 mb-2 rounded cursor-pointer hover:bg-gray-600"
                >
                  {c.name}
                </div>
              ))}
          </div>
        ))}
      </div>
    </DndContext>
  );
};
