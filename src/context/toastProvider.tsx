import { toast } from 'react-toastify';
import { ToasterCustom } from '../components/toaster';
import { ToastContext } from './toastContext';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    
    const showToast = (message: string, type: 'success' | 'error' | "warning" = 'success') => {
        
        toast.dismiss();

        toast(<ToasterCustom message={message} type={type} />, {
            className: '!bg-transparent !shadow-none !p-0 !min-h-0 !mb-5 overflow-visible',
            bodyClassName: '!p-0 !m-0 !flex-none',
            position: 'top-right',
            icon: false,
            closeButton: false,
            autoClose: 3000, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};