import React from 'react';
import { useNavigate } from 'react-router-dom';
import CityLayout from '../../components/CityLayout';
function Kathmandu() {
  const navigate = useNavigate();

  return (
    <CityLayout title="Kathmandu">
      <div className="city-content">
        <h1>Kathmandu</h1>
        <p>Capital city of Nepal, rich in cultural heritage and history.</p>
        
        {/* Add your city-specific content here */}
        <section>
          <h2>Key Information</h2>
          <ul>
            <li>Population: 1.5 million</li>
            <li>Elevation: 1,400m</li>
            <li>Major Attractions: Swayambhunath, Pashupatinath, Durbar Square</li>
          </ul>
        </section>

        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back to Map
        </button>
      </div>
    </CityLayout>
  );
}

export default Kathmandu;