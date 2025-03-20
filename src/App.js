import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import HealthAlert from "./pages/HealthAlert";
import EducationModule from "./pages/EducationModule";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  // Initialize AOS (Animate On Scroll)
  AOS.init();

  return (
    <BrowserRouter>
      {/* Navbar is outside Routes to ensure it is rendered only once */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/healthalert" element={<HealthAlert />} />
        <Route path="/education" element={<EducationModule />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/userdashboard" element={<UserDashboard />} />

        {/* Admin Routes */}
        <Route path="/admindash" element={<AdminDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;