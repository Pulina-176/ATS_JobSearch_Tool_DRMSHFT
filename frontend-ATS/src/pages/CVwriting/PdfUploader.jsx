import React, { useState } from "react";
import Header from "../../UI-components/Header";

export default function PdfUploader() {
  const [files, setFiles] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files
  };

  // Remove a file
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col pb-10">
      <Header />

      <div className="p-10 self-center">
        <h1 className="text-white font-bold text-left text-[36px]">
          Welcome to the DreamShift CV Writing Assistant
        </h1>
        <h1 className="text-white font-semibold text-left text-lg">
          Upload existing client documents
        </h1>

        {/* File Input */}
        <input
          type="file"
          multiple
          accept=".pdf"
          className="file-input mt-12 border border-gray-400 rounded bg-white"
          onChange={handleFileChange}
        />

        {/* Display Uploaded Files */}
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
      </div>
    </div>
  );
}
