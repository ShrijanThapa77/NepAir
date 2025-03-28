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
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="containNav">
      <nav
        style={{
          ...styles.navbar,
          backgroundColor: scrolled ? "rgba(0, 0, 0, 0.5)" : "transparent",
          transition: "background 0.3s ease-in-out",
        }}
      >
        <div style={styles.logoContainer}>
          <img src="/images/clouds.png" alt="Nepal Logo" style={styles.logoImage} />
          <p style={styles.logoText}>NepAir</p>
        </div>

        <div style={styles.searchContainer}>
          <div 
            style={{ 
              ...styles.searchWrapper,
              borderColor: isSearchFocused ? "#4CAF50" : "rgba(255, 255, 255, 0.3)",
              boxShadow: isSearchFocused ? "0 0 0 2px rgba(76, 175, 80, 0.2)" : "none"
            }}
            ref={searchRef}
          >
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search any Location, City, State or Country"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              style={styles.searchInput}
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
              <div style={styles.suggestionsContainer}>
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    style={styles.suggestionItem}
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

        <div style={styles.navLinks}>
          <button className="navButtons" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="navButtons" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="navButtons" onClick={() => navigate("/education")}>
            Education
          </button>
          <button className="navButtons" onClick={() => navigate("/healthalert")}>
            HealthAlert
          </button>
        </div>

        <div style={styles.authSection}>
          {isLoggedIn ? (
            <div style={styles.userSection}>
              <button className="navButtons" onClick={handleProfileClick}>
                <FaUserCircle style={styles.userIcon} className="userface" />
              </button>
              {userName && userRole && (
                <div className="userInfo">
                  <div>
                    <span style={styles.userName}>{userName}</span>
                  </div>
                  <div>
                    <span style={styles.userRole}>{userRole}</span>
                  </div>
                </div>
              )}
              <button className="authButton" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="authButton" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: "1000",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 8px",
    margin: "0",
  },
  logoContainer: {
    display: "grid",
  },
  logoImage: {
    width: "70px",
    height: "70px",
    transition: "transform 0.3s ease",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#F4F4F4",
    paddingLeft: "10px",
    transition: "all 0.3s ease",
  },
  searchContainer: {
    flex: 1,
    maxWidth: "500px",
    margin: "0 20px",
    position: "relative",
  },
  searchWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: "25px",
    border: "1px solid",
    transition: "all 0.3s ease",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#FFF",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px 12px 40px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFF",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "calc(100% + 5px)",
    left: 0,
    right: 0,
    backgroundColor: "rgba(13, 27, 42, 0.95)",
    borderRadius: "10px",
    zIndex: "1001",
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    padding: "5px 0",
  },
  suggestionItem: {
    padding: "12px 20px",
    color: "#FFF",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(76, 175, 80, 0.3)",
    }
  },
  navLinks: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userIcon: {
    fontSize: "24px",
    color: "#FFF",
    transition: "all 0.3s ease",
  },
  userName: {
    color: "#FFF",
    fontSize: "16px",
  },
  userRole: {
    color: "#FFF",
    fontSize: "14px",
    marginLeft: "5px",
  },
};

export default Navbar;