import React from "react";

const JobDescription = ({ description, onClose }) => {
  if (!description) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 relative z-50 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Job Description</h3>
        <p className="text-sm">{description || "No description available."}</p>
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