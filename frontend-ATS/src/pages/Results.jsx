import React, { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { getKeyByValue } from "../utils/simple_functions";
import { clearJobs } from "../slices/atsDataSlice";

import Filters from "../UI-components/Filters";
import JobDescription from "../UI-components/JobDescription";
import Processing from "../UI-components/Processing";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allJobs = location.state?.data || []; // Get the data from navigation state
  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  const [selectedJob, setSelectedJob] = useState(null);  // State for job description of currently clicked job
  const [selectedJobID, setSelectedJobID] = useState(null);  // State for job ID of currently clicked job
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);  // State for job title of currently clicked job

  const [isModalOpen, setIsModalOpen] = useState(false); // State for Job Description Modal

  const [selectedJobs, setSelectedJobs] = useState([]);

  const [isProcessing, setIsProcessing] = useState(true);

  const [jobTitleDict, setJobTitleDict] = useState({});

  
  const dispatch = useDispatch(); // to dispatch actions to the store

  function clearAllJobsInREDUX () { // clear all jobs in the store when refreshed
    dispatch(clearJobs());
  }


  useEffect(() => {
    fetchTitleDict();
    clearAllJobsInREDUX(); 
  }, [allJobs]);

  // map current available job titles to a new job title dictionary (created by AI)
  const fetchTitleDict = async () => {
    const jobTitleList = allJobs.map((job) => job.title);
    console.log("jobTitleList: ", jobTitleList);
    try {
      const response = await fetch("http://127.0.0.1:8000/job_titles_ai", {  // fetch job titles from gemini
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitleList }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json()

      const text = data.data;
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');  // clean the JSON string

      setJobTitleDict(JSON.parse(cleanedJSONString))  // wait for JSON parsing
      setIsProcessing(false);

    } catch (error) {
      console.error("Error fetching jobTitles:", error);
      return { error: error.message };
    }

  }

  const handleJobClick = (job) => { // Open the modal with the job description
    setSelectedJob(job.full_description);
    setSelectedJobTitle(job.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedJob(null); // Clear the selected job description
    setSelectedJobTitle(null); // Clear the selected job title
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

  if (isProcessing) {
    return <Processing />
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-800 shadow-md">
        <Filters allJobs={allJobs} setFilteredJobs={setFilteredJobs} AI_DICT={jobTitleDict} />
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
              <div key={index} className="p-4 rounded-lg bg-gray-800 shadow-md cursor-pointer flex-1 min-h-[100px] w-full" 
                               onClick={() => {
                                            setSelectedJobID(index+1) // to get a unique ID for each job. Added as an extension for handleJobClick
                                            handleJobClick(job)
                                          }}
                               >
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
        <JobDescription description={selectedJob} onClose={closeModal} title={getKeyByValue(jobTitleDict, selectedJobTitle)} raw_title={selectedJobTitle} id={selectedJobID}/>
      )}
    </div>
  );
};

export default Results;
