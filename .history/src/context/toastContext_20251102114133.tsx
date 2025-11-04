import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import ToasterCustom from '../components/toaster';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const backgroundColor = type === 'success' ? '#00A991' : '#EF4444';
        
        toast(<ToasterCustom message={message} />, {
            style: {
                background: backgroundColor,
                borderRadius: '30px',
                color: 'white',
                position: 'relative',
                marginTop: '5rem'
            },
            position: 'top-right',
        });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};