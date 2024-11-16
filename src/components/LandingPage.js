import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to the Book Exchange Platform</h1>
      <p>Discover, exchange, and lend books with ease.</p>

      <div className="buttons">
        <button className="button sign-up" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
        <button className="button login" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
