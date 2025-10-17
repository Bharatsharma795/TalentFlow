// React imports and dependencies
import React, { useState } from "react";
import { Assessment, Section, Question } from "../../types/assessment";
import { nanoid } from "nanoid";
import { RuntimeForm } from "./RuntimeForm";

// -----------------------------------------------------------------------------
// Component: BuilderPreview
// Purpose: Displays a live preview of the current assessment being built
// -----------------------------------------------------------------------------
export const BuilderPreview: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="font-bold text-lg mb-3">Live Preview</h2>

      {/* If no sections exist, show placeholder text */}
      {assessment.sections.length === 0 ? (
        <p className="text-gray-500">No sections yet. Add one to preview it here.</p>
      ) : (
        // Render runtime form for preview in read-only mode
        <RuntimeForm assessment={assessment} readOnly />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Props Interface for Builder Component
// -----------------------------------------------------------------------------
interface BuilderProps {
  assessment: Assessment;
  onChange: (assessment: Assessment) => void;
}

// -----------------------------------------------------------------------------
// Component: Builder
// Purpose: Handles creation, modification, and management of sections & questions
// -----------------------------------------------------------------------------
export const Builder: React.FC<BuilderProps> = ({ assessment, onChange }) => {
  const [localAssessment, setLocalAssessment] = useState<Assessment>(assessment);

  // Synchronize local state with parent component
  const updateAssessment = (updated: Assessment) => {
    setLocalAssessment(updated);
    onChange(updated);
  };

  // ---------------------------------------------------------------------------
  // Section Management
  // ---------------------------------------------------------------------------

  // Add new section
  const addSection = () => {
    const newSection: Section = {
      id: nanoid(),
      title: "New Section",
      questions: [],
    };
    updateAssessment({
      ...localAssessment,
      sections: [...localAssessment.sections, newSection],
    });
  };

  // Remove a section by ID
  const removeSection = (sectionId: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.filter((s) => s.id !== sectionId),
    });
  };

  // Update section title
  const updateSectionTitle = (sectionId: string, title: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId ? { ...s, title } : s
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Question Management
  // ---------------------------------------------------------------------------

  // Add a question of selected type to a specific section
  const addQuestion = (sectionId: string, type: Question["type"]) => {
    const newQuestion: Question = {
      id: nanoid(),
      label: "New Question",
      type,
      required: false,
      options: type === "single" || type === "multi" ? ["Option 1"] : undefined,
    };
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    });
  };

  // Remove a question from a section
  const removeQuestion = (sectionId: string, questionId: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      ),
    });
  };

  // Update question label text
  const updateQuestionLabel = (sectionId: string, questionId: string, label: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, label } : q
              ),
            }
          : s
      ),
    });
  };

  // Toggle question “required” property
  const toggleRequired = (sectionId: string, questionId: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, required: !q.required } : q
              ),
            }
          : s
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Options Management (for single and multi-choice questions)
  // ---------------------------------------------------------------------------

  // Add an option to a question
  const addOption = (sectionId: string, questionId: string) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: [...(q.options || []), `Option ${q.options?.length! + 1}`],
                    }
                  : q
              ),
            }
          : s
      ),
    });
  };

  // Update an option’s text value
  const updateOption = (
    sectionId: string,
    questionId: string,
    index: number,
    text: string
  ) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options?.map((opt, i) => (i === index ? text : opt)),
                    }
                  : q
              ),
            }
          : s
      ),
    });
  };

  // Remove an option by index
  const removeOption = (sectionId: string, questionId: string, index: number) => {
    updateAssessment({
      ...localAssessment,
      sections: localAssessment.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options?.filter((_, i) => i !== index),
                    }
                  : q
              ),
            }
          : s
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------------------------
  return (
    <div className="p-4 border rounded space-y-4 bg-white shadow">

      {/* Button to add new section */}
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addSection}
      >
        ➕ Add Section
      </button>

      {/* Render all sections dynamically */}
      {localAssessment.sections.map((section) => (
        <div key={section.id} className="border p-3 rounded space-y-2 bg-gray-50">

          {/* Section title input and remove button */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="font-bold text-lg border-b p-1 flex-1"
            />
            <button
              className="text-red-600 ml-2 hover:underline"
              onClick={() => removeSection(section.id)}
            >
              ✖ Remove Section
            </button>
          </div>

          {/* Buttons to add questions of different types */}
          <div className="flex gap-2 flex-wrap">
            {["single", "multi", "short", "long", "numeric", "file"].map((type) => (
              <button
                key={type}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => addQuestion(section.id, type as Question["type"])}
              >
                + {type}
              </button>
            ))}
          </div>

          {/* Render all questions inside this section */}
          <div className="space-y-2">
            {section.questions.map((q) => (
              <div key={q.id} className="border p-2 rounded bg-white">

                {/* Question label and controls */}
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => updateQuestionLabel(section.id, q.id, e.target.value)}
                    className="border px-2 py-1 flex-1 rounded"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={() => toggleRequired(section.id, q.id)}
                    />
                    Required
                  </label>
                  <button
                    onClick={() => removeQuestion(section.id, q.id)}
                    className="text-red-500 hover:underline"
                  >
                    ✖
                  </button>
                </div>

                {/* Option management for single/multi type questions */}
                {(q.type === "single" || q.type === "multi") && (
                  <div className="ml-4 space-y-1">
                    {q.options?.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(section.id, q.id, i, e.target.value)
                          }
                          className="border px-2 py-1 flex-1 rounded"
                        />
                        <button
                          onClick={() => removeOption(section.id, q.id, i)}
                          className="text-red-500 hover:underline"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(section.id, q.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
