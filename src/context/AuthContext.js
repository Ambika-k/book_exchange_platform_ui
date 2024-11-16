import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Initialize authData from localStorage
    const [authData, setAuthData] = useState(() => {
        const savedAuthData = localStorage.getItem("authData");
        return savedAuthData ? JSON.parse(savedAuthData) : null;
    });

    // Login function to update authData and store it in localStorage
    const login = (data) => {
        console.log('update login details')
        setAuthData(data);
        localStorage.setItem("authData", JSON.stringify(data)); // Save to localStorage
    };

    // Logout function to clear authData and remove it from localStorage
    const logout = () => {
        setAuthData(null);
        localStorage.removeItem("authData"); // Clear from localStorage
    };

    // Check authData on mount to sync state with localStorage
    useEffect(() => {
        const savedAuthData = localStorage.getItem("authData");
        if (savedAuthData) {
            setAuthData(JSON.parse(savedAuthData));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
