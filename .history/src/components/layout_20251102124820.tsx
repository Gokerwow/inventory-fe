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

    return (
        <div className="flex h-screen fixed w-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    closeButton={false}
                    style={{
                        top: '5rem', // Jarak dari atas untuk container
                    }}
                    toastStyle={{
                        marginBottom: '1rem' // Jarak antar toast
                    }}
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