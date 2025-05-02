import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { FiCamera, FiUpload, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import './ReportPollutionPage.css';

const ReportPollutionPage = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    location: '',
    description: '',
    pollutionType: 'smoke',
    severity: 'medium',
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVehicleImage, setIsVehicleImage] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const cloudName = 'dp8th7yoy';
  const uploadPreset = 'pollution_reports';

  const pollutionTypes = [
    { value: 'smoke', label: 'Black Smoke', icon: '💨' },
    { value: 'dust', label: 'Excessive Dust', icon: '💨' },
    { value: 'liquid', label: 'Liquid Pollution', icon: '💧' },
    { value: 'noise', label: 'Noise Pollution', icon: '🔊' },
    { value: 'white-smoke', label: 'White Smoke', icon: '💨' },
    { value: 'other', label: 'Other', icon: '⚠️' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FFC107' },
    { value: 'high', label: 'High', color: '#FF9800' },
    { value: 'extreme', label: 'Extreme', color: '#F44336' },
  ];

  const nepaliCities = [
    "Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Biratnagar", 
    "Birgunj", "Dharan", "Butwal", "Nepalgunj", "Hetauda",
    "Janakpur", "Bharatpur", "Mahendranagar", "Itahari", "Dhulikhel"
  ];

  useEffect(() => {
    // Load TensorFlow.js model when component mounts
    const loadModel = async () => {
      setIsModelLoading(true);
      await tf.ready();
      setIsModelLoading(false);
    };
    loadModel();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'location') {
      if (value.length > 2) {
        const filtered = nepaliCities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        );
        setLocationSuggestions(filtered);
        setShowLocationSuggestions(true);
      } else {
        setShowLocationSuggestions(false);
      }
    }
  };

  const selectLocation = (location) => {
    setFormData(prev => ({ ...prev, location }));
    setShowLocationSuggestions(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select a valid image (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const imageURL = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: imageURL
    }));
    setError(null);

    // Run MobileNet model to validate if image is a vehicle
    try {
      setIsModelLoading(true);
      const img = new Image();
      img.src = imageURL;
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          const model = await mobilenet.load();
          const predictions = await model.classify(img);

          const vehicleKeywords = ['car', 'truck', 'bus', 'motorcycle', 'bike', 'van', 'vehicle', 'auto'];
          const match = predictions.some(pred =>
            vehicleKeywords.some(keyword =>
              pred.className.toLowerCase().includes(keyword)
            )
          );

          setIsVehicleImage(match);
          if (!match) {
            setError('Image does not appear to be a vehicle. Please upload a clear photo of the vehicle.');
            setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
          }
        } catch (modelError) {
          console.error('Model error:', modelError);
          setError('Could not verify vehicle image. Please ensure it shows the vehicle clearly.');
        } finally {
          setIsModelLoading(false);
        }
      };
    } catch (err) {
      setIsModelLoading(false);
      setError('Error processing image. Please try again.');
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', uploadPreset);
    data.append('folder', 'pollution_reports');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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
  };

  const submitReportToBackend = async (reportData) => {
    // In a real app, this would be an API call to your backend
    console.log('Submitting report:', reportData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, reportId: `REP-${Date.now()}` };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.location) {
      setError('Vehicle number and location are required.');
      return;
    }

    if (formData.image && !isVehicleImage) {
      setError('Please upload a valid vehicle image.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      let imageData = null;
      if (formData.image) {
        imageData = await uploadImageToCloudinary(formData.image);
      }

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

      const response = await submitReportToBackend(reportData);
      if (response.success) {
        setSubmitSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
    setIsVehicleImage(null);
  };

  return (
    <motion.div 
      className="report-pollution-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="report-container">
        <motion.div 
          className="report-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="report-header">
            <h1>Report Polluting Vehicle</h1>
            <p>Help make our cities cleaner by reporting vehicles causing pollution</p>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <FiAlertCircle className="error-icon" />
                  <span>{error}</span>
                  <button 
                    type="button" 
                    className="close-error" 
                    onClick={() => setError(null)}
                  >
                    <FiX />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Number</label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                placeholder="e.g. Ba 1 Pa 1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group location-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Where did you see this pollution?"
                value={formData.location}
                onChange={handleChange}
                required
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="location-suggestions">
                  {locationSuggestions.map((city, index) => (
                    <div 
                      key={index} 
                      className="suggestion-item"
                      onClick={() => selectLocation(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Pollution Type</label>
              <div className="pollution-types">
                {pollutionTypes.map(type => (
                  <label 
                    key={type.value} 
                    className={`pollution-type-option ${formData.pollutionType === type.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="pollutionType"
                      value={type.value}
                      checked={formData.pollutionType === type.value}
                      onChange={handleChange}
                    />
                    <span className="pollution-icon">{type.icon}</span>
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Severity Level</label>
              <div className="severity-levels">
                {severityLevels.map(level => (
                  <label 
                    key={level.value} 
                    className="severity-option"
                    style={{ 
                      backgroundColor: formData.severity === level.value ? level.color : '#f5f5f5',
                      color: formData.severity === level.value ? '#fff' : '#333'
                    }}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      checked={formData.severity === level.value}
                      onChange={handleChange}
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide additional details about the pollution incident..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Upload Vehicle Photo</label>
              <div className={`image-upload ${formData.imagePreview ? 'has-image' : ''}`}>
                {!formData.imagePreview ? (
                  <>
                    <label htmlFor="image-upload" className="upload-prompt">
                      <FiCamera className="upload-icon" />
                      <span>Click to upload vehicle photo</span>
                      <span className="upload-hint">(Max 5MB, JPEG/PNG)</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </>
                ) : (
                  <div className="image-preview-container">
                    <div className="image-preview-wrapper">
                      <img
                        src={formData.imagePreview}
                        alt="Vehicle preview"
                        ref={imageRef}
                        className="image-preview"
                      />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={removeImage}
                        disabled={isSubmitting}
                      >
                        <FiX />
                      </button>
                    </div>
                    {isModelLoading && (
                      <div className="image-processing">
                        <div className="processing-spinner"></div>
                        <span>Verifying vehicle image...</span>
                      </div>
                    )}
                    {isVehicleImage === true && (
                      <div className="image-verified">
                        <FiCheckCircle className="verified-icon" />
                        <span>Vehicle verified</span>
                      </div>
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div 
                          className="progress-bar"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <span>{uploadProgress}% uploaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting || isModelLoading}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <FiUpload className="submit-icon" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {submitSuccess && (
            <motion.div 
              className="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="success-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <FiCheckCircle className="success-icon" />
                <h2>Report Submitted Successfully!</h2>
                <p>Thank you for helping make our environment cleaner. Your report has been received and will be reviewed.</p>
                <button 
                  className="success-btn"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReportPollutionPage;