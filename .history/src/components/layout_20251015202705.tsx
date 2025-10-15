// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />

            <div className="flex flex-1 gap-4 p-4 overflow-hidden pt-25">

                {/* === SIDEBAR === */}
                {/* Beri lebar tetap dan cegah menyusut. Hapus 'fixed' */}
                <div className="w-[394px] flex-shrink-0">
                    <SideBar />
                </div>

                {/* === KONTEN UTAMA === */}
                {/* Isi sisa ruang & bisa di-scroll. Hapus margin manual */}
                <div className="flex-1 overflow-y-auto scrollbar-custom px-4">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default Layout;