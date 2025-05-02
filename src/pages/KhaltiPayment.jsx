import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import khaltiLogo from '../assets/khalti.png';

const KhaltiPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'failed'
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const navigate = useNavigate();

  const subscriptionData = JSON.parse(sessionStorage.getItem('healthAlertSubscription'));
  const {
    amount = 800,
    months = 1,
    planId = 'monthly',
    userId = '787790',
    email = 'thapashrijan78@gmail.com',
    phoneNumber = '9863402224',
    stations = [],
    diseases = [],
    isRenewal = false
  } = subscriptionData;

  // Calculate VAT (13%) and total amount
  const vatAmount = Math.round(amount * 0.13);
  const totalAmount = amount + vatAmount;

  useEffect(() => {
    // Check for Khalti callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get('pidx');
    const transactionId = urlParams.get('transaction_id');
    const status = urlParams.get('status');

    if (pidx && status === 'Completed') {
      // Payment was successful, verify it
      verifyPayment(pidx, transactionId);
    } else if (status === 'Failed') {
      // Payment failed
      setPaymentStatus('failed');
    }
  }, []);

  const initiatePayment = async () => {
    setIsProcessing(true);
    
    try {
      const data = {
        return_url: `${window.location.origin}/khalti-callback?userId=${userId}`,
        website_url: window.location.origin,
        amount: totalAmount * 100, // Convert to paisa
        purchase_order_id: `HA-${Date.now()}`,
        purchase_order_name: `Health Alert ${months}-month ${isRenewal ? 'Renewal' : 'Subscription'}`,
        customer_info: {
          name: "Health Alert User",
          email: email,
          phone: phoneNumber,
        },
        amount_breakdown: [
          {
            label: "Subscription Fee",
            amount: amount * 100,
          },
          {
            label: "VAT (13%)",
            amount: vatAmount * 100,
          }
        ],
        product_details: [
          {
            identity: `HA-${userId}`,
            name: `Health Alert ${months}-month Subscription`,
            total_price: totalAmount * 100,
            quantity: 1,
            unit_price: totalAmount * 100,
          },
        ],
      };

      const headers = {
        Authorization: `Key ${process.env.REACT_APP_KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        { headers }
      );
      
      // Store subscription data in local storage for verification after return
      localStorage.setItem('pendingHealthSubscription', JSON.stringify({
        ...subscriptionData,
        pidx: response.data.pidx,
        paymentUrl: response.data.payment_url,
        amount: totalAmount
      }));
      
      // Redirect to Khalti payment page
      window.location.href = response.data.payment_url;
      
    } catch (error) {
      console.error("Payment initiation error:", error.response?.data || error.message);
      setIsProcessing(false);
      setPaymentStatus('failed');
    }
  };

  const verifyPayment = async (pidx, transactionId) => {
    try {
      const response = await axios.get(
        `https://a.khalti.com/api/v2/epayment/lookup/`,
        {
          headers: {
            Authorization: `Key ${process.env.REACT_APP_KHALTI_SECRET_KEY}`
          },
          params: { pidx }
        }
      );

      if (response.data.status === 'Completed') {
        // Payment verified successfully
        await completeSubscription(pidx, transactionId, response.data);
        setPaymentStatus('success');
      } else {
        // Payment not yet completed, retry after delay
        if (verificationAttempts < 5) {
          setTimeout(() => {
            setVerificationAttempts(prev => prev + 1);
            verifyPayment(pidx, transactionId);
          }, 2000);
        } else {
          // Max attempts reached
          setPaymentStatus('failed');
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error.response?.data || error.message);
      setPaymentStatus('failed');
    }
  };

  const completeSubscription = async (pidx, transactionId, paymentDetails) => {
    try {
      // Retrieve the pending subscription data
      const pendingSubscription = JSON.parse(localStorage.getItem('pendingHealthSubscription'));
      
      if (!pendingSubscription) {
        throw new Error('No pending subscription found');
      }

      // Prepare subscription data for Firebase
      const subscriptionRecord = {
        userId: pendingSubscription.userId,
        email: pendingSubscription.email,
        phoneNumber: pendingSubscription.phoneNumber,
        stations: pendingSubscription.stations,
        diseases: pendingSubscription.diseases,
        planId: pendingSubscription.planId,
        months: pendingSubscription.months,
        isRenewal: pendingSubscription.isRenewal,
        paymentInfo: {
          amount: pendingSubscription.amount,
          pidx,
          transactionId,
          paymentMethod: paymentDetails.payment_method,
          paymentDate: new Date(),
          expiryDate: new Date(
            new Date().setMonth(new Date().getMonth() + pendingSubscription.months)
          ),
          details: paymentDetails
        },
        subscribed: true,
        createdAt: new Date()
      };

      // Here you would typically send this to your backend to save to Firebase
      // For now, we'll simulate this and store in sessionStorage
      sessionStorage.setItem('healthAlertSubscription', JSON.stringify(subscriptionRecord));
      localStorage.removeItem('pendingHealthSubscription');

      // Simulate API call to backend
      console.log('Subscription completed:', subscriptionRecord);

    } catch (error) {
      console.error("Subscription completion error:", error);
      throw error;
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus(null);
    initiatePayment();
  };

  const handleReturnToHealthAlerts = () => {
    navigate('/health-alerts');
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div 
        className="payment-success-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <FiCheckCircle size={80} color="#4BB543" />
        </div>
        <h2>Payment Successful!</h2>
        <p>Your Health Alert subscription has been activated.</p>
        <div className="payment-details">
          <p><strong>Plan:</strong> {months}-month subscription</p>
          <p><strong>Amount:</strong> NPR {totalAmount.toLocaleString()}</p>
          <p><strong>Status:</strong> Active</p>
        </div>
        <button 
          className="return-button"
          onClick={handleReturnToHealthAlerts}
        >
          Return to Health Alerts
        </button>
      </motion.div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <motion.div 
        className="payment-failed-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="failed-icon">
          <FiAlertCircle size={80} color="#FF0000" />
        </div>
        <h2>Payment Failed</h2>
        <p>We couldn't process your payment. Please try again.</p>
        <div className="action-buttons">
          <button 
            className="retry-button"
            onClick={handleRetryPayment}
          >
            Retry Payment
          </button>
          <button 
            className="return-button"
            onClick={handleReturnToHealthAlerts}
          >
            Return to Health Alerts
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="khalti-payment-container">
      <div className="payment-header">
        <h2>Complete Your Subscription</h2>
        <p>Secure payment via Khalti</p>
      </div>

      <div className="payment-summary">
        <div className="summary-item">
          <span>Plan:</span>
          <span>{months}-month Health Alert Subscription</span>
        </div>
        <div className="summary-item">
          <span>Subscription Fee:</span>
          <span>NPR {amount.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>VAT (13%):</span>
          <span>NPR {vatAmount.toLocaleString()}</span>
        </div>
        <div className="summary-item total">
          <span>Total Amount:</span>
          <span>NPR {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="payment-method">
        <div className="khalti-branding">
          <img src={khaltiLogo} alt="Khalti Payment" />
          <p>You'll be redirected to Khalti to complete your payment securely</p>
        </div>
      </div>

      <div className="payment-actions">
        <button 
          className="pay-now-button"
          onClick={initiatePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay with Khalti'}
        </button>
        <button 
          className="cancel-button"
          onClick={handleReturnToHealthAlerts}
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>

      <div className="payment-security">
        <FiCreditCard className="security-icon" />
        <p>Your payment is secure and encrypted. We don't store your payment details.</p>
      </div>
    </div>
  );
};

export default KhaltiPayment;