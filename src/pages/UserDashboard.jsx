import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import './UserDashboard.css';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ZAxis, ComposedChart
} from 'recharts';

// Preload the CSV data
const preloadedData = await fetch('/Historicaldataofcities.csv')
  .then(response => response.text())
  .then(csvData => {
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          const parsedData = results.data.map(row => ({
            ...row,
            pm25: parseFloat(row.pm25) || 0,
            pm10: parseFloat(row.pm10) || 0,
            o3: parseFloat(row.o3) || 0,
            no2: parseFloat(row.no2) || 0,
            so2: parseFloat(row.so2) || 0,
            co: parseFloat(row.co) || 0,
            Date: new Date(row.Date)
          })).filter(row => !isNaN(row.pm25));
          resolve(parsedData);
        }
      });
    });
  });

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [pollutant, setPollutant] = useState('pm25');
  
  const cities = useMemo(() => [
    'Kathmandu', 'Janakpur', 'Pokhara', 'Butwal', 
    'Bharatpur', 'Nepalgunj', 'Mahendranagar', 
    'Biratnagar', 'Birgunj', 'Dharan'
  ], []);

  const pollutants = useMemo(() => [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'o3', label: 'Ozone (O₃)' },
    { value: 'no2', label: 'Nitrogen Dioxide (NO₂)' },
    { value: 'so2', label: 'Sulfur Dioxide (SO₂)' },
    { value: 'co', label: 'Carbon Monoxide (CO)' }
  ], []);

  const cityColors = useMemo(() => ({
    'Kathmandu': '#00FFFF',
    'Janakpur': '#FF00FF',
    'Pokhara': '#FFFF00',
    'Butwal': '#FF6600',
    'Bharatpur': '#00FF66',
    'Nepalgunj': '#FF0066',
    'Mahendranagar': '#6600FF',
    'Biratnagar': '#00FFCC',
    'Birgunj': '#FF66CC',
    'Dharan': '#66FF00'
  }), []);

  useEffect(() => {
    // Use the preloaded data
    setData(preloadedData);
    setLoading(false);
  }, []);

  const filteredData = useMemo(() => {
    return selectedCity !== 'All' 
      ? data.filter(item => item.City === selectedCity)
      : data;
  }, [data, selectedCity]);

  const averagesByCity = useMemo(() => {
    return cities.map(city => {
      const cityData = data.filter(item => item.City === city);
      if (cityData.length === 0) return { City: city, pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0 };
      
      const sumValues = cityData.reduce((acc, item) => ({
        pm25: acc.pm25 + item.pm25,
        pm10: acc.pm10 + item.pm10,
        o3: acc.o3 + item.o3,
        no2: acc.no2 + item.no2,
        so2: acc.so2 + item.so2,
        co: acc.co + item.co
      }), { pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0 });
      
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
  }, [data, cities]);

  const correlationData = useMemo(() => {
    return filteredData.length > 0 
      ? filteredData.map(item => ({
          pm25: item.pm25,
          pm10: item.pm10,
          City: item.City
        }))
      : [];
  }, [filteredData]);

  const aqiDistribution = useMemo(() => {
    const categories = {
      'Good': 0, 'Moderate': 0, 'Unhealthy for Sensitive Groups': 0,
      'Unhealthy': 0, 'Very Unhealthy': 0, 'Hazardous': 0
    };
    
    filteredData.forEach(item => {
      const pm25 = item.pm25;
      const category = pm25 <= 12 ? 'Good' :
                      pm25 <= 35.4 ? 'Moderate' :
                      pm25 <= 55.4 ? 'Unhealthy for Sensitive Groups' :
                      pm25 <= 150.4 ? 'Unhealthy' :
                      pm25 <= 250.4 ? 'Very Unhealthy' : 'Hazardous';
      categories[category]++;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const spiderData = useMemo(() => {
    const city = selectedCity !== 'All' ? selectedCity : 'Kathmandu';
    const cityData = averagesByCity.find(c => c.City === city);
    if (!cityData) return [];
    
    return [
      { subject: 'PM2.5', A: cityData.pm25, fullMark: Math.max(...averagesByCity.map(c => c.pm25)) * 1.2 },
      { subject: 'PM10', A: cityData.pm10, fullMark: Math.max(...averagesByCity.map(c => c.pm10)) * 1.2 },
      { subject: 'O₃', A: cityData.o3, fullMark: Math.max(...averagesByCity.map(c => c.o3)) * 1.2 },
      { subject: 'NO₂', A: cityData.no2, fullMark: Math.max(...averagesByCity.map(c => c.no2)) * 1.2 },
      { subject: 'SO₂', A: cityData.so2, fullMark: Math.max(...averagesByCity.map(c => c.so2)) * 1.2 },
      { subject: 'CO', A: cityData.co, fullMark: Math.max(...averagesByCity.map(c => c.co)) * 1.2 }
    ];
  }, [averagesByCity, selectedCity]);

  // Replace temporal flux with a bubble chart showing pollutant relationships
  const pollutantBubbleData = useMemo(() => {
    if (filteredData.length === 0) return [];
    
    // Sample data points for visualization
    return filteredData
      .filter((_, index) => index % 10 === 0) // Reduce data points for performance
      .map(item => ({
        city: item.City,
        pm25: item.pm25,
        pm10: item.pm10,
        o3: item.o3,
        size: Math.sqrt(item.pm25) * 2 // Bubble size based on PM2.5
      }));
  }, [filteredData]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading futuristic data visualization...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-overlay"></div>
      
      <header className="dashboard-header">
        <h1>
          <span className="title-main">NEPAL</span>
          <span className="title-sub">AIR QUALITY VISUALIZATION MATRIX</span>
        </h1>
        
        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">CITY SELECTION:</label>
            <div className="select-wrapper">
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="select-filter"
              >
                <option value="All">ALL CITIES</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city.toUpperCase()}</option>
                ))}
              </select>
              <div className="select-arrow"></div>
            </div>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">POLLUTANT:</label>
            <div className="select-wrapper">
              <select 
                value={pollutant} 
                onChange={(e) => setPollutant(e.target.value)}
                className="select-filter"
              >
                {pollutants.map(p => (
                  <option key={p.value} value={p.value}>{p.label.toUpperCase()}</option>
                ))}
              </select>
              <div className="select-arrow"></div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="dashboard-content">
        <section className="chart-section">
          <div className="chart-container holographic">
            <h2>HOLOGRAPHIC CITY AVERAGES</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={averagesByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.3)" />
                <XAxis 
                  dataKey="City" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <YAxis 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0,20,30,0.9)',
                    border: '1px solid #00FFFF',
                    borderRadius: '4px',
                    color: '#00FFFF'
                  }}
                  formatter={(value) => [value.toFixed(2), pollutants.find(p => p.value === pollutant)?.label]}
                />
                <Legend />
                <Bar 
                  dataKey={pollutant} 
                  name={pollutants.find(p => p.value === pollutant)?.label}
                  animationDuration={1000}
                >
                  {averagesByCity.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={cityColors[entry.City] || '#8884d8'}
                      stroke="rgba(0,255,255,0.8)"
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container futuristic-3d">
            <h2>POLAR POLLUTANT RADAR</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart outerRadius={120} data={spiderData}>
                <PolarGrid stroke="rgba(0,255,255,0.3)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 'auto']} 
                  tick={{ fill: '#00FFFF', fontSize: 10 }}
                />
                <Radar 
                  name={selectedCity !== 'All' ? selectedCity : 'Kathmandu'} 
                  dataKey="A" 
                  stroke={cityColors[selectedCity !== 'All' ? selectedCity : 'Kathmandu'] || '#00FFFF'} 
                  fill={cityColors[selectedCity !== 'All' ? selectedCity : 'Kathmandu'] || '#00FFFF'} 
                  fillOpacity={0.4} 
                  animationDuration={1000}
                />
                <Legend />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0,20,30,0.9)',
                    border: '1px solid #00FFFF',
                    borderRadius: '4px',
                    color: '#00FFFF'
                  }}
                  formatter={(value) => [value.toFixed(2), 'μg/m³']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
        
        <section className="chart-section">
          <div className="chart-container cyberpunk">
            <h2>PARTICULATE MATTER CORRELATION MATRIX</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.3)" />
                <XAxis 
                  type="number" 
                  dataKey="pm25" 
                  name="PM2.5" 
                  unit="μg/m³" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="pm10" 
                  name="PM10" 
                  unit="μg/m³" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <ZAxis type="number" range={[50, 200]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#00FFFF' }}
                  contentStyle={{
                    background: 'rgba(0,20,30,0.9)',
                    border: '1px solid #00FFFF',
                    borderRadius: '4px',
                    color: '#00FFFF'
                  }}
                />
                <Legend />
                <Scatter 
                  name="Pollutant Correlation" 
                  data={correlationData} 
                  fill="#8884d8"
                  animationDuration={1000}
                >
                  {correlationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={cityColors[entry.City] || '#00FFFF'}
                      stroke="rgba(0,255,255,0.8)"
                      strokeWidth={1}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container neon">
            <h2>AQI DISTRIBUTION SPHERE</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={aqiDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="white" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        style={{ textShadow: '0 0 5px rgba(0,255,255,0.7)' }}
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {aqiDistribution.map((entry, index) => {
                    const colors = ['#00E400', '#FFFF00', '#FF7E00', '#FF0000', '#8F3F97', '#7E0023'];
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]}
                        stroke="rgba(0,255,255,0.8)"
                        strokeWidth={1}
                      />
                    );
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0,20,30,0.9)',
                    border: '1px solid #00FFFF',
                    borderRadius: '4px',
                    color: '#00FFFF'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        
        <section className="chart-section">
          <div className="chart-container matrix">
            <h2>POLLUTANT RELATIONSHIP BUBBLES</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={pollutantBubbleData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.3)" />
                <XAxis 
                  dataKey="pm25" 
                  name="PM2.5" 
                  unit="μg/m³" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <YAxis 
                  dataKey="pm10" 
                  name="PM10" 
                  unit="μg/m³" 
                  tick={{ fill: '#00FFFF', fontSize: 12 }}
                  tickLine={{ stroke: '#00FFFF' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0,20,30,0.9)',
                    border: '1px solid #00FFFF',
                    borderRadius: '4px',
                    color: '#00FFFF'
                  }}
                />
                <Legend />
                <Scatter 
                  name="Pollutant Relationship" 
                  dataKey="o3"
                  fill="#FF00FF"
                  shape="circle"
                  animationDuration={1000}
                >
                  {pollutantBubbleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={cityColors[entry.city] || '#00FFFF'}
                      stroke="rgba(0,255,255,0.8)"
                      strokeWidth={1}
                    />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {selectedCity !== 'All' && (
            <div className="chart-container futuristic-3d">
              <h2>MULTI-POLLUTANT COMPARISON</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={averagesByCity.filter(city => city.City === selectedCity)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.3)" />
                  <XAxis 
                    dataKey="City" 
                    tick={{ fill: '#00FFFF', fontSize: 12 }}
                    tickLine={{ stroke: '#00FFFF' }}
                  />
                  <YAxis 
                    tick={{ fill: '#00FFFF', fontSize: 12 }}
                    tickLine={{ stroke: '#00FFFF' }}
                  />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(2), 'μg/m³']}
                    contentStyle={{
                      background: 'rgba(0,20,30,0.9)',
                      border: '1px solid #00FFFF',
                      borderRadius: '4px',
                      color: '#00FFFF'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="pm25" 
                    fill="url(#colorPm25)" 
                    name="PM2.5"
                    animationDuration={1000}
                  />
                  <Bar 
                    dataKey="pm10" 
                    fill="url(#colorPm10)" 
                    name="PM10"
                    animationDuration={1000}
                  />
                  <Bar 
                    dataKey="o3" 
                    fill="url(#colorO3)" 
                    name="Ozone"
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
      
      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} NEPAL AIR QUALITY VISUALIZATION MATRIX v3.0</p>
        <p className="footer-sub">Data sourced from Nepal Environmental Monitoring Network</p>
      </footer>
    </div>
  );
};

export default UserDashboard;