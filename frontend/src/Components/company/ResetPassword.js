import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/resetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Hook to handle navigation
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      console.log(token);
      const response = await axios.post(`http://localhost:3001/api/reset-password?token=${token}`, { password });
      setMessage(response.data.message);
      
      // Reset the input field
      setPassword('');

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/empLogin'); // Adjust this route to your login page
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
        <div className="card login-form">
      <div className="card-body">
        <h3 className="card-title text-center">Reset password</h3>
        <div className="card-text">
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="exampleInputEmail1">Enter the Password</label>
              <input 
                className="form-control form-control-sm mt-3"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-3" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default ResetPassword;
