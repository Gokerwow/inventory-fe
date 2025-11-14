// src/context/AuthContext.jsx
import type { Usernames } from '../constant/roles.ts';
import type { MockUser } from '../Mock Data/data.ts'
import { createContext } from 'react';

export interface AuthContextType {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (username: Usernames) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
