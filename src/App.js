import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import HealthAlert from "./pages/HealthAlert";
import UserProfile from "./pages/UserProfile";
import EducationModule from "./pages/EducationModule"; // Fixed import
import Navbar from "./components/Navbar"; // Import the Navbar component



import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  // Initialize AOS (Animate On Scroll)
  AOS.init();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/healthalert" element={<HealthAlert />} />
        <Route path="/education" element={<EducationModule />} />

        {/* User Routes */}
        <Route path="/userprofile" element={<UserProfile />} />

        {/* Admin Routes */}
        <Route path="/admindash" element={<AdminDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;