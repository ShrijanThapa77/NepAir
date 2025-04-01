import React, { useState } from "react";
import "./EducationModule.css";
import Footer from "../components/Footer";
import BG from '../assets/BGG.jpg';
import { FiArrowLeft, FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';

const EducationModule = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample educational resources
  const News = [
    { url: "https://www.icimod.org/wp-content/uploads/302042345_451246337032785_4783566089841697782_n.jpg", title: "Himalayan Air Pollution" },
    { url: "https://idsb.tmgrup.com.tr/ly/uploads/images/2021/03/30/103883.jpg", title: "Urban Air Quality Challenges" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2020/news/DTezpgIVMAAXM-1603301636.jpg", title: "Kathmandu Valley Pollution" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/news/polutionphoto-1699320782.jpg", title: "Winter Pollution Crisis" },
    { url: "https://assets-cdn.kathmandupost.com/uploads/source/news/2023/opinion/downPostFilePhotoHemantaShrestha-1693965360.jpg", title: "Vehicle Emissions Impact" },
  ];

  const news = [
    {
      id: 1,
      title: "Dirty and Dangerous",
      link: "https://kathmandupost.com/editorial/2025/01/20/dirty-and-dangerous",
      img: "https://assets-api.kathmandupost.com/thumb.php?src=https://assets-cdn.kathmandupost.com/uploads/source/news/2025/opinion/POLLUTIONCHANDRAGIRIROAD01302019MG5019-1737382832.jpg&w=900&height=601",
    },
    {
      id: 2,
      title: "Bad Air and Polluted Politics",
      link: "https://nepalitimes.com/here-now/bad-air-and-polluted-politics",
      img: "https://publisher-publish.s3.eu-central-1.amazonaws.com/pb-nepalitimes/swp/asv65r/media/2024082916088_402651a446551098b08eac91d3aabc16b8562b17e18ea3c40953d272e0c54436.webp",
    },
    {
      id: 3,
      title: "Air Pollution Increasing in Kathmandu",
      link: "https://thehimalayantimes.com/kathmandu/air-pollution-increasing-in-kathmandu-valley",
      img: "https://cdn4.premiumread.com/?url=https://thehimalayantimes.com/thehimalayantimes/uploads/images/2025/01/06/37187.jpeg&w=800&q=100&f=jpg",
    },
    {
      id: 4,
      title: "Wild Fires Worsening Air Pollution",
      link: "https://risingnepaldaily.com/news/57350",
      img: "https://risingnepaldaily.com/storage/media/71472/Untitled-1.jpg",
    },
    {
      id: 5,
      title: "Pollution Level Rises As Winter Sets In",
      link: "https://www.aninews.in/news/world/asia/pollution-level-in-nepal-rises-as-winter-sets-in-concerns-mount-over-health-risks20241017135455/",
      img: "https://aniportalimages.s3.amazonaws.com/media/details/ANI-20241017075628.jpg",
    },
    {
      id: 6,
      title: "Pokhara Records Highest Air Pollution",
      link: "https://english.onlinekhabar.com/pokhara-records-highest-air-pollution-in-nepal-today.html",
      img: "https://english.onlinekhabar.com/wp-content/uploads/2025/01/Pokhara-pumdikot-Himalayas-7.jpg",
    },
    {
      id: 7,
      title: "Kathmandu Valley Air Quality Drops",
      link: "http://kathmandupost.com/climate-environment/2024/11/15/kathmandu-valley-s-air-quality-drops-as-stubble-burning-starts-in-india-and-nepal",
      img: "https://assets-api.kathmandupost.com/thumb.php?src=https://assets-cdn.kathmandupost.com/uploads/source/news/2024/health/Untitled4-1731634559.jpg&w=900&height=601",
    },
    {
      id: 8,
      title: "Air pollution in Shankha Park worst",
      link: "https://myrepublica.nagariknetwork.com/news/air-pollution-in-shankha-park-worst-82-77.html",
      img: "https://republicaimg.nagariknewscdn.com/shared/web/uploads/media/pollution_20191115080506.jpg",
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Understanding Air Quality Index (AQI)",
      description: "Learn about what AQI is, how it is calculated, and its significance in monitoring air pollution levels and their health impacts.",
      link: "https://www.epa.gov/air-quality-index",
    },
    {
      id: 2,
      title: "Effects of Air Pollution on Health",
      description: "Explore the wide-ranging health impacts of poor air quality and discover effective strategies to protect yourself and your loved ones.",
      link: "https://www.who.int/health-topics/air-pollution",
    },
    {
      id: 3,
      title: "Air Quality Monitoring in Nepal",
      description: "Discover how air quality is monitored in Nepal, the challenges faced, and initiatives to improve environmental monitoring systems.",
      link: "https://nepalairquality.com",
    },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? News.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === News.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="education-module" style={{ backgroundImage: `url(${BG})` }}>
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <div className="slider-container">
          <div className="slider-wrapper">
            <button className="slider-arrow left" onClick={goToPrevious}>
              <FiArrowLeft size={32} />
            </button>
            <div 
              className="slide"
              style={{ backgroundImage: `url(${News[currentIndex].url})` }}
            >
              <div className="slide-overlay">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="slide-title"
                >
                  {News[currentIndex].title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="slide-subtitle"
                >
                  Stay informed about air quality issues in Nepal
                </motion.p>
              </div>
            </div>
            <button className="slider-arrow right" onClick={goToNext}>
              <FiArrowRight size={32} />
            </button>
          </div>
          <div className="slider-dots">
            {News.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Latest News on Air Quality</h2>
            <p className="section-description">
              Stay updated with the most recent news articles about air pollution in Nepal and its impacts.
            </p>
          </motion.div>

          <motion.div 
            className="news-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {news.map((item) => (
              <motion.div 
                key={item.id}
                className="news-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="news-image-container">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="news-image"
                  />
                  <div className={`news-overlay ${hoveredCard === item.id ? 'active' : ''}`}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      Read Article <FiExternalLink />
                    </a>
                  </div>
                </div>
                <h3 className="news-title">{item.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Educational Resources</h2>
            <p className="section-description">
              Explore comprehensive materials to deepen your understanding of air quality and its environmental impact.
            </p>
          </motion.div>

          <motion.div 
            className="resources-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resources.map((resource) => (
              <motion.div 
                key={resource.id}
                className="resource-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="resource-content">
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Learn More <FiExternalLink />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationModule;