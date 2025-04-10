import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, Scroll, Menu, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white h-screen p-5 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1
            className={`text-xl font-bold transition-all ${
              !isOpen && "hidden"
            }`}
          >
            Dashboard
          </h1>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <Menu />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 space-y-4 text-xl">
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
            to="/login"
            icon={<LogOut />}
            text={user ? "LogOut" : "LogIn"}
            isOpen={isOpen}
          />
        </nav>
      </div>

      {/* Content Area */}
    </div>
  );
};

// Sidebar Item Component with React Router Link
const SidebarItem = ({ to, icon, text, isOpen }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded cursor-pointer"
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-lg">{text}</span>}
    </Link>
  );
};

export default Sidebar;
