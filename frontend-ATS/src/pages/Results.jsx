import React, { useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import Filters from "../UI-components/Filters";
import JobDescription from "../UI-components/Jobdescription";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allJobs = location.state?.data || []; // Get the data from navigation state
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const handleJobClick = (job) => {
    setSelectedJob(job.full_description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedJob(null); // Clear the selected job description
  };

  const handleCheckboxChange = (job) => {
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(job)
        ? prevSelectedJobs.filter((j) => j !== job)
        : [...prevSelectedJobs, job]
    );
  };

  const handleSubmit = () => {
    navigate("/display", { state: { selectedJobs } }); // Navigate to the selected jobs page
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-800 shadow-md">
        <Filters allJobs={allJobs} setFilteredJobs={setFilteredJobs} />
      </div>

      {/* Main Content for Job Listings */}
      <div className="w-3/4 p-10">
        <h1 className="text-2xl font-bold mb-5">Your Results</h1>
        <div className="grid gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div key={index} className="flex items-start">
                <label className="inline-flex items-center mt-4 mr-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-6 w-6 text-blue-500 border-2 border-gray-400 rounded focus:ring-blue-500 transition duration-200"
                    checked={selectedJobs.includes(job)}
                    onChange={() => handleCheckboxChange(job)}
                  />
                </label>
              <div key={index} className="p-4 rounded-lg bg-gray-800 shadow-md cursor-pointer flex-1 min-h-[100px] w-full" onClick={() => handleJobClick(job)}>
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
              
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
        {filteredJobs.length > 0 && (
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit Selected Jobs
          </button>
        )}
      </div>
      {/* Job Description Modal */}
      {isModalOpen && (
        <JobDescription description={selectedJob} onClose={closeModal} />
      )}
    </div>
  );
};

export default Results;
