// components/Layout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';


function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 2. Periksa "sinyal" yang Anda kirim
        const shouldShowToast = location.state?.showLoginToast;

        if (shouldShowToast) {

            // 3. Panggil toast.custom dengan komponen Anda!
            toast.custom((t) => (
                <toa t={t} />
            ), {
                position: 'top-center',
                duration: 4000,
            });

            // 4. (PENTING) Bersihkan state agar tidak muncul lagi
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

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