import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Khalti from './Khalti';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowLeft, FiCreditCard, FiInfo } from 'react-icons/fi';

const KhaltiPayment = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('healthAlertSubscription');
    if (!data) {
      navigate('/healthalert');
      return;
    }
    setSubscriptionData(JSON.parse(data));
  }, [navigate]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Redirect back to health alert page after 3 seconds
    setTimeout(() => {
      navigate('/healthalert');
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-success-container">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="payment-success-content"
          >
            <div className="success-icon-wrapper">
              <FiCheckCircle size={72} className="success-icon" />
            </div>
            <h2>Payment Successful!</h2>
            <p className="success-message">Your health alert subscription has been activated successfully.</p>
            <div className="redirect-message">
              <span className="pulse-dot"></span>
              <p>You will be redirected shortly...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="khalti-payment-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="khalti-payment-content"
        >
          <button 
            onClick={() => navigate('/healthalert')}
            className="back-button"
          >
            <FiArrowLeft /> <span>Back to Subscription</span>
          </button>

          <h1 className="payment-title">Complete Your Payment</h1>
          <div className="payment-steps">
            <div className="step completed">
              <div className="step-number">1</div>
              <div className="step-label">Select Plan</div>
            </div>
            <div className="step-connector"></div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
          
          {subscriptionData && (
            <>
              <div className="subscription-card">
                <h3 className="card-title">Subscription Details</h3>
                <div className="subscription-summary">
                  <div className="summary-item">
                    <span className="label">Email:</span>
                    <span className="value">{subscriptionData.email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Phone:</span>
                    <span className="value">+977 {subscriptionData.phoneNumber}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Stations:</span>
                    <span className="value">{subscriptionData.stations.join(', ')}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Conditions:</span>
                    <span className="value">{subscriptionData.diseases.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="payment-details-card">
                <div className="amount-section">
                  <span className="amount-label">Total Amount</span>
                  <span className="amount-value">NPR {subscriptionData.amount}</span>
                </div>
                
                <div className="payment-info">
                  <div className="info-icon">
                    <FiInfo />
                  </div>
                  <p>Your subscription will be activated immediately after successful payment.</p>
                </div>
              </div>
            </>
          )}

          <div className="payment-method-section">
            <h3><FiCreditCard className="section-icon" /> Payment Method</h3>
            <div className="khalti-payment-wrapper">
              <Khalti payment={subscriptionData?.amount} onSuccess={handlePaymentSuccess} />
            </div>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .khalti-payment-container {
          width: 100%;
          max-width: 650px;
        }
        
        .khalti-payment-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          position: relative;
        }
        
        .back-button {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: transparent;
          border: none;
          color: #6c63ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background: rgba(108, 99, 255, 0.1);
        }
        
        .payment-title {
          text-align: center;
          color: #2d3748;
          font-size: 1.75rem;
          margin-bottom: 2rem;
          font-weight: 600;
          margin-top: 1rem;
        }
        
        .payment-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #718096;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .step.active .step-number {
          background: #6c63ff;
          color: white;
        }
        
        .step.completed .step-number {
          background: #48bb78;
          color: white;
        }
        
        .step-label {
          font-size: 0.85rem;
          color: #718096;
        }
        
        .step.active .step-label {
          color: #6c63ff;
          font-weight: 600;
        }
        
        .step-connector {
          width: 60px;
          height: 2px;
          background: #e2e8f0;
          margin: 0 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .subscription-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        
        .card-title {
          color: #4a5568;
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .subscription-summary {
          display: grid;
          gap: 0.85rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        
        .label {
          color: #718096;
          font-weight: 500;
        }
        
        .value {
          color: #2d3748;
          font-weight: 500;
        }
        
        .payment-details-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .amount-section {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: #6c63ff10;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .amount-label {
          color: #4a5568;
          font-weight: 600;
        }
        
        .amount-value {
          color: #6c63ff;
          font-weight: 700;
          font-size: 1.2rem;
        }
        
        .payment-info {
          display: flex;
          gap: 0.75rem;
          background: #ebf8ff;
          padding: 1rem;
          border-radius: 8px;
          color: #2b6cb0;
          font-size: 0.9rem;
        }
        
        .info-icon {
          margin-top: 2px;
        }
        
        .payment-method-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        
        .payment-method-section h3 {
          color: #2d3748;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        .section-icon {
          color: #6c63ff;
        }
        
        .khalti-payment-wrapper {
          display: flex;
          justify-content: center;
        }
        
        /* Success page styles */
        .payment-success-container {
          width: 100%;
          max-width: 500px;
        }
        
        .payment-success-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 3rem 2rem;
          text-align: center;
        }
        
        .success-icon-wrapper {
          width: 110px;
          height: 110px;
          background: #f0fdf4;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 1.5rem;
        }
        
        .success-icon {
          color: #10b981;
        }
        
        .payment-success-content h2 {
          color: #10b981;
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }
        
        .success-message {
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        .redirect-message {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 0.95rem;
          gap: 0.75rem;
        }
        
        .pulse-dot {
          width: 10px;
          height: 10px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .payment-page {
            padding: 1rem;
          }
          
          .khalti-payment-content {
            padding: 2rem 1.5rem;
          }
          
          .back-button {
            top: 1rem;
            left: 1rem;
          }
          
          .payment-title {
            margin-top: 2rem;
            font-size: 1.5rem;
          }
          
          .step-connector {
            width: 40px;
          }
        }
        
        @media (max-width: 480px) {
          .summary-item {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .payment-steps {
            margin-bottom: 2rem;
          }
          
          .step-number {
            width: 28px;
            height: 28px;
            font-size: 0.85rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
          
          .step-connector {
            width: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default KhaltiPayment;