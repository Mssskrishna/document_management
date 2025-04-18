import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Login from "./components/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
const App = () => {
  const { user,loading } = useAuth();
  const navigate = useNavigate();
  // console.log( user );
  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, loading, navigate, location]);

  return (
    <div>
      <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
    </div>
  );
};

export default App;
