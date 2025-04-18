import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../utils/baseUrl";
import LogoutButton from "./Logout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// const roles = ["admin", "moderator", "student"];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(0);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([{ id: 0, title: "Student" }]);
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/admin/users`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUsers(res.data.body);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/admin/roles`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // setRoles(res.data.body);
      // console.log(res.data.body)

      setRoles([{ id: 0, title: "Student" }, ...res.data.body]);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleUpdate = async (userEmail) => {
    if (selectedRole) {
      console.log(selectedRole);
      try {
        const role = selectedRole === 0 ? null : selectedRole;
        const res = await axios.post(
          `${BaseUrl}/admin/updateRole`,
          {
            userEmail: userEmail,
            role: role,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          toast.success("role changed successfully");
          fetchUsers(); // Refre}sh list
        }
      } catch (err) {
        console.error("Error updating role", err);
      }
    }
  };

  const authCheck = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/auth/verify-login`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      let user = response.data.body.data;
      console.log(user)
      if (!user.isAdmin) {
        throw "Not admin";
      }
    } catch (error) {
      navigate("/login");
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    authCheck();
  }, []);
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <LogoutButton />
      <div className=" mb-8 p-6 bg-white border-red rounded-lg shadow-md">
        <div className="text-center ">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🔐 Change Role
          </h1>
          <p className="text-gray-500">
            Manage user access and permissions easily
          </p>
        </div>
        {/* Search */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="🔎 Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* User Cards */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:shadow-lg transition gap-2"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Role:{" "}
                    {roles.find((r) => r.id === user.role).title || "student"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  {showDropdown === user.id ? (
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={async () => {
                          await handleRoleUpdate(user.email, selectedRole);
                          setShowDropdown(false);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowDropdown(user.id);
                        setSelectedRole(user.role || "student");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                      Change Role
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
