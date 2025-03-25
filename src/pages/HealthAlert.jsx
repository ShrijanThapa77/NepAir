import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiEdit, FiTrash2, FiPhone, FiMail, FiMapPin, FiHeart } from 'react-icons/fi';
import './HealthAlert.css';
import BG from '../assets/BGGG.jpg';


function HealthAlert() {
  const [user, setUser] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [otherDisease, setOtherDisease] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // List of available stations
  const stationOptions = [
    'Kathmandu',
    'Janakpur',
    'Pokhara',
    'Butwal',
    'Bharatpur',
    'Nepalgunj',
    'Mahendranagar',
    'Biratnagar',
    'Birgunj',
    'Dharan',
  ];

  // List of diseases with icons
  const diseases = [
    { name: 'Pneumonia', icon: '🫁' },
    { name: 'Asthma', icon: '🌬️' },
    { name: 'COPD', icon: '🚬' },
    { name: 'Sarcoidosis', icon: '🔍' },
    { name: 'Bronchiectasis', icon: '🔄' },
    { name: 'Other', icon: '❓' },
    { name: 'No Diseases', icon: '❌' },
  ];

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().healthAlert?.subscribed) {
            setIsSubscribed(true);
            setStations(userDoc.data().healthAlert.stations);
            setSelectedDiseases(userDoc.data().healthAlert.diseases);
            setPhoneNumber(userDoc.data().healthAlert.phoneNumber || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsSubscribed(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle disease selection logic
  const handleDiseaseChange = (disease) => {
    if (disease === 'No Diseases') {
      setSelectedDiseases(['No Diseases']);
    } else if (disease === 'Other') {
      setSelectedDiseases((prev) =>
        prev.includes('Other') ? prev.filter((d) => d !== 'Other') : [...prev, 'Other']
      );
    } else {
      setSelectedDiseases((prev) =>
        prev.includes(disease)
          ? prev.filter((d) => d !== disease)
          : [...prev.filter((d) => d !== 'No Diseases'), disease]
      );
    }
  };

  // Handle subscription form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!stations.length || selectedDiseases.length === 0 || !agreed || !phoneNumber) {
      setMessage('Please fill all fields and agree to terms');
      return;
    }
    
    setIsLoading(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          healthAlert: {
            stations,
            diseases: selectedDiseases.map((d) => (d === 'Other' ? otherDisease : d)),
            subscribed: true,
            phoneNumber,
          },
        },
        { merge: true }
      );
      setIsSubscribed(true);
      setMessage('Subscription successful!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unsubscribe confirmation
  const handleUnsubscribe = async () => {
    if (window.confirm('Are you sure you want to unsubscribe from health alerts?')) {
      setIsLoading(true);
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            healthAlert: { subscribed: false },
          },
          { merge: true }
        );
        setIsSubscribed(false);
        setMessage('You have been unsubscribed from health alerts.');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setMessage('Failed to unsubscribe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="health-alert-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${BG})` }}>
      <motion.div 
        className="health-alert-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        ) : !user ? (
          <motion.div 
            className="auth-required"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="header-icon">
              <FiAlertCircle size={48} />
            </div>
            <h2>NepAir - Air Quality Health Alerts</h2>
            <p className="description">
              Protect your respiratory health with our free alert service. Get notified via email and SMS when 
              air quality reaches dangerous levels in your selected locations.
            </p>
            <motion.button 
              onClick={() => navigate('/login')} 
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login to Subscribe
            </motion.button>
          </motion.div>
        ) : isSubscribed ? (
          <motion.div 
            className="subscription-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="success-icon">
              <FiCheckCircle size={64} />
            </div>
            <h2>Your Health Alert Subscription is Active!</h2>
            
            <div className="subscription-details">
              <div className="detail-item">
                <FiMail className="detail-icon" />
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <FiPhone className="detail-icon" />
                <span>{phoneNumber || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <FiMapPin className="detail-icon" />
                <span>{stations.join(', ')}</span>
              </div>
              <div className="detail-item">
                <FiHeart className="detail-icon" />
                <span>{selectedDiseases.join(', ')}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <motion.button
                onClick={() => setIsSubscribed(false)}
                className="cta-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit /> Edit Preferences
              </motion.button>
              <motion.button
                onClick={handleUnsubscribe}
                className="cta-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTrash2 /> Unsubscribe
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubscribe} 
            className="subscription-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>
              <FiAlertCircle className="form-icon" /> 
              Health Alert Subscription
            </h2>
            
            <div className="form-group">
              <label>
                <FiMapPin className="label-icon" /> 
                Select Monitoring Stations:
              </label>
              <select
                multiple
                value={stations}
                onChange={(e) =>
                  setStations(Array.from(e.target.selectedOptions, (option) => option.value))
                }
                className="station-select"
                required
              >
                {stationOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
              <small className="select-hint">
                Hold Ctrl (Windows) or Command (Mac) to select multiple stations
              </small>
            </div>
            
            <div className="form-group">
              <label>
                <FiHeart className="label-icon" /> 
                Select Respiratory Conditions:
              </label>
              <div className="disease-grid">
                {diseases.map(({name, icon}) => (
                  <motion.label 
                    key={name} 
                    className={`disease-option ${selectedDiseases.includes(name) ? 'selected' : ''}`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDiseases.includes(name)}
                      onChange={() => handleDiseaseChange(name)}
                      className="hidden-checkbox"
                    />
                    <span className="custom-checkbox">
                      {selectedDiseases.includes(name) && (
                        <span className="checkmark">✓</span>
                      )}
                    </span>
                    <span className="disease-icon">{icon}</span>
                    <span className="disease-name">{name}</span>
                    {name === 'Other' && selectedDiseases.includes('Other') && (
                      <input
                        type="text"
                        value={otherDisease}
                        onChange={(e) => setOtherDisease(e.target.value)}
                        placeholder="Specify condition"
                        required
                        className="other-input"
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <FiPhone className="label-icon" /> 
                Phone Number for SMS Alerts:
              </label>
              <div className="phone-input-container">
                <span className="country-code">+977</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  required
                  className="phone-input"
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
            </div>
            
            <label className="agreement">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="hidden-checkbox"
              />
              <span className="custom-checkbox">
                {agreed && <span className="checkmark">✓</span>}
              </span>
              I agree to receive email and SMS alerts based on my preferences
            </label>
            
            <motion.button 
              type="submit" 
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </motion.button>
          </motion.form>
        )}
        
        <AnimatePresence>
          {message && (
            <motion.div 
              className={`message ${message.includes('failed') || message.includes('Please') ? 'error' : 'success'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default HealthAlert;