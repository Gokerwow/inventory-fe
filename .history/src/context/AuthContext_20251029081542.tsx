// src/context/AuthContext.jsx
import { MOCK_USERS, MockUser, UserRoles } from '../Mock Data/data.ts'
import { createContext, useState } from 'react';

export interface AuthContextType {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (role: UserRoles) => void; // Tentukan 'role' harus salah satu dari UserRoles
    logout: () => void;
}

// 1. Buat Context-nya
export const AuthContext = createContext<AuthContextType | null>(null);
