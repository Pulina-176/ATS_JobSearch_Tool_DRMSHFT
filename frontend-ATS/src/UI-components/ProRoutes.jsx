import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProRoutes = () => {
  const { token, username } = useSelector((state) => state.auth); 


  console.log("ProtectedRoute - Auth State:", { token, username });
  

  //redirect to login
  if (!token || !username) {
    console.log("Redirecting to login...");
    return <Navigate to="/" replace />;
  }

 
  return <Outlet />;
};

export default ProRoutes;