import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { settUsername, setToken } from "../slices/authSlice"; // Import setToken

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      dispatch(settUsername(username)); // Store username in Redux
      dispatch(setToken(data.token));  // Store token in Redux
      setSuccessMessage(data.message);
      navigate("/home");
    } catch (error) {
      setError(error.message);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [successMessage, navigate]);

  // Rest of the component remains unchanged
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-6 bg-red-100 p-2 rounded-lg">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm text-center mb-6 bg-green-100 p-2 rounded-lg">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;