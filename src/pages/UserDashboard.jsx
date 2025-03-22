import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import Papa from 'papaparse';
import BG from '../assets/BGGG.jpg'; // Ensure this path is correct

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const UserDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Historicaldataofcities.csv'); // Fetch from public folder
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const parsedData = Papa.parse(csv, { header: true }).data.map((row) => ({
          ...row,
          pm25: parseFloat(row.pm25),
          pm10: parseFloat(row.pm10),
          o3: parseFloat(row.o3),
          no2: parseFloat(row.no2),
          so2: parseFloat(row.so2),
          co: parseFloat(row.co),
        }));
        console.log('Parsed Data:', parsedData); // Debugging
        setData(parsedData);
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      margin: '10px',
      width: '45%',
      minWidth: '300px',
    },
  };

  return (
    <div style={styles.container}>
      <h1>User Dashboard</h1>
      {data.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <div style={styles.chartContainer}>
          {/* Bar Diagram */}
          <div style={styles.chart}>
            <h2>PM2.5 Levels Across Different Cities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="City" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Histogram */}
          <div style={styles.chart}>
            <h2>Distribution of PM2.5 Levels Across Cities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pm25" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={styles.chart}>
            <h2>Pollutant Distribution (Pie Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="pm25"
                  nameKey="City"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div style={styles.chart}>
            <h2>Pollutant Heatmap</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="City" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" fill="#FF8042" />
                <Bar dataKey="pm10" fill="#0088FE" />
                <Bar dataKey="o3" fill="#00C49F" />
                <Bar dataKey="no2" fill="#FFBB28" />
                <Bar dataKey="so2" fill="#AF19FF" />
                <Bar dataKey="co" fill="#FF1919" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Plot */}
          <div style={styles.chart}>
            <h2>PM2.5 vs PM10 (Scatter Plot)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="pm25" name="PM2.5" />
                <YAxis type="number" dataKey="pm10" name="PM10" />
                <ZAxis range={[100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Cities" data={data} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;