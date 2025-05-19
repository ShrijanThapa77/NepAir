import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Kathmandu.css";
import Footer from "../../components/Footer";

const Kathmandu = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [airData, setAirData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [tomorrowData, setTomorrowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predictions/Kathmandu');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Format dates
        const formatDate = (isoString) => {
          const date = new Date(isoString);
          return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        };

        // Current air data
        const currentAirData = {
          aqi: data.current.aqi,
          date: formatDate(data.current.timestamp),
          pm25: data.current.pm25,
          pm10: data.current.pm10,
          o3: data.current.o3,
          no2: data.current.no2,
          so2: data.current.so2,
          co: data.current.co
        };

        // Tomorrow's predicted data
        const tomorrowPrediction = {
          aqi: data.prediction.aqi,
          pm25: data.prediction.pm25,
          date: "Tomorrow, " + formatDate(data.prediction.timestamp).split(',')[1]
        };

        // Mock weather data (replace with real API if available)
        const weather = {
          temperature: Math.round(18 + Math.random() * 10), // Random temp between 18-28°C
          windSpeed: Math.round(5 + Math.random() * 10),    // Random wind 5-15 km/h
          humidity: Math.round(50 + Math.random() * 30),    // Random humidity 50-80%
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)]
        };

        setAirData(currentAirData);
        setTomorrowData(tomorrowPrediction);
        setWeatherData(weather);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);

        // Check favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
        setIsFavorite(favorites.includes('Kathmandu'));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (isFavorite) {
      const updatedFavorites = favorites.filter(city => city !== 'Kathmandu');
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    } else {
      favorites.push('Kathmandu');
      localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return { 
      level: 'Good', 
      color: '#55a84f', 
      advice: 'Air quality is satisfactory, enjoy outdoor activities.' 
    };
    if (aqi <= 100) return { 
      level: 'Moderate', 
      color: '#a3c853', 
      advice: 'Air quality is acceptable. Sensitive people should reduce prolonged outdoor exertion.' 
    };
    if (aqi <= 150) return { 
      level: 'Unhealthy for Sensitive Groups', 
      color: '#ffa07a', 
      advice: 'Members of sensitive groups may experience health effects.' 
    };
    if (aqi <= 200) return { 
      level: 'Unhealthy', 
      color: '#f29c33', 
      advice: 'Everyone may begin to experience health effects.' 
    };
    if (aqi <= 300) return { 
      level: 'Very Unhealthy', 
      color: '#e93f33', 
      advice: 'Health alert: everyone may experience serious health effects.' 
    };
    return { 
      level: 'Hazardous', 
      color: '#af2d24', 
      advice: 'Emergency conditions. Entire population affected. Stay indoors.' 
    };
  };

  const getPollutionSources = () => {
    return {
      mainSources: ["Vehicle emissions", "Road dust", "Brick kilns", "Construction activities"],
      description: "Kathmandu's air pollution comes from rapid urbanization, vehicle emissions, and industrial activities. The valley's geography traps pollutants, especially during winter."
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Kathmandu's air quality data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!airData || !tomorrowData) {
    return (
      <div className="error-container">
        <h2>Data Not Available</h2>
        <p>Unable to retrieve air quality data at this time.</p>
      </div>
    );
  }

  const currentAqiLevel = getAqiLevel(airData.aqi);
  const tomorrowAqiLevel = getAqiLevel(tomorrowData.aqi);
  const pollutionSources = getPollutionSources();

  return (
    <>
      <div className="kathmandu-container">
        <div className="content-wrapper">
          <div className="header-section">
            <h1 className="head">Kathmandu Air Quality</h1>
            <button 
              onClick={toggleFavorite}
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
            </button>
            <div className="last-updated">Last updated: {lastUpdated}</div>
          </div>

          <div className="aqi-section">
            <div className="aqi-display" style={{ backgroundColor: currentAqiLevel.color }}>
              <h2>Current Air Quality Index</h2>
              <div className="aqi-value">{airData.aqi}</div>
              <div className="aqi-level">{currentAqiLevel.level}</div>
              <div className="aqi-date">{airData.date}</div>
            </div>
            
            <div className="aqi-advice">
              <h3>Health Advice</h3>
              <p>{currentAqiLevel.advice}</p>
              <div className="pollutant-value">
                <span className="pollutant-label">PM2.5:</span>
                <span className="pollutant-number">{airData.pm25.toFixed(1)} µg/m³</span>
              </div>
            </div>
          </div>

          <div className="prediction-section">
            <div className="aqi-display tomorrow" style={{ backgroundColor: tomorrowAqiLevel.color }}>
              <h2>Tomorrow's Prediction</h2>
              <div className="aqi-value">{tomorrowData.aqi}</div>
              <div className="aqi-level">{tomorrowAqiLevel.level}</div>
              <div className="aqi-date">{tomorrowData.date}</div>
            </div>
            <div className="aqi-advice">
              <h3>Recommendation</h3>
              <p>
                {tomorrowData.aqi > 150 
                  ? "Air quality is expected to be poor. Vulnerable groups should plan to stay indoors."
                  : tomorrowData.aqi > 100
                  ? "Moderate air quality expected. Sensitive individuals should limit outdoor exertion."
                  : "Air quality should be acceptable for most individuals."}
              </p>
              <div className="pollutant-value">
                <span className="pollutant-label">PM2.5:</span>
                <span className="pollutant-number">{tomorrowData.pm25.toFixed(1)} µg/m³</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2 className="headerr">Current Pollution Levels</h2>
            <div className="pollution-grid">
              <div className="pollution-item">
                <h3>PM10</h3>
                <p className="animate-count">{airData.pm10.toFixed(1)}</p>
                <small>Coarse particles (µg/m³)</small>
              </div>
              <div className="pollution-item">
                <h3>O₃</h3>
                <p className="animate-count">{airData.o3.toFixed(1)}</p>
                <small>Ozone (ppb)</small>
              </div>
              <div className="pollution-item">
                <h3>NO₂</h3>
                <p className="animate-count">{airData.no2.toFixed(1)}</p>
                <small>Nitrogen Dioxide (ppb)</small>
              </div>
              <div className="pollution-item">
                <h3>SO₂</h3>
                <p className="animate-count">{airData.so2.toFixed(1)}</p>
                <small>Sulfur Dioxide (ppb)</small>
              </div>
              <div className="pollution-item">
                <h3>CO</h3>
                <p className="animate-count">{airData.co.toFixed(1)}</p>
                <small>Carbon Monoxide (ppm)</small>
              </div>
            </div>
          </div>

          <div className="weather-section">
            <h2 className="headerr">Current Weather</h2>
            <div className="weather-grid">
              <div className="weather-item">
                <h3>Temperature</h3>
                <p>{weatherData.temperature}°C</p>
              </div>
              <div className="weather-item">
                <h3>Wind Speed</h3>
                <p>{weatherData.windSpeed} km/h</p>
              </div>
              <div className="weather-item">
                <h3>Humidity</h3>
                <p>{weatherData.humidity}%</p>
              </div>
              <div className="weather-item">
                <h3>Condition</h3>
                <p>{weatherData.condition}</p>
              </div>
            </div>
          </div>

          <div className="sources-section">
            <h2 className="headerr">Pollution Sources in Kathmandu</h2>
            <div className="sources-content">
              <h3>Main Contributors:</h3>
              <ul>
                {pollutionSources.mainSources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
              <p>{pollutionSources.description}</p>
            </div>
          </div>

          <div className="health-tips">
            <h2 className="headerr">Health Tips</h2>
            <div className="tips-grid">
              <div className="tip-item">
                <h3>When AQI is High</h3>
                <ul>
                  <li>Limit outdoor activities</li>
                  <li>Keep windows closed</li>
                  <li>Use air purifiers</li>
                  <li>Wear N95 masks outside</li>
                </ul>
              </div>
              <div className="tip-item">
                <h3>General Advice</h3>
                <ul>
                  <li>Monitor air quality daily</li>
                  <li>Plan outdoor activities for cleaner times</li>
                  <li>Stay hydrated</li>
                  <li>Be aware of symptoms like coughing or difficulty breathing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Kathmandu;