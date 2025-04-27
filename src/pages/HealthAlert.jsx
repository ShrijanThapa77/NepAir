import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertCircle, FiCheckCircle, FiEdit, FiTrash2, FiPhone, FiMail,
  FiMapPin, FiHeart, FiCreditCard, FiCalendar, FiInfo, FiRefreshCw,
  FiClock, FiShield, FiDollarSign, FiCheck, FiArrowUpRight, FiAlertTriangle,
  FiX, FiMessageSquare, FiRepeat
} from 'react-icons/fi';
import { TbRefresh } from "react-icons/tb";
import './HealthAlert.css';
import khalti from "../assets/khalti.png";
import Select from 'react-select';

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
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [unsubscribeFeedback, setUnsubscribeFeedback] = useState('');
  const [unsubscribeReason, setUnsubscribeReason] = useState('');
  const [manualTestMode, setManualTestMode] = useState(false);
  const [testStartDate, setTestStartDate] = useState('');
  const [testEndDate, setTestEndDate] = useState('');
  const navigate = useNavigate();

  const stationOptions = [
    'Kathmandu', 'Janakpur', 'Pokhara', 'Butwal', 'Bharatpur',
    'Nepalgunj', 'Mahendranagar', 'Biratnagar', 'Birgunj', 'Dharan'
  ];

  const diseases = [
    { name: 'Pneumonia', icon: '🫁' },
    { name: 'Asthma', icon: '🌬️' },
    { name: 'COPD', icon: '🚬' },
    { name: 'Sarcoidosis', icon: '🔍' },
    { name: 'Bronchiectasis', icon: '🔄' },
    { name: 'Other', icon: '❓' },
    { name: 'No Diseases', icon: '❌' },
  ];

  const unsubscribeReasons = [
    'Cost is too high',
    'Service not helpful',
    'Technical issues',
    'Using another service',
    'No longer needed',
    'Other'
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 800,
      currency: 'NPR',
      months: 1,
      discount: 0,
    },
    {
      id: 'biannual',
      name: '6 Months',
      price: 3900,
      currency: 'NPR',
      months: 6,
      discount: 18.75,
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 7200,
      currency: 'NPR',
      months: 12,
      discount: 25,
    }
  ];

  // Calculate subscription amount based on selected plan
  const getSubscriptionAmount = () => {
    return plans.find(plan => plan.id === selectedPlan)?.price || 800;
  };

  // Format number with thousands separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format number to display in health alert dashboard
  const formatNum = (num) => {
    num = num/100;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format date helper
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining (in days, hours, minutes)
  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    
    if (diffTime <= 0) {
      return { days: 0, hours: 0, minutes: 0, expired: true };
    }
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  };

  // Update subscription date preview based on selected plan
  useEffect(() => {
    if (!manualTestMode) {
      updateSubscriptionDates();
    }
  }, [selectedPlan, manualTestMode]);

  // Check user authentication and subscription status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoading(true);
        try {
          // Set up real-time listener for the user document
          const userDocRef = doc(db, 'users', user.uid);
          const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().healthAlert?.subscribed) {
              const healthAlertData = docSnap.data().healthAlert;
              setIsSubscribed(true);
              setStations(healthAlertData.stations || []);
              setSelectedDiseases(healthAlertData.diseases || []);
              setPhoneNumber(healthAlertData.phoneNumber || '');
              setSubscriptionDetails(healthAlertData);
              
              // Format the subscription dates and calculate time remaining
              if (healthAlertData.paymentInfo?.expiryDate) {
                let expiryDate;
                
                if (manualTestMode && testEndDate) {
                  expiryDate = new Date(testEndDate);
                } else if (healthAlertData.paymentInfo.expiryDate.seconds) {
                  expiryDate = new Date(healthAlertData.paymentInfo.expiryDate.seconds * 1000);
                } else {
                  expiryDate = new Date(healthAlertData.paymentInfo.expiryDate);
                }
                
                setSubscriptionEndDate(formatDate(expiryDate));
                
                // Calculate time remaining
                const timeRemaining = calculateTimeRemaining(expiryDate);
                setDaysRemaining(timeRemaining.days);
                
                // Check if subscription has expired
                if (timeRemaining.expired) {
                  setSubscriptionExpired(true);
                  setShowExpiryModal(true);
                } else {
                  setSubscriptionExpired(false);
                }
              }
              
              // Set subscription start date if available
              if (healthAlertData.paymentInfo?.paymentDate) {
                let startDate;
                
                if (manualTestMode && testStartDate) {
                  startDate = new Date(testStartDate);
                } else if (healthAlertData.paymentInfo.paymentDate.seconds) {
                  startDate = new Date(healthAlertData.paymentInfo.paymentDate.seconds * 1000);
                } else {
                  startDate = new Date(healthAlertData.paymentInfo.paymentDate);
                }
                
                setSubscriptionStartDate(formatDate(startDate));
              }
              
              // Handle "Other" disease option
              if (healthAlertData.diseases) {
                const other = healthAlertData.diseases.find(d => !diseases.some(disease => disease.name === d));
                if (other && other !== 'Other') {
                  setOtherDisease(other);
                  if (!selectedDiseases.includes('Other')) {
                    setSelectedDiseases(prev => [...prev, 'Other']);
                  }
                }
              }
            } else {
              setIsSubscribed(false);
              setSubscriptionDetails(null);
            }
            setIsLoading(false);
          });
          
          // Check if we're returning from a successful payment
          const paymentSuccessFlag = sessionStorage.getItem('paymentSuccess');
          if (paymentSuccessFlag === 'true') {
            setPaymentSuccess(true);
            // Remove the flag from session storage
            sessionStorage.removeItem('paymentSuccess');
          }
          
          return () => unsubscribeDoc();
          
        } catch (error) {
          console.error("Error fetching user data:", error);
          setMessage('Failed to load subscription data');
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsSubscribed(false);
        setPaymentSuccess(false);
      }
    });
    
    return () => unsubscribe();
  }, [manualTestMode, testStartDate, testEndDate]);

  // Update remaining time every minute
  useEffect(() => {
    if (isSubscribed && subscriptionDetails?.paymentInfo?.expiryDate) {
      let expiryDate;
      
      if (manualTestMode && testEndDate) {
        expiryDate = new Date(testEndDate);
      } else if (subscriptionDetails.paymentInfo.expiryDate.seconds) {
        expiryDate = new Date(subscriptionDetails.paymentInfo.expiryDate.seconds * 1000);
      } else {
        expiryDate = new Date(subscriptionDetails.paymentInfo.expiryDate);
      }
      
      // Initial calculation
      const updateRemainingTime = () => {
        const timeRemaining = calculateTimeRemaining(expiryDate);
        setDaysRemaining(timeRemaining.days);
        
        if (timeRemaining.expired && !subscriptionExpired) {
          setSubscriptionExpired(true);
          setShowExpiryModal(true);
        }
      };
      
      // Update immediately
      updateRemainingTime();
      
      // Set up interval for updates
      const intervalId = setInterval(updateRemainingTime, 60000); // Update every minute
      
      return () => clearInterval(intervalId);
    }
  }, [isSubscribed, subscriptionDetails, subscriptionExpired, manualTestMode, testEndDate]);

  // Update subscription dates
  const updateSubscriptionDates = () => {
    // Set start date (today)
    const startDate = new Date();
    setSubscriptionStartDate(formatDate(startDate));
    
    // Set end date based on selected plan
    const endDate = new Date();
    const months = plans.find(plan => plan.id === selectedPlan)?.months || 1;
    endDate.setMonth(endDate.getMonth() + months);
    setSubscriptionEndDate(formatDate(endDate));
  };

  const handleDiseaseChange = (disease) => {
    if (disease === 'No Diseases') {
      setSelectedDiseases(['No Diseases']);
      setOtherDisease('');
    } else if (disease === 'Other') {
      setSelectedDiseases(prev =>
        prev.includes('Other') ? prev.filter(d => d !== 'Other') : [...prev.filter(d => d !== 'No Diseases'), 'Other']
      );
    } else {
      setSelectedDiseases(prev =>
        prev.includes(disease)
          ? prev.filter(d => d !== disease)
          : [...prev.filter(d => d !== 'No Diseases'), disease]
      );
    }
  };

  // Validate the form before proceeding to payment
  const validateForm = () => {
    if (!stations.length) {
      setMessage('Please select at least one monitoring station');
      return false;
    }
    if (selectedDiseases.length === 0) {
      setMessage('Please select at least one health condition');
      return false;
    }
    if (selectedDiseases.includes('Other') && !otherDisease.trim()) {
      setMessage('Please specify your "Other" health condition');
      return false;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!agreed) {
      setMessage('Please agree to receive alerts');
      return false;
    }
    return true;
  };

  // Start renewal process
  const startRenewal = (keepSamePlan = false) => {
    setIsRenewing(true);
    setShowExpiryModal(false);
    
    // Prefill form with existing data
    if (subscriptionDetails) {
      // Set stations and diseases from existing subscription
      setStations(subscriptionDetails.stations || []);
      setSelectedDiseases(subscriptionDetails.diseases || []);
      setPhoneNumber(subscriptionDetails.phoneNumber || '');
      
      // Set the same plan if requested
      if (keepSamePlan && subscriptionDetails.planId) {
        setSelectedPlan(subscriptionDetails.planId);
      } else if (subscriptionDetails.months) {
        // Try to match based on months
        const matchingPlan = plans.find(plan => plan.months === subscriptionDetails.months);
        if (matchingPlan) {
          setSelectedPlan(matchingPlan.id);
        }
      }
      
      // Set other disease if applicable
      if (subscriptionDetails.diseases) {
        const other = subscriptionDetails.diseases.find(d => !diseases.some(disease => disease.name === d));
        if (other && other !== 'Other') {
          setOtherDisease(other);
        }
      }
      
      // Set agreement checkbox
      setAgreed(true);
    }
    
    setCurrentStep(1);
  };

  // Handle "Proceed to Payment" button click
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setMessage('');
    
    // Get months based on selected plan
    const months = plans.find(plan => plan.id === selectedPlan)?.months || 1;
    
    // Get amount based on selected plan
    const amount = getSubscriptionAmount();
    
    // Prepare the subscription data to be stored in session storage
    const diseasesToSave = selectedDiseases
      .filter(d => d !== 'Other')
      .concat(selectedDiseases.includes('Other') ? [otherDisease] : []);
      
    const subscriptionData = {
      email: user.email,
      phoneNumber: phoneNumber,
      stations: stations,
      diseases: diseasesToSave,
      amount: amount,
      months: months,
      planId: selectedPlan,
      startDate: new Date(),
      endDate: new Date(subscriptionEndDate),
      userId: user.uid,
      isRenewal: isRenewing
    };
    
    // Store the data in session storage for the payment page
    sessionStorage.setItem('healthAlertSubscription', JSON.stringify(subscriptionData));
    
    // Navigate to the payment page
    navigate('/khalti-payment');
  };

  const handleRenewSubscription = () => {
    setSubscriptionExpired(false);
    setShowExpiryModal(false);
    startRenewal(false); // Don't automatically keep the same plan
  };

  const handleRenewWithSamePlan = () => {
    setSubscriptionExpired(false);
    setShowExpiryModal(false);
    startRenewal(true); // Keep the same plan
  };

  const handleUnsubscribeClick = () => {
    setShowUnsubscribeModal(true);
  };

  const handleSubmitUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          healthAlert: { 
            subscribed: false,
            unsubscribedAt: new Date(),
            previousSubscription: subscriptionDetails,
            unsubscribeReason: unsubscribeReason,
            unsubscribeFeedback: unsubscribeFeedback
          },
        },
        { merge: true }
      );
      setIsSubscribed(false);
      setStations([]);
      setSelectedDiseases([]);
      setPhoneNumber('');
      setMessage('You have been unsubscribed from health alerts.');
      setPaymentSuccess(false);
      setCurrentStep(1);
      setShowUnsubscribeModal(false);
      setShowExpiryModal(false);
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setMessage('Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUnsubscribe = () => {
    setShowUnsubscribeModal(false);
    setUnsubscribeReason('');
    setUnsubscribeFeedback('');
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // For testing subscription expiration with custom dates
  const enableTestMode = () => {
    setManualTestMode(true);
    // Initialize with current dates if not already set
    if (!testStartDate) {
      const today = new Date();
      setTestStartDate(today.toISOString().split('T')[0]);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // Default to 30 days in future
      setTestEndDate(futureDate.toISOString().split('T')[0]);
    }
  };

  const disableTestMode = () => {
    setManualTestMode(false);
    updateSubscriptionDates();
  };

  const applyTestDates = () => {
    if (testStartDate && testEndDate) {
      const start = new Date(testStartDate);
      const end = new Date(testEndDate);
      
      setSubscriptionStartDate(formatDate(start));
      setSubscriptionEndDate(formatDate(end));
      
      // Calculate if subscription is expired
      const timeRemaining = calculateTimeRemaining(end);
      setDaysRemaining(timeRemaining.days);
      setSubscriptionExpired(timeRemaining.expired);
      
      if (timeRemaining.expired && !showExpiryModal) {
        setShowExpiryModal(true);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="subscription-plans">
            <h2>{isRenewing ? "Renew Your Subscription" : "Choose Your Subscription Plan"}</h2>
            
            {isRenewing && (
              <div className="renewal-notice">
                <FiRefreshCw className="renewal-icon" />
                <p>You are renewing your Health Alert subscription. Choose a plan below or continue with your previous plan.</p>
              </div>
            )}
            
            <div className="plans-container">
              {plans.map(plan => (
                <motion.div 
                  key={plan.id}
                  className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && <div className="popular-tag">Most Popular</div>}
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="amount">{formatNumber(plan.price)}</span>
                    <span className="currency">{plan.currency}</span>
                  </div>
                  <div className="plan-duration">
                    {plan.months} {plan.months === 1 ? 'Month' : 'Months'} Subscription
                  </div>
                  {plan.discount > 0 && (
                    <div className="plan-discount">
                      <span className="discount-badge">{plan.discount}% OFF</span>
                    </div>
                  )}
                  {plan.discount === 0 && (
                    <div className='empty'>
                      <p>.</p>
                    </div>
                  )}
                  <button 
                    className="choose-plan-btn"
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      nextStep();
                    }}
                  >
                    Get Started
                    <FiArrowUpRight className='arroww'/>
                  </button>
                </motion.div>
              ))}
            </div>
            <div className='powr'>
              <h1>Powered by Khalti</h1>
              <img src={khalti} alt="Khalti Payment" />
            </div>
            
            {/* Test Mode Controls (Hidden in Production) */}
            <div className="test-mode-controls">
              <button 
                className="test-mode-toggle"
                onClick={manualTestMode ? disableTestMode : enableTestMode}
              >
                {manualTestMode ? "Disable Test Mode" : "Enable Test Mode"}
              </button>
              
              {manualTestMode && (
                <div className="date-test-controls">
                  <h4>Test Subscription Dates</h4>
                  <div className="date-inputs">
                    <div className="date-input-group">
                      <label>Start Date:</label>
                      <input 
                        type="date" 
                        value={testStartDate}
                        onChange={(e) => setTestStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>End Date:</label>
                      <input 
                        type="date" 
                        value={testEndDate}
                        onChange={(e) => setTestEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    className="apply-test-dates"
                    onClick={applyTestDates}
                  >
                    Apply Test Dates
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="subscription-details-step">
            <h2>Monitoring Preferences</h2>
            
            <div className="step-content">
              <div className="selected-plan-summary">
                <div className="plan-summary-details">
                  <div className="plan-name">
                    <h3>Selected Plan</h3>
                    <h2>
                      {plans.find(p => p.id === selectedPlan)?.name} Plan
                    </h2>
                  </div>
                  <div className="plan-price">
                    <h3>Price</h3>
                    <h2>
                      NPR {formatNumber(getSubscriptionAmount())}
                    </h2>
                  </div>
                  <div className="subscription-period">
                    <h3>Subscription Duration</h3>
                    <h2>
                      {subscriptionStartDate} - {subscriptionEndDate}
                    </h2>
                  </div>
                </div>
                <div className='chngplandiv'>
                  <button className="change-plan-btn" onClick={() => setCurrentStep(1)}>
                    <span>
                      Change Plan
                      <TbRefresh className='reff'/>
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <p className='lebb'>
                  <FiMapPin className="label-icon" /> 
                  Select Monitoring Stations:
                </p>
                <div className='dropdownmenu'>
                  <Select
                    isMulti
                    options={stationOptions.map(station => ({ value: station, label: station }))}
                    value={stations.map(station => ({ value: station, label: station }))}
                    onChange={(selectedOptions) => {
                      setStations(selectedOptions.map(option => option.value));
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    required
                  />
                </div>
                <small className="select-hint">
                  Hold Ctrl (Windows) or Command (Mac) to select multiple stations
                </small>
              </div>
              
              <div className="form-group">
                <p className='lebb'>
                  <FiHeart className="label-icon" /> 
                  Select Respiratory Conditions:
                </p>
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
                      />
                      <span className="disease-icon">{icon}</span>
                      <span className="disease-name">{name}</span>
                    </motion.label>
                  ))}
                </div>
                
                {selectedDiseases.includes('Other') && (
                  <div className="other-disease-input">
                    <input
                      type="text"
                      value={otherDisease}
                      onChange={(e) => setOtherDisease(e.target.value)}
                      placeholder="Specify other condition"
                      className="form-control"
                    />
                  </div>
                )}
              </div>
              
              <div className="navigation-buttons">
                <button className="nav-button back" onClick={prevStep}>
                  Back
                </button>
                <button className="nav-button next" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="contact-details-step">
            <h2>Contact Details</h2>
            
            <div className="step-content">
              <div className="contact-form">
                <div className="form-group">
                  <label>
                    <FiMail className="label-icon" /> 
                    Email Address for Alerts:
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="form-control"
                  />
                  <small className="input-hint">
                    Alerts will be sent to your registered email address
                  </small>
                </div>
                
                <div className="form-group">
                  <label>
                    <FiPhone className="label-icon" /> 
                    Mobile Number for SMS Alerts:
                  </label>
                  <div className="phone-input-container">
                    <div className="country-code">+977</div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(value);
                      }}
                      placeholder="98XXXXXXXX"
                      maxLength="10"
                      className="form-control phone-input"
                      required
                    />
                  </div>
                  <small className="input-hint">
                    Enter a 10-digit Nepali mobile number without country code
                  </small>
                </div>
                
                <div className="checkbox-group">
                  <motion.label 
                    className="checkbox-label"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='radiodiv'>
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                      />
                      <p>
                        I agree to receive SMS and email alerts about air quality conditions 
                        that may affect my health conditions
                      </p>
                    </div>
                  </motion.label>
                </div>
                
                <div className="alert-reminder">
                  <FiShield className="alert-reminder-icon" />
                  <p>
                    Your subscription will begin immediately after payment and will be valid until <strong>{subscriptionEndDate}</strong>.
                  </p>
                </div>
                
                {message && (
                  <motion.div 
                    className="alert-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FiAlertCircle className="alert-icon" />
                    {message}
                  </motion.div>
                )}
                
                <div className="navigation-buttons">
                  <button className="nav-button back" onClick={prevStep}>
                    Back
                  </button>
                  <button 
                    className="nav-button payment"
                    onClick={handleProceedToPayment}
                    disabled={isLoading}
                  >
                    <FiCreditCard className="button-icon" />
                    {isRenewing ? 'Renew Subscription' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render payment success message
  const renderPaymentSuccess = () => {
    return (
      <motion.div 
        className="payment-success-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="success-icon-container">
          <FiCheckCircle className="success-icon" />
        </div>
        <h2>Payment Successful!</h2>
        <p>Your Health Alert subscription has been activated successfully.</p>
        <div className="subscription-details">
          <div className="detail-item">
            <FiCalendar className="detail-icon" />
            <div>
              <span className="detail-label">Subscription Period:</span>
              <span className="detail-value">{subscriptionStartDate} - {subscriptionEndDate}</span>
            </div>
          </div>
          <div className="detail-item">
            <FiDollarSign className="detail-icon" />
            <div>
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value">NPR {formatNum(subscriptionDetails?.paymentInfo?.amount || 0)}</span>
            </div>
          </div>
          <div className="detail-item">
            <FiCheck className="detail-icon" />
            <div>
              <span className="detail-label">Status:</span>
              <span className="detail-value success">Active</span>
            </div>
          </div>
        </div>
        <p className="success-message">
          You will now receive personalized health alerts based on your preferences and air quality conditions.
        </p>
        <button 
          className="view-dashboard-btn"
          onClick={() => setPaymentSuccess(false)}
        >
          View Your Health Alert Dashboard
        </button>
      </motion.div>
    );
  };

  // Render subscription details dashboard
  const renderSubscriptionDashboard = () => {
    return (
      <div className="subscription-dashboard">
        <div className="dashboard-header">
          <h2>Health Alert Dashboard</h2>
          {subscriptionExpired ? (
            <div className="subscription-status expired">
              <FiAlertTriangle className="status-icon" />
              Expired
            </div>
          ) : (
            <div className="subscription-status active">
              <FiCheckCircle className="status-icon" />
              Active
            </div>
          )}
        </div>
        
        <div className="dashboard-content">
          <div className="subscription-info-panel">
            <div className="subscription-info-item">
              <div className="info-header">
                <FiCalendar className="info-icon" />
                <h3>Subscription Period</h3>
              </div>
              <div className="info-content date-range">
                <div className="date">
                  <span className="label">From:</span>
                  <span className="value">{subscriptionStartDate}</span>
                </div>
                <div className="date">
                  <span className="label">To:</span>
                  <span className="value">{subscriptionEndDate}</span>
                </div>
              </div>
            </div>
            
            <div className="subscription-info-item">
              <div className="info-header">
                <FiClock className="info-icon" />
                <h3>Time Remaining</h3>
              </div>
              <div className="info-content time-remaining">
                {subscriptionExpired ? (
                  <div className="expired-message">
                    <FiAlertTriangle className="expired-icon" />
                    Your subscription has expired
                  </div>
                ) : (
                  <div className="days-count">
                    <span className="value">{daysRemaining}</span>
                    <span className="unit">days</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="subscription-info-item">
              <div className="info-header">
                <FiInfo className="info-icon" />
                <h3>Plan Details</h3>
              </div>
              <div className="info-content plan-details">
                <div className="plan-detail">
                  <span className="label">Plan:</span>
                  <span className="value">
                    {subscriptionDetails?.months === 1 ? 'Monthly' :
                     subscriptionDetails?.months === 6 ? '6 Months' :
                     subscriptionDetails?.months === 12 ? 'Annual' :
                     'Custom'} Plan
                  </span>
                </div>
                <div className="plan-detail">
                  <span className="label">Amount Paid:</span>
                  <span className="value">
                    NPR {formatNum(subscriptionDetails?.paymentInfo?.amount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="monitored-info-panel">
            <div className="monitored-info-item">
              <div className="info-header">
                <FiMapPin className="info-icon" />
                <h3>Monitored Stations</h3>
              </div>
              <div className="stations-grid">
                {stations.map(station => (
                  <div key={station} className="station-item">
                    {station}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="monitored-info-item">
              <div className="info-header">
                <FiHeart className="info-icon" />
                <h3>Health Conditions</h3>
              </div>
              <div className="diseases-list">
                {subscriptionDetails?.diseases?.map(disease => (
                  <div key={disease} className="disease-item">
                    {disease}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="monitored-info-item">
              <div className="info-header">
                <FiMessageSquare className="info-icon" />
                <h3>Contact Details</h3>
              </div>
              <div className="contact-details">
                <div className="contact-detail">
                  <FiMail className="contact-icon" />
                  <span>{user.email || 'No email set'}</span>
                </div>
                <div className="contact-detail">
                  <FiPhone className="contact-icon" />
                  <span>+977 {phoneNumber || 'No phone number set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          {subscriptionExpired ? (
            <button 
              className="action-button renew"
              onClick={handleRenewSubscription}
            >
              <FiRepeat className="button-icon" />
              Renew Subscription
            </button>
          ) : (
            <>
              <button 
                className="action-button unsubscribe"
                onClick={handleUnsubscribeClick}
              >
                <FiX className="button-icon" />
                Unsubscribe
              </button>
              <button 
                className="action-button renew"
                onClick={handleRenewSubscription}
              >
                <FiRepeat className="button-icon" />
                Renew/Change Plan
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render the subscription expiry modal
  const renderExpiryModal = () => {
    return (
      <AnimatePresence>
        {showExpiryModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="expiry-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="modal-header">
                <FiAlertTriangle className="expired-icon" />
                <h2>Subscription Expired</h2>
              </div>
              
              <div className="modal-content">
                <p>Your Health Alert subscription has expired on <strong>{subscriptionEndDate}</strong>.</p>
                <p>To continue receiving personalized air quality health alerts, please renew your subscription.</p>
                
                <div className="previous-plan-details">
                  <h4>Your Previous Plan</h4>
                  <p>
                    <strong>Type:</strong> {
                      subscriptionDetails?.months === 1 ? 'Monthly' :
                      subscriptionDetails?.months === 6 ? '6 Months' :
                      subscriptionDetails?.months === 12 ? 'Annual' : 'Custom'
                    } Plan
                  </p>
                  <p><strong>Amount:</strong> NPR {formatNum(subscriptionDetails?.paymentInfo?.amount || 0)}</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="modal-action renew-same"
                  onClick={handleRenewWithSamePlan}
                >
                  <FiCheck className="button-icon" />
                  Renew Same Plan
                </button>
                <button
                  className="modal-action renew-different"
                  onClick={handleRenewSubscription}
                >
                  <FiRefreshCw className="button-icon" />
                  Choose Different Plan
                </button>
                <button
                  className="modal-action close"
                  onClick={() => setShowExpiryModal(false)}
                >
                  <FiX className="button-icon" />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Render the unsubscribe confirmation modal
  const renderUnsubscribeModal = () => {
    return (
      <AnimatePresence>
        {showUnsubscribeModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="unsubscribe-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="modal-header">
                <FiAlertCircle className="warning-icon" />
                <h2>Unsubscribe from Health Alerts</h2>
              </div>
              
              <div className="modal-content">
                <p>Are you sure you want to unsubscribe from Health Alerts? This action cannot be undone.</p>
                <p>Your subscription will end immediately, and you will no longer receive any air quality health alerts.</p>
                
                <div className="feedback-form">
                  <h4>Help us improve our service</h4>
                  <div className="form-group">
                    <label>Why are you unsubscribing?</label>
                    <select
                      value={unsubscribeReason}
                      onChange={(e) => setUnsubscribeReason(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select a reason...</option>
                      {unsubscribeReasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Additional feedback (optional):</label>
                    <textarea
                      value={unsubscribeFeedback}
                      onChange={(e) => setUnsubscribeFeedback(e.target.value)}
                      placeholder="Please let us know how we can improve..."
                      className="form-control"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  className="modal-action confirm-unsubscribe"
                  onClick={handleSubmitUnsubscribe}
                  disabled={isLoading}
                >
                  <FiX className="button-icon" />
                  {isLoading ? 'Processing...' : 'Confirm Unsubscribe'}
                </button>
                <button
                  className="modal-action cancel"
                  onClick={handleCancelUnsubscribe}
                >
                  <FiArrowUpRight className="button-icon" />
                  Keep My Subscription
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Main render
  return (
    <div className="health-alert-container">
      {!user ? (
        <div className="login-prompt">
          <FiAlertCircle className="alert-icon" />
          <h2>Please log in to access Health Alerts</h2>
          <p>You need to be logged in to subscribe to health alerts.</p>
          <button 
            className="login-button"
            onClick={() => navigate('/login')}
          >
            Log In / Sign Up
          </button>
        </div>
      ) : isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your subscription details...</p>
        </div>
      ) : paymentSuccess ? (
        renderPaymentSuccess()
      ) : isSubscribed && !isRenewing ? (
        <>
          {renderSubscriptionDashboard()}
          {renderExpiryModal()}
          {renderUnsubscribeModal()}
        </>
      ) : (
        <>
          {renderStepContent()}
          {renderUnsubscribeModal()}
        </>
      )}
    </div>
  );
}

export default HealthAlert;