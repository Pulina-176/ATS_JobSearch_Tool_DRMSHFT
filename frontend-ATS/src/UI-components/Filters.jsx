import React, { useEffect, useState } from "react";

const Filters = ({ allJobs, setFilteredJobs, AI_DICT }) => {
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [sortBy, setSortBy] = useState(""); // Track sorting: "latest", "oldest", or ""

  if (!Array.isArray(allJobs)) {
    console.error("allJobs is not an array in Filters:", allJobs);
    return null;
  }

  // Extract unique values from jobs data
  const jobTitles = [...new Set(Object.keys(AI_DICT).map((key) => key))];
  const sources = [...new Set(allJobs.map((job) => job.source))];
  const countries = [...new Set(allJobs.map((job) => job.location))];
  const companies = [...new Set(allJobs.map((job) => job.company))];

  let newTitles = {};

  function updateNewTitles(AI_DICT) {
    Object.keys(AI_DICT).forEach((key) => {
      newTitles[key] = AI_DICT[key];
    });
    console.log("newTitles: ", newTitles);
  }

  // Parse relative date from other_info (e.g., "17 days ago")
  const parseRelativeDate = (otherInfo) => {
    if (!Array.isArray(otherInfo)) {
      console.warn("other_info is not an array:", otherInfo);
      return new Date(0); // Fallback to epoch
    }

    const dateString = otherInfo.find((info) => /\d+\s+days\s+ago/i.test(info));
    if (!dateString) {
      console.warn("No 'days ago' found in other_info:", otherInfo);
      return new Date(0);
    }

    const match = dateString.match(/(\d+)\s+days\s+ago/i);
    if (!match) {
      console.warn("Invalid date format in other_info:", dateString);
      return new Date(0);
    }

    const daysAgo = parseInt(match[1], 10);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  useEffect(() => {
    updateNewTitles(AI_DICT);
  }, [AI_DICT]);

  // Apply filtering and sorting logic
  const applyFilters = () => {
    let filtered = allJobs;

    if (selectedJobTitles.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTitles.some((title) =>
          AI_DICT[title]?.includes(job.title) ||
          job.title.toLowerCase().includes(title.toLowerCase())
        )
      );
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

    // Apply sorting by parsed date from other_info
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = parseRelativeDate(a.other_info);
        const dateB = parseRelativeDate(b.other_info);
        return sortBy === "latest" ? dateB - dateA : dateA - dateB;
      });
    }

    console.log("Sorting by:", sortBy, "Filtered jobs:", filtered.map(job => ({
      title: job.title,
      date: parseRelativeDate(job.other_info),
      other_info: job.other_info
    })));
    setFilteredJobs(filtered);
  };

  // Auto-apply filters when sortBy or other filter states change
  useEffect(() => {
    applyFilters();
  }, [sortBy, selectedJobTitles, selectedSources, selectedCountry, selectedCompany, allJobs]);

  const clearFilters = () => {
    setSelectedJobTitles([]);
    setSelectedSources([]);
    setSelectedCountry("");
    setSelectedCompany("");
    setSortBy("");
    console.log("Cleared states:", { sortBy: "", selectedJobTitles: [], selectedSources: [], selectedCountry: "", selectedCompany: "" });
    applyFilters();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sort by</h3>
      <label className="flex items-center space-x-2 mb-2">
        <input
          type="radio"
          name="sortBy"
          value="latest"
          checked={sortBy === "latest"}
          onChange={(e) => {
            setSortBy(e.target.value);
            console.log("sortBy set to:", e.target.value);
          }}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
        />
        <span>Latest</span>
      </label>
      <label className="flex items-center space-x-2 mb-2">
        <input
          type="radio"
          name="sortBy"
          value="oldest"
          checked={sortBy === "oldest"}
          onChange={(e) => {
            setSortBy(e.target.value);
            console.log("sortBy set to:", e.target.value);
          }}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
        />
        <span>Oldest</span>
      </label>

      {/* Job Titles */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Job Title</h3>
      {jobTitles.map((title) => (
        <label key={title} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            value={title}
            checked={selectedJobTitles.includes(title)}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedJobTitles((prev) =>
                e.target.checked ? [...prev, value] : prev.filter((t) => t !== value)
              );
              console.log("selectedJobTitles:", selectedJobTitles, "Checked:", e.target.checked);
            }}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500"
          />
          <span>{title}</span>
        </label>
      ))}

      {/* Sources */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Source</h3>
      {sources.map((source) => (
        <label key={source} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            value={source}
            checked={selectedSources.includes(source)}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSources(
                selectedSources.includes(value)
                  ? selectedSources.filter((s) => s !== value)
                  : [...selectedSources, value]
              );
              console.log("selectedSources: ", selectedSources);
            }}
            className="h-4 w-4 text-black focus:ring-black"
          />
          <span>{source}</span>
        </label>
      ))}

      {/* Country Dropdown */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Country</h3>
      <select
        className="w-full p-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          console.log("selectedCountry: ", e.target.value);
        }}
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
        className="w-full p-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={selectedCompany}
        onChange={(e) => {
          setSelectedCompany(e.target.value);
          console.log("selectedCompany: ", e.target.value);
        }}
      >
        <option value="">Select</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      <button
        className="mt-10 w-full bg-black text-white py-2 rounded hover:bg-gray-500 transition duration-200"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;

