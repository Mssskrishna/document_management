import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Scroll, Menu, LogOut, LogIn, X } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BaseUrl } from "../utils/baseUrl";
import { setLoggedIn, setUser } from "../features/userSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  // const {user}
  const user = useSelector((state) => state.user.data);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setIsOpen(false);
    }
  }, [location, isMobileView]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 text-white p-2 rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      {/* Backdrop - Only on mobile when sidebar is open */}
      {isMobileView && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white z-40 transition-all duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
          ${isOpen ? "w-64" : "w-20"} 
          md:relative md:transform-none min-h-screen`}
      >
        <div className="flex items-center justify-between p-5 h-16 border-b border-gray-800">
          <h1
            className={`text-xl font-bold transition-opacity duration-200 ${
              !isOpen && "opacity-0 md:opacity-0 invisible md:invisible"
            }`}
          >
            Dashboard
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-3 space-y-1">
          <SidebarItem to="/" icon={<Home />} text="Home" isOpen={isOpen} />
          <SidebarItem
            to="/profile"
            icon={<User />}
            text="Profile"
            isOpen={isOpen}
          />
          <SidebarItem
            to="/certificate"
            icon={<Scroll />}
            text="Certificate"
            isOpen={isOpen}
          />
          <SidebarItem
            to="/documents"
            icon={<User />}
            text="Documents"
            isOpen={isOpen}
          />

          <SidebarItem
            to="/login"
            icon={user ? <LogOut /> : <LogIn />}
            text={user ? "Log Out" : "Log In"}
            isOpen={isOpen}
          />
        </nav>

        {/* Mobile close button at bottom */}
        {isMobileView && isOpen && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-800 rounded-md text-sm flex items-center space-x-2"
            >
              <X size={16} />
              <span>Close Menu</span>
            </button>
          </div>
        )}
      </div>

      {/* Content spacer - creates space for the sidebar on desktop */}
      <div
        className={`hidden md:block ${
          isOpen ? "w-0" : "w-0"
        } flex-shrink-0 transition-all duration-300`}
      />
    </>
  );
};

// Sidebar Item Component with React Router Link
const SidebarItem = ({ to, icon, text, isOpen, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors duration-200
        ${
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      {isOpen && <span className="text-sm font-medium">{text}</span>}
    </Link>
  );
};

export default Sidebar;
