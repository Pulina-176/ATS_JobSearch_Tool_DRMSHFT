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
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [hasScrapedData, setHasScrapedData] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
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
      if (!username) return;

      const userIdMap = { "user1": 1, "user2": 2 };
      const user_id = userIdMap[username] || 1;

      try {
        if (!token) await handleLogin();

        const response = await fetch(`http://127.0.0.1:8000/get_scraped_data/${user_id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setHasScrapedData(true); // Data exists in Redis
          setScrapeMessage("You have successfully scraped data!");
        } else if (response.status === 404) {
          setHasScrapedData(false); // No data in Redis
          setScrapeMessage("");
        }
      } catch (error) {
        console.error("Error checking scraped data:", error);
        setHasScrapedData(false);
        setScrapeMessage("");
      }
    };

    checkScrapedData();
  }, [username, token]);

  useEffect(() => {
    if (!username) {
      navigate("/home");
    }
    if (!token) {
      handleLogin(); // Auto-login if no token (optional)
    }
  }, [username, navigate, token]);

  // Login function to get JWT token
  const handleLogin = async () => {
    try {
      const password = username === "user1" ? "password1" : "password2"; // Replace with real password logic
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token); // Persist token
    } catch (error) {
      console.error("Login error:", error);
      navigate("/login"); // Redirect to a login page if needed
    }
  };

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

    const userIdMap = { "user1": 1, "user2": 2 };
    const user_id = userIdMap[username] || 1;
    const mergedData = { jobRoles, locations, user_id };
  
    // const mergedData = {
    //   jobRoles: jobRoles,
    //   locations: locations,
    // };
  
    // console.log("Sending data:", mergedData);  
    
    // try {
    //   const response = await fetch("http://127.0.0.1:8000/load_inputs", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(mergedData),
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to submit data');
    //   }
  
    //   const data = await response.json();
    //   console.log("Success:", data);
    // } catch (error) {
    //   console.error("Error in handleSubmit:", error);
    // }


  //   try{
  //       const getResponse = await fetch("http://127.0.0.1:8000/scrape_and_get_details");

  //       if (!getResponse.ok) {
  //         throw new Error("Failed to fetch scraping details");
  //       }

  //       const getData = await getResponse.json();
  //       //console.log("GET Success:", getData); 
  //       setScrapedData(getData); // Store data in state new
  //       setLoading(false); //new
  //       navigate("/results", { state: { data:getData.data } }); // Navigate to results page new

  //       // Optionally handle `getData` for UI updates
  //     } catch (error) {
  //       console.error("Error in handleSubmit:", error);
  //       setLoading(false); //new
  //     }
  // };

  try {
    if (!token) await handleLogin(); // Ensure token is available

    const submitResponse = await fetch("http://127.0.0.1:8000/load_inputs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(mergedData),
    });

    if (!submitResponse.ok) throw new Error("Failed to submit data");

    const scrapeResponse = await fetch("http://127.0.0.1:8000/scrape_and_get_details", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!scrapeResponse.ok) throw new Error("Failed to fetch scraping details");

    const scrapeData = await scrapeResponse.json();
    setHasScrapedData(true);
    setScrapeMessage("You have successfully scraped data!");
    setTimeout(() => {
      navigate("/results", { state: { data: scrapeData.data } });
    }, 2000);
    
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    if (error.message.includes("401")) await handleLogin(); // Retry login on auth failure
  } finally {
    setLoading(false);
  }
};

const handleSeeResults = async () => {
  setLoading(true);
  try {
    const userIdMap = { "user1": 1, "user2": 2 };
    const user_id = userIdMap[username] || 1;

    if (!token) await handleLogin(); // Ensure token is available

    const response = await fetch(`http://127.0.0.1:8000/get_scraped_data/${user_id}`, {
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
      } else {
        throw new Error("Failed to fetch scraped data");
      }
      setLoading(false);
      return;
    }

    const getData = await response.json();
    navigate("/results", { state: { data: getData.job_details } });
  } catch (error) {
    console.error("Error fetching scraped data:", error);
    if (error.message.includes("401")) await handleLogin(); // Retry login on auth failure
  } finally {
    setLoading(false);
  }
};

//   return (
//     loading ? <Processing /> :
//     <div className="flex flex-col pb-10">
//       <Header/>

//       <div className="p-10 self-center">
//         <h1 className="text-white font-bold text-left text-[36px]">Welcome to the DreamShift Job Search Tool Test</h1>
//         <h1 className="text-white font-semibold text-left text-lg">Provide the required details to perform the job search</h1>

//       </div>

//       {/* Form Section */}
//       <div className="w-[100%] max-w-lg mx-auto mb-[30px]">
//         <form className="w-4/5 max-w-lg mx-auto text-left flex flex-col gap-6">     
    

//           {/* Job Roles Input */}
//           <TextInput
//             label="Job Roles"
//             entries={var_jobRoles}
//             onClick={()=>openModal("Job Roles", addJobRole)}
//             onRemove={removeJobRole}
//             refresh={triggerRefresh}
//           />

//           {/* Locations Input */}
//           <TextInput
//             label="Locations"
//             entries={var_locations}
//             onClick={()=>openModal("Locations", addLocation)}
//             onRemove={removeLocation}
//             refresh={triggerRefresh}
//           />

//           {/* Fields Input */}
//           <TextInput
//             label="Companies"
//             entries={var_companies}
//             onClick={()=>openModal("Companies", addCompany)}
//             onRemove={removeCompany}
//             refresh={triggerRefresh}
//           />

//           {/* Fields Input */}
//           <TextInput
//             label="Fields"
//             entries={var_fields}
//             onClick={()=>openModal("Fields", addField)}
//             onRemove={removeField}
//             refresh={triggerRefresh}
//           />
//         </form>
       
//       </div>

//     <div className="w-4/5 max-w-lg mx-auto">
//       <button className="btn ml-0 sm:ml-12" onClick={handleSubmit}>Submit to Proceed</button>
//     </div>

//     <Modal modalState={modalState} isVisible={modalState.isVisible} onClose={closeModal} refresh={triggerRefresh}/>
      
//     </div>
//   );
// };

// export default Home;

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
