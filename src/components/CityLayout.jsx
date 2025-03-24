import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './CityLayout.css';

function CityLayout({ 
  title, 
  children, 
  heroImage, 
  tagline,
  showBackButton = true 
}) {
  const navigate = useNavigate();
  
  return (
    <div className="city-layout">
      <Navbar />
      
      {heroImage && (
        <div 
          className="city-hero" 
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="hero-overlay">
            <h1 className="city-title">{title}</h1>
            {tagline && <p className="city-tagline">{tagline}</p>}
          </div>
        </div>
      )}

      <main className="city-main">
        {!heroImage && (
          <header className="city-header">
            <h1>{title}</h1>
          </header>
        )}
        
        <div className="city-content-wrapper">
          {children}
        </div>

        {showBackButton && (
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back to map"
          >
            ← Back to Map
          </button>
        )}
      </main>
    </div>
  );
}

export default CityLayout;