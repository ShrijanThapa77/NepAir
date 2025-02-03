import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import './Login.css';

// Navbar Component
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const goToDashboard = () => {
    if (user && user.role === 'admin') {
      navigate('/admindash');
    } else {
      navigate('/userdash');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="logo.png" alt="Logo" className="logo-image" />
        <span className="logo-text">NepAir</span>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span className="user-name">{user.fullName}</span>
            <span className="user-role">({user.role})</span>
            <button className="nav-button" onClick={goToDashboard}>
              Dashboard
            </button>
            <button className="nav-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="nav-button" onClick={() => navigate('/')}>
            Home
          </button>
        )}
      </div>
    </nav>
  );
}

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
    confirmPassword: '',
    role: 'user', // Default role is user
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Controls visibility of forgot password form
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle Login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          if (userCredential.user.emailVerified) {
            const userData = userDoc.data();
            if (userData.role === 'admin' && userData.status !== 'approved') {
              alert("Your admin account is pending approval.");
              return;
            }
            setUser({ uid: userCredential.user.uid, fullName: `${userData.firstName} ${userData.lastName}`, role: userData.role });
            alert("Login successful!");
            // Clear form fields after login
            setFormData({
              firstName: '',
              lastName: '',
              age: '',
              gender: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'user',
            });
          } else {
            alert("Please verify your email address.");
          }
        } else {
          alert("User data not found.");
        }
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
        // Send email verification link
        await sendEmailVerification(userCredential.user);
        // Save user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          email: formData.email,
          role: formData.role,
          status: formData.role === 'admin' ? 'pending' : 'approved', // Admins need approval
          createdAt: new Date(),
        });
        alert("Account created successfully! Please verify your email.");
        setIsLogin(true);
        // Clear form fields after signup
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          gender: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
        });
      } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      alert("Please enter your email address.");
      return;
    }

    try {
      // Check if the email exists in Firestore
      const userDoc = await getDoc(doc(db, "users", forgotPasswordEmail));
      if (!userDoc.exists()) {
        alert("No account found with this email.");
        return;
      }

      const userData = userDoc.data();
      if (!userData.emailVerified) {
        alert("Your email is not verified. Please verify your email first.");
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      alert("Password reset email sent. Please check your inbox.");
      setShowForgotPassword(false); // Hide the forgot password form after sending the email
      // Clear forgot password email field
      setForgotPasswordEmail('');
    } catch (error) {
      console.error("Forgot Password Error:", error.message);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("Logged out successfully!");
      navigate('/login');
      // Clear form fields after logout
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
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
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          {isLogin && (
            <p style={{ marginTop: '15px', cursor: 'pointer', color: '#2575fc' }} onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </p>
          )}
          {showForgotPassword && (
            <div>
              <p>Enter your email to reset your password:</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={handleForgotPasswordChange}
              />
              <button onClick={handleForgotPassword} className="submit-btn">
                Reset Password
              </button>
              <button onClick={() => setShowForgotPassword(false)} style={{ marginTop: '10px', background: '#FF6F61' }}>
                Cancel
              </button>
            </div>
          )}
          <p className="toggle-link">
            {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;