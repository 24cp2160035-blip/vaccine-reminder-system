import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api"; // Ensure this path is correct for your setup

export default function NotificationSettings() {
  const { profileId } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState({
    reminderTime: "08:00",
    reminderDaysBefore: 3,
    reminderEnabled: true,
  });

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  // Load current settings
  const load = async () => {
    try {
      const res = await API.get(`/api/profiles/${profileId}`);
      setData({
        reminderTime: res.data.reminderTime || "08:00",
        reminderDaysBefore: res.data.reminderDaysBefore || 3,
        reminderEnabled: res.data.reminderEnabled ?? true,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Save settings
  const save = async () => {
    try {
      // FIX: Changed to PUT and pointed to the standard profile update route
      await API.put(`/api/profiles/${profileId}`, data);
      alert("✔ Notification settings updated!");
      nav(`/profiles`);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("❌ Error saving settings");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🔔 Notification Settings</h1>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="enabled"
          className="w-5 h-5 text-blue-600"
          checked={data.reminderEnabled}
          onChange={(e) => setData({ ...data, reminderEnabled: e.target.checked })}
        />
        <label htmlFor="enabled" className="ml-2 text-gray-700 font-medium">
          Enable Email Reminders
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Reminder Time</label>
        <input
          type="time"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.reminderTime}
          onChange={(e) => setData({ ...data, reminderTime: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">We will send emails at this time.</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-1">Days Before Due Date</label>
        <input
          type="number"
          min="1"
          max="30"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.reminderDaysBefore}
          onChange={(e) =>
            setData({ ...data, reminderDaysBefore: Number(e.target.value) })
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          Example: If set to 3, you get an email 3 days before the vaccine is due.
        </p>
      </div>

      <button
        onClick={save}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Save Settings
      </button>
    </div>
  );
}