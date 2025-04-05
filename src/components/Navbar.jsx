import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import "./navbar.css";

function Navbar() {
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const cities = [
    { name: "Kathmandu", path: "/kathmandu" },
    { name: "Pokhara", path: "/pokhara" },
    { name: "Janakpur", path: "/janakpur" },
    { name: "Butwal", path: "/butwal" },
    { name: "Bhaktapur", path: "/bhaktapur" },
    { name: "Nepalgunj", path: "/nepalgunj" },
    { name: "Mahendranagar", path: "/mahendranagar" },
    { name: "Biratnagar", path: "/biratnagar" },
    { name: "Birgunj", path: "/birgunj" },
    { name: "Dharan", path: "/dharan" }
  ];

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredCities.length > 0) {
        handleSearch(filteredCities[0].path);
      } else if (searchQuery.trim() !== '') {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setShowSuggestions(false);
      }
    }
  };

  const handleSearch = (cityPath) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(cityPath);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
          setUserRole(userData.role);
        }
      } else {
        setIsLoggedIn(false);
        setUserName(null);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserName(null);
    setUserRole(null);
    setIsLoggedIn(false);
    alert("You have been logged out successfully.");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(userRole === "admin" ? "/admindash" : "/userprofile");
  };

  const handleDashboardClick = () => {
    navigate(userRole === "admin" ? "/admindash" : "/userdashboard");
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="logo-section" onClick={() => navigate("/")}>
          <span className="logo-text">NepAir</span>
        </div>

        <div className="search-section" ref={searchRef}>
          <div className={`search-bar ${isSearchFocused ? 'focused' : ''}`}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search any Location, City, State or Country"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              className="search-input"
              onFocus={() => {
                setIsSearchFocused(true);
                setShowSuggestions(searchQuery.length > 0);
              }}
              onBlur={() => {
                setIsSearchFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            {showSuggestions && filteredCities.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    className="suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSearch(city.path)}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="nav-link" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => navigate("/education")}>
            Education
          </button>
          <button className="nav-link" onClick={() => navigate("/healthalert")}>
            HealthAlert
          </button>
          <button className="nav-link" onClick={() => navigate("/report")}>
            Report
          </button>
        </div>

        <div className="auth-section">
          {isLoggedIn ? (
            <div className="user-profile">
              <button className="profile-button" onClick={handleProfileClick}>
                <FaUserCircle className="user-icon" />
              </button>
              {userName && userRole && (
                <div className="user-details">
                  <span className="user-name">{userName}</span>
                  <span className="user-role">{userRole}</span>
                </div>
              )}
              <button className="auth-button logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="auth-button login" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;