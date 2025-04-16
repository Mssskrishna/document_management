import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../utils/baseUrl";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyLogin = async () => {
    try {
      const res = await fetch(`${BaseUrl}/auth/verify-login`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      const user = data.body;
      dispatch(setUser(user));
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyLogin();
  }, []);

  return <>{children}</>;
};

export default ProtectedPage;
