import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();

  // Sample list of cities (replace with your actual city data)
  const cities = [
    "Kathmandu", "Pokhara", "Birgunj", "Biratnagar", "Lalitpur", 
    "Bhaktapur", "Bharatpur", "Hetauda", "Butwal", "Nepalgunj"
  ];

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
          setUserRole(userData.role);
        }
      } else {
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
    alert("You have been logged out successfully.");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(userRole === "admin" ? "/admindash" : "/userprofile");
  };

  const handleDashboardClick = () => {
    navigate(userRole === "admin" ? "/admindash" : "/userdashboard");
  };

  const handleSearch = (city) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(`/city/${city.toLowerCase()}`);
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
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search any Location, City, State or Country"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              style={styles.searchInput}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && filteredCities.length > 0 && (
              <div style={styles.suggestionsContainer}>
                {filteredCities.map((city) => (
                  <div
                    key={city}
                    style={styles.suggestionItem}
                    onClick={() => handleSearch(city)}
                  >
                    {city}
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
          {userName ? (
            <div style={styles.userSection}>
              <button className="navButtons" onClick={handleProfileClick}>
                <FaUserCircle style={styles.userIcon} className="userface" />
              </button>
              <div className="userInfo">
                <div>
                  <span style={styles.userName}>{userName}</span>
                </div>
                <div>
                  <span style={styles.userRole}>{userRole}</span>
                </div>
              </div>
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
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#F4F4F4",
    paddingLeft: "10px",
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
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#FFF",
    fontSize: "16px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 15px 10px 35px",
    borderRadius: "25px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFF",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: "0 0 10px 10px",
    zIndex: "1001",
    maxHeight: "300px",
    overflowY: "auto",
    borderTop: "none",
  },
  suggestionItem: {
    padding: "10px 15px",
    color: "#FFF",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  suggestionItemHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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