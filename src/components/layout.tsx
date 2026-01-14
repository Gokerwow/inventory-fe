/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar';
import TopBar from '../components/topBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { ToasterCustom } from '../components/toaster';
import { useAuth } from '../hooks/useAuth';
import { debugLog } from '../utils/debugLogger';

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isLoggingOut, login } = useAuth();

    // State untuk Mobile Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- 1. LOGIKA AUTHENTICATION (DIKEMBALIKAN DARI KODE LAMA) ---
    
    // Effect: Clear flag logout jika token sudah hilang
    useEffect(() => {
        const loggingOutFlag = sessionStorage.getItem('logging_out') === 'true';
        const hasToken = !!localStorage.getItem('access_token');

        if (loggingOutFlag && !hasToken) {
            debugLog('Layout: Logout completed, clearing flag');
            sessionStorage.removeItem('logging_out');
        }
    }, [isAuthenticated, isLoggingOut]);

    // Effect: Auto-login check (PENTING AGAR TIDAK STUCK LOADING)
    useEffect(() => {
        if (sessionStorage.getItem('logging_out') === 'true') {
            return;
        }

        if (!isAuthenticated && !isLoggingOut) {
            debugLog('Layout: Calling login() for auto-auth');
            login();
        }
    }, [isAuthenticated, isLoggingOut, login, location.pathname]);

    // --- 2. LOGIKA UI & UX ---

    // Effect: Tutup sidebar saat pindah halaman
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Effect: Toast notifications
    useEffect(() => {
        const isLoginSuccess = localStorage.getItem('login_success');
        
        // Handle Login Success Toast
        if (isLoginSuccess) {
            debugLog('Layout: Login success toast shown');
            toast(<ToasterCustom message="Login Berhasil! Selamat Datang." type="success" />, {
                className: '!bg-transparent !shadow-none !p-0 !min-h-0 !mb-0 overflow-visible',
                bodyClassName: '!p-0 !m-0 !flex-none',
                position: 'top-right',
                icon: false,
                closeButton: false,
            } as any);
            localStorage.removeItem('login_success');
        }

        // Handle General Toast from Navigation State
        const message = location.state?.toastMessage;
        if (message) {
            toast(<ToasterCustom message={message} />, {
                className: '!bg-transparent !shadow-none !p-0 !min-h-0 !mb-0 overflow-visible',
                bodyClassName: '!p-0 !m-0 !flex-none',
                position: 'top-right',
                icon: false,
                closeButton: false,
            } as any);
            // Clear state agar toast tidak muncul lagi saat refresh
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

    // --- 3. LOADING STATES ---

    if (isLoggingOut || sessionStorage.getItem('logging_out') === 'true') {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h2 className="text-lg font-semibold text-gray-700">Sedang Keluar...</h2>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h2 className="text-lg font-semibold text-gray-700">Memuat...</h2>
                </div>
            </div>
        );
    }

    // --- 4. RENDER LAYOUT ---
    
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SideBar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 h-full min-w-0">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    closeButton={false}
                    className="top-4! right-4! w-auto! max-w-[400px]!"
                />

                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <div id="modal-portal-root" className="overflow-auto p-4 md:p-8 flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;