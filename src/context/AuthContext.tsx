// src/context/AuthContext.jsx
import type { MockUser, UserRoles } from '../Mock Data/data.ts'
import { createContext } from 'react';

export interface AuthContextType {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (role: UserRoles) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
