import { useState, useMemo, useCallback } from 'react'; // Hapus useEffect yang tidak perlu
import { AuthContext } from './AuthContext.tsx'

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

    const logout = useCallback(() => {
        setIsLoggingOut(true);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = 'http://localhost:8001/api/sso/logout';
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