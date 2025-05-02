import React, { useState, useEffect } from "react";
import "./Kathmandu.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const Birgunj = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [airData, setAirData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [tomorrowData, setTomorrowData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Current air data
        const currentAirData = {
          aqi: 145,
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          pm25: 62.3,
          pm10: 108.7,
          o3: 41.5,
          no2: 28.9,
          so2: 15.8,
          co: 1.7
        };

        // Tomorrow's predicted data
        const tomorrowPrediction = {
          aqi: 138,
          pm25: 58.6,
          pm10: 102.4,
          o3: 39.2,
          no2: 26.7,
          so2: 14.9,
          co: 1.6
        };

        // Weather data
        const weather = {
          temperature: 29,
          windSpeed: 7,
          humidity: 58,
          condition: "Haze"
        };

        setAirData(currentAirData);
        setTomorrowData(tomorrowPrediction);
        setWeatherData(weather);
        setLoading(false);

        // Check if Birgunj is in favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
        setIsFavorite(favorites.includes('Birgunj'));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (isFavorite) {
      const updatedFavorites = favorites.filter(city => city !== 'Birgunj');
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    } else {
      favorites.push('Birgunj');
      localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#55a84f', advice: 'Air quality is satisfactory, enjoy outdoor activities.' };
    if (aqi <= 100) return { level: 'Moderate', color: '#a3c853', advice: 'Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#ffa07a', advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#f29c33', advice: 'Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion.' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#e93f33', advice: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.' };
    return { level: 'Hazardous', color: '#af2d24', advice: 'Health warnings of emergency conditions. The entire population is more likely to be affected. Stay indoors.' };
  };

  const getPollutionSources = () => {
    return {
      mainSources: ["Industrial emissions", "Border crossing traffic", "Construction dust", "Brick kilns"],
      description: "Birgunj, as Nepal's major industrial and trade hub, faces significant air quality challenges. The city's numerous factories, heavy border traffic with India, and ongoing construction projects contribute to high pollution levels. The flat terrain of the Terai region also limits natural dispersion of pollutants."
    };
  };

  const allCities = [
    { name: "Kathmandu", path: "/kathmandu" },
    { name: "Pokhara", path: "/pokhara" },
    { name: "Nepalgunj", path: "/nepalgunj" },
    { name: "Janakpur", path: "/janakpur" },
    { name: "Mahendranagar", path: "/mahendranagar" },
    { name: "Butwal", path: "/butwal" },
    { name: "Bhaktapur", path: "/bhaktapur" },
    { name: "Biratnagar", path: "/biratnagar" },
    { name: "Dharan", path: "/dharan" },
    { name: "Lalitpur", path: "/lalitpur" },
    { name: "Bharatpur", path: "/bharatpur" },
    { name: "Hetauda", path: "/hetauda" }
  ];

  if (loading) {
    return <div className="loading-container">Loading Birgunj's air quality data...</div>;
  }

  const currentAqiLevel = getAqiLevel(airData.aqi);
  const tomorrowAqiLevel = getAqiLevel(tomorrowData.aqi);
  const pollutionSources = getPollutionSources();

  return (
    <>
      <div className="birgunj-container">
        <div className="content-wrapper">
          <div className="header-section">
            <h1 className="head">Birgunj Air Quality</h1>
            <button 
              onClick={toggleFavorite} 
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
            </button>
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
            </div>
          </div>

          <div className="prediction-section">
            <div className="aqi-display tomorrow" style={{ backgroundColor: tomorrowAqiLevel.color }}>
              <h2>Tomorrow's Predicted AQI</h2>
              <div className="aqi-value">{tomorrowData.aqi}</div>
              <div className="aqi-level">{tomorrowAqiLevel.level}</div>
            </div>
            <div className="aqi-advice">
              <h3>Recommendation</h3>
              <p>
                {tomorrowData.aqi > 150 
                  ? "Air quality is expected to be poor. Vulnerable groups (children, elderly, respiratory patients) should plan to stay indoors as much as possible."
                  : tomorrowData.aqi > 100
                  ? "Moderate air quality expected. Sensitive individuals should consider limiting prolonged outdoor exertion."
                  : "Air quality should be acceptable for most individuals. Enjoy your day!"}
              </p>
            </div>
          </div>

          <div className="details-section">
            <h2 className="headerr">Pollution Details</h2>
            <div className="pollution-grid">
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#e3f2fd' }}>
                <h3>PM2.5</h3>
                <p className="animate-count">{airData.pm25}</p>
                <small>Fine particulate matter</small>
              </div>
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#e8f5e9' }}>
                <h3>PM10</h3>
                <p className="animate-count">{airData.pm10}</p>
                <small>Coarse particulate matter</small>
              </div>
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#fff8e1' }}>
                <h3>O₃</h3>
                <p className="animate-count">{airData.o3}</p>
                <small>Ozone</small>
              </div>
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#f3e5f5' }}>
                <h3>NO₂</h3>
                <p className="animate-count">{airData.no2}</p>
                <small>Nitrogen Dioxide</small>
              </div>
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#ffebee' }}>
                <h3>SO₂</h3>
                <p className="animate-count">{airData.so2}</p>
                <small>Sulfur Dioxide</small>
              </div>
              <div className="pollution-item hover-scale" style={{ backgroundColor: '#e0f7fa' }}>
                <h3>CO</h3>
                <p className="animate-count">{airData.co}</p>
                <small>Carbon Monoxide</small>
              </div>
            </div>
          </div>

          <div className="weather-section">
            <h2 className="headerr">Birgunj Weather</h2>
            <div className="weather-grid">
              <div className="weather-item hover-scale" style={{ backgroundColor: '#e1f5fe' }}>
                <h3>Temperature</h3>
                <p>{weatherData.temperature}°C</p>
              </div>
              <div className="weather-item hover-scale" style={{ backgroundColor: '#e8f5e9' }}>
                <h3>Wind Speed</h3>
                <p>{weatherData.windSpeed} km/h</p>
              </div>
              <div className="weather-item hover-scale" style={{ backgroundColor: '#f3e5f5' }}>
                <h3>Humidity</h3>
                <p>{weatherData.humidity}%</p>
              </div>
              <div className="weather-item hover-scale" style={{ backgroundColor: '#fff3e0' }}>
                <h3>Condition</h3>
                <p>{weatherData.condition}</p>
              </div>
            </div>
          </div>

          <div className="sources-section">
            <h2 className="headerr">Pollution Sources in Birgunj</h2>
            <h3>Main Contributors:</h3>
            <ul>
              {pollutionSources.mainSources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
            <p>{pollutionSources.description}</p>
          </div>

          <div className="other-cities">
            <h2 className="headerr">Other Cities in Nepal</h2>
            <div className="cities-grid">
              {allCities.map((city, index) => {
                const randomAqi = Math.floor(Math.random() * 200) + 50;
                const aqiLevel = getAqiLevel(randomAqi);
                return (
                  <div 
                    key={index} 
                    className="city-card hover-scale"
                    onClick={() => navigate(city.path)}
                    style={{ backgroundColor: '#f5f5f5' }}
                  >
                    <h3>{city.name}</h3>
                    <div className="aqi-badge" style={{ backgroundColor: aqiLevel.color }}>
                      {randomAqi}
                    </div>
                    <p style={{ color: aqiLevel.color, fontWeight: 'bold' }}>{aqiLevel.level}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Birgunj;