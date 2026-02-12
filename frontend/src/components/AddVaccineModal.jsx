import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function AddVaccineModal({ vaccine, close }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [notes, setNotes] = useState("");

  // Load user profiles for dropdown
  const loadProfiles = async () => {
    const res = await API.get("/api/profiles");
    setProfiles(res.data);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    const diff = today - birth;
    const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));

    return years > 0 ? `${years} yr ${months} mo` : `${months} months`;
  };

  const save = async () => {
    await API.post("/api/vaccines", {
      profileId: selectedProfile,
      vaccineName: vaccine.name,
      dueDate,
      doctorName,
      notes,
      status: "pending",
    });

    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Add {vaccine.name}
        </h2>

        {/* Profile Dropdown */}
        <label className="text-sm font-semibold">Select Profile:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
        >
          <option value="">-- Select --</option>

          {profiles.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — {calculateAge(p.dob)}
            </option>
          ))}
        </select>

        {/* Due Date */}
        <label className="text-sm font-semibold">Due Date:</label>
        <input
          type="date"
          className="w-full p-2 border rounded mb-3"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Doctor Name */}
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Doctor Name (optional)"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />

        {/* Notes */}
        <textarea
          className="w-full p-2 border rounded mb-3"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}