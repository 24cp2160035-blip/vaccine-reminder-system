// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import Vaccines from "./pages/Vaccines";
import VaccineLibrary from "./pages/VaccineLibrary";
import NotificationSettings from "./pages/NotificationSettings";
import VaccineInfo from "./pages/VaccineInfo";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected + Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 🔔 Notification Settings */}
        <Route
          path="/profiles/:profileId/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <Layout>
                <Profiles />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vaccines/:profileId"
          element={
            <ProtectedRoute>
              <Layout>
                <Vaccines />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 🧬 Vaccine Library */}
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Layout>
                <VaccineLibrary />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📚 Vaccine Info Center */}
        <Route
          path="/vaccine-info"
          element={
            <ProtectedRoute>
              <Layout>
                <VaccineInfo />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;