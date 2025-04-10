import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Certificate from "./components/Certificate";
import Logout from "./components/Auth";
import Cards from "./components/roles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <Router>
      <ToastContainer />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificate" element={<Certificate />} />
            {/* <Route path="/login" element={<Logout />} /> */}
            <Route path="/login" element={<Logout />} />
            <Route path="/roles" element={<Cards />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
