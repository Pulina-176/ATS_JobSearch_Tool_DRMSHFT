import React from "react";
import { createPdf } from "../utils/pdf-lib_function";
import { useLocation } from "react-router-dom";

const PdfPreview = () => {

  const location = useLocation();
  const jobListings = location.state?.selectedJobs || [];

  // let jobTitles = [
  //   "Operations Manager Bank",
  //   "Administrative & Account Assistant",
  //   "Administrative Assistant",
  // ];
  // let countries = ["Dubai", "Dubai", "Dubai"];
  // let platforms = ["Jooble", "Indeed", "Indeed"];
  // let links = [
  //   "https://ae.jooble.org/jdp/3874374147157176006",
  //   "https://devjobs.lk/dev-jobs/client/ads/215?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
  //   "hhttps://devjobs.lk/dev-jobs/client/ads/215?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
  // ];
  let jobTitles = [];
  let countries = [];
  let platforms = [];
  let links = [];

  const handleCreatePDF = () => {
    for (let i = 0; i < jobListings.length; i++) {
      jobTitles.push(jobListings[i].title);
      countries.push(jobListings[i].location);
      platforms.push(jobListings[i].source);
      links.push(jobListings[i].apply_link);
    }

    console.log(jobTitles);
    console.log(countries);

    createPdf(jobTitles, countries, platforms, links);
  }

  



  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Job Listings</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S/N</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobListings.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">{index+1}</td>
                  <td className="py-3 px-4">{job.title}</td>
                  <td className="py-3 px-4">{job.location}</td>
                  <td className="py-3 px-4">{job.source}</td>
                  <td className="py-3 px-4 break-all">
                    <a 
                      href={job.apply_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {job.apply_link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow transition duration-150 ease-in-out"
            onClick={handleCreatePDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
