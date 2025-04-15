import React, { useState } from "react";
import axios from "axios";

const Khalti = ({ payment, onSuccess }) => {
  const [paymentUrl, setPaymentUrl] = useState(null);

  const initiatePayment = async () => {
    const data = {
      return_url: "http://localhost:3000/khalti-payment",
      website_url: "http://localhost:3000",
      amount: payment * 100, // Convert to paisa
      purchase_order_id: "health_alert_" + Date.now(),
      purchase_order_name: "Health Alert Subscription",
      customer_info: {
        name: "Health Alert Subscriber",
        email: JSON.parse(sessionStorage.getItem('healthAlertSubscription')).email,
        phone: JSON.parse(sessionStorage.getItem('healthAlertSubscription')).phoneNumber,
      },
      amount_breakdown: [
        {
          label: "Subscription Fee",
          amount: payment * 100,
        },
      ],
      product_details: [
        {
          identity: "health_alert_sub",
          name: "Health Alert Subscription",
          total_price: payment * 100,
          quantity: 1,
          unit_price: payment * 100,
        },
      ],
    };

    const headers = {
      Authorization: "Key e53ffb1e15a443ce8c65cfb95e0037e8",
    };

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        { headers }
      );
      setPaymentUrl(response.data.payment_url);
      
      // Open payment URL in a new tab
      window.open(response.data.payment_url, '_blank');
      
      // Poll for payment completion
      const pollPayment = setInterval(async () => {
        try {
          const verifyResponse = await axios.get(
            `https://a.khalti.com/api/v2/epayment/lookup/`,
            {
              headers,
              params: {
                pidx: response.data.pidx
              }
            }
          );
          
          if (verifyResponse.data.status === 'Completed') {
            clearInterval(pollPayment);
            onSuccess();
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      }, 3000);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="khalti-button-container">
      <button
        className="khalti-pay-button"
        onClick={initiatePayment}
      >
        Pay Now Via Khalti
      </button>
    </div>
  );
};

export default Khalti;