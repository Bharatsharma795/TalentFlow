// Import React library to define React components
import React from "react";

// Import JobsBoard component which displays the list of jobs
import { JobsBoard } from "../components/job/JobsBoard";

// ============================
// ROUTE COMPONENT: JobsRoute
// ============================
// This component acts as a wrapper route that renders the JobsBoard component
// It will be used inside the router configuration to show all jobs on the jobs page
export const JobsRoute: React.FC = () => {
  return <JobsBoard />; // Render the JobsBoard component directly
};
