// src/context/AuthContext.jsx
import { type User } from '../constant/roles';
import { createContext } from 'react';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoggingOut: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null);
