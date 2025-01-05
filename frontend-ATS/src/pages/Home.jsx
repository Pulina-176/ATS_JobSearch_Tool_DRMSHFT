import React, { useState, useEffect } from "react";

import Header from "../UI-components/Header";
import TextInput from "../UI-components/TextInput";
import Modal from "../UI-components/Modal";

// Styles for the body element
document.body.style.backgroundColor = " #000000";

// Styles for the form
const formStyle = {
  width: "80%",
  maxWidth: "600px",
  margin: "0 auto",
  textAlign: "left",
};


// Main Home Page component

const Home = () => {
  const [companies, setCompanies] = useState(
    JSON.parse(localStorage.getItem("names")) || []
  );
  const [jobRoles, setJobRoles] = useState(
    JSON.parse(localStorage.getItem("jobRoles")) || []
  );
  const [locations, setLocations] = useState(
    JSON.parse(localStorage.getItem("locations")) || []
  );
  const [fields, setFields] = useState(
    JSON.parse(localStorage.getItem("fields")) || []
  );

  const handleAddEntry = (type, setEntries, entries) => {
    const newEntry = prompt(`Enter a new ${type}:`);
    if (newEntry) {
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);
      localStorage.setItem(type, JSON.stringify(updatedEntries));
    }
  };

  const handleRemoveEntry = (type, setEntries, entries, index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem(type, JSON.stringify(updatedEntries));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!Array.isArray(jobRoles) || !Array.isArray(locations)) {
      console.error('Invalid input data');
      return;
    }
  
    const mergedData = {
      jobRoles: jobRoles,
      locations: locations,
    };
  
    console.log("Sending data:", mergedData);  
  
    try {
      const response = await fetch("http://127.0.0.1:8000/scrape_jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mergedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
  
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }


try{
    const getResponse = await fetch("http://127.0.0.1:8000/scrape_and_get_details");

    if (!getResponse.ok) {
      throw new Error("Failed to fetch scraping details");
    }

    const getData = await getResponse.json();
    console.log("GET Success:", getData);

    // Optionally handle `getData` for UI updates
  } catch (error) {
    console.error("Error in handleSubmit:", error);
  }
  };

  return (
    <div className="flex flex-col pb-10">
      <Header/>

      <div className="p-10 self-center">
        <h1 className="text-white font-bold text-left text-[36px]">Welcome to the DreamShift Job Search Tool</h1>
        <h1 className="text-white font-semibold text-left text-lg">Provide the required details to perform the job search</h1>

      </div>

      {/* Form Section */}
      <div className="w-[100%] max-w-lg mx-auto mb-[30px]">
        <form className="w-4/5 max-w-lg mx-auto text-left flex flex-col gap-6">     
    

          {/* Job Roles Input */}
          <TextInput
            label="Job Roles"
            entries={jobRoles}
            onAdd={() => handleAddEntry("jobRoles", setJobRoles, jobRoles)}
            onRemove={(index) => handleRemoveEntry("jobRoles", setJobRoles, jobRoles, index)}
          />

          {/* Locations Input */}
          <TextInput
            label="Locations"
            entries={locations}
            onAdd={() => handleAddEntry("locations", setLocations, locations)}
            onRemove={(index) => handleRemoveEntry("locations", setLocations, locations, index)}
          />

          {/* Fields Input */}
          <TextInput
            label="Companies"
            entries={companies}
            onAdd={() => handleAddEntry("companies", setCompanies, companies)}
            onRemove={(index) => handleRemoveEntry("companies", setCompanies, companies, index)}
          />

          {/* Fields Input */}
          <TextInput
            label="Fields"
            entries={fields}
            onAdd={() => handleAddEntry("fields", setFields, fields)}
            onRemove={(index) => handleRemoveEntry("fields", setFields, fields, index)}
          />
        </form>
       
      </div>

    <div className="w-4/5 max-w-lg mx-auto">
      <button className="btn ml-0 sm:ml-12" onClick={handleSubmit}>Submit to Proceed</button>
    </div>
      
    </div>
  );
};

export default Home;
