import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter,
  ComposedChart, ReferenceLine, ReferenceArea
} from 'recharts';
import { TrendingUp, AlertTriangle, Wind, CloudRain, ThermometerSun, Calendar, MapPin, Filter } from 'lucide-react';

const Dashboard = () => {
  const [airQualityData, setAirQualityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [selectedPollutant, setSelectedPollutant] = useState('pm25');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [currentAQI, setCurrentAQI] = useState(0);
  const [aqiLevel, setAqiLevel] = useState('');
  const [averages, setAverages] = useState({});
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [years, setYears] = useState([]);
  const [weatherData, setWeatherData] = useState({
    temperature: 25,
    humidity: 68,
    windSpeed: 3.4,
    weatherCondition: 'Partly Cloudy'
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Theme colors based on mode
  const theme = {
    background: darkMode ? '#121212' : '#f5f7fa',
    cardBg: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#e0e0e0' : '#333333',
    subtext: darkMode ? '#aaaaaa' : '#666666',
    border: darkMode ? '#333333' : '#e0e0e0',
    chartGrid: darkMode ? '#333333' : '#e0e0e0',
    highlight: '#1E88E5'
  };

  const pollutantLabels = {
    'pm25': 'PM2.5',
    'pm10': 'PM10',
    'o3': 'Ozone (O₃)',
    'no2': 'Nitrogen Dioxide (NO₂)',
    'so2': 'Sulfur Dioxide (SO₂)',
    'co': 'Carbon Monoxide (CO)',
  };

  const cityColors = {
    'Kathmandu': '#1E88E5',
    'Bhaktapur': '#FF5722',
    'Biratnagar': '#4CAF50',
    'Dharan': '#FFC107',
    'Butwal': '#9C27B0',
    'Mepalgunj': '#795548',
    'Mahendranagar': '#607D8B',
    'Janakpur': '#E91E63',
    'Bharatpur': '#03A9F4',
    'Birgunj': '#FF9800'
  };

  const pollutantColors = {
    'pm25': '#1E88E5',
    'pm10': '#4CAF50',
    'o3': '#FFC107',
    'no2': '#FF5722',
    'so2': '#9C27B0',
    'co': '#607D8B'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/Historicaldataofcities.csv');
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        let parsedData = [];
        const uniqueCities = new Set();
        const uniqueYears = new Set();
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',');
          const rowData = {};
          
          headers.forEach((header, index) => {
            if (header.trim() === 'Date') {
              const dateObj = new Date(values[index]);
              rowData[header.trim()] = dateObj;
              uniqueYears.add(dateObj.getFullYear().toString());
            } else if (header.trim() === 'City') {
              rowData[header.trim()] = values[index].trim();
              uniqueCities.add(values[index].trim());
            } else {
              rowData[header.trim()] = parseFloat(values[index]);
            }
          });
          
          parsedData.push(rowData);
        }
        
        const sortedYears = Array.from(uniqueYears).sort();
        setYears(sortedYears);
        if (sortedYears.length > 0) {
          setSelectedYear(sortedYears[sortedYears.length - 1]);
        }
        
        const averagesByCity = {};
        Array.from(uniqueCities).forEach(city => {
          const cityData = parsedData.filter(data => data.City === city);
          const cityAverages = {};
          
          ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'].forEach(pollutant => {
            const values = cityData.map(data => data[pollutant]).filter(val => !isNaN(val));
            cityAverages[pollutant] = values.length ? 
              Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0;
          });
          
          averagesByCity[city] = cityAverages;
        });
        
        const yearlyStats = Array.from(uniqueYears).map(year => {
          const yearData = parsedData.filter(item => item.Date.getFullYear().toString() === year);
          const pollutantSums = {
            pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0
          };
          const pollutantCounts = {
            pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0
          };
          
          yearData.forEach(data => {
            Object.keys(pollutantLabels).forEach(pollutant => {
              if (!isNaN(data[pollutant])) {
                pollutantSums[pollutant] += data[pollutant];
                pollutantCounts[pollutant]++;
              }
            });
          });
          
          const averages = {};
          Object.keys(pollutantLabels).forEach(pollutant => {
            averages[pollutant] = pollutantCounts[pollutant] ? 
              Math.round(pollutantSums[pollutant] / pollutantCounts[pollutant]) : 0;
          });
          
          return {
            year,
            ...averages
          };
        });
        
        setYearlyData(yearlyStats);
        setAverages(averagesByCity);
        setCities(Array.from(uniqueCities));
        setAirQualityData(parsedData);
        
        if (averagesByCity[selectedCity]) {
          const pm25Value = averagesByCity[selectedCity].pm25;
          setCurrentAQI(calculateAQI(pm25Value));
          setAqiLevel(getAQILevel(calculateAQI(pm25Value)));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading CSV data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (averages[selectedCity]) {
      const pm25Value = averages[selectedCity].pm25;
      setCurrentAQI(calculateAQI(pm25Value));
      setAqiLevel(getAQILevel(calculateAQI(pm25Value)));
    }
  }, [selectedCity, averages]);

  const calculateAQI = (pm25) => {
    if (pm25 <= 12) {
      return Math.round((50 - 0) / (12 - 0) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round((100 - 51) / (35.4 - 12.1) * (pm25 - 12.1) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round((150 - 101) / (55.4 - 35.5) * (pm25 - 35.5) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round((200 - 151) / (150.4 - 55.5) * (pm25 - 55.5) + 151);
    } else if (pm25 <= 250.4) {
      return Math.round((300 - 201) / (250.4 - 150.5) * (pm25 - 150.5) + 201);
    } else if (pm25 <= 350.4) {
      return Math.round((400 - 301) / (350.4 - 250.5) * (pm25 - 250.5) + 301);
    } else {
      return Math.round((500 - 401) / (500.4 - 350.5) * (pm25 - 350.5) + 401);
    }
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#4caf50';
    if (aqi <= 100) return '#ffeb3b';
    if (aqi <= 150) return '#ff9800';
    if (aqi <= 200) return '#f44336';
    if (aqi <= 300) return '#9c27b0';
    return '#7e0023';
  };
  
  const getMonthName = (monthIndex) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  };

  // Get health impact details based on AQI level
  const getHealthImpacts = (aqiLevel) => {
    switch(aqiLevel) {
      case 'Good':
        return [
          { group: 'General Population', impact: 'No health impacts expected' },
          { group: 'Sensitive Groups', impact: 'No health impacts expected' }
        ];
      case 'Moderate':
        return [
          { group: 'General Population', impact: 'Few people may experience slight irritation' },
          { group: 'Sensitive Groups', impact: 'People with respiratory conditions may experience symptoms' }
        ];
      case 'Unhealthy for Sensitive Groups':
        return [
          { group: 'General Population', impact: 'Some may begin to experience health effects' },
          { group: 'Sensitive Groups', impact: 'Reduced lung function, increased respiratory symptoms' }
        ];
      case 'Unhealthy':
        return [
          { group: 'General Population', impact: 'May experience respiratory symptoms, breathing discomfort' },
          { group: 'Sensitive Groups', impact: 'More serious effects, should avoid outdoor exertion' }
        ];
      case 'Very Unhealthy':
        return [
          { group: 'General Population', impact: 'Significant respiratory symptoms, reduced exercise capacity' },
          { group: 'Sensitive Groups', impact: 'Serious health effects, avoid all outdoor activities' }
        ];
      case 'Hazardous':
        return [
          { group: 'General Population', impact: 'Everyone may experience serious health effects' },
          { group: 'Sensitive Groups', impact: 'Emergency conditions, stay indoors with air purification' }
        ];
      default:
        return [];
    }
  };

  const getHealthRecommendation = (aqiLevel) => {
    switch(aqiLevel) {
      case 'Good':
        return 'Air quality is satisfactory. Enjoy your normal outdoor activities.';
      case 'Moderate':
        return 'Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.';
      case 'Unhealthy for Sensitive Groups':
        return 'People with respiratory or heart conditions, children and older adults should reduce prolonged outdoor exertion.';
      case 'Unhealthy':
        return 'Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor exertion.';
      case 'Very Unhealthy':
        return 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.';
      case 'Hazardous':
        return 'Health warnings of emergency conditions. The entire population is more likely to be affected. Stay indoors.';
      default:
        return 'No specific recommendations available.';
    }
  };

  const filterDataByTimeframe = () => {
    if (!airQualityData.length) return [];
    
    const currentYear = parseInt(selectedYear);
    const filteredByCity = airQualityData.filter(data => data.City === selectedCity);
    
    // Filter by year first
    const filteredByYear = filteredByCity.filter(data => 
      data.Date.getFullYear() === currentYear
    );
    
    if (!filteredByYear.length) return [];
    
    const sortedData = [...filteredByYear].sort((a, b) => a.Date - b.Date);
    
    if (selectedTimeframe === 'month') {
      const monthlyData = [];
      const monthsMap = {};
      
      sortedData.forEach(data => {
        const month = data.Date.getMonth();
        const key = `${month}`;
        
        if (!monthsMap[key]) {
          monthsMap[key] = {
            name: getMonthName(month),
            month,
            count: 0,
            pm25: 0,
            pm10: 0,
            o3: 0,
            no2: 0,
            so2: 0,
            co: 0
          };
        }
        
        monthsMap[key].count++;
        monthsMap[key].pm25 += data.pm25 || 0;
        monthsMap[key].pm10 += data.pm10 || 0;
        monthsMap[key].o3 += data.o3 || 0;
        monthsMap[key].no2 += data.no2 || 0;
        monthsMap[key].so2 += data.so2 || 0;
        monthsMap[key].co += data.co || 0;
      });
      
      Object.keys(monthsMap).forEach(key => {
        const item = monthsMap[key];
        monthlyData.push({
          name: item.name,
          pm25: Math.round(item.pm25 / item.count),
          pm10: Math.round(item.pm10 / item.count),
          o3: Math.round(item.o3 / item.count),
          no2: Math.round(item.no2 / item.count),
          so2: Math.round(item.so2 / item.count),
          co: Math.round(item.co / item.count),
          month: item.month
        });
      });
      
      return monthlyData.sort((a, b) => a.month - b.month);
    } else if (selectedTimeframe === 'week') {
      // Return the most recent week of data
      return sortedData.slice(-7);
    }
    
    return [];
  };

  const getPollutantComparisonData = () => {
    if (!cities.length || !averages) return [];
    
    return cities.map(city => ({
      name: city,
      value: averages[city] ? averages[city][selectedPollutant] : 0,
      color: cityColors[city] || '#000000'
    }));
  };

  const getPollutantRadarData = () => {
    if (!selectedCity || !averages[selectedCity]) return [];
    
    return Object.keys(pollutantLabels).map(key => ({
      subject: pollutantLabels[key],
      A: averages[selectedCity][key] || 0,
      fullMark: 400
    }));
  };

  const getDataByYear = () => {
    if (!yearlyData.length) return [];
    
    // Get the year-specific data
    const yearData = yearlyData.find(data => data.year === selectedYear);
    if (!yearData) return [];
    
    // Transform it into an array format for the charts
    return Object.keys(pollutantLabels).map(key => ({
      name: pollutantLabels[key],
      value: yearData[key] || 0
    }));
  };

  const getPollutantYearlyComparison = () => {
    return yearlyData.map(data => ({
      name: data.year,
      pm25: data.pm25,
      pm10: data.pm10,
      o3: data.o3,
      no2: data.no2,
      so2: data.so2,
      co: data.co
    }));
  };

  // Generate data for top pollutants gauge
  const getTopPollutantsData = () => {
    if (!selectedCity || !averages[selectedCity]) return [];
    
    const cityAvg = averages[selectedCity];
    const pollutants = Object.keys(pollutantLabels);
    
    // Sort pollutants by their values
    const sortedPollutants = [...pollutants].sort((a, b) => cityAvg[b] - cityAvg[a]);
    
    return sortedPollutants.map(key => ({
      name: pollutantLabels[key],
      value: cityAvg[key] || 0,
      color: pollutantColors[key]
    }));
  };

  // Get data for spider chart
  const getSpiderChartData = () => {
    if (!cities.length || !averages) return [];
    
    // Take top 5 cities for clarity
    const topCities = cities.slice(0, 5);
    
    // Create data for each pollutant type
    return Object.keys(pollutantLabels).map(pollutant => {
      const dataPoint = { name: pollutantLabels[pollutant] };
      
      topCities.forEach(city => {
        if (averages[city]) {
          dataPoint[city] = averages[city][pollutant] || 0;
        }
      });
      
      return dataPoint;
    });
  };

  // Get correlation data between PM2.5 and other pollutants
  const getCorrelationData = () => {
    if (!selectedCity || !averages) return [];
    
    const cityData = airQualityData.filter(data => data.City === selectedCity);
    
    if (!cityData.length) return [];
    
    // Create correlation points between PM2.5 and other pollutants
    const correlations = [];
    
    ['pm10', 'o3', 'no2', 'so2', 'co'].forEach(pollutant => {
      cityData.forEach(point => {
        if (!isNaN(point.pm25) && !isNaN(point[pollutant])) {
          correlations.push({
            pm25: point.pm25,
            [pollutant]: point[pollutant],
            pollutant
          });
        }
      });
    });
    
    return correlations;
  };

  // Format for health impact gauge
  const formatHealthImpact = (aqi) => {
    if (aqi <= 50) return { value: 0.2, color: '#4caf50' };
    if (aqi <= 100) return { value: 0.4, color: '#ffeb3b' };
    if (aqi <= 150) return { value: 0.6, color: '#ff9800' };
    if (aqi <= 200) return { value: 0.7, color: '#f44336' };
    if (aqi <= 300) return { value: 0.9, color: '#9c27b0' };
    return { value: 1, color: '#7e0023' };
  };

  // Generate historical comparison data
  const getHistoricalComparison = () => {
    if (!yearlyData.length || yearlyData.length < 2) return [];
    
    const years = yearlyData.map(data => data.year);
    const sortedYears = [...years].sort();
    
    if (sortedYears.length < 2) return [];
    
    const currentYearData = yearlyData.find(data => data.year === sortedYears[sortedYears.length - 1]);
    const previousYearData = yearlyData.find(data => data.year === sortedYears[sortedYears.length - 2]);
    
    if (!currentYearData || !previousYearData) return [];
    
    return Object.keys(pollutantLabels).map(key => {
      const currentValue = currentYearData[key] || 0;
      const previousValue = previousYearData[key] || 0;
      const change = currentValue - previousValue;
      const percentChange = previousValue !== 0 ? 
        Math.round((change / previousValue) * 100) : 0;
      
      return {
        name: pollutantLabels[key],
        current: currentValue,
        previous: previousValue,
        change,
        percentChange
      };
    });
  };

  const healthImpact = formatHealthImpact(currentAQI);
  const timeframeData = filterDataByTimeframe();

  if (isLoading) {
    return (
      <div className="loading-container" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.background
      }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${theme.border}`,
          borderTop: `4px solid ${theme.highlight}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: theme.text, marginTop: '20px' }}>Loading air quality data...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper" style={{
      background: theme.background,
      color: theme.text,
      minHeight: '100vh',
      padding: '20px',
      transition: 'all 0.3s ease'
    }}>
      <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center' }}>
          <Wind size={28} color={theme.highlight} style={{ marginRight: '10px' }} />
          <h1 style={{ margin: 0, fontSize: '24px' }}>Air Quality Dashboard</h1>
        </div>
        
        <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="theme-toggle" style={{
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '4px',
            border: `1px solid ${theme.border}`,
            background: theme.cardBg
          }} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </div>
          
          <div className="filter-toggle" style={{
            cursor: 'pointer',
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: '4px',
            border: `1px solid ${theme.border}`,
            background: theme.cardBg
          }} onClick={() => setShowFilterPanel(!showFilterPanel)}>
            <Filter size={16} />
            Filters
          </div>
        </div>
      </div>
      
      {showFilterPanel && (
        <div className="filter-panel" style={{
          background: theme.cardBg,
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="filter-group" style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="city-select" style={{ display: 'block', marginBottom: '8px', color: theme.subtext }}>
              <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              City
            </label>
            <select 
              id="city-select" 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text
              }}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group" style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="pollutant-select" style={{ display: 'block', marginBottom: '8px', color: theme.subtext }}>
              <Wind size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              Pollutant
            </label>
            <select 
              id="pollutant-select" 
              value={selectedPollutant} 
              onChange={(e) => setSelectedPollutant(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text
              }}
            >
              {Object.entries(pollutantLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group" style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="timeframe-select" style={{ display: 'block', marginBottom: '8px', color: theme.subtext }}>
              <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              Timeframe
            </label>
            <select 
              id="timeframe-select" 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text
              }}
            >
              <option value="month">Monthly</option>
              <option value="week">Weekly</option>
            </select>
          </div>

          <div className="filter-group" style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="year-select" style={{ display: 'block', marginBottom: '8px', color: theme.subtext }}>
              <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              Year
            </label>
            <select 
              id="year-select" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text
              }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        {/* Top Highlight Row */}
        <div className="highlight-row" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* AQI Gauge Card */}
          <div className="highlight-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="card-title" style={{ marginBottom: '10px', fontSize: '16px', color: theme.subtext }}>
              Current AQI · {selectedCity}
            </div>
            
            <div className="aqi-gauge" style={{ position: 'relative', width: '160px', height: '160px', margin: '10px 0' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Background Arc */}
                <path 
                  d="M 80 140 A 60 60 0 1 1 80.1 140" 
                  fill="none" 
                  stroke={theme.border} 
                  strokeWidth="12" 
                  strokeLinecap="round"
                />
                {/* Value Arc */}
                <path 
                  d={`M 80 140 A 60 60 0 ${healthImpact.value > 0.5 ? 1 : 0} 1 ${
                    80 + 60 * Math.sin(2 * Math.PI * healthImpact.value)
                  } ${
                    140 - 60 * Math.cos(2 * Math.PI * healthImpact.value)
                  }`} 
                  fill="none" 
                  stroke={healthImpact.color} 
                  strokeWidth="12" 
                  strokeLinecap="round"
                />
                {/* Value Text */}
                <text 
                  x="80" 
                  y="75" 
                  textAnchor="middle" 
                  fontSize="28" 
                  fontWeight="bold"
                  fill={theme.text}
                >
                  {currentAQI}
                </text>
                <text 
                  x="80" 
                  y="100" 
                  textAnchor="middle" 
                  fontSize="14"
                  fill={healthImpact.color}
                >
                  {aqiLevel}
                </text>
              </svg>
            </div>
            
            <div className="aqi-recommendation" style={{ fontSize: '14px', color: theme.subtext, maxWidth: '80%' }}>
              {getHealthRecommendation(aqiLevel)}
            </div>
          </div>
          
          {/* City Pollutant Profile */}
          <div className="highlight-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '10px', fontSize: '16px', color: theme.subtext }}>
              {selectedCity} Pollutant Profile
            </div>
            
            <div className="pollutant-profile" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={getPollutantRadarData()}>
                  <PolarGrid stroke={theme.chartGrid} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: theme.text, fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: theme.subtext }} />
                  <Radar 
                    name={selectedCity} 
                    dataKey="A" 
                    stroke={theme.highlight} 
                    fill={theme.highlight} 
                    fillOpacity={0.4} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather Conditions Card */}
          <div className="highlight-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '10px', fontSize: '16px', color: theme.subtext }}>
              Weather Conditions
            </div>
            
            <div className="weather-content" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '200px', 
              justifyContent: 'space-around'
            }}>
              <div className="weather-main" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '15px',
                margin: '10px 0'
              }}>
                {weatherData.weatherCondition.includes('Cloud') ? (
                  <CloudRain size={48} color={theme.highlight} />
                ) : (
                  <ThermometerSun size={48} color={theme.highlight} />
                )}
                <div className="weather-temp" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                  {weatherData.temperature}°C
                </div>
              </div>
              
              <div className="weather-details" style={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                borderTop: `1px solid ${theme.border}`,
                paddingTop: '15px' 
              }}>
                <div className="weather-item">
                  <div style={{ color: theme.subtext, fontSize: '14px' }}>Humidity</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{weatherData.humidity}%</div>
                </div>
                <div className="weather-item">
                  <div style={{ color: theme.subtext, fontSize: '14px' }}>Wind</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{weatherData.windSpeed} m/s</div>
                </div>
                <div className="weather-item">
                  <div style={{ color: theme.subtext, fontSize: '14px' }}>Condition</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{weatherData.weatherCondition}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Charts Row */}
        <div className="charts-row" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Pollutant Time Series */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Air Quality Trend ({selectedTimeframe === 'month' ? 'Monthly' : 'Weekly'})
            </div>
            
            <div className="pollutant-chart" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeframeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="name" tick={{ fill: theme.text }} />
                  <YAxis tick={{ fill: theme.text }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedPollutant} 
                    stroke={pollutantColors[selectedPollutant]} 
                    activeDot={{ r: 8 }} 
                    name={pollutantLabels[selectedPollutant]}
                  />
                  {selectedPollutant === 'pm25' && (
                    <ReferenceLine y={35} label={{ 
                      value: "WHO Guideline", 
                      position: 'insideTopRight',
                      fill: theme.text
                    }} stroke="#ff0000" strokeDasharray="3 3" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* City Comparison Chart */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              City Comparison: {pollutantLabels[selectedPollutant]}
            </div>
            
            <div className="city-chart" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getPollutantComparisonData()} layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis type="number" tick={{ fill: theme.text }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: theme.text }} 
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                  <Bar dataKey="value" name={pollutantLabels[selectedPollutant]}>
                    {getPollutantComparisonData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Bottom Charts Row */}
        <div className="charts-row" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Health Impacts */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Health Impacts: {aqiLevel} ({currentAQI})
            </div>
            
            <div className="health-impacts" style={{ padding: '10px 0' }}>
              {getHealthImpacts(aqiLevel).map((impact, index) => (
                <div key={index} className="impact-item" style={{
                  padding: '12px',
                  margin: '8px 0',
                  borderRadius: '8px',
                  background: index % 2 === 0 ? 'rgba(30, 136, 229, 0.1)' : 'rgba(30, 136, 229, 0.05)',
                  border: `1px solid ${theme.border}`
                }}>
                  <div className="impact-group" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {impact.group}
                  </div>
                  <div className="impact-text" style={{ fontSize: '14px', color: theme.subtext }}>
                    {impact.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Annual Comparison */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Annual Pollutant Comparison
            </div>
            
            <div className="annual-chart" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={getPollutantYearlyComparison()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="name" tick={{ fill: theme.text }} />
                  <YAxis tick={{ fill: theme.text }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="pm25" name="PM2.5" fill={pollutantColors.pm25} barSize={20} />
                  <Line type="monotone" dataKey="pm10" name="PM10" stroke={pollutantColors.pm10} />
                  <Line type="monotone" dataKey="o3" name="O₃" stroke={pollutantColors.o3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Pollution Sources and Year Stats */}
        <div className="charts-row" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Top Pollutants */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              Top Pollutants in {selectedCity}
            </div>
            
            <div className="top-pollutants-chart" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTopPollutantsData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getTopPollutantsData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Year Summary Stats */}
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              {selectedYear} - Year Summary
            </div>
            
            <div className="year-stats" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getDataByYear()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis dataKey="name" tick={{ fill: theme.text }} />
                  <YAxis tick={{ fill: theme.text }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme.cardBg, 
                      border: `1px solid ${theme.border}`, 
                      color: theme.text 
                    }} 
                  />
                  <Bar dataKey="value" fill={theme.highlight}>
                    {Object.entries(pollutantLabels).map(([key, label], index) => (
                      <Cell key={`cell-${index}`} fill={pollutantColors[key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Historical Data Analysis */}
        <div className="charts-row" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div className="chart-card" style={{
            background: theme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="card-title" style={{ marginBottom: '15px', fontSize: '16px', color: theme.subtext }}>
              Historical Data Analysis
            </div>
            
            <div className="historical-analysis" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div className="analysis-header" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                padding: '10px 0',
                borderBottom: `1px solid ${theme.border}`,
                fontWeight: 'bold'
              }}>
                <div>Pollutant</div>
                <div>Previous Year</div>
                <div>Current Year</div>
                <div>Change</div>
              </div>
              
              {getHistoricalComparison().map((item, index) => (
                <div key={index} className="analysis-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '10px 0',
                  borderBottom: `1px solid ${theme.border}`,
                  color: item.change > 0 ? '#f44336' : (item.change < 0 ? '#4caf50' : theme.text)
                }}>
                  <div>{item.name}</div>
                  <div>{item.previous}</div>
                  <div>{item.current}</div>
                  <div>{item.percentChange > 0 ? `+${item.percentChange}%` : `${item.percentChange}%`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-footer" style={{
        padding: '20px 0',
        textAlign: 'center',
        color: theme.subtext,
        fontSize: '14px',
        borderTop: `1px solid ${theme.border}`
      }}>
        Air Quality Dashboard · Data Updated: April 2025
      </div>
    </div>
  );
};

export default Dashboard;