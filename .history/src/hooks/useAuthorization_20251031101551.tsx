// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths';

export const useAuth = (requiredRole = null) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulasi cek user dari localStorage/context/API
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        // Jika requiredRole diberikan, cek apakah user memiliki role tersebut
        if (requiredRole && userData?.role !== requiredRole) {
          navigate(PATHS.UNAUTHORIZED);
          return;
        }
        
      } catch (error) {
        console.error('Auth check error:', error);
        navigate(PATHS.UNAUTHORIZED);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, navigate]);

  return { user, loading };
};