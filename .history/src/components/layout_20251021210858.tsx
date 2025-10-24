// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className='flex-1 h-full'>
                <TopBar />
                <div className='h-full overflow-hidden bg-amber-700'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;