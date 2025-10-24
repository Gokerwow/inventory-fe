// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import SimbaLogo from '../assets/Light Logo new 1.png';

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <div className='pl-4 h-full'>
                <img src={SimbaLogo} alt="Simba Logo" />
            </div>

            <div className="flex flex-1 gap-4 p-4 overflow-hidden pt-25">

                {/* === SIDEBAR === */}
                <div className="w-[394px] flex-shrink-0">
                    <SideBar />
                </div>

                {/* === KONTEN UTAMA === */}
                <div className="flex-1 overflow-y-auto scrollbar-custom px-4">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default Layout;