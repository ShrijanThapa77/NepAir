import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Ensure Firestore is initialized in firebase.js
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const [userName, setUserName] = useState(null); // To store user's full name
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        } else {
          console.error("No such user document!");
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserName(null);
    alert("You have been logged out successfully.");
    navigate('/');
  };

  return (
    <div className='contain'>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/images/nepal_logo.png" alt="Nepal Logo" style={styles.logoImage} />
          <p style={styles.logoText}>NepAir</p>
        </div>

        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate('/')}>Home</button>
          <button style={styles.navButton} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={styles.navButton} onClick={() => navigate('/education')}>Education</button>
          <button style={styles.navButton} onClick={() => navigate('/analysis')}>Analysis</button>
        </div>

        <div style={styles.authSection}>
          {userName ? (
            <div style={styles.userSection}>
              <FaUserCircle style={styles.userIcon} />
              <span style={styles.userName}>{userName}</span>
              <button style={styles.navButton} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button style={styles.navButton} onClick={() => navigate('/login')}>Login</button>
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
    backgroundColor: '#003049',
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
    border: '2px solid #E63946',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#F4F4F4',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#E63946',
    border: 'none',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userIcon: {
    fontSize: '24px',
    color: '#FFF',
  },
  userName: {
    color: '#FFF',
    fontSize: '16px',
  },
};

export default Navbar;
