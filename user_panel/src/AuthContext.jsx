import { useEffect, createContext, useState, useContext } from "react";
import axios from "axios";
import { BaseUrl } from "./utils/baseUrl";
import { useDispatch } from "react-redux";
import { setLoggedIn, setUser } from "./features/userSlice";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authCheck = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/auth/verify-login`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch(setUser(response.data.body.data));
      dispatch(setLoggedIn(true));
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    authCheck();
  }, []);

  return (
    <AuthContext.Provider value={{  authCheck }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
