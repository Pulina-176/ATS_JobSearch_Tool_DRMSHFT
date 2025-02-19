import React from "react";
import { useLocation } from "react-router-dom";

const Display = () => {
  const location = useLocation();
  const selectedJobs = location.state?.selectedJobs || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-5">Selected Jobs</h1>
      <div className="grid gap-6">
        {selectedJobs.length > 0 ? (
          selectedJobs.map((job, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-800 shadow-md">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm">Company: {job.company}</p>
              <p className="text-sm">Location: {job.location}</p>
              <p className="text-sm">Source: {job.source}</p>
              <a
                href={job.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Apply Link
              </a>
            </div>
          ))
        ) : (
          <p>No jobs selected.</p>
        )}
      </div>
    </div>
  );
};

export default Display;