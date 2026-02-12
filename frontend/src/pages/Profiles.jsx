import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("child");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await API.get("/api/profiles");
        setProfiles(res.data);

        // ⭐ Save list so Vaccine Library can show selection popup
        localStorage.setItem("profilesList", JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfiles();
  }, []);

  const resetForm = () => {
    setName("");
    setType("child");
    setDob("");
    setGender("");
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (!name || !dob || !gender) return;

    setLoading(true);
    try {
      const res = await API.post("/api/profiles", {
        name,
        type,
        dob,
        gender,
      });

      setProfiles((prev) => [...prev, res.data]);
      localStorage.setItem("profilesList", JSON.stringify([...profiles, res.data])); // save new list
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this profile?")) return;

    try {
      await API.delete(`/api/profiles/${id}`);
      const updated = profiles.filter((p) => p._id !== id);
      setProfiles(updated);
      localStorage.setItem("profilesList", JSON.stringify(updated)); // update list in storage
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenVaccines = (profileId) => {
    localStorage.setItem("activeProfile", profileId);  // ⭐ USED IF LIBRARY SELECT NOT SHOWN
    navigate(`/vaccines/${profileId}`);
  };

  const calcAge = (dobStr) => {
    if (!dobStr) return "-";
    const dobDate = new Date(dobStr);
    const diff = Date.now() - dobDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage children & pets, and track vaccination schedules.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Profile */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Profile</h2>

            <form className="space-y-4" onSubmit={handleAddProfile}>
              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Profile name"
              />

              <select
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="child">Child</option>
                <option value="pet">Pet</option>
              </select>

              <input
                type="date"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />

              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Male / Female / Other"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white py-2 text-sm"
              >
                {loading ? "Adding..." : "Add Profile"}
              </button>
            </form>
          </div>
        </div>

        {/* Profile List */}
        <div className="md:col-span-2">
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No profiles added yet.</p>
            ) : (
              profiles.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border px-5 py-4 flex justify-between cursor-pointer"
                  onClick={() => handleOpenVaccines(p._id)}
                >
                  <div>
                    <p className="font-semibold capitalize flex gap-2">
                      {p.name}
                      <span className="text-xs bg-gray-200 px-2 rounded capitalize">
                        {p.type}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      DOB: {p.dob ? new Date(p.dob).toLocaleDateString("en-IN") : "-"}  · Age: {calcAge(p.dob)} yrs
                    </p>
                  </div>

                  <button
                    className="text-red-500 text-sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}