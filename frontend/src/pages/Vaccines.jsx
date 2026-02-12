// src/pages/Vaccines.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function Vaccines() {
  const { profileId } = useParams();
  const [vaccines, setVaccines] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    vaccineName: "",
    dueDate: "",
    doctorName: "",
    notes: "",
    remindMeDate: "",
    remindMeTime: "",
  });

  const load = React.useCallback(async () => {
    const res = await API.get(`/api/vaccines/${profileId}`);
    setVaccines(res.data);
  }, [profileId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
   await API.post("/api/vaccines", {
  ...form,
  status: "pending", // <-- REQUIRED
  profileId,
});
    setForm({ vaccineName: "", dueDate: "", doctorName: "", notes: "", remindMeDate: "", remindMeTime: "" });
    setOpenModal(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/api/vaccines/${id}`, { status });
    load();
  };

  const del = async (id) => {
    await API.delete(`/api/vaccines/${id}`);
    load();
  };

  const exportHistory = async () => {
    try {
      const res = await API.get(`/api/export/${profileId}`);
      const data = res.data;
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaccine-history-${data.profile.name}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export vaccination history");
    }
  };

  // Badge Color Logic
  const getStatusBadge = (v) => {
  const today = new Date().toISOString().split("T")[0];
  const due = new Date(v.dueDate);
  const now = new Date(today);

  if (v.status === "completed") {
    return "bg-green-200 text-green-700";
  }
  if (due < now) {
    return "bg-red-200 text-red-700";
  }
  return "bg-yellow-200 text-yellow-700";
};

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Vaccination Records
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportHistory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            📥 Export History
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            ➕ Add Vaccine
          </button>
        </div>
      </div>

      {/* VACCINE LIST */}
      <div className="space-y-4">
        {vaccines.length === 0 ? (
          <p className="text-gray-500">No vaccines added yet.</p>
        ) : (
          vaccines.map((v) => (
            <div
              key={v._id}
              className="bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {v.vaccineName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(v.dueDate).toLocaleDateString()}
                  </p>
                  {v.doctorName && (
                    <p className="text-xs text-gray-500">
                      Doctor: {v.doctorName}
                    </p>
                  )}
                  {v.notes && (
                    <p className="text-xs text-gray-500">Note: {v.notes}</p>
                  )}
                  {v.remindMeDate && (
                    <p className="text-xs text-blue-600 font-medium">
                      🔔 Remind me: {new Date(v.remindMeDate).toLocaleDateString()}
                      {v.remindMeTime && ` at ${v.remindMeTime}`}
                      {v.reminderSent && " ✓ Sent"}
                    </p>
                  )}
                </div>

                <span
                  className={`px-3 h-fit py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    v
                  )}`}
                >
                  {v.status || "pending"}
                </span>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="text-green-600 font-medium"
                  onClick={() => updateStatus(v._id, "completed")}
                >
                  ✔ Mark Done
                </button>
                <button
                  className="text-yellow-600 font-medium"
                  onClick={() => updateStatus(v._id, "pending")}
                >
                  ⏳ Set Pending
                </button>
                <button
                  className="text-red-600 font-medium"
                  onClick={() => del(v._id)}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4">Add Vaccine</h3>

            <form onSubmit={submit} className="space-y-3">
              <input
                required
                placeholder="Vaccine name"
                value={form.vaccineName}
                onChange={(e) =>
                  setForm({ ...form, vaccineName: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🔔 Remind Me On (Optional)
                </label>
                <input
                  type="date"
                  value={form.remindMeDate}
                  onChange={(e) =>
                    setForm({ ...form, remindMeDate: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                  placeholder="Set custom reminder date"
                />
              </div>
              
              {form.remindMeDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⏰ Remind Me At (Optional)
                  </label>
                  <input
                    type="time"
                    value={form.remindMeTime}
                    onChange={(e) =>
                      setForm({ ...form, remindMeTime: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="Set reminder time"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.remindMeTime 
                      ? `You'll get an email on ${new Date(form.remindMeDate).toLocaleDateString()} at ${form.remindMeTime}`
                      : "Leave empty for default time (9:00 AM)"}
                  </p>
                </div>
              )}
              
              {!form.remindMeDate && (
                <p className="text-xs text-gray-500 -mt-2">
                  Set a date and time to receive a custom reminder email
                </p>
              )}
              
              <input
                placeholder="Doctor name"
                value={form.doctorName}
                onChange={(e) =>
                  setForm({ ...form, doctorName: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}