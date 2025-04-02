import React, { useState, useEffect } from 'react';

import Papa from 'papaparse';
import './UserDashboard.css';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [timeRange, setTimeRange] = useState('all');
  const [pollutant, setPollutant] = useState('pm25');
  
  const cities = [
    'Kathmandu', 'Janakpur', 'Pokhara', 'Butwal', 
    'Bharatpur', 'Nepalgunj', 'Mahendranagar', 
    'Biratnagar', 'Birgunj', 'Dharan'
  ];

  const pollutants = [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'o3', label: 'Ozone (O₃)' },
    { value: 'no2', label: 'Nitrogen Dioxide (NO₂)' },
    { value: 'so2', label: 'Sulfur Dioxide (SO₂)' },
    { value: 'co', label: 'Carbon Monoxide (CO)' }
  ];

  const cityColors = {
    'Kathmandu': '#FFD700',
    'Janakpur': '#800020',
    'Pokhara': '#A0522D',
    'Butwal': '#FF4500',
    'Bharatpur': '#B22222',
    'Nepalgunj': '#FF8C00',
    'Mahendranagar': '#FFD700',
    'Biratnagar': '#32CD32',
    'Birgunj': '#FFD700',
    'Dharan': '#DAA520'
  };

  const RADIAN = Math.PI / 180;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Historicaldataofcities.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);
        
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            // Convert string values to numbers for pollutant data
            const parsedData = results.data.map(row => {
              return {
                ...row,
                pm25: parseFloat(row.pm25),
                pm10: parseFloat(row.pm10),
                o3: parseFloat(row.o3),
                no2: parseFloat(row.no2),
                so2: parseFloat(row.so2),
                co: parseFloat(row.co),
                Date: new Date(row.Date)
              };
            }).filter(row => !isNaN(row.pm25)); // Filter out incomplete rows
            
            setData(parsedData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    if (selectedCity !== 'All' && item.City !== selectedCity) return false;
    
    if (timeRange !== 'all') {
      const itemDate = new Date(item.Date);
      const today = new Date();
      
      if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return itemDate >= monthAgo;
      } else if (timeRange === '3months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return itemDate >= threeMonthsAgo;
      } else if (timeRange === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(today.getFullYear() - 1);
        return itemDate >= yearAgo;
      }
    }
    
    return true;
  });

  // Calculate average pollutant values by city
  const averagesByCity = cities.map(city => {
    const cityData = data.filter(item => item.City === city);
    
    if (cityData.length === 0) return { City: city, pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0 };
    
    const sumValues = cityData.reduce((acc, item) => {
      return {
        pm25: acc.pm25 + item.pm25,
        pm10: acc.pm10 + item.pm10,
        o3: acc.o3 + item.o3,
        no2: acc.no2 + item.no2,
        so2: acc.so2 + item.so2,
        co: acc.co + item.co
      };
    }, { pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0 });
    
    return {
      City: city,
      pm25: sumValues.pm25 / cityData.length,
      pm10: sumValues.pm10 / cityData.length,
      o3: sumValues.o3 / cityData.length,
      no2: sumValues.no2 / cityData.length,
      so2: sumValues.so2 / cityData.length,
      co: sumValues.co / cityData.length
    };
  });

  // Group data by month for trend analysis
  const monthlyData = () => {
    const months = {};
    
    filteredData.forEach(item => {
      const date = new Date(item.Date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = {
          month: monthYear,
          pm25: 0,
          pm10: 0,
          o3: 0,
          no2: 0,
          so2: 0,
          co: 0,
          count: 0
        };
      }
      
      months[monthYear].pm25 += item.pm25;
      months[monthYear].pm10 += item.pm10;
      months[monthYear].o3 += item.o3;
      months[monthYear].no2 += item.no2;
      months[monthYear].so2 += item.so2;
      months[monthYear].co += item.co;
      months[monthYear].count += 1;
    });
    
    return Object.values(months)
      .map(month => ({
        month: month.month,
        pm25: month.pm25 / month.count,
        pm10: month.pm10 / month.count,
        o3: month.o3 / month.count,
        no2: month.no2 / month.count,
        so2: month.so2 / month.count,
        co: month.co / month.count
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
  };

  // Calculate correlation between pollutants
  const correlationData = () => {
    if (filteredData.length === 0) return [];
    
    return filteredData.map(item => ({
      pm25: item.pm25,
      pm10: item.pm10,
      City: item.City
    }));
  };

  // Calculate AQI categories based on PM2.5
  const getAQICategory = (pm25) => {
    if (pm25 <= 12) return 'Good';
    if (pm25 <= 35.4) return 'Moderate';
    if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
    if (pm25 <= 150.4) return 'Unhealthy';
    if (pm25 <= 250.4) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const calculateAQIDistribution = () => {
    const categories = {
      'Good': 0,
      'Moderate': 0,
      'Unhealthy for Sensitive Groups': 0,
      'Unhealthy': 0,
      'Very Unhealthy': 0,
      'Hazardous': 0
    };
    
    filteredData.forEach(item => {
      const category = getAQICategory(item.pm25);
      categories[category] += 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="dashboard" style={{ backgroundImage: `url('/BGGG.jpg')` }}>
      <div className="overlay">
        <header className="dashboard-header">
          <h1>Nepal Air Quality Dashboard</h1>
          <div className="filters">
            <div className="filter-group">
              <label>City:</label>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="select-filter"
              >
                <option value="All">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Time Range:</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="select-filter"
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Pollutant:</label>
              <select 
                value={pollutant} 
                onChange={(e) => setPollutant(e.target.value)}
                className="select-filter"
              >
                {pollutants.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <section className="chart-section">
            <div className="chart-container">
              <h2>Average Air Quality by City</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averagesByCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="City" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend />
                  <Bar 
                    dataKey={pollutant} 
                    fill="#8884d8" 
                    name={pollutants.find(p => p.value === pollutant)?.label}
                  >
                    {averagesByCity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cityColors[entry.City] || '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h2>Pollutant Trend Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={pollutant} 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name={pollutants.find(p => p.value === pollutant)?.label}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          
          <section className="chart-section">
            <div className="chart-container">
              <h2>PM2.5 vs PM10 Correlation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="pm25" 
                    name="PM2.5" 
                    unit="μg/m³" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="pm10" 
                    name="PM10" 
                    unit="μg/m³" 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Pollutant Correlation" 
                    data={correlationData()} 
                    fill="#8884d8"
                  >
                    {correlationData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={cityColors[entry.City] || '#8884d8'} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h2>Air Quality Index Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculateAQIDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculateAQIDistribution().map((entry, index) => {
                      const colors = ['#00E400', '#FFFF00', '#FF7E00', '#FF0000', '#8F3F97', '#7E0023'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
          
          {selectedCity !== 'All' && (
            <section className="city-details">
              <h2>{selectedCity} Air Quality Details</h2>
              
              <div className="chart-section">
                <div className="chart-container">
                  <h3>Pollutant Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart 
                      outerRadius={90} 
                      data={[averagesByCity.find(city => city.City === selectedCity)]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar 
                        name={selectedCity} 
                        dataKey="value" 
                        stroke={cityColors[selectedCity]} 
                        fill={cityColors[selectedCity]} 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <h3>Monthly Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={monthlyData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey={pollutant} 
                        stroke={cityColors[selectedCity]} 
                        fill={cityColors[selectedCity]} 
                        fillOpacity={0.3}
                        name={pollutants.find(p => p.value === pollutant)?.label}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}
        </div>
        
        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Nepal Air Quality Monitoring System</p>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;