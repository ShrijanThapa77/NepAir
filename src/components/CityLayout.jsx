import React from 'react';
import Navbar from './Navbar';
import BG from '../assets/BGG.jpg';
function CityLayout({ children, title }) {
  return (
    <div className="city-page">
      <Navbar />
      <main className="city-container">
        <header className="city-header">
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}

export default CityLayout;