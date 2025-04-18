import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const Profile = () => {
  // Sample student details (can be replaced with actual API data)
  // const { user } = useAuth();
  const user = useSelector((state) => state.user.data);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div>
        <h2 className="text-xl font-semibold text-white flex flex-row items-center justify-center ">
          Student Details
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <img
              src={user?.imageUrl}
              alt="Student"
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
            <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
            <p className="text-gray-600">
              {user?.department || "CSE"} - {user?.year || "E-03"}
            </p>
          </div>

          {/* Student Details */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Info label="Student ID" value={user?.id || "N2XXXXX"} />

              <Info label="Name" value={user?.name} />
              <Info label="Email" value={user?.email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying individual info fields
const Info = ({ label, value }) => {
  return (
    <div className="bg-gray-200 p-3 rounded-md">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
};

export default Profile;
