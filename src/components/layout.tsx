// components/Layout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // <-- WAJIB Impor CSS-nya
import { useEffect } from 'react';
import { ToasterCustom } from '../components/toaster';
import { useAuth } from '../hooks/useAuth';


function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isLoggingOut, login } = useAuth();

    // Gunakan useEffect untuk memeriksa 'state' setiap kali halaman dimuat
    useEffect(() => {
        // Ambil pesan yang dikirim dari 'navigate'
        const message = location.state?.toastMessage;

        if (message) {
            // 1. Tampilkan toast!
            toast(<ToasterCustom message={message} />, {
                // Beri style pada container-nya
                style: {
                    background: '#00A991',
                    borderRadius: '30px',
                    color: 'white',
                    position: 'relative',
                },
                progress: undefined,
                position: 'top-right',
            });

            // 2. Hapus state agar toast tidak muncul lagi saat refresh
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]); // Jalankan efek ini setiap kali lokasi berubah

    // 1. JIKA SEDANG PROSES LOGOUT
    // Tampilkan loading visual, jangan layar putih kosong/gepeng
    if (isLoggingOut) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-gray-50">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Sedang Keluar...</h2>
                    <p className="text-sm text-gray-500">Mohon tunggu sebentar.</p>
                </div>
            </div>
        );
    }

    // 2. JIKA BELUM LOGIN (Dan bukan sedang logout)
    if (!isAuthenticated) {
        // PENTING: Jangan return null begitu saja!
        // Kita harus paksa redirect ke login SSO di sini, 
        // karena Layout membungkus semua halaman.

        // Panggil login() secara manual agar tidak stuck di layar putih
        login();

        // Sambil menunggu redirect, tampilkan loading
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Mengalihkan ke Login...</p>
            </div>
        );
    }

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
                    style={{
                        top: '8rem', // Jarak dari atas untuk container
                    }}
                    toastStyle={{
                        marginBottom: '2rem' // Jarak antar toast
                    }}
                />
                <TopBar />
                <div
                    id="modal-portal-root"
                    className="overflow-auto p-8 flex-1 relative"
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;