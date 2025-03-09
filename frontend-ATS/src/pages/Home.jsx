import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //new
import { useSelector } from "react-redux";
import { addJobRole , removeJobRole , addCompany , removeCompany ,
         addLocation , removeLocation , addField , removeField } from "../slices/inputSlice";

import Header from "../UI-components/Header";
import TextInput from "../UI-components/TextInput";
import Modal from "../UI-components/Modal";
import Processing from "../UI-components/Processing";

// Styles for the body element
document.body.style.backgroundColor = " #000000";

// Main Home Page component

const Home = () => {

  const [loading, setLoading] = useState(false)
  // const [scrapedData, setScrapedData] = useState(null); // State for backend data new
  const navigate = useNavigate(); // Use navigate hook for routing new
  
  const var_jobRoles = useSelector((state) => state.input.jobRoles);
  const var_companies = useSelector((state) => state.input.companies);
  const var_locations = useSelector((state) => state.input.locations);
  const var_fields = useSelector((state) => state.input.fields);

  const [companies, setCompanies] = useState(var_companies);
  const [jobRoles, setJobRoles] = useState(var_jobRoles);
  const [locations, setLocations] = useState(var_locations);
  const [fields, setFields] = useState(var_fields);

  // Trigger refresh states
  function triggerRefresh () {
    setCompanies(var_companies);
    setJobRoles(var_jobRoles);
    setLocations(var_locations);
    setFields(var_fields);
  }

  // State to control modal
  const [modalState, setModalState] = useState({
    isVisible: false,
    prop: "",
    setter: () => {},
  });

  // Open modal with dynamic content
  const openModal = (name, setter) => {
    setModalState({
      isVisible: true,
      prop: name,
      setter: setter 
    });
  };

  // Close the modal
  const closeModal = () => {
    setModalState({ ...modalState, isVisible: false });
  };

  // NEW: User ID (replace with actual authentication later)
  const [userId, setUserId] = useState(123); // Static user ID for now

 

  // Webscraper begin

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    if (!Array.isArray(jobRoles) || !Array.isArray(locations)) {
      console.error('Invalid input data');
      setLoading(false);
      return;
    }
  
    const mergedData = {
      jobRoles: jobRoles,
      locations: locations,
      user_id: userId,
    };
  
    console.log("Sending data:", mergedData);
  
    try {
      // Step 1: Submit the form data to /load_inputs
      const submitResponse = await fetch("http://127.0.0.1:8000/load_inputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mergedData),
      });
  
      if (!submitResponse.ok) {
        throw new Error("Failed to submit data");
      }
  
      console.log("Form data submitted successfully.");
  
      // Step 2: Trigger scraping immediately after submission
      const scrapeResponse = await fetch("http://127.0.0.1:8000/scrape_and_get_details");
  
      if (!scrapeResponse.ok) {
        throw new Error("Failed to fetch scraping details");
      }
  
      const scrapeData = await scrapeResponse.json();
      console.log("Scraping Success:", scrapeData);
  
      // Navigate to results with scraped data
      navigate("/results", { state: { data: scrapeData.data } });
  
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  // const handleSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  
  //   if (!Array.isArray(jobRoles) || !Array.isArray(locations)) {
  //     console.error('Invalid input data');
  //     return;
  //   }
  
  //   const mergedData = {
  //     jobRoles: jobRoles,
  //     locations: locations,
  //     user_id: userId 
  //   };
  
  //   console.log("Sending data:", mergedData);  
  
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/load_inputs", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(mergedData),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to submit data');
  //     }
  
  //     const data = await response.json();
  //     console.log("Success:", data);
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const handleSeeResults = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/get_scraped_data/${userId}`);

  //     if (!response.ok) {
  //       // If no data is found for the user, attempt to scrape
  //       if (response.status === 404) {
  //         console.log("No cached data found.");
  // //         const scrapeResponse = await fetch("http://127.0.0.1:8000/scrape_and_get_details");

  // //         if (!scrapeResponse.ok) {
  // //           throw new Error("Failed to fetch scraping details");
  // //         }

  // //         const scrapeData = await scrapeResponse.json();
  // //         console.log("GET Success:", scrapeData);
  // //         navigate("/results", { state: { data: scrapeData.data } });

  // //       } else {
  // //         throw new Error("Failed to fetch scraping details");
  // //       }

  //     } else {
  //       const getData = await response.json();
  //       console.log("GET Success:", getData);
  //       navigate("/results", { state: { data: getData } });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching scraped data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSeeResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_scraped_data/${userId}`);
  
      if (!response.ok) {
        // If no cached data is found, log a message and stop further execution
        if (response.status === 404) {
          console.log("No cached data found.");
        } else {
          throw new Error("Failed to fetch scraped data");
        }
      } else {
        // If cached data is found, navigate to the results page
        const getData = await response.json();
        console.log("GET Success:", getData);
        navigate("/results", { state: { data: getData } });
      }
    } catch (error) {
      console.error("Error fetching scraped data:", error);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    loading ? <Processing /> :
    <div className="flex flex-col pb-10">
      <Header/>

      <div className="p-10 self-center">
        <h1 className="text-white font-bold text-left text-[36px]">Welcome to the DreamShift Job Search Tool Test</h1>
        <h1 className="text-white font-semibold text-left text-lg">Provide the required details to perform the job search</h1>

      </div>

      {/* Form Section */}
      <div className="w-[100%] max-w-lg mx-auto mb-[30px]">
        <form className="w-4/5 max-w-lg mx-auto text-left flex flex-col gap-6">     
    

          {/* Job Roles Input */}
          <TextInput
            label="Job Roles"
            entries={var_jobRoles}
            onClick={()=>openModal("Job Roles", addJobRole)}
            onRemove={removeJobRole}
            refresh={triggerRefresh}
          />

          {/* Locations Input */}
          <TextInput
            label="Locations"
            entries={var_locations}
            onClick={()=>openModal("Locations", addLocation)}
            onRemove={removeLocation}
            refresh={triggerRefresh}
          />

          {/* Fields Input */}
          <TextInput
            label="Companies"
            entries={var_companies}
            onClick={()=>openModal("Companies", addCompany)}
            onRemove={removeCompany}
            refresh={triggerRefresh}
          />

          {/* Fields Input */}
          <TextInput
            label="Fields"
            entries={var_fields}
            onClick={()=>openModal("Fields", addField)}
            onRemove={removeField}
            refresh={triggerRefresh}
          />
        </form>
       
      </div>

    <div className="w-4/5 max-w-lg mx-auto">
      <button className="btn ml-0 sm:ml-12" onClick={handleSubmit}>Submit to Proceed</button>
      <button className="btn ml-0 sm:ml-12" onClick={handleSeeResults}>See Scraped Results</button>
    </div>

    <Modal modalState={modalState} isVisible={modalState.isVisible} onClose={closeModal} refresh={triggerRefresh}/>
      
    </div>
  );
};

export default Home;
