import React from 'react';
import { useNavigate } from 'react-router-dom';
import CityLayout from '../../components/CityLayout';
import BG from '../../assets/BGGG.jpg'; // Your background image
import './CityPage.css';

function Pokhara() {
  const navigate = useNavigate();

  return (
    <CityLayout 
      title="Pokhara" 
      heroImage={BG}
      tagline="Capital of Nepal - The City of Temples"
    >
      <div className="city-content">
        {/* Air Quality Dashboard Section */}
        <div className="air-quality-dashboard">
          <h2>Live Air Quality</h2>
          <div className="metrics-container">
            <div className="aqi-metric">
              <h3>Live AQI</h3>
              <div className="aqi-value">87</div>
              <div className="pm-value">PM10 : 58 µg/m³</div>
              <div className="quality-status good">Good Moderate</div>
              <div className="scale-bar">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300</span>
                <span>301+</span>
              </div>
            </div>

            <div className="quality-metric">
              <h3>Air Quality Is</h3>
              <div className="quality-status-large moderate">Moderate</div>
              <div className="pm-value">PM2.5 : 29 µg/m³</div>
              <div className="quality-scale">
                <span>Unhealthy</span>
                <span>Severe</span>
                <span>Hazardous</span>
              </div>
            </div>
          </div>

          <div className="weather-metrics">
            <div className="weather-item">
              <span>21 °C</span>
              <small>Temperature</small>
            </div>
            <div className="weather-item">
              <span>46%</span>
              <small>Humidity</small>
            </div>
            <div className="weather-item">
              <span>6 km/h</span>
              <small>Wind Speed</small>
            </div>
            <div className="weather-item">
              <span>0</span>
              <small>UV Index</small>
            </div>
          </div>
        </div>

        {/* City Information Section */}
        <section className="city-info">
          <h2>About Pokhara</h2>
          <p>Pokhara, the capital city of Nepal, is rich in cultural heritage and history. Nestled in the Pokhara Valley at an elevation of 1,400 meters, it serves as the gateway to the Himalayas.</p>
          
          <div className="info-grid">
            <div className="info-card">
              <h3>Key Information</h3>
              <ul>
                <li><strong>Population:</strong> 1.5 million</li>
                <li><strong>Elevation:</strong> 1,400m</li>
                <li><strong>Language:</strong> Nepali, Newari</li>
                <li><strong>Best Time to Visit:</strong> Oct-Dec</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>Major Attractions</h3>
              <ul>
                <li>Swayambhunath Stupa</li>
                <li>Pashupatinath Temple</li>
                <li>Pokhara Durbar Square</li>
                <li>Boudhanath Stupa</li>
              </ul>
            </div>
          </div>
        </section>

        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Map
        </button>
      </div>
    </CityLayout>
  );
}

export default Pokhara;