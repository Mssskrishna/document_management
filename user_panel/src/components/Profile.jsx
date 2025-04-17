import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const Profile = () => {
  // Sample student details (can be replaced with actual API data)
  // const { user } = useAuth();
  const user = useSelector((state) => state.user.data);
  // const user = {
  //   photo: "https://intranet.rguktn.ac.in/SMS/usrphotos/user/N200997.jpg", // Replace with actual photo URL
  //   name: "Bhavani Kishore",
  //   id: "N200997",
  //   email: "n200997@rguktn.ac.in",
  //   department: "Computer Science & Engineering",
  //   year: "2020-2026",
  //   dob: "15th August 2003",
  //   caste: "General",
  //   address: "RGUKT Nuzvid, Krishna Dist, Andhra Pradesh",
  //   phone: "+91 70326XXXX8",
  //   fatherName: "Durga Rao",
  //   motherName: "Durga",
  // };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div>
        <h2 className="text-xl font-semibold text-white flex flex-row items-center justify-center ">
          Student Details
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <img
              src={user?.photo}
              alt="Student"
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
            <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
            <p className="text-gray-600">
              {user?.department} - {user?.year}
            </p>
          </div>

          {/* Student Details */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Info label="Student ID" value={user?.id} />

              <Info label="Name" value={user?.name} />
              <Info label="Email" value={user?.email} />
              <Info label="Date of Birth" value={user?.dob} />
              <Info label="Phone" value={user?.phone} />
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
