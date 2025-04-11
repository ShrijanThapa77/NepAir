import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { FaBiohazard, FaSkull, FaExclamationTriangle } from "react-icons/fa";
import { MdDangerous, MdHealthAndSafety } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

// ✅ FIXED: Correct API base URL depending on environment
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001' 
  : 'https://your-production-api-url.com';

function OldData({ setShowInfo }) {
  const [khumaltarPM25, setKhumaltarPM25] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCategory = (value) => {
    if (value === '-') return '';
    if (value > 200) return 'Hazardous';
    if (value > 150) return 'Sensitive';
    if (value > 100) return 'Unhealthy';
    if (value > 50) return 'Moderate';
    return 'Good';
  };

  const categoryIcons = {
    Hazardous: <FaBiohazard />,
    Sensitive: <FaSkull />,
    Unhealthy: <FaExclamationTriangle />,
    Moderate: <MdDangerous />,
    Good: <MdHealthAndSafety />,
  };

  const categoryColors = {
    Hazardous: '#8b0000',
    Sensitive: '#ff4500',
    Unhealthy: '#ff8c00',
    Moderate: '#ffd700',
    Good: '#2e8b57',
  };

  const fetchRealTimePM25 = async () => {
    try {
      const response = await fetch(
        'https://api.waqi.info/feed/@10124/?token=ec4f4e7dd3eab970a6daa16025d4d2d696ad4b28'
      );
      if (!response.ok) throw new Error('Failed to fetch AQI data');
      const data = await response.json();
      setKhumaltarPM25(data.status === 'ok' ? data.data.iaqi.pm25?.v || '-' : '-');
    } catch (error) {
      console.error('Error fetching PM2.5 data:', error);
      setKhumaltarPM25('-');
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (toPhone, message) => {
    try {
      console.log('Attempting to send SMS to:', toPhone);
      
      const response = await fetch(`${API_BASE_URL}/send-sms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          toPhone: `+977${toPhone}`,
          message 
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text(); // helpful for debugging
        console.error('Raw error response:', errorText);
        throw new Error('Failed to send SMS');
      }
      
      const result = await response.json();
      console.log('SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      return false;
    }
  };

  useEffect(() => { 
    fetchRealTimePM25(); 
  }, []);

  const data = useMemo(() => [
    { station: 'Kathmandu', value:'100', category: 'Hazardous' },//khumaltarPM25, category: getCategory(khumaltarPM25) },//
    { station: 'Janakpur', value: 100, category: 'Hazardous' },
    { station: 'Pokhara', value: '100', category: 'Hazardous' },
    { station: 'Butwal', value: 100, category: 'Unhealthy' },
    { station: 'Bharatpur', value: 100, category: 'Unhealthy' },
    { station: 'Nepalgunj', value: 100, category: 'Sensitive' },
    { station: 'Mahendranagar', value: 80, category: 'Moderate' },
    { station: 'Biratnagar', value: 40, category: 'Good' },
    { station: 'Birgunj', value: 90, category: 'Moderate' },
    { station: 'Dharan', value: 80, category: 'Moderate' },
  ].map(entry => ({
    ...entry,
    icon: categoryIcons[entry.category] || null,
    color: categoryColors[entry.category] || '#000',
  })), [khumaltarPM25]);

  useEffect(() => {
    const checkAQIAndNotify = async () => {
      const highAQIStations = data.filter(entry => 
        entry.value !== '-' && entry.value > 100
      );
      
      if (highAQIStations.length === 0) {
        console.log('No high AQI stations detected.');
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('healthAlert.subscribed', '==', true));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          const user = doc.data();
          const userStations = user.healthAlert?.stations || [];
          const userPhone = user.healthAlert?.phoneNumber;
          
          const relevantStations = highAQIStations.filter(station => 
            userStations.includes(station.station)
          );

          if (relevantStations.length > 0) {
            const alertMessage = `⚠️ Air Quality Alert!\n${
              relevantStations.map(s => 
                `${s.station}: ${s.value} (${s.category})`
              ).join('\n')
            }\nTake precautions!`;

            if (userPhone && userPhone.length === 10) {
              console.log(`Preparing to notify ${user.email} via SMS`);
              await sendSMS(userPhone, alertMessage);
            }

            if (user.email) {
              emailjs.send(
                'service_thkeu45',
                'template_kk30yhg',
                {
                  to_email: user.email,
                  stations: relevantStations.map(s => 
                    `${s.station}: ${s.value}`
                  ).join('\n')
                },
                'v6pNvmbYK2iyUdR2Z'
              ).catch(emailError => 
                console.error('Email failed:', emailError)
              );
            }
          }
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    };

    checkAQIAndNotify();
  }, [data]);

  const handleStationClick = (stationName) => {
    navigate(`/${stationName.toLowerCase()}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table className="oldData tab1">
        <thead>
          <tr>
            <th>Stations (AQI)</th>
            <th>Yesterday 24hr</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td 
                id='category' 
                className={entry.category}
                style={{ color: entry.color, fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => handleStationClick(entry.station)}
              >
                {entry.station} {entry.icon}
              </td>
              <td className='tdata' style={{ color: entry.color }}>
                {entry.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OldData;