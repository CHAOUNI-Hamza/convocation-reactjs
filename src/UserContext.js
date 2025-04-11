// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // <- ajouté

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await axios.post(
            "/auth/me",
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUserInfo(response.data);
        } catch (error) {
          console.error("There was an error fetching user data!", error);
        }
        setLoading(false);
      } else {
        //console.warn("No access token found in local storage.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
};
