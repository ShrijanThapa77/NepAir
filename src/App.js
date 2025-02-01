import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import './App.css';
import AdminDash from "./pages/AdminDash";
import HealthAlert from './pages/HealthAlert';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindash" element={<AdminDash />} />
        <Route path="/healthalert" element={<HealthAlert />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
