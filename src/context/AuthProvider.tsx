import { useState, useMemo, useCallback } from 'react'; // <-- TAMBAHKAN useMemo dan useCallback
import { MOCK_USERS, type Usernames } from '../Mock Data/data.ts'
import { AuthContext } from './AuthContext.tsx'
import { useNavigate } from 'react-router-dom';
// import apiClient from '../services/api.ts';
import { USERNAMES } from '../constant/roles.ts';

const ROLE_PATHS = {
    [USERNAMES.SUPER_ADMIN] : '/akun', 
    [USERNAMES.ADMIN_GUDANG] : '/dashboard',
    [USERNAMES.PPK]: '/penerimaan',
    [USERNAMES.TEKNIS]: '/penerimaan',
    [USERNAMES.PENANGGUNG_JAWAB]: '/pengeluaran',
    [USERNAMES.INSTALASI]: '/pemesanan',
};

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    // --- UBAHAN: Stabilkan 'login' dengan useCallback ---
    const login = useCallback((username: Usernames) => {
        const userToLogin = MOCK_USERS.find(user => user.nama_pengguna === username);
        if (userToLogin) {
            localStorage.setItem('currentUser', JSON.stringify(userToLogin));
            setUser(userToLogin);
            const path = ROLE_PATHS[username];
            navigate(path, { 
                state: { toastMessage: 'Anda berhasil Login!' } 
            });
            console.log(`Simulasi: Login sebagai ${username}`);
        } 
    }, [navigate]); // <-- Dependency

    // --- UBAHAN: Stabilkan 'logout' dengan useCallback ---
    const logout = useCallback(() => {
        navigate('/role-pick');
        localStorage.removeItem('currentUser');
        setUser(null);
        console.log('Simulasi: Logout');
    }, [navigate]); // <-- Dependency

    // --- UBAHAN: Stabilkan 'value' dengan useMemo ---
    // Nilai yang akan dibagikan ke semua komponen
    const value = useMemo(() => ({
        user,   // Data user saat ini (null jika guest)
        login,  // Fungsi untuk login
        logout, // Fungsi untuk logout
        isAuthenticated: !!user, // boolean (true/false)
    }), [user, login, logout]); // <-- Hanya buat objek 'value' baru jika user, login, atau logout berubah

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}