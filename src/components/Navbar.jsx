import React from 'react'
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const goToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const goToPage = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className='contain'>
      <nav style={styles.navbar}>
        <div className="logo" style={styles.logoContainer}>
          <img src="/images/nepal_logo.png" alt="Nepal Logo" style={styles.logoImage} />
          <div style={styles.logoTextContainer}>
            <p style={styles.logoText}>NepAir</p>
          </div>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => goToPage('home')}>Home</button>
          <button style={styles.navButton} onClick={() => goToPage('dashboard')}>Dashboard</button>
          <button style={styles.navButton} onClick={() => goToPage('education')}>Education</button>
          <button style={styles.navButton} onClick={() => goToPage('analysis')}>Analysis</button>
        </div>
        <div className="auth-btn" style={styles.authButtonContainer}>
          <form onSubmit={goToLogin}>
            <input type="submit" value="Go to Login" style={styles.loginButton} />
          </form>
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
    backgroundColor: '#002E3D', // Deep blue for clean air and sky
    padding: '15px 30px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px', // Rounded edges for a modern look
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
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#fff', // White color for the text
    background: 'linear-gradient(to left, #1E6FB3, #D6403F)', // Gradient from blue to red
    padding: '5px 20px',
    borderRadius: '10px', // Rounded corners for the text background
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)', // Slight shadow for depth
    fontFamily: '"Arial", sans-serif',
    letterSpacing: '2px',
    textTransform: 'uppercase',  // Official and bold look
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#A11B16', // Red color inspired by Nepal flag
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    textTransform: 'uppercase', // Bold uppercase text
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover effects
    letterSpacing: '1px',
  },
  navButtonHover: {
    backgroundColor: '#D6403F', // Lighter red for hover effect
    transform: 'scale(1.05)', // Slight scaling effect on hover
  },
  authButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loginButton: {
    padding: '10px 20px',
    backgroundColor: '#A11B16', // Red color inspired by Nepal flag
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  loginButtonHover: {
    backgroundColor: '#D6403F', // Lighter red for hover effect
  },
};

export default Navbar;
