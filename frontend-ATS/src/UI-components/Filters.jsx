import React, { useState } from "react";

const Filters = ({ allJobs, setFilteredJobs }) => {
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Extract unique values from jobs data
  const jobTitles = [...new Set(allJobs.map((job) => job.title))];
  const sources = [...new Set(allJobs.map((job) => job.source))];
  const countries = [...new Set(allJobs.map((job) => job.location))];
  const companies = [...new Set(allJobs.map((job) => job.company))];

  let newTitles = {}

  // Apply filtering logic
  const applyFilters = () => {
    let filtered = allJobs;

    if (selectedJobTitles.length > 0) {
      filtered = filtered.filter((job) => selectedJobTitles.includes(job.title));
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter((job) => selectedSources.includes(job.source));
    }

    if (selectedCountry) {
      filtered = filtered.filter((job) => job.location === selectedCountry);
    }

    if (selectedCompany) {
      filtered = filtered.filter((job) => job.company === selectedCompany);
    }

    setFilteredJobs(filtered);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sort by</h3>
      <label className="flex items-center space-x-2">
        <input type="checkbox" />
        <span>Latest</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" />
        <span>Oldest</span>
      </label>

      {/* Job Titles */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Job Title</h3>
      {jobTitles.map((title) => (
        <label key={title} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedJobTitles(
                selectedJobTitles.includes(value)
                  ? selectedJobTitles.filter((t) => t !== value)
                  : [...selectedJobTitles, value]
              );
            }}
          />
          <span>{title}</span>
        </label>
      ))}

      {/* Sources */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Source</h3>
      {sources.map((source) => (
        <label key={source} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={source}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSources(
                selectedSources.includes(value)
                  ? selectedSources.filter((s) => s !== value)
                  : [...selectedSources, value]
              );
            }}
          />
          <span>{source}</span>
        </label>
      ))}

      {/* Country Dropdown */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Country</h3>
      <select
        className="w-full p-2 border rounded"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* Company Dropdown */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Company</h3>
      <select
        className="w-full p-2 border rounded"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        <option value="">Select</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      {/* Apply Filters Button */}
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
