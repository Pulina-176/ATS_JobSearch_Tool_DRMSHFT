import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ResumeData = () => {
  const [activeTab, setActiveTab] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    try {
      if (location.state?.resumeData) {
        setResumeData(location.state.resumeData);
      } else {
        throw new Error("No resume data provided");
      }
    } catch (err) {
      console.error("Error setting resume data:", err);
      setError("Failed to load resume data");
    }
  }, [location.state]);

  // Dynamically set the default active tab based on JSON keys
  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      const firstTab = Object.keys(resumeData)[0];
      setActiveTab(firstTab);
    }
  }, [resumeData]);

  // Function to render nested JSON data recursively
  const renderNestedData = (data, level = 0) => {
    if (!data) return null;

    if (typeof data !== "object") {
      
      const hasQuantitative = /\d+(\.\d+)?(%| years| months| team of \d+)/i.test(data);
      return (
        <span className={hasQuantitative ? "text-green-600 font-semibold" : ""}>
          {data.toString()}
        </span>
      );
    }

    if (Array.isArray(data)) {
      return (
        <ul className={`list-disc pl-${level * 5} mt-2 text-gray-800`}>
          {data.map((item, index) => (
            <li key={index} className="mb-1">
              {renderNestedData(item, level + 1)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul className={`list-disc pl-${level * 5} mt-2 text-gray-800`}>
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="mb-1">
            <span className="font-medium capitalize">{key}:</span>{" "}
            {renderNestedData(value, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  // Function to render content for the active tab
  const renderTabContent = () => {
    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!resumeData) {
      return <p className="text-gray-700 text-center">Loading...</p>;
    }

    if (Object.keys(resumeData).length === 0) {
      return <p className="text-gray-700 text-center">No data available.</p>;
    }

    const data = resumeData[activeTab];
    if (!data) {
      return <p className="text-gray-700 text-center">No data available for this category.</p>;
    }

    // If data is an array of objects, render each item as a separate card
    if (Array.isArray(data) && data.every(item => typeof item === "object" && !Array.isArray(item))) {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {item.role || item.degree || Object.entries(item)[0]?.[1] || "Entry"}{" "}
                {item.company && `at ${item.company}`}{" "}
                {item.institution && `from ${item.institution}`}
              </h3>
              {renderNestedData(item)}
            </div>
          ))}
        </div>
      );
    }

    // Otherwise, render the data as a single card
    return (
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600 capitalize">
            {activeTab}
          </h3>
          {renderNestedData(data)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-5 text-gray-900 bg-white min-h-screen w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Data</h1>
      </div>
      {resumeData && Object.keys(resumeData).length > 0 ? (
        <div className="flex flex-wrap border-b border-gray-300 mb-4 w-full">
          {Object.keys(resumeData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold text-lg whitespace-nowrap ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 text-center mb-4">No tabs available.</p>
      )}
      <div className="p-4 bg-gray-50 rounded-lg w-full break-words">{renderTabContent()}</div>
    </div>
  );
};

export default ResumeData;