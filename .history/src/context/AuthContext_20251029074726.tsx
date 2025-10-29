// src/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react';

// Data pengguna palsu (mock user data)
const MOCK_USERS = {
    superAdmin: {
        user_id: 1,
        name: 'Admin Ganteng',
        role: 'admin',
        email: 'admin@rsudbalung.com',
    },
    adminGudangUmum: {
        id: 2,
        name: 'User Biasa',
        role: 'user',
        email: 'user@rsudbalung.com',
    },
    timPPK: {
        id: 2,
        name: 'User Biasa',
        role: 'user',
        email: 'user@rsudbalung.com',
    },
    timTeknis: {
        id: 2,
        name: 'User Biasa',
        role: 'user',
        email: 'user@rsudbalung.com',
    },
    penaggungJawab: {
        id: 2,
        name: 'User Biasa',
        role: 'user',
        email: 'user@rsudbalung.com',
    },
    instalasi: {
        id: 2,
        name: 'User Biasa',
        role: 'user',
        email: 'user@rsudbalung.com',
    },
};

// 1. Buat Context-nya
const AuthContext = createContext(null);

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children } : { children: React.ReactNode }) {
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