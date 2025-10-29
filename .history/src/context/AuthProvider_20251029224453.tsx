import { useState } from 'react';
import { MOCK_USERS, type UserRoles } from '../Mock Data/data.ts'
import { AuthContext } from './AuthContext.tsx'
import { useNavigate } from 'react-router-dom';

const ROLE_PATHS: Record<UserRoles, string> = {
    'Super Admin': '/akun',
    'Admin Gudang Umum': '/dashboard',
    'Tim PPK': '/penerimaan',
    'Tim Teknis': '/penerimaan',
    'Penanggung Jawab': '/pengeluaran',
    'Instalasi': '/pemesanan',
};

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('mockUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    // Fungsi untuk "login"
    const login = (role: UserRoles) => {
        const userToLogin = MOCK_USERS.find(user => user.role === role);
        if (userToLogin) {
            localStorage.setItem('mockUser', JSON.stringify(userToLogin));
            setUser(userToLogin);
            const path = ROLE_PATHS[role]; // Sekarang path akan menjadi '/dashboard'
            navigate(path, { 
                state: { toastMessage: 'Anda berhasil Login!' } 
            });
            console.log(`Simulasi: Login sebagai ${role}`);
        } 
    };

    // Fungsi untuk "logout"
    const logout = () => {
        localStorage.removeItem('mockUser');
        setUser(null);
        console.log('Simulasi: Logout');
    };

    // Nilai yang akan dibagikan ke semua komponen
    const value = {
        user,   // Data user saat ini (null jika guest)
        login,  // Fungsi untuk login
        logout, // Fungsi untuk logout
        isAuthenticated: !!user, // boolean (true/false)
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}