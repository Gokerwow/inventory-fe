// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import Background from '../assets/background.png';
import SimbaLogo from '../assets/Light Logo new 1.png';

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <img src={Background} alt="Background" className='absolute w-full' />

            <div className='flex'>
                {/* Sidebar  */}
                <div className='p-4 h-screen fixed top-0 left-0 flex flex-col w-[394px] z-10'>
                    <div className='p-4'>
                        <img src={SimbaLogo} alt="Simba Logo" />
                    </div>
                    <SideBar />
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 ml-[394px] p-3 px-6">
                    <TopBar />
                    <div className="flex-1 bg-gray-100 overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;