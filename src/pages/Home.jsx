import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import Station from '../components/Station';
import OldData from '../components/OldData';
import Footer from '../components/Footer';

const Home = () => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
    <Navbar/>
      <div className='content'>
        <Station/>
        <Map showInfo={showInfo} setShowInfo={setShowInfo} />
        <OldData showInfo={showInfo} setShowInfo={setShowInfo} />
      </div>
      <Footer/>
    </>
  )
}

export default Home
