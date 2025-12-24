import { useState, useMemo, useCallback, useEffect } from 'react'; // <-- TAMBAHKAN useMemo dan useCallback
import { AuthContext } from './AuthContext.tsx'

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
        isAuthenticated: !!localStorage.getItem('access_token'),
        isLoggingOut,
    }), [user, login, logout, isLoggingOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
