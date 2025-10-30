// components/Layout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // <-- WAJIB Impor CSS-nya
import { useEffect } from 'react';
import { ToasterCustom } from '../components/toaster';


function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Gunakan useEffect untuk memeriksa 'state' setiap kali halaman dimuat
    useEffect(() => {
        // Ambil pesan yang dikirim dari 'navigate'
        const message = location.state?.toastMessage;

        if (message) {
            // 1. Tampilkan toast!
            toast(<ToasterCustom />, {
                // Beri style pada container-nya
                className: 'bg-[#00A991] rounded-xl text-white',
                progress: undefined,
            });

            // 2. Hapus state agar toast tidak muncul lagi saat refresh
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]); // Jalankan efek ini setiap kali lokasi berubah

    return (
        <div className="flex h-screen fixed w-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
                <ToastContainer
                    position="top-center"
                    autoClose={4000}
                    hideProgressBar
                    closeOnClick
                    pauseOnHover
                />
                <TopBar />
                <div className="overflow-auto p-8 flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;