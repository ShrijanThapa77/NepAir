import React from 'react'
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  
      const goToLogin = (e) => {
        e.preventDefault();
        navigate("/login");
      };
  return (
    <div className='contain'>
      <nav>
        <div className="logo">
            <img src="/images/nepal_logo.png" alt="logo" />
            <div>
            <p>Government of Nepal</p>
            <p>Ministry of Forests and Environment</p>
            <p>Department of Environment</p>
            <p>Air Quality Monitoring</p>
            </div>
        </div>
        {/* <div className="navLinks"> use when needed
            <ul>
                <li href="#" className='active link'>Home</li>
                <li href="#" className='link'>Stations</li>
                <li href="#" className='link'>AQ Network Overview</li>
            </ul>
        </div> */}
        <div className="auth-btn">
        <form onSubmit={goToLogin}>
        <input type="submit" value="Go to Login" />
        </form>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
