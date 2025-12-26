import { useState, useMemo, useCallback } from 'react'; // Hapus useEffect yang tidak perlu
import { AuthContext } from './AuthContext.tsx';
import apiClient from '../services/api.ts';

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
        setIsLoggingOut(true); // Jika pakai loading

        try {
            const response = await apiClient.post('/v1/sso/logout');

            localStorage.clear();

            const targetUrl = response.data.target_url || 'http://localhost:8000/logout';

            window.location.href = targetUrl;

        } catch (error) {
            console.error("Logout Inventory Gagal (API Error), memaksa logout SSO...", error);

            localStorage.clear();

            // --- PERBAIKAN DI SINI ---
            // JANGAN ke /login, tapi ke /logout
            // Supaya session di Port 8000 dihancurkan paksa
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