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
                <div className="w-[394px] flex-shrink-0">
                    <SideBar />
                </div>

        {/* === KONTEN UTAMA === */}
        <div className="flex-1 relative">
            <div className="h-full overflow-y-auto scrollbar-custom pb-20">
                <Outlet />
            </div>
            
            {/* Fade overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>

            </div>
        </div>
    );
}

export default Layout;