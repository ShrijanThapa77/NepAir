import React, { useState, useEffect } from "react";
import "./Kathmandu.css";
import { useNavigate } from "react-router-dom";
import BG from '../../assets/BGGG.jpg';
const KathmanduAQI = () => {
  const navigate = useNavigate();
  const [aqiData, setAqiData] = useState({
    city: "Kathmandu",
    date: new Date().toLocaleDateString(),
    pm25: 64.1,
    pm10: 92,
    o3: 15,
    no2: 38,
    so2: 12,
    co: 1.2,
    weather: "Partly Cloudy",
    temperature: 36,
    humidity: 26,
    windSpeed: 11.1,
    windDirection: "NE",
    pressure: 1015,
    visibility: 8,
    followers: "1.4M",
  });

  const [hourlyPrediction, setHourlyPrediction] = useState([]);
  const [tomorrowPrediction, setTomorrowPrediction] = useState([]);
  const [selectedTab, setSelectedTab] = useState("today");
  const [loading, setLoading] = useState(true);
  const [activePollutant, setActivePollutant] = useState(null);
  const [stationData, setStationData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      generatePredictions();
      generateStationData();
      setLoading(false);
    }, 1200);
  }, []);

  const generatePredictions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const currentHour = new Date().getHours();
    
    // Generate more realistic data with a morning and evening peak pattern
    const todayPredictions = hours.map((hour) => {
      // Morning peak around 8-10 AM and evening peak around 6-8 PM
      let baseValue = 120;
      
      if (hour >= 7 && hour <= 10) {
        // Morning rush hour peak
        baseValue = 175 - Math.abs(hour - 8.5) * 15;
      } else if (hour >= 17 && hour <= 20) {
        // Evening rush hour peak
        baseValue = 180 - Math.abs(hour - 18.5) * 15;
      } else if (hour >= 1 && hour <= 5) {
        // Early morning low
        baseValue = 90;
      } else {
        // Rest of the day
        baseValue = 130;
      }
      
      // Add some randomness
      baseValue += (Math.random() - 0.5) * 20;
      
      return {
        hour: `${hour}:00`,
        aqi: Math.round(baseValue),
        level: getAQILevel(Math.round(baseValue)),
        dominantPollutant: hour >= 7 && hour <= 20 ? "PM2.5" : hour > 20 || hour < 3 ? "NO₂" : "PM10",
      };
    });
    setHourlyPrediction(todayPredictions);

    // Tomorrow's data with slightly better conditions
    const tomorrowPredictions = hours.map((hour) => {
      let baseValue = todayPredictions[hour].aqi * (0.9 + Math.random() * 0.2);
      return {
        hour: `${hour}:00`,
        aqi: Math.round(baseValue),
        level: getAQILevel(Math.round(baseValue)),
        dominantPollutant: hour >= 7 && hour <= 20 ? "PM2.5" : hour > 20 || hour < 3 ? "NO₂" : "PM10",
      };
    });
    setTomorrowPrediction(tomorrowPredictions);
  };

  const generateStationData = () => {
    const stations = [
      { name: "Victoria Memorial", aqi: 157, pm25: 64.1, dominantPollutant: "PM2.5" },
      { name: "Fort William", aqi: 175, pm25: 78.3, dominantPollutant: "PM2.5" },
      { name: "Rabindra Sarobar", aqi: 162, pm25: 69.7, dominantPollutant: "PM2.5" },
      { name: "Salt Lake", aqi: 183, pm25: 82.5, dominantPollutant: "PM2.5" },
      { name: "Jadavpur", aqi: 144, pm25: 58.9, dominantPollutant: "PM2.5" },
      { name: "Ballygunge", aqi: 169, pm25: 72.6, dominantPollutant: "PM2.5" },
      { name: "Howrah Bridge", aqi: 198, pm25: 86.2, dominantPollutant: "PM10" },
      { name: "New Town", aqi: 139, pm25: 56.4, dominantPollutant: "PM2.5" }
    ];
    setStationData(stations);
  };

  const getRandomPollutant = () => {
    const pollutants = ["PM2.5", "PM10", "O₃", "NO₂", "SO₂", "CO"];
    return pollutants[Math.floor(Math.random() * pollutants.length)];
  };

  const getAQILevel = (value) => {
    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy for Sensitive Groups";
    if (value <= 200) return "Unhealthy";
    if (value <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getAQIColor = (value) => {
    if (value <= 50) return "#55a84f";
    if (value <= 100) return "#a3c853";
    if (value <= 150) return "#f99049";
    if (value <= 200) return "#f65e5f";
    if (value <= 300) return "#a070b6";
    return "#a06a7b";
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const currentAQI = 157;
  const currentAQIColor = getAQIColor(currentAQI);
  const currentAQILevel = getAQILevel(currentAQI);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Kathmandu Air Quality Data...</p>
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay"></div>
      <header className="dashboard-header">
        <div className="breadcrumb">
         
         
        </div>
      </header>

      <div className="station-info">
        <div className="station-icon">
          <i className="fas fa-broadcast-tower"></i>
        </div>
        <span>8 Stations operated by 2 Contributors</span>
        <button className="station-details-btn"><i className="fas fa-chevron-right"></i></button>
      </div>

      <div className="main-dashboard">
        <div className="dashboard-row">
          <div className="current-data-section">
            <div className="current-aqi-card" style={{ borderColor: currentAQIColor }}>
              <div className="aqi-value" style={{ color: currentAQIColor }}>
                {currentAQI}
                <span className="aqi-level" style={{ backgroundColor: currentAQIColor }}>
                  {currentAQILevel}
                </span>
              </div>
              <div className="aqi-label">US AQI</div>
              <div className="face-icon">
                <svg viewBox="0 0 50 50" width="60" height="60">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="#000" strokeWidth="1.5"></circle>
                  <circle cx="16" cy="20" r="3" fill="#000"></circle>
                  <circle cx="34" cy="20" r="3" fill="#000"></circle>
                  <path d="M15,35 Q25,25 35,35" fill="none" stroke="#000" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="pollutant-main">
                <span>Main pollutant: PM2.5</span>
                <span className="pollutant-value">{aqiData.pm25} µg/m³</span>
              </div>
            </div>
            <div className="weather-card">
              <div className="weather-data">
                <div className="weather-row">
                  <div className="weather-item">
                    <i className="fas fa-temperature-high"></i>
                    <span>{aqiData.temperature}°</span>
                  </div>
                  <div className="weather-item">
                    <i className="fas fa-wind"></i>
                    <span>{aqiData.windSpeed} km/h</span>
                  </div>
                  <div className="weather-item">
                    <i className="fas fa-tint"></i>
                    <span>{aqiData.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="stations-section">
            <h2>Monitoring Stations</h2>
            <div className="stations-grid">
              {stationData.map((station, index) => (
                <div 
                  key={index} 
                  className="station-card"
                  style={{ borderColor: getAQIColor(station.aqi) }}
                >
                  <div className="station-header" style={{ backgroundColor: getAQIColor(station.aqi) }}>
                    <span className="station-aqi">{station.aqi}</span>
                    <span className="station-level">{getAQILevel(station.aqi)}</span>
                  </div>
                  <div className="station-body">
                    <h3>{station.name}</h3>
                    <div className="station-details">
                      <span>PM2.5: {station.pm25} µg/m³</span>
                      <span>Main: {station.dominantPollutant}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="pollutants-section">
            <h2>Pollutant Concentrations (µg/m³)</h2>
            <div className="pollutants-grid">
              {[
                { name: "PM2.5", value: aqiData.pm25, multiplier: 2, icon: "fas fa-smog" },
                { name: "PM10", value: aqiData.pm10, multiplier: 1.5, icon: "fas fa-cloud" },
                { name: "O₃", value: aqiData.o3, multiplier: 5, icon: "fas fa-sun" },
                { name: "NO₂", value: aqiData.no2, multiplier: 3, icon: "fas fa-industry" },
                { name: "SO₂", value: aqiData.so2, multiplier: 5, icon: "fas fa-smoke" },
                { name: "CO", value: aqiData.co, multiplier: 50, icon: "fas fa-car" },
              ].map((pollutant, index) => (
                <div
                  key={index}
                  className={`pollutant-card ${activePollutant === pollutant.name.toLowerCase() ? "active" : ""}`}
                  onClick={() =>
                    setActivePollutant(activePollutant === pollutant.name.toLowerCase() ? null : pollutant.name.toLowerCase())
                  }
                >
                  <div className="pollutant-header">
                    <i className={pollutant.icon}></i>
                    <span className="pollutant-name">{pollutant.name}</span>
                  </div>
                  <div className="pollutant-value">{pollutant.name === "CO" ? pollutant.value.toFixed(1) : pollutant.value}</div>
                  <div className="pollutant-bar">
                    <div
                      className="pollutant-bar-fill"
                      style={{
                        width: `${Math.min(100, pollutant.value * pollutant.multiplier)}%`,
                        backgroundColor: getAQIColor(pollutant.value * pollutant.multiplier),
                      }}
                    ></div>
                  </div>
                  {activePollutant === pollutant.name.toLowerCase() && (
                    <div className="pollutant-info">
                      {pollutant.name === "PM2.5" && "Fine particles that can penetrate deep into lungs and bloodstream"}
                      {pollutant.name === "PM10" && "Coarse dust particles that can irritate airways and cause respiratory issues"}
                      {pollutant.name === "O₃" && "Ground-level ozone that affects respiratory system and irritates lungs"}
                      {pollutant.name === "NO₂" && "Nitrogen dioxide mainly from vehicle emissions that can inflame airways"}
                      {pollutant.name === "SO₂" && "Sulfur dioxide from industrial processes causing respiratory problems"}
                      {pollutant.name === "CO" && "Carbon monoxide from incomplete combustion reducing oxygen delivery in the body"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="forecast-section">
            <div className="forecast-header">
              <h2>AQI Forecast</h2>
              <div className="forecast-tabs">
                <button
                  className={selectedTab === "today" ? "active" : ""}
                  onClick={() => setSelectedTab("today")}
                >
                  Today
                </button>
                <button
                  className={selectedTab === "tomorrow" ? "active" : ""}
                  onClick={() => setSelectedTab("tomorrow")}
                >
                  Tomorrow
                </button>
              </div>
            </div>
            <div className="forecast-content">
              {selectedTab === "today" ? (
                <>
                  <div className="hourly-forecast">
                    {hourlyPrediction.map((hour, index) => (
                      <div key={index} className="hourly-item">
                        <div className="hour-label">{hour.hour}</div>
                        <div
                          className="hour-aqi-bar"
                          style={{
                            height: `${Math.min(100, hour.aqi * 0.5)}%`,
                            backgroundColor: getAQIColor(hour.aqi),
                          }}
                          title={`AQI: ${hour.aqi} (${hour.level})
Dominant: ${hour.dominantPollutant}`}
                        >
                          <span className="hour-aqi-value">{hour.aqi}</span>
                        </div>
                        <span className="hour-pollutant">{hour.dominantPollutant}</span>
                      </div>
                    ))}
                  </div>
                  <div className="forecast-summary">
                    <h3>Today's Summary</h3>
                    <p>
                      Air quality is expected to remain in the Unhealthy range throughout most of the day. Peak pollution levels are forecasted around 18:00, when AQI may reach Very Unhealthy levels. The main pollutant is PM2.5 during daylight hours, with NO₂ becoming more prominent during evening hours.
                    </p>
                    <div className="forecast-recommendations">
                      <div className="recommendation-item">
                        <i className="fas fa-mask"></i>
                        <span>Wear a mask outdoors</span>
                      </div>
                      <div className="recommendation-item">
                        <i className="fas fa-home"></i>
                        <span>Close windows</span>
                      </div>
                      <div className="recommendation-item">
                        <i className="fas fa-running"></i>
                        <span>Avoid outdoor exercise</span>
                      </div>
                    </div>
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
                            height: `${Math.min(100, hour.aqi * 0.5)}%`,
                            backgroundColor: getAQIColor(hour.aqi),
                          }}
                          title={`AQI: ${hour.aqi} (${hour.level})
Dominant: ${hour.dominantPollutant}`}
                        >
                          <span className="hour-aqi-value">{hour.aqi}</span>
                        </div>
                        <span className="hour-pollutant">{hour.dominantPollutant}</span>
                      </div>
                    ))}
                  </div>
                  <div className="forecast-summary">
                    <h3>Tomorrow's Outlook</h3>
                    <p>
                      Tomorrow's air quality is expected to be slightly better than today, with AQI levels mostly in the Unhealthy for Sensitive Groups range. Morning rush hour will still see elevated levels, but overall pollution is forecasted to be about 10% lower than today.
                    </p>
                    <div className="forecast-recommendations">
                      <div className="recommendation-item">
                        <i className="fas fa-mask"></i>
                        <span>Sensitive groups should wear masks</span>
                      </div>
                      <div className="recommendation-item">
                        <i className="fas fa-window-close"></i>
                        <span>Keep windows closed during peak hours</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="health-recommendation">
            <h3>Health Recommendations</h3>
            <div className="recommendation-content">
              <div className="health-card unhealthy">
                <div className="health-icon"><i className="fas fa-exclamation-triangle"></i></div>
                <div className="health-text">
                  <h4>Unhealthy Air Quality</h4>
                  <p>Everyone may begin to experience health effects. Members of sensitive groups may experience more serious effects. People with heart or lung disease, older adults, children and teenagers should avoid prolonged or heavy exertion.</p>
                </div>
              </div>
            </div>
            <div className="recommendation-actions">
              <button className="action-btn mask-btn"><i className="fas fa-mask"></i> Wear Mask</button>
              <button className="action-btn indoor-btn"><i className="fas fa-home"></i> Stay Indoors</button>
              <button className="action-btn window-btn"><i className="fas fa-window-close"></i> Close Windows</button>
              <button className="action-btn filter-btn"><i className="fas fa-fan"></i> Use Air Purifier</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Data Sources</h4>
            <p>West Bengal State Pollution Control Board</p>
            <p>Central Pollution Control Board</p>
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="footer-section">
            <h4>About</h4>
            <p>The US AQI is EPA's index for reporting air quality.</p>
            <p>*AQI stands for Air Quality Index</p>
          </div>
          <div className="footer-section">
            <button className="go-back-button" onClick={handleGoBack}>
              <i className="fas fa-arrow-left"></i> Back to India Map
            </button>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Kathmandu Air Quality Monitoring | All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default KathmanduAQI;