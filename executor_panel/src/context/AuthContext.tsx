import { useEffect, createContext, useState, useContext } from "react";
import axios from "axios";
import { BaseUrl } from "../utils/baseurl";

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  authCheck: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const authCheck = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/auth/check`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUser(response.data.body.data);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authCheck();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authCheck }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
