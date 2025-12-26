import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar';
import TopBar from '../components/topBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { ToasterCustom } from '../components/toaster';
import { useAuth } from '../hooks/useAuth';
import { debugLog } from '../utils/debugLogger';

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isLoggingOut, login } = useAuth();

    // Effect pertama: Clear flag jika tidak ada token (logout selesai)
    useEffect(() => {
        const loggingOutFlag = sessionStorage.getItem('logging_out') === 'true';
        const hasToken = !!localStorage.getItem('access_token');

        debugLog('Layout: Checking logout state', {
            loggingOutFlag,
            hasToken,
            isAuthenticated,
            isLoggingOut
        });

        // Jika flag logout masih ada TAPI tidak ada token, berarti logout sudah selesai
        if (loggingOutFlag && !hasToken) {
            debugLog('Layout: Logout completed, clearing flag');
            sessionStorage.removeItem('logging_out');
        }
    }, [isAuthenticated, isLoggingOut]);

    // Effect kedua: Auto-login
    useEffect(() => {
        debugLog('Layout: useEffect triggered', {
            isAuthenticated,
            isLoggingOut,
            loggingOutFlag: sessionStorage.getItem('logging_out'),
            pathname: location.pathname
        });

        if (sessionStorage.getItem('logging_out') === 'true') {
            debugLog('Layout: Blocked auto-login - logging_out flag is true');
            return;
        }

        if (!isAuthenticated && !isLoggingOut) {
            debugLog('Layout: Calling login()');
            login();
        }
    }, [isAuthenticated, isLoggingOut, login, location.pathname]);

    // Effect ketiga: Toast notifications
    useEffect(() => {
        const isLoginSuccess = localStorage.getItem('login_success');
        if (isLoginSuccess) {
            debugLog('Layout: Login success toast shown');
            toast(<ToasterCustom message="Login Berhasil! Selamat Datang." type="success" />, {
                className: '!bg-transparent !shadow-none !p-0 !min-h-0 !mb-0 overflow-visible',
                bodyClassName: '!p-0 !m-0 !flex-none',
                position: 'top-right',
                icon: false,
                closeButton: false,
            });
            localStorage.removeItem('login_success');
        }

        const message = location.state?.toastMessage;
        if (message) {
            toast(<ToasterCustom message={message} />, {
                className: '!bg-transparent !shadow-none !p-0 !min-h-0 !mb-0 overflow-visible',
                bodyClassName: '!p-0 !m-0 !flex-none',
                position: 'top-right',
                icon: false,
                closeButton: false,
            });
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

    if (isLoggingOut || sessionStorage.getItem('logging_out') === 'true') {
        debugLog('Layout: Showing logout loading');
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
        debugLog('Layout: Showing login loading');
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h2 className="text-lg font-semibold text-gray-700">Memuat...</h2>
                </div>
            </div>
        );
    }

    debugLog('Layout: Rendering main layout');
    return (
        <div className="flex h-screen fixed w-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
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
                
                <TopBar />
                
                <div id="modal-portal-root" className="overflow-auto p-8 flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;