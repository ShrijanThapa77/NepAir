import React, { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Bar, 
  Line, 
  Pie, 
  Scatter,
  Bubble,
  Radar 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import BG from '../assets/BGGG.jpg';
import './UserDashboard.css';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  TimeScale,
  Filler
);

const UserDashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [timeRange, setTimeRange] = useState('year');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch and parse CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('.C:\Users\Dell\Desktop\NepAirrrs\NepAir\public\Historicaldataofcities.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const processed = results.data
              .filter(item => item.City && item.Date)
              .map(item => ({
                ...item,
                Date: new Date(item.Date),
                pm25: parseFloat(item.pm25) || 0,
                pm10: parseFloat(item.pm10) || 0,
                o3: parseFloat(item.o3) || 0,
                no2: parseFloat(item.no2) || 0,
                so2: parseFloat(item.so2) || 0,
                co: parseFloat(item.co) || 0,
              }))
              .filter(item => !isNaN(item.Date.getTime()));
            
            setRawData(processed);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...rawData];
    
    // Filter by city
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(item => 
        item.City.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.City.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by time range
    const now = new Date();
    if (timeRange === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(item => item.Date >= oneMonthAgo);
    } else if (timeRange === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(item => item.Date >= oneWeekAgo);
    } else if (timeRange === 'day') {
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
      filtered = filtered.filter(item => item.Date >= oneDayAgo);
    }
    
    return filtered;
  }, [rawData, selectedCity, searchQuery, timeRange]);

  // Get unique cities for dropdown
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(rawData.map(item => item.City))];
    return ['All Cities', ...uniqueCities];
  }, [rawData]);

  // Calculate AQI based on PM2.5 (simplified)
  const calculateAQI = (pm25) => {
    if (pm25 <= 12) return Math.round((50/12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100-51)/(35.4-12.1)) * (pm25-12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150-101)/(55.4-35.5)) * (pm25-35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200-151)/(150.4-55.5)) * (pm25-55.5) + 151);
    if (pm25 <= 250.4) return Math.round(((300-201)/(250.4-150.5)) * (pm25-150.5) + 201);
    if (pm25 <= 350.4) return Math.round(((400-301)/(350.4-250.5)) * (pm25-250.5) + 301);
    if (pm25 <= 500.4) return Math.round(((500-401)/(500.4-350.5)) * (pm25-350.5) + 401);
    return 500;
  };

  // Get AQI category and color
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#55a84f' };
    if (aqi <= 100) return { label: 'Satisfactory', color: '#a3c853' };
    if (aqi <= 200) return { label: 'Moderate', color: '#fff833' };
    if (aqi <= 300) return { label: 'Poor', color: '#f29c33' };
    if (aqi <= 400) return { label: 'Very Poor', color: '#e93f33' };
    return { label: 'Severe', color: '#af2d24' };
  };

  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    const grouped = filteredData.reduce((acc, item) => {
      let key;
      const date = item.Date;
      
      if (timeRange === 'year') key = date.getFullYear();
      else if (timeRange === 'month') key = `${date.getFullYear()}-${date.getMonth()}`;
      else if (timeRange === 'week') key = `${date.getFullYear()}-${Math.floor(date.getDate() / 7)}`;
      else key = date.toISOString().split('T')[0];
      
      if (!acc[key]) {
        acc[key] = {
          dates: [],
          pm25: [],
          pm10: [],
          o3: [],
          no2: [],
          so2: [],
          co: []
        };
      }
      
      acc[key].dates.push(date);
      acc[key].pm25.push(item.pm25);
      acc[key].pm10.push(item.pm10);
      acc[key].o3.push(item.o3);
      acc[key].no2.push(item.no2);
      acc[key].so2.push(item.so2);
      acc[key].co.push(item.co);
      
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([key, values]) => {
      const avgPm25 = values.pm25.reduce((a, b) => a + b, 0) / values.pm25.length;
      const avgPm10 = values.pm10.reduce((a, b) => a + b, 0) / values.pm10.length;
      const avgO3 = values.o3.reduce((a, b) => a + b, 0) / values.o3.length;
      const avgNo2 = values.no2.reduce((a, b) => a + b, 0) / values.no2.length;
      
      return {
        date: key,
        pm25: avgPm25,
        pm10: avgPm10,
        o3: avgO3,
        no2: avgNo2,
        aqi: calculateAQI(avgPm25)
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, timeRange]);

  // Latest data point
  const latestData = filteredData.length > 0 
    ? filteredData[filteredData.length - 1] 
    : null;
  
  const currentAQI = latestData ? calculateAQI(latestData.pm25) : 0;
  const aqiCategory = getAQICategory(currentAQI);

  // Chart data configurations
  const pollutantDistributionData = {
    labels: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
    datasets: [{
      data: [
        d3.mean(filteredData, d => d.pm25) || 0,
        d3.mean(filteredData, d => d.pm10) || 0,
        d3.mean(filteredData, d => d.o3) || 0,
        d3.mean(filteredData, d => d.no2) || 0,
        d3.mean(filteredData, d => d.so2) || 0,
        d3.mean(filteredData, d => d.co) || 0
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderWidth: 1,
      hoverOffset: 20
    }]
  };

  const cityComparisonData = {
    labels: [...new Set(rawData.map(item => item.City))],
    datasets: [
      {
        label: 'Average PM2.5',
        data: [...new Set(rawData.map(item => item.City))].map(city => {
          const cityData = rawData.filter(d => d.City === city);
          return d3.mean(cityData, d => d.pm25) || 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      },
      {
        label: 'Average PM10',
        data: [...new Set(rawData.map(item => item.City))].map(city => {
          const cityData = rawData.filter(d => d.City === city);
          return d3.mean(cityData, d => d.pm10) || 0;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }
    ]
  };

  const aqiTrendData = {
    labels: timeSeriesData.map(d => d.date),
    datasets: [{
      label: 'AQI',
      data: timeSeriesData.map(d => d.aqi),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const pollutantCorrelationData = {
    labels: timeSeriesData.map(d => d.date),
    datasets: [
      {
        label: 'PM2.5 vs PM10',
        data: timeSeriesData.map(d => ({
          x: d.pm25,
          y: d.pm10
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }
    ]
  };

  const pollutantRadarData = {
    labels: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
    datasets: filteredData.slice(0, 3).map((item, i) => ({
      label: `${item.City} - ${item.Date.toLocaleDateString()}`,
      data: [item.pm25, item.pm10, item.o3, item.no2, item.so2, item.co],
      backgroundColor: `rgba(${100 + i * 50}, ${200 - i * 50}, ${150 + i * 30}, 0.2)`,
      borderColor: `rgba(${100 + i * 50}, ${200 - i * 50}, ${150 + i * 30}, 1)`,
      borderWidth: 2
    }))
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${BG})` }}>
      <div className="dashboard-overlay"></div>
      
      <motion.div 
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="dashboard-header">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            NepAir Quality Dashboard
          </motion.h1>
          
          <div className="search-controls">
            <motion.div 
              className="search-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search Location, City, State or Country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </motion.div>
          </div>
          
          <div className="filters">
            <motion.div 
              className="filter-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label>City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </motion.div>
            
            <motion.div 
              className="filter-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label>Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="year">Year</option>
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </motion.div>
          </div>
        </header>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading air quality data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div 
            className="no-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No data available for the selected filters</p>
          </motion.div>
        ) : (
          <>
            <div className="summary-cards">
              <motion.div 
                className="summary-card aqi-card"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ backgroundColor: aqiCategory.color }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>Current AQI</h3>
                <div className="aqi-value">{currentAQI}</div>
                <div className="aqi-category">{aqiCategory.label}</div>
                {latestData && (
                  <div className="aqi-location">
                    {latestData.City}, {latestData.Date.toLocaleDateString()}
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                className="summary-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>Primary Pollutant</h3>
                <div className="pollutant-value">
                  <span className="pollutant-name">PM2.5</span>
                  <span className="pollutant-level">
                    {latestData ? latestData.pm25.toFixed(1) : '0.0'} µg/m³
                  </span>
                </div>
                <div className="pollutant-description">
                  Fine particulate matter, can penetrate deep into lungs
                </div>
              </motion.div>
              
              <motion.div 
                className="summary-card"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>Health Implications</h3>
                <div className="health-implication">
                  {aqiCategory.label === 'Good' && 'Air quality is considered satisfactory.'}
                  {aqiCategory.label === 'Satisfactory' && 'Acceptable air quality.'}
                  {aqiCategory.label === 'Moderate' && 'Sensitive groups may experience health effects.'}
                  {aqiCategory.label === 'Poor' && 'Everyone may begin to experience health effects.'}
                  {aqiCategory.label === 'Very Poor' && 'Health alert: everyone may experience more serious health effects.'}
                  {aqiCategory.label === 'Severe' && 'Health warnings of emergency conditions.'}
                </div>
              </motion.div>
            </div>
            
            <div className="chart-grid">
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>AQI Trend Over Time</h3>
                <div className="chart-wrapper">
                  <Line 
                    data={aqiTrendData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `AQI: ${context.raw} (${getAQICategory(context.raw).label})`
                          }
                        }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>Pollutant Distribution</h3>
                <div className="chart-wrapper">
                  <Pie 
                    data={pollutantDistributionData}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.label}: ${context.raw.toFixed(2)} µg/m³`
                          }
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>City Comparison</h3>
                <div className="chart-wrapper">
                  <Bar 
                    data={cityComparisonData}
                    options={{
                      responsive: true,
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>Pollutant Correlation</h3>
                <div className="chart-wrapper">
                  <Scatter 
                    data={pollutantCorrelationData}
                    options={{
                      responsive: true,
                      scales: {
                        x: { title: { display: true, text: 'PM2.5 (µg/m³)' } },
                        y: { title: { display: true, text: 'PM10 (µg/m³)' } }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>Pollutant Radar</h3>
                <div className="chart-wrapper">
                  <Radar 
                    data={pollutantRadarData}
                    options={{
                      responsive: true,
                      scales: {
                        r: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="chart-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.01 }}
              >
                <h3>Pollutant Bubble Chart</h3>
                <div className="chart-wrapper">
                  <Bubble 
                    data={{
                      datasets: filteredData.slice(0, 10).map(item => ({
                        label: `${item.City} - ${item.Date.toLocaleDateString()}`,
                        data: [{
                          x: item.pm25,
                          y: item.pm10,
                          r: Math.sqrt(item.o3) * 2
                        }],
                        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
                      }))
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        x: { title: { display: true, text: 'PM2.5 (µg/m³)' } },
                        y: { title: { display: true, text: 'PM10 (µg/m³)' } }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;