// src/pages/Library.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [vaccines, setVaccines] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    const res = await API.get("/api/library");
    setVaccines(res.data);
  };

  const addToSchedule = async (v) => {
    const profileId = localStorage.getItem("selectedProfileId");

    if (!profileId) {
      alert("Select a profile first!");
      nav("/profiles");
      return;
    }

    const today = new Date();
    today.setDate(today.getDate() + v.daysAfterBirth);

    await API.post("/api/vaccines", {
      profileId,
      vaccineName: v.name,
      dueDate: today,
      notes: v.purpose,
    });

    alert("Added to your schedule!");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vaccine Library (India)</h1>
      <p className="text-gray-600 mb-6">
        Browse the official Indian vaccination schedule & add vaccines to your child's profile.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaccines.map((v) => (
          <div key={v._id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{v.name}</h2>
            <p className="text-sm text-gray-500">{v.purpose}</p>

            <div className="mt-3 text-sm">
              <strong>Given at:</strong> {v.age}
            </div>

            <button
              onClick={() => addToSchedule(v)}
              className="mt-4 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Add to My Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}