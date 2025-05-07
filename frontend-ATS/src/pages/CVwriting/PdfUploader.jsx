// import React, { useState } from "react";
// import Header from "../../UI-components/Header";

// export default function PdfUploader() {
//   const YOUR_BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Ensure this is set in your .env file
//   const [files, setFiles] = useState([]);

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files);
//     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files
//   };

//   // Remove a file
//   const removeFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   // Upload files to the backend
//   const uploadFiles = async () => {
//     if (files.length === 0) {
//       alert("Please select at least one file.");
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file, index) => {
//       formData.append(`files`, file); // `files` will be an array in the backend
//     });

//     try {
//         console.log(YOUR_BACKEND_URL);
//       const response = await fetch(`${YOUR_BACKEND_URL}/cv-assistant/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed");
//       }

//       const result = await response.json();
//       console.log("Upload success:", result);
//       alert("Files uploaded successfully!");

//       if (result.message === "CV Draft Successful") {
//         try {
//           // Clean the data by removing the Markdown code block markers
//           let jsonString = result.data;
//           // Remove ```json and ``` markers, and trim whitespace
//           jsonString = jsonString
//             .replace(/```json\n?/, '') // Remove ```json at the start
//             .replace(/```/, '')        // Remove ``` at the end
//             .trim();                   // Remove extra whitespace

//           // Parse the cleaned JSON string
//           const resumeData = JSON.parse(jsonString);
//           navigate("/resume-data", { state: { resumeData } });
//         } catch (parseError) {
//           console.error("Error parsing JSON:", parseError);
//           alert("Error processing CV data: Invalid JSON format");
//         }
//       } else {
//         alert("Error processing CV data");
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       alert("Error uploading files");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#000000] flex flex-col pb-10">
//       <Header />

//       <div className="p-10 self-center">
//         <h1 className="text-white font-bold text-left text-[36px]">
//           Welcome to the DreamShift CV Writing Assistant
//         </h1>
//         <h1 className="text-white font-semibold text-left text-lg">
//           Upload existing client documents
//         </h1>

//         {/* File Input */}
//         <input
//           type="file"
//           multiple
//           accept=".pdf"
//           className="file-input mt-12 border border-gray-400 rounded bg-white"
//           onChange={handleFileChange}
//         />

//         {/* Display Uploaded Files */}
//         {files.length > 0 && (
//           <div className="mt-12 bg-white p-4 rounded-lg">
//             <h2 className="text-black font-semibold text-lg">Uploaded Files:</h2>
//             <ul className="mt-2">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="text-black flex justify-between items-center border-b border-gray-600 py-2"
//                 >
//                   {file.name}
//                   <button
//                     className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
//                     onClick={() => removeFile(index)}
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <div className="mt-12">
//           <button
//             className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFDF00]"
//             onClick={uploadFiles}
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../UI-components/Header";
import Loading from "../../UI-components/LoadingPdf";

export default function PdfUploader() {
  const YOUR_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      setLoading(true); 
      console.log(YOUR_BACKEND_URL);
      const response = await fetch(`${YOUR_BACKEND_URL}/cv-assistant/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log("Upload success:", result);

      if (result.message === "CV Draft Successful") {
        try {
          // Clean the data by removing the Markdown code block markers and extra whitespace
          let jsonString = result.data;
          // Remove ```json (and optional newlines), ``` (and optional newlines), and trim
          jsonString = jsonString
            .replace(/```json\s*\n?/, '') // Remove ```json and any following newline
            .replace(/\n?\s*```/, '')     // Remove ``` and any preceding newline
            .trim();                      // Remove leading/trailing whitespace

            console.log("Cleaned JSON string:", jsonString);

          // Parse the cleaned JSON string
          const resumeData = JSON.parse(jsonString);
          navigate("/cv-writing/resume-data", { state: { resumeData } });
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          setLoading(false); 
          alert("Error processing CV data: Invalid JSON format");
        }
      } else {
        alert("Error processing CV data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files: " + error.message);
      setLoading(false);
    }
  };

  return (
    loading ? (
      <Loading />
    ) : (
    <div className="min-h-screen bg-[#000000] flex flex-col pb-10">
      <Header />
      <div className="p-10 self-center">
        <h1 className="text-white font-bold text-left text-[36px]">
          Welcome to the DreamShift CV Writing Assistant
        </h1>
        <h1 className="text-white font-semibold text-left text-lg">
          Upload existing client documents
        </h1>
        <input
          type="file"
          multiple
          accept=".pdf"
          className="file-input mt-12 border border-gray-400 rounded bg-white"
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <div className="mt-12 bg-white p-4 rounded-lg">
            <h2 className="text-black font-semibold text-lg">Uploaded Files:</h2>
            <ul className="mt-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="text-black flex justify-between items-center border-b border-gray-600 py-2"
                >
                  {file.name}
                  <button
                    className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-12">
          <button
            className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFDF00]"
            onClick={uploadFiles}
          >
            Continue
          </button>
        </div>
      </div>
    </div>)
  );
}