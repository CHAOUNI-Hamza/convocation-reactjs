import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TokenExpiryHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = () => {
      const accessToken = localStorage.getItem("accessToken");
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (accessToken && tokenExpiry) {
        const expiryTime = new Date(tokenExpiry).getTime();
        const currentTime = new Date().getTime();
        if (currentTime >= expiryTime) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("role");
        navigate("/login");
      }
    };

    // Check token immediately when component mounts
    checkTokenValidity();

    // Set interval to check token validity periodically
    const intervalId = setInterval(checkTokenValidity, 1000 * 60); // Check every minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  return <>{children}</>;
};

export default TokenExpiryHandler;
