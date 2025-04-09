require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors({
  origin: 'http://localhost:5001' // Your React app's URL
}));
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/send-sms', async (req, res) => {
  try {
    const { toPhone, message } = req.body;
    
    // Validate phone number format
    if (!toPhone.startsWith('+977') || toPhone.length !== 13) {
      return res.status(400).json({ error: 'Invalid Nepali phone number format' });
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone
    });

    console.log('SMS sent:', result.sid);
    res.json({ success: true, sid: result.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS API running on port ${PORT}`);
  console.log(`Twilio Account: ${process.env.TWILIO_ACCOUNT_SID}`);
});