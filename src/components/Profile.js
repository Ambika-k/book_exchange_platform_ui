import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();

    if (!authData) {
        return <p>Loading...</p>;
    }
    const goToHome = () => {
        navigate('/book-listing');
    };
    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-card">
                <p><strong>Name:</strong> {authData.name}</p>
                <p><strong>Email:</strong> {authData.email}</p>
                <p><strong>Mobile Number:</strong> {authData.mobileNumber}</p>
            </div>
            <button className="home-button" onClick={goToHome}>
                Home
            </button>
        </div>
    );
};

export default Profile;
