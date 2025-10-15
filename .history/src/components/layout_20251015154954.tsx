// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />
            <div className='flex bg-amber-600'>
                <SideBar />
                <div className='flex-1 p-4'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;