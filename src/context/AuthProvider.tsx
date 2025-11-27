import { useState, useMemo, useCallback } from 'react'; // <-- TAMBAHKAN useMemo dan useCallback
import { MOCK_USERS, type Usernames } from '../Mock Data/data.ts'
import { AuthContext } from './AuthContext.tsx'
import { useNavigate } from 'react-router-dom';
// import apiClient from '../services/api.ts';
import { menuItems } from '../constant/roles.ts';
import { useTag } from '../hooks/useTag.tsx';

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setTag } = useTag()

    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    const getDefaultMenuItem = (role: string) => {
        // Cari menu pertama yang mengizinkan role ini
        const item = menuItems.find(menu => menu.role.includes(role));

        // Return item utuh. 
        // Jika tidak ketemu, return undefined (atau bisa Anda set default object lain)
        return item;
    };
    // --- UBAHAN: Stabilkan 'login' dengan useCallback ---
    const login = useCallback((username: Usernames) => {
        const userToLogin = MOCK_USERS.find(user => user.nama_pengguna === username);
        if (userToLogin) {
            localStorage.setItem('currentUser', JSON.stringify(userToLogin));
            setUser(userToLogin);
            const menuObj = getDefaultMenuItem(userToLogin.role);
            const targetPath = menuObj ? menuObj.path : '/dashboard';
            setTag(menuObj?.tag)
            navigate(targetPath, {
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