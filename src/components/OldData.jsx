import React, { useEffect, useMemo } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore utilities
import emailjs from '@emailjs/browser';

function OldData({ setShowInfo }) {
  // Memoize the `data` array to prevent it from changing on every render
  const data = useMemo(
    () => [
      { station: 'Khumaltar', value: 205, category: 'Hazardous' }, // Example: AQI > 200
      { station: 'Ratnapark', value: 300, category: 'Hazardous' },
      { station: 'Deukhuri, Dang', value: 165, category: 'Hazardous' },
      { station: 'Bharatpur', value: 156, category: 'Unhealthy' },
      { station: 'Bhaktapur', value: 155, category: 'Unhealthy' },
      { station: 'Nepalgunj', value: 105, category: 'Sensitive' },
      { station: 'Dhulikhel', value: 80, category: 'Moderate' },
      { station: 'Ilam', value: 42, category: 'Good' },
      { station: 'Shankapark', value: '-', category: '' },
      { station: 'Achaam', value: '-', category: '' },
    ],
    []
  );

  useEffect(() => {
    const checkAQIAndNotify = async () => {
      // Filter stations with AQI values above 200
      const highAQIStations = data.filter((entry) => entry.value > 200);
      console.log('High AQI stations:', highAQIStations);

      if (highAQIStations.length === 0) {
        console.log('No high AQI stations detected.');
        return;
      }

      // Fetch user emails from Firestore
      const usersRef = collection(db, 'users'); // Assuming 'users' is the collection name
      const q = query(usersRef, where('subscribed', '==', true)); // Only notify subscribed users
      const querySnapshot = await getDocs(q);

      const userEmails = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userEmails.push(userData.email); // Collect user emails
        console.log('Fetched user:', userData); // Log each user document
      });
      console.log('Fetched emails:', userEmails);

      if (userEmails.length === 0) {
        console.warn('No subscribed users found in Firestore.');
        return;
      }

      // Prepare email content
      const stationsText = highAQIStations
        .map((station) => `${station.station}: ${station.value}`)
        .join('\n');

      // Send email using EmailJS
      userEmails.forEach((email) => {
        emailjs
          .send(
            'service_thkeu45', // Your Service ID
            'template_kk30yhg', // Your Template ID
            {
              to_email: email,
              stations: stationsText,
            },
            'v6pNvmbYK2iyUdR2Z' // Your Public Key
          )
          .then(
            (result) => {
              console.log('Email sent successfully:', result.text);
            },
            (error) => {
              console.error('Error sending email:', error.text);
            }
          );
      });
    };

    checkAQIAndNotify();
  }, [data]);

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
            <tr key={index} onMouseEnter={() => setShowInfo(true)}>
              <td className={entry.category}>{entry.station}</td>
              <td className={entry.category}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OldData;