import React, { useState } from "react";
import "./EducationModule.css";
import Footer from "../components/Footer";
import { FiFeather } from 'react-icons/fi';
import BG from '../assets/sky.jpg';

import { motion } from 'framer-motion';

const EducationModule = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState('intro');

  // Hero slider images
  const News = [
    { url: "https://www.icimod.org/wp-content/uploads/302042345_451246337032785_4783566089841697782_n.jpg", title: "Himalayan Air Pollution" },
    { url: "https://idsb.tmgrup.com.tr/ly/uploads/images/2021/03/30/103883.jpg", title: "Urban Air Quality Challenges" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2020/news/DTezpgIVMAAXM-1603301636.jpg", title: "Kathmandu Valley Pollution" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/news/polutionphoto-1699320782.jpg", title: "Winter Pollution Crisis" },
  ];

  // News articles
  const news = [
    {
      id: 1,
      title: "Kathmandu's Air Quality Crisis",
      link: "https://kathmandupost.com",
      img: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/news/polutionphoto-1699320782.jpg"
    },
    {
      id: 2,
      title: "Wildfires Worsen Air Pollution",
      link: "https://nepalitimes.com",
      img: "https://www.icimod.org/wp-content/uploads/302042345_451246337032785_4783566089841697782_n.jpg"
    },
    {
      id: 3,
      title: "Vehicle Emissions Impact",
      link: "https://thehimalayantimes.com",
      img: "https://assets-cdn.kathmandupost.com/uploads/source/news/2020/news/DTezpgIVMAAXM-1603301636.jpg"
    },
  ];

  // Educational resources
  const resources = [
    {
      id: 1,
      title: "Understanding AQI",
      description: "Learn how the Air Quality Index works and how to interpret the readings.",
      link: "https://www.epa.gov/air-quality-index"
    },
    {
      id: 2,
      title: "Health Impacts Guide",
      description: "Comprehensive information on how air pollution affects different age groups.",
      link: "https://www.who.int/health-topics/air-pollution"
    },
    {
      id: 3,
      title: "Nepal Air Quality Data",
      description: "Real-time and historical air quality data for Nepal.",
      link: "https://nepalairquality.com"
    },
  ];

  // AQI Scale data
  const aqiScale = [
    { range: "0-50", level: "Good", color: "#00E400", description: "Air quality is satisfactory with minimal health risk." },
    { range: "51-100", level: "Moderate", color: "#FFFF00", description: "Acceptable quality, but some pollutants may affect sensitive individuals." },
    { range: "101-150", level: "Unhealthy for Sensitive", color: "#FF7E00", description: "General public not likely affected but sensitive groups may experience symptoms." },
    { range: "151-200", level: "Unhealthy", color: "#FF0000", description: "Everyone may begin to experience health effects." },
    { range: "201-300", level: "Very Unhealthy", color: "#8F3F97", description: "Health warnings of emergency conditions." },
    { range: "301-500", level: "Hazardous", color: "#7E0023", description: "Health alert: everyone may experience serious health effects." }
  ];

  // Pollutant information
  const pollutants = [
    {
      name: "PM2.5",
      
      sources: "Vehicle emissions, industrial processes, wildfires",
      health: "Respiratory issues, cardiovascular disease, premature death",
      safeLevel: "≤ 10 μg/m³ (annual mean)"
    },
    {
      name: "PM10",
   
      sources: "Dust from roads, construction sites, agriculture",
      health: "Aggravated asthma, decreased lung function",
      safeLevel: "≤ 20 μg/m³ (annual mean)"
    },
    {
      name: "O₃",
      
      sources: "Chemical reactions between NOx and VOCs in sunlight",
      health: "Coughing, throat irritation, worsened asthma",
      safeLevel: "≤ 100 μg/m³ (8-hour mean)"
    },
    {
      name: "NO₂",
     
      sources: "Vehicle emissions, power plants, industrial combustion",
      health: "Respiratory infections, increased asthma symptoms",
      safeLevel: "≤ 10 μg/m³ (annual mean)"
    },
    {
      name: "SO₂",
      
      sources: "Burning of fossil fuels, industrial processes",
      health: "Respiratory symptoms, chronic bronchitis",
      safeLevel: "≤ 20 μg/m³ (24-hour mean)"
    },
    {
      name: "CO",
      
      sources: "Vehicle exhaust, incomplete combustion",
      health: "Reduced oxygen delivery, cardiovascular effects",
      safeLevel: "≤ 4 mg/m³ (24-hour mean)"
    }
  ];

  // Health effects by group
  const healthEffects = [
    {
      group: "Children",
      
      effects: [
        "Impaired lung development",
        "Increased respiratory infections",
        "Higher asthma risk",
        "Reduced lung function"
      ]
    },
    {
      group: "Elderly",
      
      effects: [
        "Increased heart attack risk",
        "Worsening heart/lung disease",
        "Higher susceptibility to infections",
        "Increased mortality"
      ]
    },
    {
      group: "Pregnant Women",
     
      effects: [
        "Preterm birth risk",
        "Low birth weight",
        "Fetal brain impacts",
        "Pregnancy complications"
      ]
    },
    {
      group: "Asthma/Heart Patients",
      
      effects: [
        "More severe asthma attacks",
        "Worsened COPD",
        "Increased hospitalizations",
        "Higher heart attack risk"
      ]
    }
  ];

  // Protection tips
  const protectionTips = [
    {
      title: "High AQI Days",
      
      tips: [
        "Limit outdoor activities",
        "Keep windows closed",
        "Use air purifiers",
        "Stay hydrated"
      ]
    },
    {
      title: "Mask Usage",
     
      tips: [
        "Use N95/KN95 masks",
        "Ensure proper fit",
        "Replace regularly",
        "Avoid valved masks"
      ]
    },
    {
      title: "Indoor Air",
    
      tips: [
        "Add air-purifying plants",
        "Avoid indoor burning",
        "Use exhaust fans",
        "Regular cleaning"
      ]
    },
    {
      title: "Smart Planning",
      
      tips: [
        "Check AQI forecasts",
        "Morning outdoor activities",
        "Avoid high-traffic areas",
        "Indoor exercise options"
      ]
    }
  ];

  // Pollution sources in Nepal
  const pollutionSources = [
    {
      source: "Vehicle Emissions",
      description: "Major urban contributor, especially from older diesel vehicles without proper emission controls."
    },
    {
      source: "Brick Kilns",
      description: "Traditional kilns burning coal and fuels, releasing large particulate matter amounts."
    },
    {
      source: "Road/Construction Dust",
      description: "Unpaved roads and construction generate significant PM10, especially in dry seasons."
    },
    {
      source: "Open Burning",
      description: "Agricultural waste, garbage, and forest fires contribute substantially to pollution."
    },
    {
      source: "Industrial Emissions",
      description: "Factories often lack proper pollution control technologies."
    },
    {
      source: "Transboundary Pollution",
      description: "Seasonal pollution from neighboring countries affects Nepal's air quality."
    }
  ];

  // Community actions
  const communityActions = [
    {
      action: "Alternative Transport",
      
      description: "Carpool, use public transport, bike, or walk to reduce emissions."
    },
    {
      action: "Plant Trees",
      
      description: "Join tree planting initiatives to help filter air pollutants."
    },
    {
      action: "Educate Others",
      
      description: "Share air quality information with your community."
    },
    {
      action: "Report Violations",
      
      description: "Report illegal burning or industrial emissions to authorities."
    },
    {
      action: "Energy Conservation",
     
      description: "Reduce energy consumption to decrease polluting power demand."
    },
    {
      action: "Support Clean Policies",
      
      description: "Advocate for policies that improve air quality standards."
    }
  ];

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? News.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === News.length - 1 ? 0 : prevIndex + 1));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
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
      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slider-container">
          <div className="slider-wrapper">
            <button className="slider-arrow left" onClick={goToPrevious}>
              
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
                  Stay informed about Nepal's air quality challenges
                </motion.p>
              </div>
            </div>
            <button className="slider-arrow right" onClick={goToNext}>
              
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

      {/* Education Tabs */}
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
                className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
                onClick={() => setActiveTab('intro')}
              >
                 Introduction
              </button>
              <button 
                className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
              >
                 Health Impacts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'nepal' ? 'active' : ''}`}
                onClick={() => setActiveTab('nepal')}
              >
                 Nepal's AQI
              </button>
              <button 
                className={`tab-btn ${activeTab === 'measurement' ? 'active' : ''}`}
                onClick={() => setActiveTab('measurement')}
              >
               Measurement
              </button>
              <button 
                className={`tab-btn ${activeTab === 'forecast' ? 'active' : ''}`}
                onClick={() => setActiveTab('forecast')}
              >
                 Forecast
              </button>
              <button 
                className={`tab-btn ${activeTab === 'action' ? 'active' : ''}`}
                onClick={() => setActiveTab('action')}
              >
                 Take Action
              </button>
            </div>

            <motion.div 
              className="tab-content"
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Introduction Tab */}
              {activeTab === 'intro' && (
                <div className="intro-content">
                  <div className="intro-section">
                    <div className="section-icon">
                     
                    </div>
                    <h3>What is Air Quality Index (AQI)?</h3>
                    <p>
                      The Air Quality Index (AQI) is a numerical scale used to communicate how polluted the air currently is or how polluted it is forecast to become. It transforms complex air quality data into an easy-to-understand format that helps people make decisions about their outdoor activities.
                    </p>
                  </div>

                  <div className="aqi-scale-section">
                    <h3>AQI Scale and Colors</h3>
                    <div className="aqi-scale-chart">
                      {aqiScale.map((item, index) => (
                        <div 
                          key={index}
                          className="aqi-level"
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

                  <div className="pollutants-section">
                    <h3>Common Air Pollutants</h3>
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
                              <strong>Sources:</strong>
                              <p>{pollutant.sources}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Health Effects:</strong>
                              <p>{pollutant.health}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Safe Levels:</strong>
                              <p>{pollutant.safeLevel}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Health Impacts Tab */}
              {activeTab === 'health' && (
                <div className="health-content">
                  <div className="intro-section">
                    <div className="section-icon">
                      
                    </div>
                    <h3>Health Impacts of Poor Air Quality</h3>
                    <p>
                      Air pollution affects different groups of people in various ways. Some populations are particularly vulnerable to its harmful effects. Understanding these impacts can help you take appropriate precautions.
                    </p>
                  </div>

                  <div className="health-effects-grid">
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
                        <ul className="health-effects-list">
                          {group.effects.map((effect, i) => (
                            <li key={i}>{effect}</li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  <div className="time-effects-section">
                    <h4>Short-term vs Long-term Effects</h4>
                    <div className="time-effects-grid">
                      <div className="time-effect-card">
                        <h5>Short-term Exposure</h5>
                        <ul>
                          <li>Eye, nose and throat irritation</li>
                          <li>Headaches and dizziness</li>
                          <li>Aggravated asthma symptoms</li>
                          <li>Respiratory infections</li>
                        </ul>
                      </div>
                      <div className="time-effect-card">
                        <h5>Long-term Exposure</h5>
                        <ul>
                          <li>Chronic respiratory diseases</li>
                          <li>Lung cancer</li>
                          <li>Heart disease and stroke</li>
                          <li>Reduced lung function growth in children</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nepal AQI Tab */}
              {activeTab === 'nepal' && (
                <div className="nepal-content">
                  <div className="intro-section">
                    <div className="section-icon">
                      
                    </div>
                    <h3>Air Quality in Nepal</h3>
                    <p>
                      Nepal faces significant air quality challenges, particularly in urban areas and during certain seasons. Understanding the sources and patterns can help address this growing public health concern.
                    </p>
                  </div>

                  <div className="sources-section">
                    <h4>Major Pollution Sources in Nepal</h4>
                    <div className="sources-grid">
                      {pollutionSources.map((source, index) => (
                        <motion.div 
                          key={index}
                          className="source-card"
                          whileHover={{ y: -5 }}
                          variants={itemVariants}
                        >
                          <h5>{source.source}</h5>
                          <p>{source.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="seasonal-section">
                    <h4>Seasonal Variations</h4>
                    <div className="seasonal-content">
                      <p>
                        Air pollution in Nepal varies significantly by season. Winter months (December-February) typically see the worst air quality due to:
                      </p>
                      <ul>
                        <li>Temperature inversions that trap pollutants</li>
                        <li>Increased biomass burning for heating</li>
                        <li>Reduced rainfall to clear the air</li>
                        <li>Transboundary pollution from neighboring countries</li>
                      </ul>
                      <p>
                        The monsoon season (June-September) generally has better air quality due to frequent rains that wash away pollutants.
                      </p>
                    </div>
                  </div>

                  <div className="city-comparison-section">
                    <h4>City Comparison</h4>
                    <div className="comparison-grid">
                      <div className="city-card">
                        <h5>Kathmandu</h5>
                        <p>Highest pollution levels due to dense traffic, brick kilns, and geographical bowl shape that traps pollutants.</p>
                      </div>
                      <div className="city-card">
                        <h5>Pokhara</h5>
                        <p>Generally better air quality but affected by seasonal tourism and increasing vehicle numbers.</p>
                      </div>
                      <div className="city-card">
                        <h5>Biratnagar</h5>
                        <p>Industrial emissions and cross-border pollution contribute to poor air quality, especially in winter.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Measurement Tab */}
              {activeTab === 'measurement' && (
                <div className="measurement-content">
                  <div className="intro-section">
                    <div className="section-icon">
                    
                    </div>
                    <h3>How AQI is Measured</h3>
                    <p>
                      Understanding how air quality is monitored helps interpret AQI values and forecasts. Nepal uses a combination of ground stations, sensors, and satellite data to assess air pollution levels.
                    </p>
                  </div>

                  <div className="methods-section">
                    <h4>Measurement Methods</h4>
                    <div className="methods-grid">
                      <div className="method-card">
                        <div className="method-icon">
                       
                        </div>
                        <h5>Monitoring Stations</h5>
                        <p>
                          Government-operated stations with high-quality instruments measure pollutant concentrations at fixed locations.
                        </p>
                      </div>
                      <div className="method-card">
                        <div className="method-icon">
                          
                        </div>
                        <h5>Low-cost Sensors</h5>
                        <p>
                          Smaller, more affordable devices deployed widely to supplement official monitoring networks.
                        </p>
                      </div>
                      <div className="method-card">
                        <div className="method-icon">
                       
                        </div>
                        <h5>Satellite Data</h5>
                        <p>
                          Remote sensing provides broad coverage, especially useful in areas with few ground stations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="process-section">
                    <h4>From Data to AQI</h4>
                    <div className="process-steps">
                      <div className="process-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h5>Data Collection</h5>
                          <p>Pollutant concentrations are measured continuously at monitoring stations.</p>
                        </div>
                      </div>
                      <div className="process-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h5>Quality Control</h5>
                          <p>Data is checked for accuracy and consistency.</p>
                        </div>
                      </div>
                      <div className="process-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h5>Index Calculation</h5>
                          <p>Pollutant levels are converted to AQI values using standard formulas.</p>
                        </div>
                      </div>
                      <div className="process-step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                          <h5>Reporting</h5>
                          <p>The highest AQI value among pollutants becomes the overall AQI for reporting.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Forecast Tab */}
              {activeTab === 'forecast' && (
                <div className="forecast-content">
                  <div className="intro-section">
                    <div className="section-icon">
                  
                    </div>
                    <h3>AQI Forecast and Prediction</h3>
                    <p>
                      Air quality forecasting helps individuals and authorities prepare for and mitigate pollution impacts. Forecasts consider multiple factors that influence pollution levels.
                    </p>
                  </div>

                  <div className="importance-section">
                    <h4>Why Forecasting Matters</h4>
                    <div className="importance-grid">
                      <div className="importance-card">
                        <div className="importance-icon">
                          
                        </div>
                        <div className="importance-text">
                          <h5>Health Protection</h5>
                          <p>Allows sensitive groups to take precautions on bad air days.</p>
                        </div>
                      </div>
                      <div className="importance-card">
                        <div className="importance-icon">
                          
                        </div>
                        <div className="importance-text">
                          <h5>Activity Planning</h5>
                          <p>Helps schedule outdoor activities when air quality is better.</p>
                        </div>
                      </div>
                      <div className="importance-card">
                        <div className="importance-icon">
                         
                        </div>
                        <div className="importance-text">
                          <h5>Policy Decisions</h5>
                          <p>Supports temporary measures like traffic restrictions on high pollution days.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="factors-section">
                    <h4>Factors Affecting AQI</h4>
                    <div className="factors-grid">
                      <div className="factor-card">
                        <h5>Weather Conditions</h5>
                        <ul>
                          <li>Wind disperses or concentrates pollutants</li>
                          <li>Rain cleans the air by washing out particles</li>
                          <li>Temperature inversions trap pollutants near ground</li>
                        </ul>
                      </div>
                      <div className="factor-card">
                        <h5>Human Activities</h5>
                        <ul>
                          <li>Traffic patterns and volume</li>
                          <li>Industrial operations</li>
                          <li>Construction and agricultural activities</li>
                        </ul>
                      </div>
                      <div className="factor-card">
                        <h5>Seasonal Patterns</h5>
                        <ul>
                          <li>Winter heating increases emissions</li>
                          <li>Dry seasons increase dust</li>
                          <li>Festivals with fireworks cause spikes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="forecast-methods-section">
                    <h4>How We Predict AQI</h4>
                    <div className="forecast-methods">
                      <div className="method-card">
                        <h5>Statistical Models</h5>
                        <p>Analyze historical patterns and relationships between weather and pollution.</p>
                      </div>
                      <div className="method-card">
                        <h5>Chemical Transport Models</h5>
                        <p>Simulate how pollutants move and transform in the atmosphere.</p>
                      </div>
                      <div className="method-card">
                        <h5>Machine Learning</h5>
                        <p>AI algorithms identify complex patterns in large datasets to improve predictions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Tab */}
              {activeTab === 'action' && (
                <div className="action-content">
                  <div className="intro-section">
                    <div className="section-icon">
                      
                    </div>
                    <h3>What You Can Do</h3>
                    <p>
                      While air pollution is a complex problem requiring systemic solutions, individual actions can significantly reduce exposure and contribute to cleaner air for everyone.
                    </p>
                  </div>

                  <div className="protection-section">
                    <h4>Personal Protection Strategies</h4>
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
                            <h5>{tip.title}</h5>
                          </div>
                          <ul className="protection-tips-list">
                            {tip.tips.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="community-section">
                    <h4>Community Actions</h4>
                    <div className="community-grid">
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
                            <h5>{action.action}</h5>
                            <p>{action.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="advocacy-section">
                    <h4>Advocacy and Policy</h4>
                    <div className="advocacy-content">
                      <p>
                        While individual actions help, systemic change is needed for lasting air quality improvements. Consider:
                      </p>
                      <ul>
                        <li>Supporting cleaner public transportation initiatives</li>
                        <li>Advocating for stricter industrial emission standards</li>
                        <li>Promoting urban green spaces and tree planting programs</li>
                        <li>Encouraging investment in renewable energy sources</li>
                        <li>Supporting air quality monitoring and research</li>
                      </ul>
                    </div>
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
            <h2 className="section-title">Latest Air Quality News</h2>
            <p className="section-description">
              Stay updated with recent developments and research about air pollution in Nepal.
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
                      Read Article 
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
            <h2 className="section-title">Additional Resources</h2>
            <p className="section-description">
              Explore these resources to learn more about air quality and protection strategies.
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
                  Learn More 
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