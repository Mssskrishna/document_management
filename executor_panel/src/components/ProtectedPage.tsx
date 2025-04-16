import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { User } from "../enum/ApplicationsResponse";
interface ProtectedPageProps {
  children: ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyLogin = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/verify-login`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      const user = data.body.data;
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
