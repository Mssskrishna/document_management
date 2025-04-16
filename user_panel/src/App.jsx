import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Certificate from "./components/Certificate";
import Logout from "./components/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Document from "./components/Document";
import ProtectedPage from "./components/ProtectedRoute";

const RouteToaster = () => {
  const location = useLocation();
  const [visited, setVisited] = useState(new Set());

  useEffect(() => {
    const path = location.pathname;
    if (!visited.has(path)) {
      const messages = {
        "/": "You're on the Home page.",
        "/profile": "Here’s your Profile.",
        "/certificate": "Request a certificate here.",
        "/login": "Login or Logout from here.",
        "/roles": "View available roles.",
      };

      if (messages[path]) {
        toast.info(messages[path], { closeOnClick: true });
        setVisited((prev) => new Set(prev).add(path));
      }
    }
  }, [location, visited]);

  return null;
};
const App = () => {
  const [initSet, setInitSet] = useState(0);
  useEffect(() => {
    if (initSet == 0) {
      toast.info("Welcome to the Student Panel");
    }
    setInitSet(1);
  });
  return (
    <Router>
      <ToastContainer />

      <RouteToaster />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route
              path="/documents"
              element={
                <ProtectedPage>
                  <Document />
                </ProtectedPage>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedPage>
                  <Home />
                </ProtectedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedPage>
                  <Profile />
                </ProtectedPage>
              }
            />
            <Route
              path="/certificate"
              element={
                <ProtectedPage>
                  <Certificate />
                </ProtectedPage>
              }
            />

            {/* <Route path="/login" element={<Logout />} /> */}
            <Route path="/login" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
