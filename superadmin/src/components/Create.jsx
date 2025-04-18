import axios from "axios";
import React from "react";

export default function Create() {
  const [role, setRoleAttributes] = useState({
    title: "",
    departmentId: "",
    allowMultiple: false,
  });

  const handleCreateRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${BaseUrl}/admin/create-role`,
        { role: selectedRole },
        { withCredentials: true }
      );
      toast.success(`Role "${roleName}" created successfully`);
      setRoleName("");
    } catch (error) {
      console.error(error);
      toast.error("Error creating role");
    }
  };
  return (
    <div className="mb-8 p-6 bg-white border-red rounded-lg shadow-md">
      {/* <ToastContainer /> */}
      <div className="bg-white p-8 rounded  w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          ➕ Create New Role
        </h2>

        <form onSubmit={handleCreateRole}>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-gray-700 font-semibold mb-2"
            >
              Role Name
            </label>
            <input
              type="text"
              id="role"
              value={role.title}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-2"
              placeholder="e.g., admin, moderator"
            />
            <label
              htmlFor="role"
              className="block text-gray-700 font-semibold mb-2"
            >
              Department Id
            </label>
            <input
              type="text"
              id="role"
              value={role.title}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300  mb-2"
              placeholder="e.g., admin, moderator"
            />
            <label
              htmlFor="role"
              className="block text-gray-700 font-semibold mb-2"
            >
              Allow Multiple
              <input
                type="checkbox"
                id="role"
                value={role.title}
                onChange={(e) => setRoleName(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="e.g., admin, moderator"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Create Role
          </button>
        </form>
      </div>
    </div>
  );
}
