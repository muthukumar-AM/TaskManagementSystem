import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../../App.css'; // Make sure to import your CSS file for styling

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const location = useLocation();
  const hasFetchedRef = useRef(false); // Ref to track if fetch has already happened

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setLoading(false);
        setFailureMessage('Token not found.');
        return;
      }

      try {                               
        const response = await axios.get(`https://taskmanagementsystem-64t8.onrender.com/api/verify-email/${token}`);
        
        if (response.data.success) {
          setSuccessMessage('Email verified successfully! Redirecting to login');
          // Redirect logic commented out for now
          // setTimeout(() => {
          //   window.location.href = '/login'; // Redirect to login page after 3 seconds
          // }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          setFailureMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        setFailureMessage(error.response?.data || 'Verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedRef.current) {
      verifyEmail();
      hasFetchedRef.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="verify-email-container">
      {loading ? (
        <div className="loading-container">
          <div className="clock-loader">
            <div className="clock">
              <div className="hand hour"></div>
              <div className="hand minute"></div>
            </div>
          </div>
          <div className="loading-text">Verifying email...</div>
        </div>
      ) : (
        <div className="response-message">
          {successMessage && <p className="success">{successMessage}</p>}
          {failureMessage && <p className="error">{failureMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
