import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BG from '../assets/BGGG.jpg';

const data = [
  // Replace this with your actual data from Historicaldataofcities.csv
  { City: 'Kathmandu', pm25: 120, pm10: 150, o3: 30, no2: 40, so2: 20, co: 1.5 },
  { City: 'Pokhara', pm25: 80, pm10: 100, o3: 25, no2: 35, so2: 15, co: 1.2 },
  // Add more data points as needed
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const UserDashboard = () => {
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
              <XAxis dataKey="City" />
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