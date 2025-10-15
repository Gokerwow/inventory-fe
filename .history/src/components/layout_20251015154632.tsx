// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />

            {/* Wrapper utama untuk sidebar dan konten */}
            <div className="flex flex-1 overflow-hidden">
                {/* === SIDEBAR === */}
                {/* Diberi lebar tetap dan dicegah agar tidak menyusut */}
                <div className="w-[394px] flex-shrink-0">
                    <SideBar />
                </div>

                {/* === KONTEN UTAMA === */}
                {/* flex-1 agar mengisi sisa ruang & overflow-y-auto agar bisa scroll */}
                <div className="flex-1 bg-amber-500 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;