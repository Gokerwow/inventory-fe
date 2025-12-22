import { useState, useMemo, useCallback } from 'react'; // <-- TAMBAHKAN useMemo dan useCallback
import { AuthContext } from './AuthContext.tsx'

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    // Ganti fungsi login yang lama dengan ini:
    const login = useCallback(() => {
        // Redirect browser ke Backend Inventory
        window.location.href = 'http://localhost:8001/api/sso/login';
    }, []);

    // --- UBAHAN: Stabilkan 'logout' dengan useCallback ---
    const logout = useCallback(() => {
        // 3. Set flag logout jadi TRUE
        setIsLoggingOut(true);

        // Hapus data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setUser(null);

        // Redirect
        window.location.href = 'http://localhost:8001/api/sso/logout';
    }, []);

    // --- UBAHAN: Stabilkan 'value' dengan useMemo ---
    // Nilai yang akan dibagikan ke semua komponen
    const value = useMemo(() => ({
        user,   // Data user saat ini (null jika guest)
        login,  // Fungsi untuk login
        logout, // Fungsi untuk logout
        isAuthenticated: !!user, // boolean (true/false)
        isLoggingOut,
    }), [user, login, logout, isLoggingOut]); // <-- Hanya buat objek 'value' baru jika user, login, atau logout berubah

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}