import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';


const Processing = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [scraperStatus, setScraperStatus] = useState(null)

  const navigate = useNavigate(); // to navigate to other pages

  async function fetchStatus () { // this function fetches the scraping status of the respective user's job if any
    const response = await fetch(`${BACKEND_URL}/scraper/get_job_status/${2}`, { // pass the userid
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      // If response is not OK (e.g., 404, 500), handle it
      const errorData = await response.json(); // parse the error body
      console.error("Error:", errorData);

    } else {

      const data = await response.json(); // parse response body
      setScraperStatus(data.status);

      if (data.status === "finished") { // when job is finished
        onJobComplete();
      }
      else {
        console.log("what?")
        console.log(scraperStatus)
      }
    } 
  }

  function onJobComplete () {
    navigate("/home"); // navigate to results page
  }

  useEffect(() => {
    // Function to start polling
    const interval = setInterval(() => {
      fetchStatus()
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount    
  }, [])

  function handleCancel () {
    if (scraperStatus !== "started") {
      return null
    }
    else {
      // cancel the scraper process
      fetch(`${BACKEND_URL}/scraper/cancel_job/${2}`, { // pass the userid
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center text-white font-inter p-6 rounded-lg">
        <FontAwesomeIcon icon={faGear} spin className="text-[100px] mb-8 text-white" />
        <p className="text-lg mb-2">The search process may consume some time...</p>
        <p className="text-lg mb-6">{scraperStatus}</p>

        <button
          onClick={handleCancel} // Add your own cancel handler
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out"
        >
          Cancel
        </button>
      </div>
  </div>
  )
}

export default Processing

