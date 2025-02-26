import React from "react";
import Navbar from '../components/Navbar'; // Import the Navbar component
import "./EducationModule.css"; // Import the CSS file for styling

const EducationModule = () => {
  // Sample educational resources (you can replace this with dynamic data)
  const resources = [
    {
      id: 1,
      title: "Understanding Air Quality Index (AQI)",
      description: "Learn about what AQI is, how it is calculated, and its significance.",
      link: "https://www.epa.gov/air-quality-index",
    },
    {
      id: 2,
      title: "Effects of Air Pollution on Health",
      description: "Explore the health impacts of poor air quality and how to protect yourself.",
      link: "https://www.who.int/health-topics/air-pollution",
    },
    {
      id: 3,
      title: "Air Quality Monitoring in Nepal",
      description: "Discover how air quality is monitored in Nepal and the challenges faced.",
      link: "https://nepalairquality.com",
    },
    {
      id: 4,
      title: "How to Reduce Your Carbon Footprint",
      description: "Practical tips to reduce your contribution to air pollution.",
      link: "https://www.carbonfootprint.com",
    },
  ];

  return (
    <div className="education-module">
      <Navbar /> {/* Include the Navbar */}
      <div className="education-content">
        <h1>Educational Resources on Air Quality</h1>
        <p>
          Explore educational materials and resources to learn more about air quality and its impact
          on health and the environment.
        </p>

        <div className="resource-list">
          {resources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationModule;