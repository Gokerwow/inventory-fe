// src/context/AuthContext.jsx
import { MOCK_USERS, MockUser, UserRoles } from '../Mock Data/data.ts'
import { createContext, useContext, useState } from 'react';

export interface AuthContextType {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (role: UserRoles) => void; // Tentukan 'role' harus salah satu dari UserRoles
    logout: () => void;
}

// 1. Buat Context-nya
export const AuthContext = createContext<AuthContextType | null>(null);

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('mockUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Fungsi untuk "login"
    const login = (role: UserRoles) => {
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

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}