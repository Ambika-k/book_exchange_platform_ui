import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const { authData } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            console.log("new and confirm passwords doesnt match");
            setErrorMessage("New password and confirm password do not match.");
            setSuccessMessage('');
            return;
        }

        if (oldPassword === newPassword) {
            console.log("new password matches with old ");
            setErrorMessage("New password must be different from old password.");
            setSuccessMessage('');
            return;
        }

        try {
            console.log("all checks passed making api call");
            const response = await axios.post(
                `http://localhost:8080/user/resetpassword?email=${authData.email}`, 
                {
                    oldPassword,
                    newPassword
                }
            );
            if (response.status === 200 && response.data.message) {
                console.log(response.data.message);
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Password reset failed.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Home Button to navigate to BookListing page */}
            <button className="home-button" onClick={() => navigate('/book-listing')}>Home</button>

        </div>
    );
};

export default ResetPassword;
