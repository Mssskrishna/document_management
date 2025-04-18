import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // for notification (optional)

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear user session or token from storage or context
    try {
      const res = await fetch(`${BaseUrl}/auth/logout`, {
        credentials: "include",
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    // Optionally clear any user state from context or redux
    // For example: dispatch(logoutAction())

    // Show logout success message
    toast.success("Logged out successfully!");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition m-2"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
