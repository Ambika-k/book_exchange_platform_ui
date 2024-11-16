import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/login', credentials);
      if (response.status === 200) {
        setUserData(response.data); // Store user data upon successful login
        login(response.data);
        setErrorMessage('');
        console.log('User Data:', response.data); // Handle user data as needed
        navigate("/book-listing");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setUserData(null);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {userData && (
        <div className="user-data">
          <p>Welcome, {userData.name}!</p>
          <p>Email: {userData.email}</p>
          <p>Mobile Number: {userData.mobileNumber}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate('/')}>Go to Landing Page</button>
        <button onClick={() => navigate('/signup')}>Go to Sign Up Page</button>
      </div>
    </div>
  );
}

export default Login;
