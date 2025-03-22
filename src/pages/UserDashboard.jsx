import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Papa from 'papaparse';
import BG from '../assets/BGGG.jpg'; // Ensure this path is correct

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [cityAverages, setCityAverages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Historicaldataofcities.csv'); // Ensure correct file path
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        const parsedData = Papa.parse(csv, { header: true }).data.map((row) => ({
          City: row.City,
          Date: row.Date,
          pm25: parseFloat(row.pm25),
          pm10: parseFloat(row.pm10),
          o3: parseFloat(row.o3),
          no2: parseFloat(row.no2),
          so2: parseFloat(row.so2),
          co: parseFloat(row.co),
        }));

        // Compute city-wise average pollutant levels
        const cityGroups = parsedData.reduce((acc, row) => {
          if (!acc[row.City]) acc[row.City] = { ...row, count: 1 };
          else {
            Object.keys(row).forEach((key) => {
              if (key !== 'City' && key !== 'Date') acc[row.City][key] += row[key];
            });
            acc[row.City].count += 1;
          }
          return acc;
        }, {});

        const averages = Object.keys(cityGroups).map((city) => ({
          City: city,
          pm25: (cityGroups[city].pm25 / cityGroups[city].count).toFixed(2),
          pm10: (cityGroups[city].pm10 / cityGroups[city].count).toFixed(2),
          o3: (cityGroups[city].o3 / cityGroups[city].count).toFixed(2),
          no2: (cityGroups[city].no2 / cityGroups[city].count).toFixed(2),
          so2: (cityGroups[city].so2 / cityGroups[city].count).toFixed(2),
          co: (cityGroups[city].co / cityGroups[city].count).toFixed(2),
        }));

        setData(parsedData);
        setCityAverages(averages);
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    fetchData();
  }, []);

  const styles = {
    container: {
      backgroundImage: `url(${BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px',
      color: 'white',
    },
    chartContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: '20px',
    },
    chart: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '10px',
      margin: '10px',
      width: '45%',
      minWidth: '350px',
      color: 'black',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      {data.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <div style={styles.chartContainer}>
          {/* Bar Chart - PM2.5 Levels by City */}
          <div style={styles.chart}>
            <h2>Average PM2.5 Levels (Bar Chart)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cityAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="City" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart - PM10 Trends per City */}
          <div style={styles.chart}>
            <h2>PM10 Trends (Area Chart)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cityAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="City" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pm10" fill="#FF8042" stroke="#FF8042" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stacked Bar Chart - Pollutants Comparison */}
          <div style={styles.chart}>
            <h2>Pollutant Levels by City (Stacked Bar Chart)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cityAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="City" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" stackId="a" fill="#FF8042" />
                <Bar dataKey="pm10" stackId="a" fill="#0088FE" />
                <Bar dataKey="o3" stackId="a" fill="#00C49F" />
                <Bar dataKey="no2" stackId="a" fill="#FFBB28" />
                <Bar dataKey="so2" stackId="a" fill="#AF19FF" />
                <Bar dataKey="co" stackId="a" fill="#FF1919" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart - Pollution Levels Comparison */}
          <div style={styles.chart}>
            <h2 style={{ color: '#1565C0', fontWeight: 'bold' }}>Pollutant Levels Radar Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cityAverages}>
                <PolarGrid />
                <PolarAngleAxis dataKey="City" />
                <PolarRadiusAxis />
                <Tooltip />
                <Legend />
                <Radar name="PM2.5" dataKey="pm25" stroke="#FF5733" fill="#FF5733" fillOpacity={0.6} />
                <Radar name="PM10" dataKey="pm10" stroke="#FFC300" fill="#FFC300" fillOpacity={0.6} />
                <Radar name="O3" dataKey="o3" stroke="#36D7B7" fill="#36D7B7" fillOpacity={0.6} />
                <Radar name="NO2" dataKey="no2" stroke="#C70039" fill="#C70039" fillOpacity={0.6} />
                <Radar name="SO2" dataKey="so2" stroke="#900C3F" fill="#900C3F" fillOpacity={0.6} />
                <Radar name="CO" dataKey="co" stroke="#581845" fill="#581845" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
