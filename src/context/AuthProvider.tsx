import { useState, useMemo, useCallback } from 'react'; // Hapus useEffect yang tidak perlu
import { AuthContext } from './AuthContext.tsx';
import axios from 'axios';

export function AuthProvider({ children }: { children: React.ReactNode; }) {
    const [user, setUser] = useState(() => {
        try {
            const token = localStorage.getItem('access_token'); // Pastikan nama key SAMA dengan di api.ts
            const storedUser = localStorage.getItem('user');

            return (token && storedUser) ? JSON.parse(storedUser) : null;
        } catch (error) {
            return null;
        }
    });

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const login = useCallback(() => {
        window.location.href = 'http://localhost:8001/api/sso/login';
    }, []);

    const logout = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('http://localhost:8001/api/v1/sso/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.clear();
            setUser(null);

            if (response.data.target_url) {
                window.location.href = response.data.target_url;
            }
        } catch (error) {
            localStorage.clear();
            setUser(null);
            window.location.href = '/login';
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