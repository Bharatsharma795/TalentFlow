// -----------------------------------------------------------------------------
// RuntimeForm.tsx
// Purpose: Handles rendering and submission logic for an assessment runtime form.
// Supports text, numeric, choice, and file-based question types.
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from "react";
import { Assessment } from "../../types/assessment";

// -----------------------------------------------------------------------------
// Props Interface
// -----------------------------------------------------------------------------
interface RuntimeFormProps {
  assessment: Assessment;                     // Assessment structure passed from builder
  readOnly?: boolean;                         // When true, disables all inputs (used in preview)
  onSubmit?: (answers: Record<string, any>) => void;  // Callback for form submission
}

// -----------------------------------------------------------------------------
// Component: RuntimeForm
// -----------------------------------------------------------------------------
export const RuntimeForm: React.FC<RuntimeFormProps> = ({
  assessment,
  readOnly = false,
  onSubmit,
}) => {
  // Stores user responses keyed by question ID
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // Tracks whether form has been submitted
  const [submitted, setSubmitted] = useState(false);

  // ---------------------------------------------------------------------------
  // Create a structure signature to detect when sections or questions change
  // Used to reset the form if builder modifies structure (add/remove sections)
  // ---------------------------------------------------------------------------
  const structureSignature = useMemo(() => {
    return assessment.sections
      .map(
        (s) => `${s.id}:${(s.questions || []).map((q) => q.id).join(",")}`
      )
      .join("|");
  }, [assessment.sections]);

  // ---------------------------------------------------------------------------
  // Reset form when structure changes
  // This ensures that adding/removing a section resets the answers and submission state
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [structureSignature]);

  // ---------------------------------------------------------------------------
  // Handle change of input value for any question type
  // ---------------------------------------------------------------------------
  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Flatten all questions from all sections into a single array for validation
  const allQuestions = useMemo(
    () => assessment.sections.flatMap((s) => s.questions || []),
    [assessment.sections]
  );

  // Check if any questions exist at all
  const hasQuestions = allQuestions.length > 0;

  // ---------------------------------------------------------------------------
  // Check if all required questions are filled before allowing submission
  // ---------------------------------------------------------------------------
  const allRequiredAnswered = allQuestions.every((q) => {
    if (!q.required) return true;
    const val = answers[q.id];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  });

  // ---------------------------------------------------------------------------
  // Handle form submission
  // ---------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    // Prevent submission if there are no questions
    if (!hasQuestions) {
      alert("No questions available to submit.");
      return;
    }

    // Prevent submission if required questions are not answered
    if (!allRequiredAnswered) {
      alert("Please fill all required questions before submitting.");
      return;
    }

    // Log and submit collected answers
    console.log("Submitting answers:", answers);
    onSubmit(answers);
    setSubmitted(true);
  };

  // ---------------------------------------------------------------------------
  // Render form UI dynamically from assessment structure
  // ---------------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white shadow"
    >
      {/* Render all sections */}
      {assessment.sections.map((section) => (
        <div key={section.id} className="border p-3 rounded bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">{section.title}</h3>

          {/* Render all questions in this section */}
          {section.questions.map((q) => (
            <div key={q.id} className="mb-3">
              <label className="block font-medium mb-1">
                {q.label}
                {q.required && <span className="text-red-500">*</span>}
              </label>

              {/* Short Answer Question */}
              {q.type === "short" && (
                <input
                  type="text"
                  className="border rounded p-2 w-full"
                  disabled={readOnly || submitted}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {/* Long Answer Question */}
              {q.type === "long" && (
                <textarea
                  className="border rounded p-2 w-full"
                  disabled={readOnly || submitted}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {/* Numeric Question */}
              {q.type === "numeric" && (
                <input
                  type="number"
                  className="border rounded p-2 w-full"
                  disabled={readOnly || submitted}
                  onChange={(e) =>
                    handleChange(q.id, e.target.valueAsNumber ?? "")
                  }
                />
              )}

              {/* Single-Choice / Multi-Choice Questions */}
              {(q.type === "single" || q.type === "multi") && (
                <div className="space-y-1">
                  {q.options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        name={q.id}
                        value={opt}
                        disabled={readOnly || submitted}
                        onChange={(e) => {
                          if (q.type === "single") handleChange(q.id, opt);
                          else {
                            const prev = answers[q.id] || [];
                            handleChange(
                              q.id,
                              e.target.checked
                                ? [...prev, opt]
                                : prev.filter((v: string) => v !== opt)
                            );
                          }
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* File Upload Question */}
              {q.type === "file" && (
                <input
                  type="file"
                  className="border rounded p-2 w-full"
                  disabled={readOnly || submitted}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleChange(q.id, file.name);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Submit Button - only visible when not in read-only mode */}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!hasQuestions || submitted}
            className={`px-4 py-2 rounded text-white transition ${
              !hasQuestions || submitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitted ? "Submitted" : "Submit Assessment"}
          </button>

          {/* Show submission success indicator */}
          {submitted && (
            <span className="text-green-600 font-medium">Submitted!</span>
          )}
        </div>
      )}
    </form>
  );
};
