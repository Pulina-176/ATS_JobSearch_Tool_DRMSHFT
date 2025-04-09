import React, { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { getKeyByValue } from "../utils/simple_functions";
import { addJob , clearJobs} from "../slices/atsDataSlice";

import { TrashIcon } from '@heroicons/react/24/outline';

import Filters from "../UI-components/Filters";
import JobDescription from "../UI-components/JobDescription";
import CustomLoading from "../UI-components/CustomLoading";
import AddJob from "../UI-components/AddJob";
import DeleteJobModal from "../UI-components/DeleteJob";

const Results = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState(location.state?.data || []); // Get the data from navigation state
  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  const [selectedJob, setSelectedJob] = useState(null);  // State for job description of currently clicked job
  const [selectedJobID, setSelectedJobID] = useState(null);  // State for job ID of currently clicked job
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);  // State for job title of currently clicked job

  const [isModalOpen, setIsModalOpen] = useState(false); // State for Job Description Modal

  const [selectedJobs, setSelectedJobs] = useState([]);

  const [isProcessing, setIsProcessing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // State for mass job description generation at job submission

  const [jobTitleDict, setJobTitleDict] = useState({});

  
  const dispatch = useDispatch(); // to dispatch actions to the store
  const jobsInStore = useSelector((state) => state.atsData.jobs.map(job => job.id)); // get list of jobs (ids) in the redux store currently

  function clearAllJobsInREDUX () { // clear all jobs in the store when refreshed
    dispatch(clearJobs());
  }

  async function getDescription (description) {  // fetch json format for raw description from gemini
    if (!description) {
      return { error: "No description available." };
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/job_description_ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();  // wait for JSON parsing
      const text = data.data;
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');  // clean the JSON string
            
      return cleanedJSONString;

    } catch (error) {
      console.error("Error fetching description:", error);
      return { error: error.message };
    }
  }

  const parseDescription = (description) => {  // for parsing the description into JSON form
    try {
      const jsonDescription = JSON.parse(description);
      console.log(jsonDescription);
      return jsonDescription      
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  }

  async function addSelectedJobsToStore (selectedJobs) { // add selected jobs to the Redux store

    setIsGenerating(true);

    const jobsToAdd = // set up a Promise
      selectedJobs.filter((job) => !jobsInStore.includes(job.link_no)) // filter out jobs already in the store
                  .map(async(job) => { // asynchoronus for fetching purposes

                    const fetchedDescription = await getDescription(job.full_description);
                    const formatted = await parseDescription(fetchedDescription); // AI generated description

                    const jobToAdd = {
                      title: getKeyByValue(jobTitleDict, job.title),
                      description: formatted,
                      raw_title: job.title,
                      id: job.link_no
                    }
                    dispatch(addJob(jobToAdd)); // add job to the store
                  });

    return Promise.all(jobsToAdd); // wait for all jobs to be added
  }


  useEffect(() => {
    fetchTitleDict();
    clearAllJobsInREDUX(); 
    getNextJobID();
  }, [allJobs]);

  // map current available job titles to a new job title dictionary (created by AI)
  const fetchTitleDict = async () => {
    const jobTitleList = allJobs.map((job) => job.title);
    console.log("jobTitleList: ", jobTitleList);
    try {
      const response = await fetch(`${BACKEND_URL}/job_titles_ai`, {  // fetch job titles from gemini
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

  const closeModal = () => { // Close the modal with the job description
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

  const handleSubmit = async () => {
    await addSelectedJobsToStore(selectedJobs); // Add selected jobs to the store
    setIsGenerating(false);
    navigate("/display", { state: { selectedJobs } }); // Navigate to the selected jobs page
  };

  // State management for the Delete Job Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null); // State for the job id to be deleted
  const openDeleteModal = (jobID) => {
    setJobToDelete(jobID);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // State management for the Add Job Modal
  const [isOpened, setIsOpened] = useState(false);
  const openAddJobModal = () => setIsOpened(true);
  const closeAddJobModal = () => setIsOpened(false);

  // The nextJobID is the value needed to assign a unique ID to each job
  const [nextJobID, setNextJobID] = useState(0);

  async function getNextJobID() { // get the next job ID during first load of page
    const jobIDList = allJobs.map((job) => job.link_no);
    const maxID = Math.max(...jobIDList);
    setNextJobID(maxID + 1);
  }

  useEffect(() => {
    setFilteredJobs(allJobs); // Update filteredJobs whenever allJobs changes
  }, [allJobs]);


  const message3 = "Setting up Filters"
  const message4 = "utilizing full power of AI"

  if (isProcessing) {
    return <CustomLoading message1={message3} message2={message4}/>
  }

  const message1 = "AI is working on the Job Descriptions";
  const message2 = "Stay tuned for the results";

  if (isGenerating) {
    return <CustomLoading message1={message1} message2={message2}/>
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-800 shadow-md">
        <Filters allJobs={allJobs} setFilteredJobs={setFilteredJobs} AI_DICT={jobTitleDict} />
      </div>

      {/* Main Content for Job Listings */}
      <div className="w-3/4 p-10">

        <div className="flex flex-row justify-between my-2">
          <h1 className="text-2xl font-bold mb-5">Your Results</h1>
          <button
            className="px-2 btn-md bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={openAddJobModal}
          >
            Add Job Manually
          </button>
        </div>

        <AddJob visible={isOpened} closeModal={closeAddJobModal} id={nextJobID} setNextID={setNextJobID} currentJobs={allJobs} updateJobs={setAllJobs}/>

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

                <div key={index} className="p-4 rounded-lg bg-gray-800 shadow-md flex-1 min-h-[100px] w-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <button
                      onClick={() => openDeleteModal(job.link_no)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                  <p className="text-sm">Company: {job.company}</p>
                  <p className="text-sm">Location: {job.location}</p>
                  <p className="text-sm">Source: {job.source}</p>

                  <div className="flex items-center justify-between">  
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline cursor-pointer"
                    >
                      Apply Link
                    </a>
                    <p
                      className="text-blue-400 underline cursor-pointer"
                      onClick={() => {
                        setSelectedJobID(job.link_no) // to get a unique ID for each job. Added as an extension for handleJobClick
                        handleJobClick(job)
                      }}
                    >
                      See Description...
                    </p>
                  </div>

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
      {/* Delete Job Modal */}
      {isDeleteModalOpen && (
        <DeleteJobModal handleClose={closeDeleteModal} jobID={jobToDelete} currentJobs={allJobs} updateJobs={setAllJobs}/>
      )}
    </div>
  );
};

export default Results;
