import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Navbar";

export default function KPIManagement() {
  const [kpis, setKpis] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingKPI, setEditingKPI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const buildKpiPayload = (data) => ({
    title: data.title,
    description: data.description || "",
    target_value: Number(data.target_value) || 0,
    actual_value: Number(data.actual_value) || 0,
    status: data.status,
    assigned_user: typeof data.assigned_user === "object"
      ? data.assigned_user._id
      : data.assigned_user,
    start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
    end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_value: "",
    actual_value: "",
    status: "On Track",
    assigned_user: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchKPIs(), fetchUsers()]);
    setIsLoading(false);
  };

  const fetchKPIs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kpis", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setKpis(res.data);
    } catch (err) {
      console.error(err);
      alert("โหลด KPI ไม่ได้");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("โหลด Users ไม่ได้");
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingKPI) {
        await axios.put(
          `http://localhost:5000/api/kpis/${editingKPI._id}`,
          buildKpiPayload(formData),
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/kpis", buildKpiPayload(formData), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchKPIs();
      setShowForm(false);
      setEditingKPI(null);
      resetForm();
    } catch (err) {
      console.error("🔥 handleCreateOrUpdate Error:", err.response?.data || err.message);
      alert("บันทึก KPI ไม่ได้");
    }
  };

  const handleEdit = (kpi) => {
    setEditingKPI(kpi);
    setFormData({
      ...kpi,
      assigned_user: kpi.assigned_user?._id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("แน่ใจว่าจะลบ KPI นี้?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kpis/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchKPIs();
    } catch (err) {
      console.error(err);
      alert("ลบ KPI ไม่ได้");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      target_value: "",
      actual_value: "",
      status: "On Track",
      assigned_user: "",
      start_date: "",
      end_date: "",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📊 KPI Management
            </h1>
            <p className="text-gray-600 text-lg">Create, edit, and monitor your key performance indicators</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingKPI(null);
              setShowForm(!showForm);
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create KPI</span>
            </div>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingKPI ? "✏️ Edit KPI" : "✨ Create New KPI"}
              </h2>
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
                <span className="text-white text-sm font-medium">
                  {editingKPI ? "Edit Mode" : "Create Mode"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  placeholder="Enter KPI title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                >
                  <option value="On Track">🟢 On Track</option>
                  <option value="At Risk">🟡 At Risk</option>
                  <option value="Off Track">🔴 Off Track</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Target Value</label>
                <input
                  type="number"
                  placeholder="Enter target value"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Actual Value</label>
                <input
                  type="number"
                  placeholder="Enter actual value"
                  value={formData.actual_value}
                  onChange={(e) => setFormData({ ...formData, actual_value: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Assigned User</label>
                <select
                  value={formData.assigned_user}
                  onChange={(e) => setFormData({ ...formData, assigned_user: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                >
                  <option value="">-- Select User --</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Duration</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  />
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  placeholder="Enter KPI description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/70 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCreateOrUpdate}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editingKPI ? "Update" : "Create"}</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingKPI(null);
                  resetForm();
                }}
                className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* KPI Table */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">KPI Overview</h2>
            <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
              <span className="text-white text-sm font-medium">{kpis.length} KPIs</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700" colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {kpis.map((kpi) => (
                  <tr key={kpi._id} className="transition-all duration-200 hover:bg-indigo-50/30 hover:scale-[1.01]">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{kpi.title}</div>
                      <div className="text-sm text-gray-500 truncate">{kpi.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-700">{kpi.target_value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">{kpi.actual_value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                          kpi.status === "On Track"
                            ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300"
                            : kpi.status === "At Risk"
                            ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300"
                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          kpi.status === "On Track" ? "bg-emerald-500" :
                          kpi.status === "At Risk" ? "bg-amber-500" : "bg-red-500"
                        }`}></div>
                        {kpi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {kpi.assigned_user?.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-gray-700 font-medium">{kpi.assigned_user?.username || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div>{kpi.start_date?.substring(0, 10)}</div>
                        <div className="text-gray-400">to</div>
                        <div>{kpi.end_date?.substring(0, 10)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => handleEdit(kpi)}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative">Edit</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => handleDelete(kpi._id)}
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
    </Layout>
  );
}