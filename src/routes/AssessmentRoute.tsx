// Importing React and required components
import React from "react";
// Importing the builder component for creating/editing assessments
import { Builder } from "../components/assessments/Builder";
// Importing the live preview component to visualize assessment structure
import { BuilderPreview } from "../components/assessments/BuilderPreview";
// Importing runtime form component to simulate candidate responses
import { RuntimeForm } from "../components/assessments/RuntimeForm";
// Importing custom React hook to fetch and save assessments
import { useAssessments } from "../hooks/useAssessments";
// Importing type definition for AssessmentResponse
import type { AssessmentResponse } from "../types/assessment";

// Component representing the Assessment route/page
export const AssessmentRoute: React.FC = () => {
  // Temporary fixed job ID for demo purposes (can be dynamic later)
  const jobId = "job-1";

  // Using custom hook to load and manage assessment data
  const { assessmentQuery, saveAssessment } = useAssessments(jobId);

  // Handling loading and error states during data fetch
  if (assessmentQuery.isLoading) return <p>Loading assessment...</p>;
  if (assessmentQuery.error) return <p>Error loading assessment</p>;

  // Extracting assessment data once loaded
  const assessment = assessmentQuery.data!;
  if (!assessment) return <p>No assessment found.</p>;

  // --- 🧠 Function to handle submission of test responses ---
  const handleSubmitAnswers = (answers: Record<string, any>) => {
    // Constructing a new response object
    const response: AssessmentResponse = {
      id: crypto.randomUUID(), // Unique response ID
      jobId: assessment.jobId, // Associated job ID
      assessmentId: assessment.id ?? assessment.jobId, // Link to current assessment
      candidateId: "local_candidate", // Placeholder candidate ID (can be replaced)
      answers, // User’s filled answers
      submittedAt: new Date().toISOString(), // Timestamp of submission
    };

    // Storing the response locally in browser storage for now
    const stored = JSON.parse(localStorage.getItem("responses") || "[]");
    stored.push(response);
    localStorage.setItem("responses", JSON.stringify(stored));

    // Simple success alert message
    alert("Response submitted successfully!");
  };

  // --- 🧩 Page Structure ---
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* === Section 1: Assessment Builder === */}
      <section className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2 text-blue-700">Assessment Builder</h2>
        <p className="text-sm text-gray-500 mb-4">
          Create and edit questions for this assessment.
        </p>
        {/* Builder component allows creating and saving assessment */}
        <Builder assessment={assessment} onChange={saveAssessment.mutate} />
      </section>

      {/* === Section 2: Live Preview === */}
      <section className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2 text-green-700">Live Preview</h2>
        <p className="text-sm text-gray-500 mb-4">
          See what the assessment will look like to candidates.
        </p>
        {/* Displays real-time visual preview of current assessment */}
        <BuilderPreview assessment={assessment} />
      </section>

      {/* === Section 3: Runtime Form === */}
      <section className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2 text-purple-700">Test Runtime Form</h2>
        <p className="text-sm text-gray-500 mb-4">
          Try answering the assessment as if you were a candidate.
        </p>
        {/* Simulates form submission to test how candidates interact */}
        <RuntimeForm assessment={assessment} onSubmit={handleSubmitAnswers} />
      </section>
    </div>
  );
};

// Exporting the component as default
export default AssessmentRoute;
