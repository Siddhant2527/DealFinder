// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, token }

  const login = (username, token) => {
    setUser({ username, token });
    localStorage.setItem('auth', JSON.stringify({ username, token }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  // restore on load (use useEffect to avoid infinite re-renders)
  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.username && parsed?.token) {
          setUser(parsed);
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []); // Empty dependency array to run only once

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
