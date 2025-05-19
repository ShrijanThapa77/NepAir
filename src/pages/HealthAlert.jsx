import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiAlertCircle, FiCheckCircle, FiEdit, FiTrash2, FiPhone, FiMail,
  FiMapPin, FiHeart, FiCreditCard, FiCalendar, FiInfo, FiRefreshCw,
  FiClock, FiShield, FiDollarSign, FiCheck, FiArrowUpRight, FiAlertTriangle,
  FiX, FiMessageSquare, FiRepeat, FiLoader
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentVerificationInProgress, setPaymentVerificationInProgress] = useState(false);
  const [transactionId, setTransactionId] = useState('');
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

  const getSubscriptionAmount = () => {
    return plans.find(plan => plan.id === selectedPlan)?.price || 800;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatNum = (num) => {
    num = num/100;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  useEffect(() => {
    updateSubscriptionDates();
  }, [selectedPlan]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const pidx = queryParams.get('pidx');
    const txnId = queryParams.get('txnId');
    const status = queryParams.get('status');
    
    if (pidx && status === "Completed") {
      setTransactionId(txnId || '');
      setPaymentVerificationInProgress(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().healthAlert?.subscribed) {
              const healthAlertData = docSnap.data().healthAlert;
              setIsSubscribed(true);
              setStations(healthAlertData.stations || []);
              setSelectedDiseases(healthAlertData.diseases || []);
              setPhoneNumber(healthAlertData.phoneNumber || '');
              setSubscriptionDetails(healthAlertData);
              
              if (healthAlertData.paymentInfo?.expiryDate) {
                let expiryDate;
                
                if (healthAlertData.paymentInfo.expiryDate.seconds) {
                  expiryDate = new Date(healthAlertData.paymentInfo.expiryDate.seconds * 1000);
                } else {
                  expiryDate = new Date(healthAlertData.paymentInfo.expiryDate);
                }
                
                setSubscriptionEndDate(formatDate(expiryDate));
                
                const timeRemaining = calculateTimeRemaining(expiryDate);
                setDaysRemaining(timeRemaining.days);
                
                if (timeRemaining.expired) {
                  setSubscriptionExpired(true);
                  setShowExpiryModal(true);
                } else {
                  setSubscriptionExpired(false);
                }
              }
              
              if (healthAlertData.paymentInfo?.paymentDate) {
                let startDate;
                
                if (healthAlertData.paymentInfo.paymentDate.seconds) {
                  startDate = new Date(healthAlertData.paymentInfo.paymentDate.seconds * 1000);
                } else {
                  startDate = new Date(healthAlertData.paymentInfo.paymentDate);
                }
                
                setSubscriptionStartDate(formatDate(startDate));
              }
              
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
  }, []);

  useEffect(() => {
    if (isSubscribed && subscriptionDetails?.paymentInfo?.expiryDate) {
      let expiryDate;
      
      if (subscriptionDetails.paymentInfo.expiryDate.seconds) {
        expiryDate = new Date(subscriptionDetails.paymentInfo.expiryDate.seconds * 1000);
      } else {
        expiryDate = new Date(subscriptionDetails.paymentInfo.expiryDate);
      }
      
      const updateRemainingTime = () => {
        const timeRemaining = calculateTimeRemaining(expiryDate);
        setDaysRemaining(timeRemaining.days);
        
        if (timeRemaining.expired && !subscriptionExpired) {
          setSubscriptionExpired(true);
          setShowExpiryModal(true);
        }
      };
      
      updateRemainingTime();
      
      const intervalId = setInterval(updateRemainingTime, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [isSubscribed, subscriptionDetails, subscriptionExpired]);

  useEffect(() => {
    if (paymentVerificationInProgress && user) {
      const verifyPayment = async () => {
        try {
          setIsLoading(true);
          
          const subscriptionData = JSON.parse(localStorage.getItem('healthAlertSubscription') || '{}');
          
          if (!subscriptionData.amount) {
            throw new Error('Subscription data missing');
          }
          
          await setDoc(
            doc(db, 'users', user.uid),
            {
              healthAlert: {
                subscribed: true,
                stations: subscriptionData.stations,
                diseases: subscriptionData.diseases,
                phoneNumber: subscriptionData.phoneNumber,
                planId: subscriptionData.planId,
                months: subscriptionData.months,
                paymentInfo: {
                  amount: subscriptionData.amount * 100,
                  transactionId: transactionId,
                  paymentMethod: 'Khalti',
                  paymentDate: new Date(),
                  expiryDate: new Date(subscriptionData.endDate)
                },
                createdAt: new Date(),
                updatedAt: new Date()
              },
            },
            { merge: true }
          );
          
          localStorage.removeItem('healthAlertSubscription');
          setPaymentSuccess(true);
          setPaymentVerificationInProgress(false);
          setIsLoading(false);
          
        } catch (error) {
          console.error('Payment verification error:', error);
          setMessage('Failed to verify payment. Please contact support.');
          setPaymentVerificationInProgress(false);
          setIsLoading(false);
        }
      };
      
      verifyPayment();
    }
  }, [paymentVerificationInProgress, user, transactionId]);

  const updateSubscriptionDates = () => {
    const startDate = new Date();
    setSubscriptionStartDate(formatDate(startDate));
    
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

  const startRenewal = () => {
    setIsRenewing(true);
    setShowExpiryModal(false);
    
    if (subscriptionDetails) {
      setStations(subscriptionDetails.stations || []);
      setSelectedDiseases(subscriptionDetails.diseases || []);
      setPhoneNumber(subscriptionDetails.phoneNumber || '');
      
      if (subscriptionDetails.planId) {
        setSelectedPlan(subscriptionDetails.planId);
      }
      
      if (subscriptionDetails.diseases) {
        const other = subscriptionDetails.diseases.find(d => !diseases.some(disease => disease.name === d));
        if (other && other !== 'Other') {
          setOtherDisease(other);
        }
      }
      
      setAgreed(true);
    }
    
    setCurrentStep(1);
  };

  const initiateKhaltiPayment = async () => {
    if (!validateForm()) {
      return;
    }
    
    setMessage('');
    setPaymentLoading(true);
    setPaymentError('');
    
    try {
      const months = plans.find(plan => plan.id === selectedPlan)?.months || 1;
      const amount = getSubscriptionAmount();
      
      const diseasesToSave = selectedDiseases
        .filter(d => d !== 'Other')
        .concat(selectedDiseases.includes('Other') ? [otherDisease] : []);
      
      const purchaseOrderId = `health-${user.uid}-${Date.now()}`;
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      const subscriptionData = {
        email: user.email,
        phoneNumber: phoneNumber,
        stations: stations,
        diseases: diseasesToSave,
        amount: amount,
        months: months,
        planId: selectedPlan,
        startDate: startDate,
        endDate: endDate,
        userId: user.uid,
        isRenewal: isRenewing
      };
      
      localStorage.setItem('healthAlertSubscription', JSON.stringify(subscriptionData));
      
      const khaltiPayload = {
        return_url: window.location.href,
        website_url: window.location.origin,
        amount: amount * 100,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `NepAir Health Alert - ${months} Month${months > 1 ? 's' : ''}`,
        customer_info: {
          name: user.displayName || user.email,
          email: user.email,
          phone: phoneNumber,
        },
        amount_breakdown: [
          {
            label: `Health Alert Subscription (${months} Month${months > 1 ? 's' : ''})`,
            amount: amount * 100,
          },
        ],
        product_details: [
          {
            identity: purchaseOrderId,
            name: `NepAir Health Alert - ${months} Month${months > 1 ? 's' : ''}`,
            total_price: amount * 100,
            quantity: 1,
            unit_price: amount * 100,
          },
        ],
      };
      
      const headers = {
        'Authorization': 'Key f10f753336fa4eef9c8c506d125703d3',
        'Content-Type': 'application/json'
      };
      
      const response = await axios.post(
        'https://a.khalti.com/api/v2/epayment/initiate/',
        khaltiPayload,
        { headers }
      );
      
      if (response.data && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        throw new Error('Invalid response from payment gateway');
      }
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentError('Failed to initiate payment. Please try again later.');
      setPaymentLoading(false);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    initiateKhaltiPayment();
  };

  const handleRenewSubscription = () => {
    setSubscriptionExpired(false);
    setShowExpiryModal(false);
    startRenewal();
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
      setSubscriptionDetails(null);
      setShowUnsubscribeModal(false);
      setShowExpiryModal(false);
      navigate('/');
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="subscription-plans">
            <h2>{isRenewing ? "Renew Your Subscription" : "Choose Your Subscription Plan"}</h2>
            
            {isRenewing && (
              <div className="renewal-notice">
                <FiRefreshCw className="renewal-icon" />
                <p>You are renewing your Health Alert subscription. Choose a plan below.</p>
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
                  <input
                    type="text"
                    placeholder="Please specify your condition"
                    value={otherDisease}
                    onChange={(e) => setOtherDisease(e.target.value)}
                    className="other-disease-input"
                  />
                )}
              </div>
              
              <div className="form-group">
                <label>
                  <FiPhone className="label-icon" /> Phone Number:
                  <input
                    type="tel"
                    placeholder="Your 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                  />
                </label>
              </div>
              
              <div className="form-group agreement">
                <label className="agreement-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to receive alerts about air quality and health recommendations based on my selected conditions.
                  </span>
                </label>
              </div>
              
              {message && <div className="message">{message}</div>}
              
              <div className="navigation-buttons">
                <button className="back-button" onClick={prevStep}>
                  Back
                </button>
                <button 
                  className="next-button" 
                  onClick={handleProceedToPayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <FiLoader className="loading-icon spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
              
              {paymentError && (
                <div className="payment-error">
                  <FiAlertTriangle className="error-icon" />
                  {paymentError}
                </div>
              )}
            </div>
          </div>
        );
          
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="health-alert-container">
        <div className="login-prompt">
          <FiAlertCircle className="alert-icon" />
          <h2>Please Login</h2>
          <p>You need to log in to subscribe to health alerts</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="health-alert-container loading">
        <div className="loading-indicator">
          <FiLoader className="loading-icon spin" />
          <p>Loading your health alert subscription...</p>
        </div>
      </div>
    );
  }

  if (paymentVerificationInProgress) {
    return (
      <div className="health-alert-container">
        <div className="payment-verification">
          <FiLoader className="loading-icon spin" />
          <h2>Verifying Payment</h2>
          <p>Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="health-alert-container">
        <div className="success-container">
          <motion.div 
            className="success-animation"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiCheckCircle className="success-icon" />
          </motion.div>
          <h2>Subscription Successful!</h2>
          <p>Thank you for subscribing to our Health Alert service.</p>
          
          <div className="subscription-summary">
            <h3>Your Subscription Details</h3>
            
            <div className="summary-item">
              <FiCalendar className="summary-icon" />
              <div className="summary-content">
                <span className="summary-label">Subscription Period:</span>
                <span className="summary-value">{subscriptionStartDate} - {subscriptionEndDate}</span>
              </div>
            </div>
            
            <div className="summary-item">
              <FiMapPin className="summary-icon" />
              <div className="summary-content">
                <span className="summary-label">Monitoring Stations:</span>
                <span className="summary-value">{stations.join(', ')}</span>
              </div>
            </div>
            
            <div className="summary-item">
              <FiHeart className="summary-icon" />
              <div className="summary-content">
                <span className="summary-label">Health Conditions:</span>
                <span className="summary-value">
                  {selectedDiseases
                    .filter(d => d !== 'Other')
                    .concat(selectedDiseases.includes('Other') ? [otherDisease] : [])
                    .join(', ')}
                </span>
              </div>
            </div>
            
            <div className="summary-item">
              <FiPhone className="summary-icon" />
              <div className="summary-content">
                <span className="summary-label">Notifications Sent To:</span>
                <span className="summary-value">{phoneNumber}</span>
              </div>
            </div>
          </div>
          
          <button className="dashboard-btn" onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isSubscribed && !isRenewing) {
    return (
      <div className="health-alert-container">
        <div className="subscription-status">
          <div className="status-header">
            <div className="status-badge active">
              <FiCheckCircle className="status-icon" />
              <span>Subscription Active</span>
            </div>
            
            {!subscriptionExpired && (
              <div className="time-remaining">
                <FiClock className="time-icon" />
                <span>
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                </span>
              </div>
            )}
          </div>
          
          <div className="subscription-details">
            <h2>Your Health Alert Subscription</h2>
            
            <div className="details-grid">
              <div className="detail-card">
                <FiCalendar className="detail-icon" />
                <h3>Subscription Period</h3>
                <p>{subscriptionStartDate} - {subscriptionEndDate}</p>
              </div>
              
              <div className="detail-card">
                <FiHeart className="detail-icon" />
                <h3>Health Conditions</h3>
                <p>
                  {subscriptionDetails?.diseases
                    .filter(d => d !== 'Other')
                    .concat(subscriptionDetails?.diseases.includes('Other') ? [otherDisease] : [])
                    .join(', ')}
                </p>
              </div>
              
              <div className="detail-card">
                <FiMapPin className="detail-icon" />
                <h3>Monitoring Stations</h3>
                <p>{subscriptionDetails?.stations.join(', ')}</p>
              </div>
            </div>
            
            <div className="subscription-actions">
              <button 
                className="renew-subscription" 
                onClick={() => startRenewal()}
              >
                <FiRefreshCw className="action-icon" />
                Renew Subscription
              </button>
              
              <button 
                className="unsubscribe-button"
                onClick={handleUnsubscribeClick}
              >
                <FiX className="action-icon" />
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showUnsubscribeModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content unsubscribe-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h2>Unsubscribe from Health Alerts</h2>
                <p>We're sorry to see you go. Please tell us why you're unsubscribing:</p>
                
                <div className="unsubscribe-options">
                  {unsubscribeReasons.map(reason => (
                    <label key={reason} className="unsubscribe-option">
                      <input
                        type="radio"
                        name="unsubscribe-reason"
                        value={reason}
                        checked={unsubscribeReason === reason}
                        onChange={() => setUnsubscribeReason(reason)}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                
                <textarea
                  placeholder="Any additional feedback? (optional)"
                  value={unsubscribeFeedback}
                  onChange={(e) => setUnsubscribeFeedback(e.target.value)}
                  rows={3}
                />
                
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={handleCancelUnsubscribe}>
                    Cancel
                  </button>
                  <button 
                    className="confirm-unsubscribe" 
                    onClick={handleSubmitUnsubscribe}
                    disabled={!unsubscribeReason}
                  >
                    Confirm Unsubscribe
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {showExpiryModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content expiry-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="expiry-icon">
                  <FiAlertTriangle className="icon" />
                </div>
                
                <h2>Your Subscription Has Expired</h2>
                <p>Your Health Alert subscription ended on {subscriptionEndDate}. Renew now to continue receiving alerts.</p>
                
                <div className="expiry-actions">
                  <button className="renew-btn" onClick={handleRenewSubscription}>
                    <FiRefreshCw className="action-icon" />
                    Renew Subscription
                  </button>
                  
                  <button 
                    className="unsubscribe-btn" 
                    onClick={handleUnsubscribeClick}
                  >
                    <FiX className="action-icon" />
                    I Don't Want to Continue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="health-alert-container">
      <div className="subscription-form">
        <div className="form-header">
          <h1 className="form-title">
            <FiAlertCircle className="title-icon" />
            Health Alert Subscription
          </h1>
          <p className="form-description">
            Get personalized air quality alerts based on your location and health conditions
          </p>
        </div>
        
        <div className="subscription-benefits">
          <div className="benefit-item">
            <FiMessageSquare className="benefit-icon" />
            <div className="benefit-content">
              <h3>SMS Alerts</h3>
              <p>Receive timely SMS alerts when air quality may affect your health</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <FiMapPin className="benefit-icon" />
            <div className="benefit-content">
              <h3>Location-Based</h3>
              <p>Monitor air quality in specific areas you care about</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <FiHeart className="benefit-icon" />
            <div className="benefit-content">
              <h3>Health-Focused</h3>
              <p>Get personalized recommendations based on your health conditions</p>
            </div>
          </div>
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
}

export default HealthAlert;