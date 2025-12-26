// src/context/AuthProvider.tsx
import { useState, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthContext.tsx';
import apiClient from '../utils/api.ts';
import { debugLog } from '../utils/debugLogger.tsx';

export function AuthProvider({ children }: { children: React.ReactNode; }) {
    const [user, setUser] = useState(() => {
        try {
            debugLog('AuthProvider: Initializing');
            
            if (sessionStorage.getItem('logging_out') === 'true') {
                debugLog('AuthProvider: logging_out flag detected, returning null');
                return null;
            }
            
            const token = localStorage.getItem('access_token');
            const storedUser = localStorage.getItem('user');
            
            debugLog('AuthProvider: Initial check', { 
                hasToken: !!token, 
                hasUser: !!storedUser 
            });

            return (token && storedUser) ? JSON.parse(storedUser) : null;
        } catch (error) {
            debugLog('AuthProvider: Error initializing', error);
            return null;
        }
    });

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const login = useCallback(() => {
        if (sessionStorage.getItem('logging_out') === 'true') {
            debugLog('login: Blocked - logging_out flag is true');
            return;
        }
        
        debugLog('login: Redirecting to SSO login');
        window.location.href = 'http://localhost:8001/api/sso/login';
    }, []);

    const logout = useCallback(async () => {
        debugLog('logout: START');
        
        setIsLoggingOut(true);
        sessionStorage.setItem('logging_out', 'true');
        debugLog('logout: Flags set', { isLoggingOut: true, sessionFlag: 'true' });

        try {
            debugLog('logout: Calling API');
            const response = await apiClient.post('/api/v1/sso/logout');
            debugLog('logout: API success', response.data);

            localStorage.clear();
            setUser(null);
            debugLog('logout: Storage cleared');

            const targetUrl = response.data.target_url || 'http://localhost:8000/logout';
            debugLog('logout: Redirecting to', targetUrl);
            
            window.location.href = targetUrl;

        } catch (error) {
            debugLog('logout: API error', error);
            
            localStorage.clear();
            setUser(null);
            debugLog('logout: Storage cleared (error path)');
            
            debugLog('logout: Redirecting to SSO logout (error path)');
            window.location.href = 'http://localhost:8000/logout';
        }
    }, []);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoggingOut,
    }), [user, login, logout, isLoggingOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}