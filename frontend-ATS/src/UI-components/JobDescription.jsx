import React, { useEffect , useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import { addJob } from "../slices/atsDataSlice";

// Input props:
// - description: raw job description
// - onClose    : function to close the modal
// - title      : job title, as of the relevant category raw job title falls under
// - raw_title  : raw job title
// - id         : job id (for identification purpose only)
const JobDescription = ({ description, onClose, title, raw_title, id }) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch(); // to dispatch actions to the store
  const jobsInRedux = useSelector((state) => state.atsData.jobs); // get the current state of jobs in the store

  function addJobToRedux (gen_description) {
    const job = {
      title: title,
      description: gen_description,  // generated from AI
      raw_title: raw_title,
      id: id
    }

    dispatch(addJob(job)); // add job to the store
  }

  function getJobFromRedux (id) { // get job description from the store if available
    const job = jobsInRedux.find((job) => job.id === id);
    if (job && job.description!==""){
      setFormattedDescription(job.description);
      return true;
    }
    else return false;
  }

  const JobRole = { // to send to backend for ATS keyword functions - refer main.py for object reference
    jobRole: title,
    description: description
  }

  const [formattedDescription, setFormattedDescription] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  
  const getDescription = async (description) => {  // fetch json format for raw description from gemini
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
  
      const data = await response.json();  // wait for JSON parsing
      const text = data.data;
      const cleanedJSONString = text.trim().replace(/^```json|```$/g, '');  // clean the JSON string
      
      setFormattedDescription(cleanedJSONString);
      setIsGenerating(false); // stop loading animation
      
      return cleanedJSONString;

    } catch (error) {
      console.error("Error fetching description:", error);
      return { error: error.message };
    }
  }

  const parseDescription = (description) => {  // fo
    try {
      const jsonDescription = JSON.parse(description);
      console.log(jsonDescription);
      return jsonDescription      
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  }


  useEffect(() => {
    async function fetchAndFormat() {

      const check_store = getJobFromRedux(id);

      if (check_store) {
        setIsGenerating(false);
      }

      else {
        const fetchedDescription = await getDescription(description);
        const formatted = parseDescription(fetchedDescription);

        addJobToRedux(formatted); // add job to the store

        setFormattedDescription(formatted)
        setIsGenerating(false);
      }
    }

    fetchAndFormat();
  }, []);



  if (!description) return null;
  if (isGenerating) return <p>Smart scraping job description... Powered by Gemini</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 relative z-50 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Job Description</h3>
        <ShowDescriptionFROMJSON JSONFormat={formattedDescription}/>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JobDescription;



const ShowDescriptionFROMJSON = (JSONFormat) => {

  function hasChildKey (jsonTree, key) {
    if (Array.isArray(jsonTree[key])) {
      return "Array of values";
    }
    else if (typeof jsonTree[key] === "object" && jsonTree[key] !== null) {
      return "nested keys";
    }
    else {
      return "single value";
    }
  }

  function iterator (jsonTree) {  // test algorithm logic
      const keys = Object.keys(jsonTree)
      keys.forEach((key) => {
        if (hasChildKey(jsonTree, key) === "nested keys") {
          iterator(jsonTree[key])

        }
        else if (hasChildKey(jsonTree, key) === "Array of values"){
          const arrayList = jsonTree[key]
          console.log(key, " : ", )
          arrayList.forEach((_, i) => {
            console.log(arrayList[i])
          })
          return 0

        }
        else {
          console.log(key, " : ", jsonTree[key])
          return 0

        }
      })
  }

  const renderJSON = (jsonTree) => {
    return Object.keys(jsonTree).map((key) => {
      const valueType = typeof jsonTree[key];

      if (Array.isArray(jsonTree[key])) {
        return (
          <div key={key} className="m-4 bg-gray-800 text-white">
            <strong>{key}:</strong>
            <ul className="list-disc pl-5">
              {jsonTree[key].map((item, index) => (
                <li key={index}>{typeof item === "object" ? renderJSON(item) : item}</li>
              ))}
            </ul>
          </div>
        );
      } else if (valueType === "object" && jsonTree[key] !== null) {
        return (
          <div key={key} className="m-4 bg-gray-800 text-white">
            <strong>{key}:</strong>
            {renderJSON(jsonTree[key])}
          </div>
        );
      } else {
        return (
          <p key={key} className="m-4 bg-gray-800 text-white">
            <strong>{key}:</strong> {jsonTree[key]}
          </p>
        );
      }
    });
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <div>{renderJSON(JSONFormat)}</div>
    </div>
  );

}