import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Navbar";

export default function MyKPI() {
  const [kpis, setKpis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKPI, setEditingKPI] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_value: "",
    actual_value: "",
    status: "On Track",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchMyKpis();
  }, []);

  const fetchMyKpis = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kpis/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setKpis(res.data);
    } catch (err) {
      console.error(err);
      alert("โหลด KPI ของคุณไม่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (kpi) => {
    setEditingKPI(kpi);
    setFormData({
      title: kpi.title,
      description: kpi.description,
      target_value: kpi.target_value,
      actual_value: kpi.actual_value,
      status: kpi.status,
      start_date: kpi.start_date?.substring(0, 10),
      end_date: kpi.end_date?.substring(0, 10),
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/kpis/${editingKPI._id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("อัปเดต KPI สำเร็จ");
      setEditingKPI(null);
      fetchMyKpis();
    } catch (err) {
      console.error(err);
      alert("อัปเดต KPI ไม่ได้");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">📌 My KPIs</h1>

        {/* Form แก้ไข */}
        {editingKPI && (
          <div className="mb-8 bg-white/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Update KPI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Actual"
                value={formData.actual_value}
                onChange={(e) => setFormData({ ...formData, actual_value: e.target.value })}
                className="border p-3 rounded-lg"
              />           
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border p-3 rounded-lg md:col-span-2"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => setEditingKPI(null)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ตาราง KPI */}
        {kpis.length === 0 ? (
          <p className="text-gray-600">คุณยังไม่มี KPI ที่ได้รับมอบหมาย</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg bg-white/70 backdrop-blur-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Target</th>
                  <th className="px-6 py-4 text-left">Actual</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Duration</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {kpis.map((kpi) => (
                  <tr key={kpi._id} className="hover:bg-indigo-50/30 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{kpi.title}</td>
                    <td className="px-6 py-4">{kpi.target_value}</td>
                    <td className="px-6 py-4">{kpi.actual_value}</td>
                    <td className="px-6 py-4">{kpi.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {kpi.start_date?.substring(0, 10)} - {kpi.end_date?.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => handleEdit(kpi)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
