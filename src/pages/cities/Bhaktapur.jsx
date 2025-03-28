// Kathmandu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTemperatureHigh, FaTint, FaWind, FaSun, FaLeaf, FaChartLine, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { GiModernCity, GiMountainRoad } from 'react-icons/gi';
import { MdOutlineAttractions, MdAir, MdRefresh } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import BG from '../../assets/BGGG.jpg';
import './CityPage.css';

function Kathmandu() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="kathmandu-page">
      {/* Hero Section */}
      <div className="kathmandu-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), url(${BG})` }}>
        <div className="hero-content">
          <h1>Kathmandu</h1>
          <p>Capital of Nepal - The City of Temples</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search any Location, City, State or Country" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="kathmandu-content">
        {/* Air Quality Section */}
        <section className="aqi-section">
          <div className="section-header">
            <h2>
              <MdAir className="title-icon" />
              Kathmandu Air Quality Index (AQI)
            </h2>
            <div className="last-updated">
              <MdRefresh className="refresh-icon" />
              Last Updated: {currentDate}
            </div>
          </div>

          <div className="aqi-main">
            <div className="aqi-value-container">
              <div className="aqi-value">117</div>
              <div className="aqi-status poor">Air Quality is Poor</div>
            </div>

            <div className="aqi-details">
              <div className="detail-item">
                <div className="detail-label">PM2.5</div>
                <div className="detail-value">42 µg/m³</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">PM10</div>
                <div className="detail-value">61 µg/m³</div>
              </div>
            </div>

            <div className="aqi-scale">
              <div className="scale-labels">
                <span>Good</span>
                <span>Moderate</span>
                <span>Poor</span>
                <span>Unhealthy</span>
                <span>Severe</span>
                <span>Hazardous</span>
              </div>
              <div className="scale-bar">
                <div className="segment excellent"></div>
                <div className="segment good"></div>
                <div className="segment poor active"></div>
                <div className="segment unhealthy"></div>
                <div className="segment severe"></div>
                <div className="segment hazardous"></div>
              </div>
              <div className="scale-numbers">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300</span>
                <span>500</span>
              </div>
            </div>

            <div className="ranking-info">
              Currently, Kathmandu ranks <span className="highlight">531st</span> in the Air Quality ranking
            </div>
          </div>
        </section>

        {/* Weather and Pollution Metrics */}
        <section className="metrics-section">
          <div className="weather-metrics">
            <div className="metric-card">
              <div className="metric-header">
                <FaTemperatureHigh className="metric-icon" />
                <h3>Weather</h3>
              </div>
              <div className="metric-values">
                <div className="weather-item">
                  <div className="weather-value">28 °C</div>
                  <div className="weather-label">Temperature</div>
                </div>
                <div className="weather-item">
                  <div className="weather-value">Mist</div>
                  <div className="weather-label">Conditions</div>
                </div>
                <div className="weather-item">
                  <div className="weather-value">37%</div>
                  <div className="weather-label">Humidity</div>
                </div>
                <div className="weather-item">
                  <div className="weather-value">12 km/h</div>
                  <div className="weather-label">Wind Speed</div>
                </div>
                <div className="weather-item">
                  <div className="weather-value">2</div>
                  <div className="weather-label">UV Index</div>
                </div>
              </div>
            </div>

            <div className="pollution-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <FaChartLine className="metric-icon" />
                  <h3>Pollution</h3>
                </div>
                <div className="pollution-grid">
                  <div className="pollution-item">
                    <div className="pollution-label">PM10</div>
                    <div className="pollution-value">61 µg/m³</div>
                  </div>
                  <div className="pollution-item">
                    <div className="pollution-label">CO</div>
                    <div className="pollution-value">0.5 mg/m³</div>
                  </div>
                  <div className="pollution-item">
                    <div className="pollution-label">SO₂</div>
                    <div className="pollution-value">4 µg/m³</div>
                  </div>
                  <div className="pollution-item">
                    <div className="pollution-label">NO₂</div>
                    <div className="pollution-value">12 µg/m³</div>
                  </div>
                  <div className="pollution-item">
                    <div className="pollution-label">O₃</div>
                    <div className="pollution-value">28 µg/m³</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* City Information Section */}
        <section className="city-info">
          <div className="section-header">
            <h2>
              <GiModernCity className="title-icon" />
              About Kathmandu
            </h2>
          </div>

          <p className="city-description">
            Kathmandu, the capital city of Nepal, is rich in cultural heritage and history. 
            Nestled in the Kathmandu Valley at an elevation of 1,400 meters, it serves as the 
            gateway to the Himalayas with breathtaking mountain views and ancient temples.
          </p>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-card-header">
                <GiMountainRoad className="info-card-icon" />
                <h3>Key Information</h3>
              </div>
              <ul className="info-list">
                <li>
                  <span className="info-label">Population:</span>
                  <span className="info-value">1.5 million</span>
                </li>
                <li>
                  <span className="info-label">Elevation:</span>
                  <span className="info-value">1,400m</span>
                </li>
                <li>
                  <span className="info-label">Language:</span>
                  <span className="info-value">Nepali, Newari</span>
                </li>
                <li>
                  <span className="info-label">Best Time to Visit:</span>
                  <span className="info-value">Oct-Dec</span>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <MdOutlineAttractions className="info-card-icon" />
                <h3>Major Attractions</h3>
              </div>
              <ul className="info-list">
                <li>Swayambhunath Stupa (Monkey Temple)</li>
                <li>Pashupatinath Temple</li>
                <li>Kathmandu Durbar Square</li>
                <li>Boudhanath Stupa</li>
                <li>Thamel District</li>
                <li>Garden of Dreams</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoIosArrowBack className="back-icon" />
          Back to Map
        </button>
      </div>
    </div>
  );
}

export default Kathmandu;