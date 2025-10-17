// Import React and required hooks
import React, { useState } from "react";

// Import React Router components for routing and navigation
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// Import route components
import HomePage from "./components/home/HomePage";
import { JobsRoute } from "./routes/JobsRoute";
import { CandidatesRoute } from "./routes/CandidatesRoute";
import { AssessmentRoute } from "./routes/AssessmentRoute";

// ============================
// Main App Component
// ============================
// This is the root component of the application
// It includes a collapsible sidebar and main content area with routing
const App: React.FC = () => {
  const [open, setOpen] = useState(true); // State to control sidebar open/close

  return (
    // Container for the whole page
    <div className="flex min-h-screen bg-gray-50">
      
      {/* ============================ */}
      {/* Sidebar */}
      {/* ============================ */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-300 transform transition-transform duration-300 ease-in-out z-40
        ${open ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        {/* Collapse button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute top-4 right-[-45px] bg-gray-200 text-gray-700 rounded-md p-2 hover:bg-gray-300 transition"
          title={open ? "Close Menu" : "Open Menu"}
        >
          ☰
        </button>

        {/* Navigation links */}
        <nav className="p-4 space-y-2 mt-10">
          {/* Home link */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Home
          </NavLink>

          {/* Jobs link */}
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Jobs
          </NavLink>

          {/* Candidates link */}
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Candidates
          </NavLink>

          {/* Assessments link */}
          <NavLink
            to="/assessments/1"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Assessments
          </NavLink>
        </nav>
      </div>

      {/* ============================ */}
      {/* Main content area */}
      {/* ============================ */}
      <main
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        } p-6`}
      >
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Jobs route */}
          <Route path="/jobs/*" element={<JobsRoute />} />

          {/* Candidates route */}
          <Route path="/candidates/*" element={<CandidatesRoute />} />

          {/* Assessment route for a specific job */}
          <Route path="/assessments/:jobId" element={<AssessmentRoute />} />
        </Routes>
      </main>
    </div>
  );
};

// Export the App component as default
export default App;
