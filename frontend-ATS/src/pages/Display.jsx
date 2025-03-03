import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Display = () => {
  const location = useLocation();
  const selectedJobs = location.state?.selectedJobs || [];
  const navigate = useNavigate();

  const handlePdfPreview = () => {
    navigate("/preview", { state: { selectedJobs } });
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-5">Selected Jobs</h1>
      <div className="grid gap-6">
        {selectedJobs.length > 0 ? (
          selectedJobs.map((job, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-900 shadow-md">
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
      <button
        className="mt-6 px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={
          handlePdfPreview
        }
      > Print JOBDES Report </button>
            <button
        className="mt-6 px-4 py-2 mx-2 bg-teal-800 text-white rounded hover:bg-blue-600"
        onClick={()=>console.log("developing...")}
      > Get ATS Report </button>
    </div>
  );
};

export default Display;