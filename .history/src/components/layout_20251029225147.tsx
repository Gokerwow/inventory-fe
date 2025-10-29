// components/Layout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { ToasterCustom } from '../components/toaster'

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 2. Periksa "sinyal" yang Anda kirim
        const shouldShowToast = location.state?.showLoginToast;

        if (shouldShowToast) {

            // 3. Panggil toast.custom dengan komponen Anda!
            toast.custom((t) => (
                <ToasterCustom t={t} />
            ), {
                position: 'top-center',
                duration: 4000,
            });

            // 4. (PENTING) Bersihkan state agar tidak muncul lagi
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

        // Gunakan useEffect untuk memeriksa 'state' setiap kali halaman dimuat
    useEffect(() => {
        // Ambil pesan yang dikirim dari 'navigate'
        const message = location.state?.toastMessage;

        if (message) {
            // 1. Tampilkan toast!
            toast.success(message);

            // 2. Hapus state agar toast tidak muncul lagi saat refresh
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]); // Jalankan efek ini setiap kali lokasi berubah

    return (
        <div className="flex h-screen fixed w-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
                <Toaster />
                <TopBar />
                <div className="overflow-auto p-8 flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;