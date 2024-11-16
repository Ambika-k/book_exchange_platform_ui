import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import BookListing from "./components/BookListing";
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import BookSearchPage from './components/BookSearchPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/book-listing" element={<BookListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search" element={<BookSearchPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
