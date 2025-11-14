import { toast } from 'react-toastify';
import { ToasterCustom } from '../components/toaster';
import { ToastContext } from './toastContext';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const backgroundColor = type === 'success' ? '#00A991' : '#EF4444';
        
        toast(<ToasterCustom message={message} />, {
            style: {
                background: backgroundColor,
                borderRadius: '30px',
                color: 'white',
                position: 'relative',
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