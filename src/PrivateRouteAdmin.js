import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteAdmin = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteAdmin;
