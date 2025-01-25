import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this is the correct path to your firebase.js
import './Login.css';

// Navbar Component
function Navbar() {
  const navigate = useNavigate();

  const goToPage = (page) => {
    if (page === 'Home') {
      navigate('/'); // Navigate to the root (actual home page)
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className='contain'>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/images/nepal_logo.png" alt="Nepal Logo" style={styles.logoImage} />
          <p style={styles.logoText}>NepAir</p>
        </div>
        <div style={styles.navLinks}>
          <button
            style={styles.navButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
            onClick={() => goToPage('Home')}
          >
            Home
          </button>
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
    letterSpacing: '1.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
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
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  navButtonHover: {
    backgroundColor: '#FF6F61',
  },
};

// Login Component
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle Login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Logged in:", userCredential.user);
        alert("Login successful!");
        navigate("/"); // Redirect to home page
      } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
      }
    } else {
      // Handle Signup
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("User signed up:", userCredential.user);
        alert("Account created successfully!");
        navigate("/"); // Redirect to home page
      } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Retype Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="toggle-link">
            {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
            <span onClick={toggleForm}>{isLogin ? 'Sign Up' : 'Login'}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
