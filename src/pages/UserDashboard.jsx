import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import BG from '../assets/BGGG.jpg';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const UserDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV data
    const fetchData = async () => {
      const response = await fetch('/path/to/Historicaldataofcities.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const parsedData = Papa.parse(csv, { header: true }).data;
      setData(parsedData);
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
      <div style={styles.chartContainer}>
        <div style={styles.chart}>
          <h2>PM2.5 Levels</h2>
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

        <div style={styles.chart}>
          <h2>Pollutant Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="pm25" nameKey="City" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chart}>
          <h2>Heatmap (PM2.5)</h2>
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

        <div style={styles.chart}>
          <h2>Histogram (PM2.5)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pm25" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;