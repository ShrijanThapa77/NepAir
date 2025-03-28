import React, { useState, useEffect } from 'react';
import './Kathmandu.css';
import BG from '../../assets/BGG.jpg';

const Kathmandu = () => {
  const [aqiData, setAqiData] = useState({
    city: 'Kathmandu',
    date: new Date().toLocaleDateString(),
    pm25: 45,
    pm10: 78,
    o3: 12,
    no2: 23,
    so2: 9,
    co: 0.8,
    weather: 'Partly Cloudy',
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    windDirection: 'NE',
    pressure: 1013,
    visibility: 8
  });

  const [hourlyPrediction, setHourlyPrediction] = useState([]);
  const [tomorrowPrediction, setTomorrowPrediction] = useState([]);
  const [selectedTab, setSelectedTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [activePollutant, setActivePollutant] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      generatePredictions();
      setLoading(false);
    }, 1500);
  }, []);

  const generatePredictions = () => {
    // Generate hourly predictions for today
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const todayPredictions = hours.map(hour => {
      const baseValue = 30 + Math.sin(hour / 4) * 20 + Math.random() * 5;
      return {
        hour: `${hour}:00`,
        aqi: Math.round(baseValue),
        level: getAQILevel(Math.round(baseValue)),
        dominantPollutant: getRandomPollutant()
      };
    });
    setHourlyPrediction(todayPredictions);

    // Generate predictions for tomorrow
    const tomorrowPredictions = hours.map(hour => {
      const baseValue = 25 + Math.sin(hour / 4) * 25 + Math.random() * 8;
      return {
        hour: `${hour}:00`,
        aqi: Math.round(baseValue),
        level: getAQILevel(Math.round(baseValue)),
        dominantPollutant: getRandomPollutant()
      };
    });
    setTomorrowPrediction(tomorrowPredictions);
  };

  const getRandomPollutant = () => {
    const pollutants = ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'];
    return pollutants[Math.floor(Math.random() * pollutants.length)];
  };

  const getAQILevel = (value) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Unhealthy for Sensitive Groups';
    if (value <= 200) return 'Unhealthy';
    if (value <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (value) => {
    if (value <= 50) return '#55a84f';
    if (value <= 100) return '#a3c853';
    if (value <= 150) return '#fff833';
    if (value <= 200) return '#f29c32';
    if (value <= 300) return '#e93f33';
    return '#af2d24';
  };

  const currentAQI = Math.round((aqiData.pm25 + aqiData.pm10) / 2);
  const currentAQIColor = getAQIColor(currentAQI);
  const currentAQILevel = getAQILevel(currentAQI);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Kathmandu AQI Data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${BG})` }}>
      <div className="overlay"></div>
      
      <div className="nav-back">
        <button className="back-to-map" onClick={() => window.history.back()}>
          ← Back to Map
        </button>
      </div>

      <header className="dashboard-header">
        <h1>Kathmandu Air Quality Dashboard</h1>
        <div className="last-updated">
          <span>{aqiData.city}</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </header>

      <div className="main-dashboard">
        <div className="current-data-section">
          <div className="current-aqi-card" style={{ borderColor: currentAQIColor }}>
            <div className="aqi-value" style={{ color: currentAQIColor }}>
              {currentAQI}
              <span className="aqi-level" style={{ backgroundColor: currentAQIColor }}>
                {currentAQILevel}
              </span>
            </div>
            <div className="aqi-label">Air Quality Index</div>
            <div className="aqi-description">
              {currentAQI <= 50 && 'Air quality is satisfactory'}
              {currentAQI > 50 && currentAQI <= 100 && 'Moderate health concern'}
              {currentAQI > 100 && currentAQI <= 150 && 'Unhealthy for sensitive groups'}
              {currentAQI > 150 && currentAQI <= 200 && 'Unhealthy for all'}
              {currentAQI > 200 && currentAQI <= 300 && 'Very unhealthy'}
              {currentAQI > 300 && 'Hazardous conditions'}
            </div>
          </div>

          <div className="weather-card">
            <div className="weather-icon">
              {aqiData.weather.includes('Cloudy') ? '☁️' : aqiData.weather.includes('Rain') ? '🌧️' : '☀️'}
            </div>
            <div className="weather-details">
              <div className="weather-condition">{aqiData.weather}</div>
              <div className="weather-temp">{aqiData.temperature}°C</div>
              <div className="weather-meta">
                <span title="Humidity">💧 {aqiData.humidity}%</span>
                <span title="Wind Speed">🌬️ {aqiData.windSpeed} km/h {aqiData.windDirection}</span>
                <span title="Pressure">📊 {aqiData.pressure} hPa</span>
                <span title="Visibility">👁️ {aqiData.visibility} km</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-middle">
          <div className="pollutants-section">
            <h2>Pollutant Concentrations (µg/m³)</h2>
            <div className="pollutants-grid">
              {[
                { name: 'PM2.5', value: aqiData.pm25, multiplier: 2 },
                { name: 'PM10', value: aqiData.pm10, multiplier: 1.5 },
                { name: 'O₃', value: aqiData.o3, multiplier: 5 },
                { name: 'NO₂', value: aqiData.no2, multiplier: 3 },
                { name: 'SO₂', value: aqiData.so2, multiplier: 5 },
                { name: 'CO', value: aqiData.co, multiplier: 50 }
              ].map((pollutant, index) => (
                <div 
                  key={index}
                  className={`pollutant-card ${activePollutant === pollutant.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setActivePollutant(activePollutant === pollutant.name.toLowerCase() ? null : pollutant.name.toLowerCase())}
                >
                  <div className="pollutant-name">{pollutant.name}</div>
                  <div className="pollutant-value">{pollutant.name === 'CO' ? pollutant.value.toFixed(1) : pollutant.value}</div>
                  <div className="pollutant-bar">
                    <div 
                      className="pollutant-bar-fill" 
                      style={{ 
                        width: `${Math.min(100, pollutant.value * pollutant.multiplier)}%`,
                        backgroundColor: getAQIColor(pollutant.value * pollutant.multiplier)
                      }}
                    ></div>
                  </div>
                  {activePollutant === pollutant.name.toLowerCase() && (
                    <div className="pollutant-info">
                      {pollutant.name === 'PM2.5' && 'Fine particles that can penetrate lungs'}
                      {pollutant.name === 'PM10' && 'Coarse particles that can irritate airways'}
                      {pollutant.name === 'O₃' && 'Ground-level ozone that affects respiratory system'}
                      {pollutant.name === 'NO₂' && 'Nitrogen dioxide from vehicle emissions'}
                      {pollutant.name === 'SO₂' && 'Sulfur dioxide from industrial processes'}
                      {pollutant.name === 'CO' && 'Carbon monoxide from incomplete combustion'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="forecast-section">
            <div className="forecast-header">
              <h2>AQI Forecast</h2>
              <div className="forecast-tabs">
                <button 
                  className={selectedTab === 'today' ? 'active' : ''}
                  onClick={() => setSelectedTab('today')}
                >
                  Today
                </button>
                <button 
                  className={selectedTab === 'tomorrow' ? 'active' : ''}
                  onClick={() => setSelectedTab('tomorrow')}
                >
                  Tomorrow
                </button>
              </div>
            </div>
            
            <div className="forecast-content">
              {selectedTab === 'today' ? (
                <>
                  <div className="hourly-forecast">
                    {hourlyPrediction.map((hour, index) => (
                      <div key={index} className="hourly-item">
                        <div className="hour-label">{hour.hour}</div>
                        <div 
                          className="hour-aqi-bar" 
                          style={{
                            height: `${Math.min(100, hour.aqi)}%`,
                            backgroundColor: getAQIColor(hour.aqi)
                          }}
                          title={`AQI: ${hour.aqi} (${hour.level})\nDominant: ${hour.dominantPollutant}`}
                        >
                          <span className="hour-aqi-value">{hour.aqi}</span>
                          <span className="dominant-pollutant">{hour.dominantPollutant}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="forecast-summary">
                    <h3>Today's Summary</h3>
                    <p>Air quality is expected to {hourlyPrediction[0].aqi < hourlyPrediction[12].aqi ? 'deteriorate' : 'improve'} throughout the day with peak pollution around {hourlyPrediction.reduce((maxIndex, item, i, arr) => item.aqi > arr[maxIndex].aqi ? i : maxIndex, 0)}:00.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="hourly-forecast">
                    {tomorrowPrediction.map((hour, index) => (
                      <div key={index} className="hourly-item">
                        <div className="hour-label">{hour.hour}</div>
                        <div 
                          className="hour-aqi-bar" 
                          style={{
                            height: `${Math.min(100, hour.aqi)}%`,
                            backgroundColor: getAQIColor(hour.aqi)
                          }}
                          title={`AQI: ${hour.aqi} (${hour.level})\nDominant: ${hour.dominantPollutant}`}
                        >
                          <span className="hour-aqi-value">{hour.aqi}</span>
                          <span className="dominant-pollutant">{hour.dominantPollutant}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="forecast-summary">
                    <h3>Tomorrow's Outlook</h3>
                    <p>Air quality is predicted to be {tomorrowPrediction.reduce((sum, item) => sum + item.aqi, 0) / tomorrowPrediction.length > currentAQI ? 'worse' : 'better'} than today with dominant pollutants being {[...new Set(tomorrowPrediction.map(item => item.dominantPollutant))].join(', ')}.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="health-recommendation">
          <h3>Health Recommendations</h3>
          <div className="recommendation-content">
            {currentAQI <= 50 && (
              <p className="good">Air quality is satisfactory. Enjoy your normal outdoor activities.</p>
            )}
            {currentAQI > 50 && currentAQI <= 100 && (
              <p className="moderate">Unusually sensitive individuals should consider reducing prolonged outdoor exertion.</p>
            )}
            {currentAQI > 100 && currentAQI <= 150 && (
              <p className="unhealthy-sensitive">Sensitive groups should reduce prolonged outdoor exertion.</p>
            )}
            {currentAQI > 150 && currentAQI <= 200 && (
              <p className="unhealthy">Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor exertion.</p>
            )}
            {currentAQI > 200 && currentAQI <= 300 && (
              <p className="very-unhealthy">Health alert: everyone may experience more serious health effects.</p>
            )}
            {currentAQI > 300 && (
              <p className="hazardous blinking">Health warning of emergency conditions: everyone is likely to be affected.</p>
            )}
          </div>
          <div className="recommendation-actions">
            <button className="action-btn mask-btn">😷 Wear Mask</button>
            <button className="action-btn indoor-btn">🏠 Stay Indoors</button>
            <button className="action-btn window-btn">🪟 Close Windows</button>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>Data Source: Nepal Environmental Monitoring Network | Last refreshed: {new Date().toLocaleTimeString()}</p>
        <p>© {new Date().getFullYear()} Kathmandu Air Quality Monitoring | All rights reserved</p>
      </footer>
    </div>
  );
};

export default Kathmandu;