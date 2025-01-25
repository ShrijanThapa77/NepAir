import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Make sure this is the correct path to your firebase.js
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [user, setUser] = useState(null); // Track user state
  const navigate = useNavigate();

  useEffect(() => {
    // Track user state with Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If user is logged in, store user info
      } else {
        setUser(null); // If no user, set user as null
      }
    });

    // Clean up subscription on component unmount
    return () => unsubscribe();
  }, []);

  const goToPage = (page) => {
    if (page === 'Home') {
      navigate('/'); // Navigate to the root page
    } else {
      navigate(`/${page}`);
    }
  };

  const goToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleLogout = () => {
    signOut(auth); // Sign out the user
    navigate("/"); // Redirect to login page after signing out
  };

  return (
    <div className='contain'>
      <nav style={styles.navbar}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img src="/images/nepal_logo.png" alt="Nepal Logo" style={styles.logoImage} />
          <p style={styles.logoText}>NepAir</p>
        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <button
            style={styles.navButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
            onClick={() => goToPage('Home')}
          >
            Home
          </button>
          <button
            style={styles.navButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
            onClick={() => goToPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            style={styles.navButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
            onClick={() => goToPage('education')}
          >
            Education
          </button>
          <button
            style={styles.navButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
            onClick={() => goToPage('analysis')}
          >
            Analysis
          </button>
        </div>

        {/* Authentication Button */}
        <div style={styles.authButtonContainer}>
          {user ? (
            <div style={styles.userName}>
              {user.displayName || "User"} {/* Display user's full name */}
              <button 
                style={styles.navButton} 
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <form onSubmit={goToLogin}>
              <input
                type="submit"
                value="Login"
                style={styles.loginButton}
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.loginButtonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.loginButton.backgroundColor)}
              />
            </form>
          )}
        </div>
      </nav>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003049', // Modern deep blue
    padding: '15px 30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #E63946', // Red border for emphasis
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#F4F4F4',
    letterSpacing: '1.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#E63946', // Nepal-inspired red
    border: 'none',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  navButtonHover: {
    backgroundColor: '#FF6F61', // Lighter red for hover
  },
  authButtonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    padding: '10px 20px',
    backgroundColor: '#E63946', // Match navigation button color
    border: 'none',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loginButtonHover: {
    backgroundColor: '#FF6F61',
  },
  userName: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  }
};

export default Navbar;
