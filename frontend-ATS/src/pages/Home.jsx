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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.auth.token);
  const [hasScrapedData, setHasScrapedData] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
  // const [scrapedData, setScrapedData] = useState(null); // State for backend data new
  const navigate = useNavigate(); // Use navigate hook for routing new
  
  const var_jobRoles = useSelector((state) => state.input.jobRoles);
  const var_companies = useSelector((state) => state.input.companies);
  const var_locations = useSelector((state) => state.input.locations);
  const var_fields = useSelector((state) => state.input.fields);
  const user_id = useSelector((state) => state.auth.userId);

  const [companies, setCompanies] = useState(var_companies);
  const [jobRoles, setJobRoles] = useState(var_jobRoles);
  const [locations, setLocations] = useState(var_locations);
  const [fields, setFields] = useState(var_fields);

  const username = useSelector((state) => state.auth?.username);

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

  useEffect(() => {
    const checkScrapedData = async () => {
      if (!username || !token) return;
  
      // const userIdMap = { "user1": 1, "user2": 2 }; // Replace with proper DB mapping
      // const user_id = userIdMap[username] || 1;
      
  
      try {
        const response = await fetch(`${BACKEND_URL}/scraper/get_scraped_data/${user_id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          setHasScrapedData(true);
          setScrapeMessage("You have successfully scraped data!");
        } else if (response.status === 404) {
          setHasScrapedData(false);
          setScrapeMessage("");
        } else if (response.status === 401) {
          navigate("/"); // Redirect to login on unauthorized
          return;
        } else {
          throw new Error("Failed to check scraped data");
        }
      } catch (error) {
        console.error("Error checking scraped data:", error);
        setHasScrapedData(false);
        setScrapeMessage("");
      }
    };
  
    checkScrapedData();
  }, [username, token, navigate]);

  useEffect(() => {
    if (!username || !token) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [username, token, navigate]);

  // Webscraper begin
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setScrapeMessage("");
  
    if (!Array.isArray(jobRoles) || !Array.isArray(locations)) {
      console.error('Invalid input data');
      setLoading(false);
      return;
    }
  
    // const userIdMap = { "user1": 1, "user2": 2 }; // Replace with proper DB mapping
    // const user_id = userIdMap[username] || 1;
    
    const mergedData = { jobRoles, locations, user_id };
  
    try {
      const submitResponse = await fetch(`${BACKEND_URL}/scraper/load_inputs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mergedData),
      });
  
      if (!submitResponse.ok) {
        if (submitResponse.status === 401) {
          navigate("/"); // Redirect to login on unauthorized
          return;
        }
        throw new Error("Failed to submit data");
      }
  
      const scrapeResponse = await fetch(`${BACKEND_URL}/scraper/scrape_jobs_async/${user_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!scrapeResponse.ok) {
        if (scrapeResponse.status === 401) {
          navigate("/"); // Redirect to login on unauthorized
          return;
        }
        throw new Error("Failed to fetch scraping details");
      }
  
      const scrapeData = await scrapeResponse.json();
      setHasScrapedData(true);
      setScrapeMessage("You have successfully scraped data!");
      setTimeout(() => {
        navigate("/results", { state: { data: scrapeData.data } });
      }, 2000);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setScrapeMessage("Error during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeeResults = async () => {
    setLoading(true);
    try {
      // const userIdMap = { "user1": 1, "user2": 2 }; // Replace with proper DB mapping
      // const user_id = userIdMap[username] || 1;
     
  
      const response = await fetch(`${BACKEND_URL}/scraper/get_scraped_data/${user_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No cached data found.");
          setHasScrapedData(false);
          setScrapeMessage("");
        } else if (response.status === 401) {
          navigate("/"); // Redirect to login on unauthorized
          return;
        } else {
          throw new Error("Failed to fetch scraped data");
        }
        setLoading(false);
        return;
      }
  
      const getData = await response.json();
      console.log(getData.job_details);
      navigate("/results", { state: { data: getData.job_details } });
    } catch (error) {
      console.error("Error fetching scraped data:", error);
      setScrapeMessage("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

return loading ? (
  <Processing />
) : (
  <div className="flex flex-col pb-10">
    <Header />
    <div className="p-5 self-center">
      <h1 className="text-white font-bold text-left text-[36px]">
        Welcome to the DreamShift Job Search Tool Test
      </h1>
      <h1 className="text-white font-semibold text-left text-lg">
        Provide the required details to perform the job search
      </h1>
    </div>

    <div className="w-full max-w-4xl mx-auto flex justify-end mb-4 px-5">
      <div className="flex flex-col items-end gap-2">
        {scrapeMessage && (
          <p
            className={`text-sm text-center p-2 rounded-lg font-semibold ${
              scrapeMessage.startsWith("Error")
                ? "text-white bg-red-900"
                : "text-white bg-blue-900"
            }`}
          >
            {scrapeMessage}
          </p>
        )}
        {hasScrapedData && (
          <button className="btn" onClick={handleSeeResults}>
            See Scraped Results
          </button>
        )}
      </div>
      </div>

    <div className="w-[100%] max-w-lg mx-auto mb-[30px]">
      <form className="w-4/5 max-w-lg mx-auto text-left flex flex-col gap-6">
        <TextInput
          label="Job Roles"
          entries={var_jobRoles}
          onClick={() => openModal("Job Roles", addJobRole)}
          onRemove={removeJobRole}
          refresh={triggerRefresh}
        />
        <TextInput
          label="Locations"
          entries={var_locations}
          onClick={() => openModal("Locations", addLocation)}
          onRemove={removeLocation}
          refresh={triggerRefresh}
        />
        <TextInput
          label="Companies"
          entries={var_companies}
          onClick={() => openModal("Companies", addCompany)}
          onRemove={removeCompany}
          refresh={triggerRefresh}
        />
        <TextInput
          label="Fields"
          entries={var_fields}
          onClick={() => openModal("Fields", addField)}
          onRemove={removeField}
          refresh={triggerRefresh}
        />
      </form>
    </div>

    <div className="w-4/5 max-w-lg mx-auto flex justify-center">
        <button className="btn" onClick={handleSubmit}>
          Submit to Proceed
        </button>
      </div>

    <Modal
      modalState={modalState}
      isVisible={modalState.isVisible}
      onClose={closeModal}
      refresh={triggerRefresh}
    />
  </div>
);
};

export default Home;
