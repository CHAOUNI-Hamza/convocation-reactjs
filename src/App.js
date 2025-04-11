import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/front/LoginView";
//import HomeView from "./views/front/HomeView";
import "./App.css";
import TokenExpiryHandler from "./TokenExpiryHandler"; 
import DashboardWiew from "./views/back/DashboardWiew";

import PrivateRouteAdmin from "./PrivateRouteAdmin";
import { UserProvider } from "./UserContext";

axios.defaults.baseURL = "http://localhost:8000/api";
//axios.defaults.baseURL = 'https://events.recherche-scientifique-flshm.ma/api';
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenExpiry");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, []);

  //<Route path="/" element={<HomeView />} />
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    window.location.href = "/login";
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <TokenExpiryHandler>
          <Routes>
            ()
            {/*<Route path="/" element={<HomeView />} />*/}
            <Route path="/login" element={<LoginView />} />
            <Route element={<PrivateRouteAdmin />}>
              <Route
                path="/admin"
                element={<DashboardWiew handleLogout={handleLogout} />}
              />
            </Route>
          </Routes>
        </TokenExpiryHandler>
      </BrowserRouter>
    </UserProvider>
  );
}
