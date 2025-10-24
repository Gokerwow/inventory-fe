// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className='flex-1'>
                <TopBar />
                <div className='overflow-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;