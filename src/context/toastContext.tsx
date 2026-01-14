import { createContext } from 'react';


interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
