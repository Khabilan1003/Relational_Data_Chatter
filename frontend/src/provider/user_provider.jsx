import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  //State Variables
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(Cookies.get("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestErrorMessage, setLatestErrorMessage] = useState(""); // Will contain the latest error message happened here

  useEffect(() => {
    const currentUser = async () => {
      if (accessToken == null) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      setLoading(true);

      try {
        const getUserAxiosResult = await axios.get(
          `${process.env.REACT_APP_API_URL}/login`,
          {
            headers: {
              Authorization: `bearer ${accessToken}`,
            },
          }
        );

        console.log(getUserAxiosResult.data);
        setUser(getUserAxiosResult.data);
        setIsLoggedIn(true);
      } catch (exception) {
        Cookies.remove("token");
        setIsLoggedIn(false);
        setLatestErrorMessage(exception.response.data.detail);
        console.log(`Exception : ${exception.response.data.detail}`);
      }

      setLoading(false);
    };
    currentUser();
  }, [accessToken]);

  const basicAuth = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      let result = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAccessToken(result.data.access_token);
      Cookies.set("token", result.data.access_token, { expires: 7 });
    } catch (exception) {
      setLoading(false);
      setLatestErrorMessage(exception.response.data.detail);
      console.log(`Exception : ${exception}`);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setAccessToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  // Combine the state values and the methods inside a map
  const contextValue = {
    accessToken,
    loading,
    user,
    isLoggedIn,
    latestErrorMessage,
    basicAuth,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
