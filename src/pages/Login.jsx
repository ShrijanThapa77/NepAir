import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
   sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar"; // Import the shared Navbar
import './Login.css';
import BG from '../assets/BGG.jpg'; // Import the same background image

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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    return null; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password during signup
    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        alert(passwordError);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }

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
      } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (email) {
      try {
        // Query Firestore to find the user document with the matching email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming email is unique, we take the first document
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          // Check if the user is approved
          if (userData.status === "approved") {
            // Send password reset email
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent. Please check your inbox.");
          } else {
            alert("Your account is not approved. Please contact the administrator.");
          }
        } else {
          alert("No user found with this email.");
        }
      } catch (error) {
        console.error("Password Reset Error:", error.message);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <Navbar /> {/* Use the shared Navbar */}
      <div className="containerlogin" style={{ backgroundImage: `url(${BG})` }}>
        <div className="cardwrapper">
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
                  <select name="role" value={formData.role} onChange={handleChange}>
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
              <button onClick={handleForgotPassword} className="toggle-link">
                Forgot Password?
              </button>
            )}
            <p className="toggle-link">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={toggleForm}>{isLogin ? 'Sign Up' : 'Login'}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;