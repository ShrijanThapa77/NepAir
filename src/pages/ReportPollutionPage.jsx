import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ReportPollutionPage.css';

const ReportPollutionPage = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    location: '',
    description: '',
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Form data to submit:', {
        vehicleNumber: formData.vehicleNumber,
        location: formData.location,
        description: formData.description,
        image: formData.image ? formData.image.name : null,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="success-page-container">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="success-container"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="success-card"
          >
            <svg className="success-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="success-title">Report Submitted Successfully!</h2>
            <p className="success-message">Thank you for helping make our environment cleaner.</p>
            <div className="progress-bar">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
                className="progress-fill"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-background">
        <div className="form-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="report-form-container"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="form-header"
            >
              <h1 className="form-title">Report Polluting Vehicle</h1>
              <p className="form-subtitle">Help us identify vehicles causing air pollution</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="report-form">
              <motion.div 
                whileHover={{ x: 5 }}
                className="form-group"
              >
                <label htmlFor="vehicleNumber" className="form-label">
                  Vehicle Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. ABC 1234"
                  required
                />
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="form-group"
              >
                <label htmlFor="location" className="form-label">
                  Location of Incident <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Main Street near Central Park"
                  required
                />
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="form-group"
              >
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe what you observed (e.g. heavy black smoke, excessive dust)"
                />
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="form-group"
              >
                <label className="form-label">
                  Upload Photo Evidence
                </label>
                <div className="file-upload-container">
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-upload-input"
                    />
                    <span className="file-upload-button">
                      {formData.image ? 'Change Image' : 'Select Image'}
                    </span>
                    {formData.image && (
                      <span className="file-name">{formData.image.name}</span>
                    )}
                  </label>
                </div>
                {formData.imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="image-preview-container"
                  >
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="image-preview"
                    />
                  </motion.div>
                )}
                <p className="file-upload-hint">
                  Photos help authorities take appropriate action (Max 5MB)
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="submit-button-container"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle className="spinner-circle" cx="12" cy="12" r="10" />
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Report'}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportPollutionPage;