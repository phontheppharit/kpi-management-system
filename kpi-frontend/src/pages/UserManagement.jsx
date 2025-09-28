import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("โหลด users ไม่ได้", err);
      alert("โหลด users ไม่ได้: " + (err.response?.data?.msg || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setNewRole(user.role);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("แก้ role ไม่ได้");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("ลบ user ไม่ได้");
    }
  };

  const handleCreate = async () => {
    if (!newUser.username || !newUser.password || !newUser.email) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", newUser);
      fetchUsers();
      setNewUser({ username: "", password: "", email: "", role: "User" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("สร้าง user ไม่ได้");
    }
  };

  const resetForm = () => {
    setNewUser({ username: "", password: "", email: "", role: "User" });
  };

  if (isLoading) {
    return (
      <Navbar>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              👥 User Management
            </h1>
            <p className="text-gray-600 text-lg">Manage user accounts, roles, and permissions</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Create User</span>
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{users.length}</h2>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-emerald-100 text-sm font-medium">Admins</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{users.filter(u => u.role === 'Admin').length}</h2>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all group-hover:scale-150"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-purple-100 text-sm font-medium">Regular Users</p>
                <div className="rounded-full bg-white/20 p-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold">{users.filter(u => u.role === 'User').length}</h2>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">✨ Create New User</h2>
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
                <span className="text-white text-sm font-medium">New Account</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Role</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="User">👤 User</option>
                  <option value="Admin">👑 Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCreate}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add User</span>
                </div>
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">User Directory</h2>
            <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
              <span className="text-white text-sm font-medium">{users.length} Users</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700" colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {users.map((user) => (
                  <tr key={user._id} className="transition-all duration-200 hover:bg-indigo-50/30 hover:scale-[1.01]">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          {user.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="rounded-xl border-2 border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                        >
                          <option value="User">👤 User</option>
                          <option value="Admin">👑 Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                            user.role === "Admin"
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            user.role === "Admin" ? "bg-blue-500" : "bg-gray-500"
                          }`}></div>
                          {user.role === "Admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingUser === user._id ? (
                        <button
                          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                          onClick={() => handleSave(user._id)}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          <span className="relative">Save</span>
                        </button>
                      ) : (
                        <button
                          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                          onClick={() => handleEdit(user)}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          <span className="relative">Edit</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => handleDelete(user._id)}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Navbar>
  );
}