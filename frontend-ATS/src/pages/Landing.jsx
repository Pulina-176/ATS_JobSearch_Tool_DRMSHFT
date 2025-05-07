import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaFileAlt, FaRobot } from "react-icons/fa";

const Landing = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 text-white flex flex-col items-center justify-start p-8 gap-12 overflow-auto">
      {/* Title and Subtitle */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to DreamShift Assistant
        </h1>
        <p className="text-gray-400 text-lg">Choose a tool to get started</p>
      </div>

      {/* Tool Options */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 px-6">
        {/* CV Writing Assistant Section */}
        <div className="flex-1 bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
          <FaFileAlt className="text-5xl text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">CV Writing Assistant</h2>
          <p className="mb-6 text-gray-300">
          Upload past CVs and automatically extract and merge key sections like education, experience, and skills — without duplicates. Streamline your drafting process with AI-powered section consolidation.
          </p>
          <button
            onClick={() => navigate("/cv-writing/pdf-uploader")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition"
          >
            Launch CV Assistant
          </button>
        </div>

        {/* ATS Assistant Section */}
        <div className="flex-1 bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
          <FaRobot className="text-5xl text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">ATS Assistant</h2>
          <p className="mb-6 text-gray-300">
          Enter job titles and target locations to automatically gather live job postings from the web. The tool extracts descriptions, skills, companies, and more — generating a comprehensive JOBDES and an ATS keyword report to guide optimized CV writing          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
          >
            Launch ATS Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;