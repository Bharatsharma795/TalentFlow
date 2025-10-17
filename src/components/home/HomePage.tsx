// -----------------------------------------------------------------------------
// File: HomePage.tsx
// Purpose: Display the main landing page of TalentFlow with navigation to core modules.
// -----------------------------------------------------------------------------

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// -----------------------------------------------------------------------------
// Component: HomePage
// -----------------------------------------------------------------------------
const HomePage: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Feature list for quick access cards on the homepage
  // Each feature includes a title, description, link, and gradient color style
  // ---------------------------------------------------------------------------
  const features = [
    {
      name: "Jobs",
      desc: "Create, edit, and manage job openings with ease.",
      link: "/jobs",
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "Candidates",
      desc: "Track candidates through every hiring stage.",
      link: "/candidates",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Assessments",
      desc: "Build custom assessments to evaluate applicants.",
      link: "/assessments/1",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // ---------------------------------------------------------------------------
  // Render homepage layout
  // Includes background animation, hero section, feature cards, and footer
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
          Welcome to <span className="text-blue-600">TalentFlow</span>
        </h1>

        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Your complete hiring solution — manage jobs, candidates, and
          assessments all in one powerful platform.
        </p>

        {/* Primary CTA Button */}
        <div className="flex justify-center gap-4 mb-10">
          <Link
            to="/jobs"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Get Started →
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 max-w-5xl w-full"
      >
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.link}
            className={`p-8 rounded-xl shadow-lg bg-gradient-to-br ${feature.color} text-white hover:shadow-2xl transition transform hover:-translate-y-1`}
          >
            <h2 className="text-2xl font-bold mb-2">{feature.name}</h2>
            <p className="text-sm opacity-90">{feature.desc}</p>
            <span className="text-sm mt-3 inline-block underline opacity-90">
              Explore →
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-12 relative z-10">
        © {new Date().getFullYear()} TalentFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
