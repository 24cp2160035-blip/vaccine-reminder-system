import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const p = await API.get("/api/profiles");
      setProfiles(p.data);

      if (p.data.length) {
        const vaccinePromises = p.data.map(profile => 
          API.get(`/api/vaccines/${profile._id}`)
        );
        const vaccineResults = await Promise.all(vaccinePromises);
        const combined = vaccineResults.flatMap((res, idx) => 
          res.data.map(v => ({ ...v, profileName: p.data[idx].name }))
        );
        setAllVaccines(combined);
        setSelectedProfile(p.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const displayVaccines = selectedProfile 
    ? allVaccines.filter(v => v.profileId === selectedProfile)
    : allVaccines;

  const overdue = displayVaccines.filter(v => 
    v.status !== "completed" && new Date(v.dueDate) < today
  );
  
  const dueToday = displayVaccines.filter(v => {
    const due = new Date(v.dueDate);
    due.setHours(0, 0, 0, 0);
    return v.status !== "completed" && due.getTime() === today.getTime();
  });

  const upcoming = displayVaccines.filter(v => {
    const due = new Date(v.dueDate);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    return v.status !== "completed" && due > today && due <= in7Days;
  });

  const completed = displayVaccines.filter(v => v.status === "completed");

  // Removed unused nextVaccine variable

  const upcomingTimeline = displayVaccines
    .filter(v => v.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <select 
          value={selectedProfile || "all"}
          onChange={(e) => setSelectedProfile(e.target.value === "all" ? null : e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Profiles</option>
          {profiles.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Priority Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-700 font-semibold">⚠️ Overdue</p>
            <span className="text-3xl font-bold text-red-600">{overdue.length}</span>
          </div>
          {overdue.length > 0 && (
            <p className="text-sm text-red-600">Action required immediately</p>
          )}
        </div>

        <div className="p-6 bg-orange-50 border-2 border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-700 font-semibold">📅 Due Today</p>
            <span className="text-3xl font-bold text-orange-600">{dueToday.length}</span>
          </div>
          {dueToday.length > 0 && (
            <p className="text-sm text-orange-600">Schedule appointment today</p>
          )}
        </div>

        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-700 font-semibold">🔔 Upcoming (7 days)</p>
            <span className="text-3xl font-bold text-blue-600">{upcoming.length}</span>
          </div>
          {upcoming.length > 0 && (
            <p className="text-sm text-blue-600">Plan ahead</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500">Profiles</p>
          <p className="text-3xl font-bold">{profiles.length}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500">Total Vaccines</p>
          <p className="text-3xl font-bold">{displayVaccines.length}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500">Pending</p>
          <p className="text-3xl font-bold">{displayVaccines.length - completed.length}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completed.length}</p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📆 Vaccination Timeline</h2>
        
        {upcomingTimeline.length === 0 ? (
          <p className="text-gray-500">No upcoming vaccines scheduled</p>
        ) : (
          <div className="space-y-3">
            {upcomingTimeline.map((v, idx) => {
              const dueDate = new Date(v.dueDate);
              const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntil < 0;
              
              return (
                <div key={v._id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    isOverdue ? 'bg-red-500' : daysUntil === 0 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {isOverdue ? '!' : daysUntil === 0 ? '0' : daysUntil}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{v.vaccineName}</p>
                    <p className="text-sm text-gray-600">
                      {v.profileName} • {dueDate.toLocaleDateString()}
                      {daysUntil > 0 && ` (in ${daysUntil} days)`}
                      {daysUntil === 0 && ' (Today)'}
                      {isOverdue && ` (${Math.abs(daysUntil)} days overdue)`}
                    </p>
                  </div>
                  <Link
                    to={`/vaccines/${v.profileId}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/profiles"
          className="p-6 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700"
        >
          + Add New Profile
        </Link>

        <Link
          to="/library"
          className="p-6 bg-purple-600 text-white rounded-lg text-center font-semibold hover:bg-purple-700"
        >
          📚 Browse Vaccine Library
        </Link>

        {profiles.length > 0 && (
          <Link
            to={`/vaccines/${profiles[0]._id}`}
            className="p-6 bg-green-600 text-white rounded-lg text-center font-semibold hover:bg-green-700"
          >
            + Add Vaccine
          </Link>
        )}
      </div>
    </div>
  );
}