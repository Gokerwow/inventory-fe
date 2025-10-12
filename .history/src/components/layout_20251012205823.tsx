import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import Background from './assets/background.png';
import SimbaLogo from './assets/Light Logo new 1.png';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen">
            <img src={Background} alt="Background" className='absolute w-full' />

            <div className='flex'>
                {/* Sidebar */}
                <div className='p-4 h-screen fixed top-0 flex flex-col w-64 z-10'>
                    <div className='p-4'>
                        <img src={SimbaLogo} alt="Simba Logo" />
                    </div>
                    <SideBar />
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 ml-64">
                    <TopBar />
                    <div className="flex-1 bg-gray-100 overflow-auto">
                        <Outlet /> {/* Ini akan render komponen sesuai route */}
                    </div>
                </div>
            </div>
        </div>
    )
}