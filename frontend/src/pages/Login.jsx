// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/users/login", form);
      login({ name: res.data.name, email: res.data.email, _id: res.data._id }, res.data.token);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <input required type="email" placeholder="Email" className="w-full p-3 border rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input required type="password" placeholder="Password" className="w-full p-3 border rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="w-full bg-blue-600 text-white p-3 rounded">Login</button>
        <p className="text-center text-sm text-gray-600">No account? <span className="text-green-600 cursor-pointer" onClick={() => nav("/register")}>Register</span></p>
      </form>
    </div>
  );
}