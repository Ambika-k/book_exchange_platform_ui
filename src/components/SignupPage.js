import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'
function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobileNumber: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/register', formData);
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Registration successful! Please log in.');
        setErrorMessage('');
        setTimeout(() => {
            navigate('/login'); // Redirect to login page after successful registration
          }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate('/')}>Go to Landing Page</button>
        <button onClick={() => navigate('/login')}>Go to Login Page</button>
      </div>
    </div>
  );
}

export default SignUp;
