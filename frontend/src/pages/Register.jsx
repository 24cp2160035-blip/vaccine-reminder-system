// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "parent" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/users/register", form);
      login({ name: res.data.name, email: res.data.email, _id: res.data._id }, res.data.token);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <input required placeholder="Name" className="w-full p-3 border rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input required type="email" placeholder="Email" className="w-full p-3 border rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input required type="password" placeholder="Password" className="w-full p-3 border rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <select className="w-full p-3 border rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="parent">Parent (child)</option>
          <option value="pet_owner">Pet owner</option>
        </select>
        <button className="w-full bg-green-600 text-white p-3 rounded">Register</button>
        <p className="text-center text-sm text-gray-600">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => nav("/login")}>Login</span></p>
      </form>
    </div>
  );
}