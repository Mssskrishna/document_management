import { useEffect, createContext, useState, useContext } from "react";
import axios from "axios";
import { BaseUrl } from "./utils/baseUrl";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true); // 👈

  const authCheck = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/auth/verify-login`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUser(response.data.body);
      setLoading(false);
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
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
