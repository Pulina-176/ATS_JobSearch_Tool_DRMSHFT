import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getKeyByValue } from "../utils/simple_functions";
import { addJob, clearJobs } from "../slices/atsDataSlice";

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
  const [allJobs, setAllJobs] = useState(location.state?.data || []);
  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobTitleDict, setJobTitleDict] = useState({});

  const dispatch = useDispatch();
  const jobsInStore = useSelector((state) => state.atsData.jobs.map(job => job.id));

  function clearAllJobsInREDUX() {
    dispatch(clearJobs());
  }

  async function getDescription(description) {
    if (!description) {
      return { error: "No description available." };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/ai_gemini/job_description_ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.data;
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');

      return cleanedJSONString;
    } catch (error) {
      console.error("Error fetching description:", error);
      return { error: error.message };
    }
  }

  const parseDescription = (description) => {
    try {
      const jsonDescription = JSON.parse(description);
      console.log(jsonDescription);
      return jsonDescription;
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  }

  async function addSelectedJobsToStore(selectedJobs) {
    setIsGenerating(true);

    const jobsToAdd = selectedJobs
      .filter((job) => !jobsInStore.includes(job.link_no))
      .map(async (job) => {
        const fetchedDescription = await getDescription(job.full_description);
        const formatted = await parseDescription(fetchedDescription);

        const jobToAdd = {
          title: getKeyByValue(jobTitleDict, job.title),
          description: formatted,
          raw_title: job.title,
          id: job.link_no
        };
        dispatch(addJob(jobToAdd));
      });

    return Promise.all(jobsToAdd);
  }

  useEffect(() => {
    fetchTitleDict();
    clearAllJobsInREDUX();
    getNextJobID();
  }, [allJobs]);

  const fetchTitleDict = async () => {
    const jobTitleList = allJobs.map((job) => job.title);
    console.log("jobTitleList: ", jobTitleList);
    try {
      const response = await fetch(`${BACKEND_URL}/ai_gemini/job_titles_ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitleList }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.data;
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');

      setJobTitleDict(JSON.parse(cleanedJSONString));
      setIsProcessing(false);
    } catch (error) {
      console.error("Error fetching jobTitles:", error);
      return { error: error.message };
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job.full_description);
    setSelectedJobTitle(job.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setSelectedJobTitle(null);
  };

  const handleCheckboxChange = (job) => {
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(job)
        ? prevSelectedJobs.filter((j) => j !== job)
        : [...prevSelectedJobs, job]
    );
  };

  const handleSelectAll = () => {
    if (filteredJobs.every((job) => selectedJobs.includes(job))) {
      setSelectedJobs([]);
      console.log("Deselected all jobs");
    } else {
      setSelectedJobs([...filteredJobs]);
      console.log("Selected all filtered jobs:", filteredJobs);
    }
  };

  const handleSubmit = async () => {
    await addSelectedJobsToStore(selectedJobs);
    setIsGenerating(false);
    navigate("/display", { state: { selectedJobs } });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const openDeleteModal = (jobID) => {
    setJobToDelete(jobID);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const [isOpened, setIsOpened] = useState(false);
  const openAddJobModal = () => setIsOpened(true);
  const closeAddJobModal = () => setIsOpened(false);

  const [nextJobID, setNextJobID] = useState(0);

  async function getNextJobID() {
    const jobIDList = allJobs.map((job) => job.link_no);
    const maxID = Math.max(...jobIDList);
    setNextJobID(maxID + 1);
  }

  // Log filteredJobs to verify sorting
  useEffect(() => {
    console.log("filteredJobs updated:", filteredJobs.map(job => ({
      title: job.title,
      other_info: job.other_info
    })));
  }, [filteredJobs]);

  const message3 = "Setting up Filters";
  const message4 = "utilizing full power of AI";

  if (isProcessing) {
    return <CustomLoading message1={message3} message2={message4} />;
  }

  const message1 = "AI is working on the Job Descriptions";
  const message2 = "Stay tuned for the results";

  if (isGenerating) {
    return <CustomLoading message1={message1} message2={message2} />;
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 shadow-md">
        <Filters allJobs={allJobs} setFilteredJobs={setFilteredJobs} AI_DICT={jobTitleDict} />
      </div>

      {/* Main Content for Job Listings */}
      <div className="w-3/4 p-10">
        <div className="flex flex-row justify-between my-2">
          <h1 className="text-2xl font-bold mb-6">Your Results</h1>


        </div>

        <div className="flex flex-row space-x-4 mb-4">
          {filteredJobs.length > 0 && (
            <div className="mb-4">
              <button
                className=" btn-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={handleSelectAll}
              >
                {filteredJobs.every((job) => selectedJobs.includes(job)) ? "Deselect All" : "Select All"}
              </button>
            </div>
          )}

          <button
            className="px-2 btn-sm bg-black text-white rounded hover:bg-gray-500"
            onClick={openAddJobModal}
          >
            Add Job Manually
          </button>
        </div>

        <AddJob
          visible={isOpened}
          closeModal={closeAddJobModal}
          id={nextJobID}
          setNextID={setNextJobID}
          currentJobs={allJobs}
          updateJobs={setAllJobs}
        />

        <div className="grid gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.link_no} className="flex items-start">
                <label className="inline-flex items-center mt-4 mr-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 bg-white border-2 border-gray-400 rounded focus:ring-black transition duration-200"
                    checked={selectedJobs.includes(job)}
                    onChange={() => handleCheckboxChange(job)}
                  />
                </label>

                <div className="p-4 rounded-lg bg-gray-100 shadow-md flex-1 min-h-[100px] w-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <button
                      onClick={() => openDeleteModal(job.link_no)}
                      className="text-black hover:text-gray-500"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                  <p className="text-md font-bold text-gray-600 mb-2">Company: {job.company}</p>
                  <p className="text-sm">Location: {job.location}</p>
                  <p className="text-sm">Source: {job.source}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {job.other_info.length > 0 ? job.other_info.join(" ➖ ") : "No additional info"}
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 underline cursor-pointer"
                    >
                      Apply Link
                    </a>
                    <p
                      className="text-black underline cursor-pointer"
                      onClick={() => {
                        setSelectedJobID(job.link_no);
                        handleJobClick(job);
                      }}
                    >
                      Learn More
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
          <div className="mt-6 flex space-x-4">

            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-500"
              onClick={handleSubmit}
            >
              Submit Selected Jobs
            </button>
          </div>
        )}
      </div>
      {/* Job Description Modal */}
      {isModalOpen && (
        <JobDescription
          description={selectedJob}
          onClose={closeModal}
          title={getKeyByValue(jobTitleDict, selectedJobTitle)}
          raw_title={selectedJobTitle}
          id={selectedJobID}
        />
      )}
      {/* Delete Job Modal */}
      {isDeleteModalOpen && (
        <DeleteJobModal
          handleClose={closeDeleteModal}
          jobID={jobToDelete}
          currentJobs={allJobs}
          updateJobs={setAllJobs}
        />
      )}
    </div>
  );
};

export default Results;