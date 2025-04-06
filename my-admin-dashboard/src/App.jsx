import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GoogleAuth from "./Google";
import { useAuth } from "./AuthContext";
import axios from "axios";
const requestsData = [
  {
    id: 1,
    name: "rama krishna",
    request: "Library Access",
    status: "Pending",
    document: "library_access.pdf",
    photo: "john_doe.jpg",
  },
  {
    id: 2,
    name: "Siraj",
    request: "Hostel Room Change",
    status: "Pending",
    document: "hostel_request.pdf",
    photo: "jane_smith.jpg",
  },
  {
    id: 3,
    name: "surendra",
    request: "Fee Payment Extension",
    status: "Rejected",
    document: "fee_extension.pdf",
    photo: "mike_johnson.jpg",
  },
];

const Sidebar = ({ user }) => {
  console.log(user);
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-6">Finance Department Board</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="text-blue-400 hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/pending-applications"
            className="text-blue-400 hover:underline"
          >
            Pending Applications
          </Link>
        </li>
        <li>
          <Link
            to="/approved-applications"
            className="text-blue-400 hover:underline"
          >
            Approved Applications
          </Link>
        </li>
        <li>
          <Link
            to="/rejected-applications"
            className="text-blue-400 hover:underline"
          >
            Rejected Applications
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-blue-400 hover:underline">
            About Us
          </Link>
        </li>
        {user ? (
          <li>
            <Link to="/profile" className="text-blue-400 hover:underline">
              Profile
            </Link>
          </li>
        ) : (
          <li>
            <Link to={"/login"} className="text-blue-400 hover:underline">
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

const ApprovedApplications = ({ requests }) => {
  const approvedRequests = requests.filter((req) => req.status === "Approved");
  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Approved Applications</h1>
      {approvedRequests.map((req) => (
        <motion.div
          key={req.id}
          className="p-4 bg-green-700 rounded shadow-md mb-3"
        >
          <h2 className="text-xl font-bold">{req.name}</h2>
          <p>{req.request}</p>
          <a href={req.document} className="text-blue-300 underline">
            View Document
          </a>
          <img
            src={req.photo}
            alt={req.name}
            className="w-16 h-16 mt-2 rounded-full"
          />
        </motion.div>
      ))}
    </div>
  );
};
const Dashboard = ({ requests }) => {
  const pendingApplications = async () => {
    const response = await axios.post(
      "http://localhost:8080/executive/applications",
      {}, // Empty body, since you're not sending any data
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    
    console.log(response);
  };

  const totalApplications = requests.length;
  const pendingCount = requests.filter(
    (req) => req.status === "Pending"
  ).length;
  const approvedCount = requests.filter(
    (req) => req.status === "Approved"
  ).length;
  const rejectedCount = requests.filter(
    (req) => req.status === "Rejected"
  ).length;
  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-700 rounded text-center">
          <h2 className="text-lg font-bold">Total Applications</h2>
          <p className="text-2xl">{totalApplications}</p>
        </div>
        <div className="p-4 bg-yellow-600 rounded text-center">
          <h2 className="text-lg font-bold">Pending</h2>
          <p className="text-2xl">{pendingCount}</p>
        </div>
        <div className="p-4 bg-green-600 rounded text-center">
          <h2 className="text-lg font-bold">Approved</h2>
          <p className="text-2xl">{approvedCount}</p>
        </div>
        <div className="p-4 bg-red-600 rounded text-center">
          <h2 className="text-lg font-bold">Rejected</h2>
          <p className="text-2xl">{rejectedCount}</p>
        </div>
        <button
          onClick={pendingApplications}
          className="col-span-4 bg-blue-500 px-4 py-2 text-white rounded"
        >
          View Pending Applications
        </button>
      </div>
    </div>
  );
};

const RejectedApplications = ({ requests }) => {
  const rejectedRequests = requests.filter((req) => req.status === "Rejected");
  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Rejected Applications</h1>
      {rejectedRequests.map((req) => (
        <motion.div
          key={req.id}
          className="p-4 bg-red-700 rounded shadow-md mb-3"
        >
          <h2 className="text-xl font-bold">{req.name}</h2>
          <p>{req.request}</p>
        </motion.div>
      ))}
    </div>
  );
};

const PendingApplications = ({ requests, setRequests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const approveRequest = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
    setSelectedRequest(null);
  };

  const rejectRequest = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    );
    setSelectedRequest(null);
  };

  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Pending Applications</h1>
      {!selectedRequest ? (
        requests
          .filter((req) => req.status === "Pending")
          .map((req) => (
            <motion.div
              key={req.id}
              className="p-4 bg-gray-700 rounded shadow-md mb-3"
            >
              <h2 className="text-xl font-bold">{req.name}</h2>
              <p>{req.request}</p>
              <button
                onClick={() => setSelectedRequest(req)}
                className="mt-2 bg-blue-500 px-4 py-2 text-white rounded"
              >
                View Details
              </button>
            </motion.div>
          ))
      ) : (
        <motion.div className="p-4 bg-gray-800 rounded shadow-md relative">
          <button
            onClick={() => setSelectedRequest(null)}
            className="absolute top-3 left-3 bg-gray-700 p-2 rounded-full"
          >
            ⬅ Back
          </button>
          <h2 className="text-xl font-bold text-center">
            {selectedRequest.request}
          </h2>
          <p className="text-gray-300 mt-2">Dear Sir/Madam,</p>
          <p className="text-gray-300 mt-2">
            I, {selectedRequest.name}, formally request{" "}
            {selectedRequest.request}. This request is essential due to...
          </p>
          <p className="text-gray-300 mt-2">
            Attached Document:{" "}
            <a
              href={selectedRequest.document}
              className="text-blue-400 underline"
            >
              {selectedRequest.document}
            </a>
          </p>
          <p className="text-gray-300 mt-2">Uploaded Photo:</p>
          <img
            src={selectedRequest.photo}
            alt="Uploaded"
            className="w-32 h-32 mt-2 rounded"
          />
          <textarea
            className="w-full p-2 mt-2 text-black"
            placeholder="Add remarks..."
          ></textarea>
          <input type="file" className="mt-2" />
          <button className="mt-2 bg-blue-500 px-4 py-2 text-white rounded">
            Upload Document
          </button>
          <button
            onClick={() => approveRequest(selectedRequest.id)}
            className="mt-2 bg-green-500 px-4 py-2 text-white rounded ml-2"
          >
            Approve
          </button>
          <button
            onClick={() => rejectRequest(selectedRequest.id)}
            className="mt-2 bg-red-500 px-4 py-2 text-white rounded ml-2"
          >
            Reject
          </button>
        </motion.div>
      )}
    </div>
  );
};
const AboutUs = () => {
  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-gray-300">
        Welcome to the Finance Department Board. We are committed to providing
        an efficient and transparent process for handling student requests,
        including financial aid, hostel accommodations, and academic support.
        Our team ensures that all applications are processed promptly while
        maintaining fairness and integrity.
      </p>
      <p className="mt-4 text-gray-300">
        If you have any questions, feel free to contact our support team.
      </p>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-gray-300">Welcome to your profile page.</p>
    </div>
  );
};

const App = () => {
  const [requests, setRequests] = useState(requestsData);
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Prevent rendering before auth check is complete
  }
  return (
    <Router>
      <div className="flex bg-gray-900 min-h-screen">
        <Sidebar user={user} />
        <div className="ml-64 flex-1 p-5">
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard requests={requests} />}
            />
            <Route
              path="/pending-applications"
              element={
                <PendingApplications
                  requests={requests}
                  setRequests={setRequests}
                />
              }
            />
            <Route
              path="/approved-applications"
              element={<ApprovedApplications requests={requests} />}
            />
            <Route
              path="/rejected-applications"
              element={<RejectedApplications requests={requests} />}
            />
            <Route path="/about" element={<AboutUs />} />
            {user ? (
              <Route path="/profile" element={<Profile />} />
            ) : (
              <Route path="/login" element={<GoogleAuth />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
