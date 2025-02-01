import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import { db } from '../firebase'; // Import Firestore database
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Firestore utilities
import './HealthAlert.css'; // Import CSS file

function HealthAlert() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      // Check if the user already exists in the database
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists, update subscription status
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          subscribed: !isSubscribed,
        });
        setIsSubscribed(!isSubscribed);
        setMessage(
          isSubscribed
            ? 'You have unsubscribed from email alerts.'
            : 'You have successfully subscribed to email alerts!'
        );
      } else {
        // User does not exist, add new user
        await addDoc(usersRef, {
          email: email,
          subscribed: true,
        });
        setIsSubscribed(true);
        setMessage('You have successfully subscribed to email alerts!');
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="health-alert-page">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="health-alert-container">
        <h2>Subscribe to Health Alerts</h2>
        <p>Stay informed about air quality updates and health alerts.</p>
        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="subscribe-btn">
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </form>
        {message && <p className={`message ${message.includes('error') ? 'error' : ''}`}>{message}</p>}
      </div>
    </div>
  );
}

export default HealthAlert;