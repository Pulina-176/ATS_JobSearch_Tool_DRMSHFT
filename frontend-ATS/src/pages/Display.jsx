import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Display = () => {
  const location = useLocation();
  const selectedJobs = location.state?.selectedJobs || [];
  const navigate = useNavigate();

  const jobsToATS = useSelector((state) => state.atsData.jobs); // get the current state of jobs in the store

  let ATSjobList = {} // hash table to send jobs for ATS report. This is the data set used to generate the ATS Report

  let ATSReport = [] // array to store ATS report data (fetched from gemini)

  // function to add jobs occupy ATSjobList hash table
  function occupyATSjobList (jobList) {
    jobList.map((job) => {
      if (!(job.title in ATSjobList)) {
        ATSjobList[job.title] = []
        ATSjobList[job.title].push(job.description)
      }
      else {
        ATSjobList[job.title].push(job.description)
      } 
    })
  }

  async function getATSkeywords (title, descriptions) {

    const JobRole = { // to send to backend for ATS keyword functions - refer main.py for object reference
      jobRole: title,
      descriptions: descriptions
    }

    console.log("Sending data:", { title, descriptions });  
    
    try{
      const response = await fetch("http://127.0.0.1:8000/ats_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JobRole),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();  // wait for JSON parsing
      const text = data.data 
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');  // clean the JSON string
      const parsedJSON = JSON.parse(cleanedJSONString);
      console.log("Success:", parsedJSON);

      const ATS_data_set = {
        title: title,
        keywords: parsedJSON
      }

      return ATS_data_set;

    }
    catch(error){
      console.error("Error in getATSkeywords:", error);
      return { error: error.message };
    }
  }
  

  const handlePdfPreview = () => {
    navigate("/preview", { state: { selectedJobs } });
  }

  const handleATSReport = async () => {
    occupyATSjobList(jobsToATS)

    for (const [key, value] of Object.entries(ATSjobList)) {
      const result = await getATSkeywords(key, JSON.stringify(value)); // Wait for each async call
      ATSReport.push(result);
    }

    navigate("/ats-preview", { state: { ATSdata:ATSReport } }); // Navigate to ats-preview page
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
        className="mt-6 px-4 py-2 mx-2 bg-teal-800 text-white rounded hover:bg-teal-600"
        onClick={()=>handleATSReport()}
      > Get ATS Report </button>
    </div>
  );
};

export default Display;