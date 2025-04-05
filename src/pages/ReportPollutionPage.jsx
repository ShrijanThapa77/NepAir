import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './ReportPollutionPage.css';

const ReportPollutionPage = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    location: '',
    description: '',
    pollutionType: 'smoke', // Default pollution type
    severity: 'medium',    // Default severity
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Cloudinary configuration
  const cloudName = 'dp8th7yoy';
  const uploadPreset = 'pollution_reports';

  // Pollution type options
  const pollutionTypes = [
    { value: 'smoke', label: 'Black Smoke' },
    { value: 'dust', label: 'Excessive Dust' },
    { value: 'liquid', label: 'Liquid Pollution' },
    { value: 'noise', label: 'White smoke' },
    { value: 'other', label: 'Other' },
  ];

  // Severity options
  const severityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'extreme', label: 'Extreme' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setError(null);
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'pollution_reports');
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new Error('Image upload failed. Please try again.');
    }
  };

  const submitReportToBackend = async (reportData) => {
    // In a real app, replace with your actual API endpoint
    console.log('Submitting report:', reportData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, id: 'mock-report-id' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.vehicleNumber || !formData.location) {
      setError('Vehicle number and location are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      let imageData = null;
      
      // Upload image if present
      if (formData.image) {
        imageData = await uploadImageToCloudinary(formData.image);
      }

      // Prepare complete report data
      const reportData = {
        vehicleNumber: formData.vehicleNumber.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        pollutionType: formData.pollutionType,
        severity: formData.severity,
        image: imageData,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      // Submit to backend
      const result = await submitReportToBackend(reportData);
      console.log('Report submitted successfully:', result);
      
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
            <p className="success-message">
              Your report has been received. Reference ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
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
              <p className="form-subtitle">Help combat air pollution by reporting offenders</p>
            </motion.div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-grid">
                {/* Vehicle Information */}
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
                    pattern="[A-Za-z0-9 ]{3,15}"
                    title="Enter a valid vehicle number"
                  />
                </motion.div>

                {/* Location */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="form-group"
                >
                  <label htmlFor="location" className="form-label">
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Dhumbarahi,Kathmandu"
                    required
                  />
                </motion.div>

                {/* Pollution Type */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="form-group"
                >
                  <label htmlFor="pollutionType" className="form-label">
                    Pollution Type
                  </label>
                  <select
                    id="pollutionType"
                    name="pollutionType"
                    value={formData.pollutionType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {pollutionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Severity */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="form-group"
                >
                  <label htmlFor="severity" className="form-label">
                    Severity Level
                  </label>
                  <div className="severity-options">
                    {severityLevels.map(level => (
                      <label key={level.value} className="severity-option">
                        <input
                          type="radio"
                          name="severity"
                          value={level.value}
                          checked={formData.severity === level.value}
                          onChange={handleChange}
                        />
                        <span className={`severity-label ${formData.severity === level.value ? 'active' : ''}`}>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="form-group full-width"
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
                    placeholder="Describe what you observed in detail..."
                  />
                </motion.div>

                {/* Image Upload */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="form-group full-width"
                >
                  <label className="form-label">
                    Photo Evidence <span className="hint">(Optional but recommended)</span>
                  </label>
                  <div className="file-upload-container">
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-upload-input"
                        disabled={isSubmitting}
                        capture="environment" // Prefer device camera on mobile
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
                      {isSubmitting && uploadProgress > 0 && (
                        <div className="upload-progress-bar">
                          <div 
                            className="upload-progress-fill" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                          <span className="upload-progress-text">
                            {uploadProgress}% uploaded
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                  <p className="file-upload-hint">
                    Clear photos help authorities take action (Max 5MB, JPEG/PNG)
                  </p>
                </motion.div>
              </div>

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
                      {uploadProgress > 0 ? 'Uploading...' : 'Submitting...'}
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