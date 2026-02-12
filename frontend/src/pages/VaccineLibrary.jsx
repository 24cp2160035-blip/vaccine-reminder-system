// src/pages/VaccineLibrary.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function VaccineLibrary() {
  const [list, setList] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/api/vaccine-library");
    setList(res.data);
  };

  // ⭐ FINAL – Ask user by NUMBER instead of profileId
  const addToProfile = async (v) => {
    try {
      const res = await API.get("/api/profiles");
      const profiles = res.data;

      if (profiles.length === 0) {
        return alert("❗ No profiles found. Create profile first.");
      }

      // Generate list for user selection 📌
      let menu = "Select a profile to add this vaccine:\n\n";

      profiles.forEach((p, i) => {
        menu += `${i + 1}. ${p.name} (${p.type})\n`;
      });

      const choice = prompt(menu);
      const index = Number(choice) - 1;

      if (isNaN(index) || index < 0 || index >= profiles.length) {
        return alert("❗ Invalid choice. Try again.");
      }

      const selectedProfile = profiles[index];

      // Send to backend
      await API.post("/api/vaccine-library/add", {
        profileId: selectedProfile._id,
        name: v.name,
        recommendedAge: v.recommendedAge,
      });

      alert(`✔ ${v.name} added to ${selectedProfile.name} successfully`);
      nav(`/vaccines/${selectedProfile._id}`);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to add. Check console");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">🧬 Vaccine Library</h1>
      <p className="text-gray-600 mb-6">
        Browse recommended vaccines & add to any profile easily.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {list.map(v => (
          <div key={v._id} className="border p-4 rounded shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold">{v.name}</h2>
            <p className="text-blue-600 text-sm font-medium">
              Recommended Age: {v.recommendedAge}
            </p>
            <p className="text-gray-600 text-sm mt-2">{v.description}</p>

            <button
              onClick={() => addToProfile(v)}
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add to Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}