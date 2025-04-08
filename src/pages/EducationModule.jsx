import React, { useState } from "react";
import "./EducationModule.css";
import Footer from "../components/Footer";
import BG from '../assets/sky.jpg';
import { FiFeather } from 'react-icons/fi';

import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiExternalLink,
  FiInfo,
  FiAlertTriangle,
  FiHeart,
  FiShield,
  FiWind,
  FiDroplet,
  FiSun,
  FiCloud,
  FiActivity,
  FiCalendar,
  FiUsers,
  FiHome,
 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const EducationModule = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState('aqi');

  // Sample educational resources
  const News = [
    { url: "https://www.icimod.org/wp-content/uploads/302042345_451246337032785_4783566089841697782_n.jpg", title: "Himalayan Air Pollution" },
    { url: "https://idsb.tmgrup.com.tr/ly/uploads/images/2021/03/30/103883.jpg", title: "Urban Air Quality Challenges" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2020/news/DTezpgIVMAAXM-1603301636.jpg", title: "Kathmandu Valley Pollution" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/news/polutionphoto-1699320782.jpg", title: "Winter Pollution Crisis" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/opinion/downPostFilePhotoHemantaShrestha-1693965360.jpg", title: "Vehicle Emissions Impact" },
  ];

  const news = [
    {
      id: 1,
      title: "Dirty and Dangerous",
      link: "https://kathmandupost.com/editorial/2025/01/20/dirty-and-dangerous",
      img: "https://assets-api.kathmandupost.com/thumb.php?src=https://assets-cdn.kathmandupost.com/uploads/source/news/2025/opinion/POLLUTIONCHANDRAGIRIROAD01302019MG5019-1737382832.jpg&w=900&height=601",
    },
    {
      id: 2,
      title: "Bad Air and Polluted Politics",
      link: "https://nepalitimes.com/here-now/bad-air-and-polluted-politics",
      img: "https://publisher-publish.s3.eu-central-1.amazonaws.com/pb-nepalitimes/swp/asv65r/media/2024082916088_402651a446551098b08eac91d3aabc16b8562b17e18ea3c40953d272e0c54436.webp",
    },
    {
      id: 3,
      title: "Air Pollution Increasing in Kathmandu",
      link: "https://thehimalayantimes.com/kathmandu/air-pollution-increasing-in-kathmandu-valley",
      img: "https://cdn4.premiumread.com/?url=https://thehimalayantimes.com/thehimalayantimes/uploads/images/2025/01/06/37187.jpeg&w=800&q=100&f=jpg",
    },
    {
      id: 4,
      title: "Wild Fires Worsening Air Pollution",
      link: "https://risingnepaldaily.com/news/57350",
      img: "https://risingnepaldaily.com/storage/media/71472/Untitled-1.jpg",
    },
    {
      id: 5,
      title: "Pollution Level Rises As Winter Sets In",
      link: "https://www.aninews.in/news/world/asia/pollution-level-in-nepal-rises-as-winter-sets-in-concerns-mount-over-health-risks20241017135455/",
      img: "https://aniportalimages.s3.amazonaws.com/media/details/ANI-20241017075628.jpg",
    },
    {
      id: 6,
      title: "Pokhara Records Highest Air Pollution",
      link: "https://english.onlinekhabar.com/pokhara-records-highest-air-pollution-in-nepal-today.html",
      img: "https://english.onlinekhabar.com/wp-content/uploads/2025/01/Pokhara-pumdikot-Himalayas-7.jpg",
    },
    {
      id: 7,
      title: "Kathmandu Valley Air Quality Drops",
      link: "http://kathmandupost.com/climate-environment/2024/11/15/kathmandu-valley-s-air-quality-drops-as-stubble-burning-starts-in-india-and-nepal",
      img: "https://assets-api.kathmandupost.com/thumb.php?src=https://assets-cdn.kathmandupost.com/uploads/source/news/2024/health/Untitled4-1731634559.jpg&w=900&height=601",
    },
    {
      id: 8,
      title: "Air pollution in Shankha Park worst",
      link: "https://myrepublica.nagariknetwork.com/news/air-pollution-in-shankha-park-worst-82-77.html",
      img: "https://republicaimg.nagariknewscdn.com/shared/web/uploads/media/pollution_20191115080506.jpg",
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Understanding Air Quality Index (AQI)",
      description: "Learn about what AQI is, how it is calculated, and its significance in monitoring air pollution levels and their health impacts.",
      link: "https://www.epa.gov/air-quality-index",
    },
    {
      id: 2,
      title: "Effects of Air Pollution on Health",
      description: "Explore the wide-ranging health impacts of poor air quality and discover effective strategies to protect yourself and your loved ones.",
      link: "https://www.who.int/health-topics/air-pollution",
    },
    {
      id: 3,
      title: "Air Quality Monitoring in Nepal",
      description: "Discover how air quality is monitored in Nepal, the challenges faced, and initiatives to improve environmental monitoring systems.",
      link: "https://nepalairquality.com",
    },
  ];

  const aqiScale = [
    { range: "0-50", level: "Good", color: "#00E400", description: "Air quality is satisfactory, and air pollution poses little or no risk." },
    { range: "51-100", level: "Moderate", color: "#FFFF00", description: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution." },
    { range: "101-150", level: "Unhealthy for Sensitive Groups", color: "#FF7E00", description: "Members of sensitive groups may experience health effects. The general public is less likely to be affected." },
    { range: "151-200", level: "Unhealthy", color: "#FF0000", description: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects." },
    { range: "201-300", level: "Very Unhealthy", color: "#8F3F97", description: "Health alert: The risk of health effects is increased for everyone." },
    { range: "301-500", level: "Hazardous", color: "#7E0023", description: "Health warning of emergency conditions: everyone is more likely to be affected." }
  ];

  const pollutants = [
    {
      name: "PM2.5",
      icon: <FiWind size={24} />,
      sources: "Vehicle emissions, industrial processes, wildfires, power plants",
      health: "Respiratory issues, cardiovascular disease, premature death",
      safeLevel: "Annual mean: ≤ 10 μg/m³, 24-hour mean: ≤ 25 μg/m³ (WHO)"
    },
    {
      name: "PM10",
      icon: <FiCloud size={24} />,
      sources: "Dust from roads, construction sites, agriculture, industrial emissions",
      health: "Aggravated asthma, decreased lung function, respiratory symptoms",
      safeLevel: "Annual mean: ≤ 20 μg/m³, 24-hour mean: ≤ 50 μg/m³ (WHO)"
    },
    {
      name: "Ozone (O₃)",
      icon: <FiSun size={24} />,
      sources: "Chemical reactions between oxides of nitrogen (NOx) and volatile organic compounds (VOCs)",
      health: "Coughing, throat irritation, worsening of asthma, reduced lung function",
      safeLevel: "8-hour mean: ≤ 100 μg/m³ (WHO)"
    },
    {
      name: "Nitrogen Dioxide (NO₂)",
      icon: <FiActivity size={24} />,
      sources: "Vehicle emissions, power plants, industrial combustion",
      health: "Respiratory infections, reduced lung function, increased asthma symptoms",
      safeLevel: "Annual mean: ≤ 10 μg/m³, 1-hour mean: ≤ 200 μg/m³ (WHO)"
    },
    {
      name: "Sulfur Dioxide (SO₂)",
      icon: <FiDroplet size={24} />,
      sources: "Burning of fossil fuels (coal and oil), industrial processes",
      health: "Respiratory symptoms, aggravation of asthma, chronic bronchitis",
      safeLevel: "24-hour mean: ≤ 20 μg/m³, 10-minute mean: ≤ 500 μg/m³ (WHO)"
    },
    {
      name: "Carbon Monoxide (CO)",
      icon: <FiAlertTriangle size={24} />,
      sources: "Vehicle exhaust, incomplete combustion of fuels",
      health: "Reduced oxygen delivery to organs, cardiovascular effects, headaches",
      safeLevel: "24-hour mean: ≤ 4 mg/m³, 15-minute mean: ≤ 100 mg/m³ (WHO)"
    }
  ];

  const healthEffects = [
    {
      group: "Children",
      icon: <FiUsers size={24} />,
      effects: [
        "Impaired lung development",
        "Increased respiratory infections",
        "Higher risk of developing asthma",
        "Reduced lung function that may persist into adulthood"
      ]
    },
    {
      group: "Elderly",
      icon: <FiHeart size={24} />,
      effects: [
        "Increased risk of heart attacks",
        "Worsening of existing heart or lung disease",
        "Higher susceptibility to respiratory infections",
        "Increased mortality from cardiovascular and respiratory causes"
      ]
    },
    {
      group: "Pregnant Individuals",
      icon: <FiUsers size={24} />,
      effects: [
        "Increased risk of preterm birth",
        "Low birth weight",
        "Potential impacts on fetal brain development",
        "Higher risk of pregnancy complications"
      ]
    },
    {
      group: "People with Asthma/Heart Conditions",
      icon: <FiActivity size={24} />,
      effects: [
        "Increased frequency and severity of asthma attacks",
        "Worsening of chronic obstructive pulmonary disease (COPD)",
        "Increased hospital admissions",
        "Higher risk of heart attacks and strokes"
      ]
    }
  ];

  const protectionTips = [
    {
      title: "During High AQI Days",
      icon: <FiAlertTriangle size={24} />,
      tips: [
        "Limit outdoor activities, especially strenuous exercise",
        "Keep windows and doors closed",
        "Use air purifiers with HEPA filters",
        "Stay hydrated to help your body flush out toxins"
      ]
    },
    {
      title: "Proper Mask Usage",
      icon: <FiShield size={24} />,
      tips: [
        "Use N95 or KN95 masks for proper filtration",
        "Ensure proper fit with no gaps around edges",
        "Replace masks regularly (every 40 hours or when soiled)",
        "Avoid masks with valves as they don't filter exhaled air"
      ]
    },
    {
      title: "Indoor Air Quality",
      icon: <FiHome size={24} />,
      tips: [
        "Use indoor plants like spider plants or peace lilies",
        "Avoid burning candles or incense indoors",
        "Use exhaust fans when cooking",
        "Regularly clean to reduce dust accumulation"
      ]
    },
    {
      title: "Smart Planning",
      icon: <FiCalendar size={24} />,
      tips: [
        "Check AQI forecasts before planning outdoor activities",
        "Schedule outdoor activities for early morning when pollution is lower",
        "Avoid high-traffic areas when possible",
        "Consider indoor alternatives for exercise on bad air days"
      ]
    }
  ];

  const pollutionSources = [
    {
      source: "Vehicle Emissions",
      description: "Major contributor in urban areas, especially from older diesel vehicles without proper emission controls."
    },
    {
      source: "Brick Kilns",
      description: "Traditional brick kilns around Kathmandu Valley burn coal and other fuels, releasing large amounts of particulate matter."
    },
    {
      source: "Dust from Roads/Construction",
      description: "Unpaved roads and construction sites generate significant amounts of PM10, especially during dry seasons."
    },
    {
      source: "Open Burning",
      description: "Burning of agricultural waste, garbage, and forest fires contribute significantly to air pollution."
    },
    {
      source: "Industrial Emissions",
      description: "Factories and small industries often lack proper pollution control technologies."
    },
    {
      source: "Transboundary Pollution",
      description: "During certain seasons, pollution from neighboring countries affects Nepal's air quality."
    }
  ];

  const communityActions = [
    {
      action: "Use Alternative Transportation",
      icon: <FiArrowRight size={20} />,
      description: "Carpool, use public transport, bike, or walk to reduce vehicle emissions."
    },
    {
      action: "Plant Trees",
      iicon: <FiFeather size={20} />,
      description: "Participate in tree planting initiatives to help filter air pollutants."
    },
    {
      action: "Educate Others",
      icon: <FiInfo size={20} />,
      description: "Share information about air quality and its impacts with your community."
    },
    {
      action: "Report Violations",
      icon: <FiAlertTriangle size={20} />,
      description: "Report illegal burning or industrial emissions to local authorities."
    },
    {
      action: "Energy Conservation",
      icon: <FiSun size={20} />,
      description: "Reduce energy consumption to decrease demand for polluting power sources."
    },
    {
      action: "Support Clean Air Policies",
      icon: <FiShield size={20} />,
      description: "Advocate for and support policies that improve air quality standards."
    }
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? News.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === News.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="education-module" style={{ backgroundImage: `url(${BG})` }}>
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <div className="slider-container">
          <div className="slider-wrapper">
            <button className="slider-arrow left" onClick={goToPrevious}>
              <FiArrowLeft size={32} />
            </button>
            <div 
              className="slide"
              style={{ backgroundImage: `url(${News[currentIndex].url})` }}
            >
              <div className="slide-overlay">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="slide-title"
                >
                  {News[currentIndex].title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="slide-subtitle"
                >
                  Stay informed about air quality issues in Nepal
                </motion.p>
              </div>
            </div>
            <button className="slider-arrow right" onClick={goToNext}>
              <FiArrowRight size={32} />
            </button>
          </div>
          <div className="slider-dots">
            {News.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Education Tabs Section */}
      <section className="education-tabs-section">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Air Quality Education</h2>
            <p className="section-description">
              Learn about air quality, its impacts, and how to protect yourself and your community.
            </p>
          </motion.div>

          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'aqi' ? 'active' : ''}`}
                onClick={() => setActiveTab('aqi')}
              >
                <FiInfo className="tab-icon" /> What is AQI?
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pollutants' ? 'active' : ''}`}
                onClick={() => setActiveTab('pollutants')}
              >
                <FiAlertTriangle className="tab-icon" /> Major Pollutants
              </button>
              <button 
                className={`tab-btn ${activeTab === 'measurement' ? 'active' : ''}`}
                onClick={() => setActiveTab('measurement')}
              >
                <FiActivity className="tab-icon" /> Measurement in Nepal
              </button>
              <button 
                className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
              >
                <FiHeart className="tab-icon" /> Health Effects
              </button>
              <button 
                className={`tab-btn ${activeTab === 'protection' ? 'active' : ''}`}
                onClick={() => setActiveTab('protection')}
              >
                <FiShield className="tab-icon" /> Protection Tips
              </button>
              <button 
                className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                <FiWind className="tab-icon" /> Pollution Sources
              </button>
              <button 
                className={`tab-btn ${activeTab === 'action' ? 'active' : ''}`}
                onClick={() => setActiveTab('action')}
              >
                <FiUsers className="tab-icon" /> Community Action
              </button>
            </div>

            <motion.div 
              className="tab-content"
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              {activeTab === 'aqi' && (
                <div className="aqi-content">
                  <div className="aqi-intro">
                    <div className="aqi-icon">
                      <FiInfo size={48} />
                    </div>
                    <div className="aqi-text">
                      <h3>What is the Air Quality Index (AQI)?</h3>
                      <p>
                        The Air Quality Index (AQI) is a numerical scale used to communicate how polluted the air currently is or how polluted it is forecast to become. It transforms complex air quality data into an easy-to-understand format that helps people make decisions about their outdoor activities.
                      </p>
                    </div>
                  </div>

                  <div className="aqi-scale">
                    <h3>AQI Scale (0-500)</h3>
                    <div className="scale-chart">
                      {aqiScale.map((item, index) => (
                        <div 
                          key={index}
                          className="scale-level"
                          style={{ backgroundColor: item.color }}
                        >
                          <span className="level-range">{item.range}</span>
                          <span className="level-name">{item.level}</span>
                          <div className="level-tooltip">
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="aqi-legend">
                    <h3>AQI Color Legend</h3>
                    <div className="legend-grid">
                      {aqiScale.map((item, index) => (
                        <div key={index} className="legend-item">
                          <div 
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="legend-text">
                            <strong>{item.level} ({item.range})</strong>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pollutants' && (
                <div className="pollutants-content">
                  <h3>Major Air Pollutants and Their Impacts</h3>
                  <p className="pollutants-intro">
                    Air pollution consists of various harmful substances that can affect human health and the environment. Below are the key pollutants monitored in air quality indices:
                  </p>
                  
                  <div className="pollutants-grid">
                    {pollutants.map((pollutant, index) => (
                      <motion.div 
                        key={index}
                        className="pollutant-card"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        <div className="pollutant-header">
                          <div className="pollutant-icon">
                            {pollutant.icon}
                          </div>
                          <h4>{pollutant.name}</h4>
                        </div>
                        <div className="pollutant-details">
                          <div className="detail-item">
                            <strong>Main Sources:</strong>
                            <p>{pollutant.sources}</p>
                          </div>
                          <div className="detail-item">
                            <strong>Health Impacts:</strong>
                            <p>{pollutant.health}</p>
                          </div>
                          <div className="detail-item">
                            <strong>Safe Levels (WHO):</strong>
                            <p>{pollutant.safeLevel}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'measurement' && (
                <div className="measurement-content">
                  <h3>How AQI is Measured in Nepal</h3>
                  
                  <div className="measurement-grid">
                    <div className="measurement-card">
                      <div className="measurement-icon">
                        <FiActivity size={32} />
                      </div>
                      <h4>Monitoring Stations</h4>
                      <p>
                        Nepal's Department of Environment operates several air quality monitoring stations across the country, primarily in urban areas like Kathmandu, Pokhara, and Biratnagar. These stations use sophisticated sensors to measure concentrations of key pollutants.
                      </p>
                    </div>
                    
                    <div className="measurement-card">
                      <div className="measurement-icon">
                        <FiCalendar size={32} />
                      </div>
                      <h4>Real-time vs Forecasted Data</h4>
                      <p>
                        Real-time data comes from ground stations providing current conditions, while forecasted data uses models incorporating weather patterns, historical trends, and satellite observations to predict future air quality.
                      </p>
                    </div>
                    
                    <div className="measurement-card">
                      <div className="measurement-icon">
                        <FiCloud size={32} />
                      </div>
                      <h4>Technology Used</h4>
                      <p>
                        Nepal utilizes a combination of reference-grade monitors, low-cost sensors, satellite remote sensing, and increasingly, machine learning algorithms to improve data accuracy and fill gaps in monitoring coverage.
                      </p>
                    </div>
                  </div>
                  
                  <div className="measurement-note">
                    <p>
                      <strong>Note:</strong> While monitoring has improved, Nepal still faces challenges with limited stations outside major cities and occasional data gaps due to technical or resource constraints.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="health-content">
                  <h3>Health Effects of Poor Air Quality</h3>
                  <p className="health-intro">
                    Air pollution affects different groups of people in various ways. Some populations are particularly vulnerable to its harmful effects:
                  </p>
                  
                  <div className="health-grid">
                    {healthEffects.map((group, index) => (
                      <motion.div 
                        key={index}
                        className="health-card"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        <div className="health-header">
                          <div className="health-icon">
                            {group.icon}
                          </div>
                          <h4>{group.group}</h4>
                        </div>
                        <ul className="health-effects">
                          {group.effects.map((effect, i) => (
                            <li key={i}>{effect}</li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="prevention-tips">
                    <h4>Basic Prevention Tips for All:</h4>
                    <ul>
                      <li>Check daily air quality forecasts in your area</li>
                      <li>Limit outdoor exercise when air quality is poor</li>
                      <li>Create a clean room at home with good filtration</li>
                      <li>Stay hydrated to help your body eliminate toxins</li>
                      <li>Consult your doctor about extra precautions if you're in a high-risk group</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'protection' && (
                <div className="protection-content">
                  <h3>How to Protect Yourself from Air Pollution</h3>
                  
                  <div className="protection-grid">
                    {protectionTips.map((tip, index) => (
                      <motion.div 
                        key={index}
                        className="protection-card"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        <div className="protection-header">
                          <div className="protection-icon">
                            {tip.icon}
                          </div>
                          <h4>{tip.title}</h4>
                        </div>
                        <ul className="protection-tips">
                          {tip.tips.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="protection-resources">
                    <h4>Recommended AQI Resources:</h4>
                    <ul>
                      <li>IQAir AirVisual app</li>
                      <li>World Air Quality Index website</li>
                      <li>Nepal Department of Environment reports</li>
                      <li>Local weather and environment news</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'sources' && (
                <div className="sources-content">
                  <h3>Major Sources of Air Pollution in Nepal</h3>
                  
                  <div className="sources-grid">
                    {pollutionSources.map((source, index) => (
                      <motion.div 
                        key={index}
                        className="source-card"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        <h4>{source.source}</h4>
                        <p>{source.description}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="sources-seasonal">
                    <h4>Seasonal Variations:</h4>
                    <p>
                      Air pollution in Nepal varies significantly by season. Winter months (December-February) typically see the worst air quality due to temperature inversions that trap pollutants, increased biomass burning for heating, and reduced rainfall to clear the air. The monsoon season (June-September) generally has better air quality due to frequent rains that wash away pollutants.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'action' && (
                <div className="action-content">
                  <h3>What You Can Do (Community Action)</h3>
                  <p className="action-intro">
                    Individual and community actions can significantly improve air quality. Here are ways you can contribute:
                  </p>
                  
                  <div className="action-grid">
                    {communityActions.map((action, index) => (
                      <motion.div 
                        key={index}
                        className="action-card"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        <div className="action-icon">
                          {action.icon}
                        </div>
                        <div className="action-text">
                          <h4>{action.action}</h4>
                          <p>{action.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="action-callout">
                    <h4>Get Involved:</h4>
                    <p>
                      Consider joining or supporting local environmental organizations working on air quality issues. Participate in citizen science projects that monitor air pollution. Advocate for cleaner air policies with local representatives. Small individual actions, when multiplied across communities, can create significant positive change.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Latest News on Air Quality</h2>
            <p className="section-description">
              Stay updated with the most recent news articles about air pollution in Nepal and its impacts.
            </p>
          </motion.div>

          <motion.div 
            className="news-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {news.map((item) => (
              <motion.div 
                key={item.id}
                className="news-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="news-image-container">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="news-image"
                  />
                  <div className={`news-overlay ${hoveredCard === item.id ? 'active' : ''}`}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      Read Article <FiExternalLink />
                    </a>
                  </div>
                </div>
                <h3 className="news-title">{item.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Educational Resources</h2>
            <p className="section-description">
              Explore comprehensive materials to deepen your understanding of air quality and its environmental impact.
            </p>
          </motion.div>

          <motion.div 
            className="resources-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resources.map((resource) => (
              <motion.div 
                key={resource.id}
                className="resource-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="resource-content">
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Learn More <FiExternalLink />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationModule;