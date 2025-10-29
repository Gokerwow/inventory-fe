// src/context/AuthContext.jsx
import { MOCK_USERS, MockUser, UserRoles } from '../Mock Data/data.ts'
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (role: UserRoles) => void; // Tentukan 'role' harus salah satu dari UserRoles
    logout: () => void;
}

// 1. Buat Context-nya
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('mockUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Fungsi untuk "login"
    const login = (role) => {
        const userToLogin = MOCK_USERS[role];
        if (userToLogin) {
            localStorage.setItem('mockUser', JSON.stringify(userToLogin));
            setUser(userToLogin);
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Buat Custom Hook (untuk mempermudah penggunaan)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};