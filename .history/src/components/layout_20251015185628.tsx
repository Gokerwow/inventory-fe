// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />
            <div className='relative flex p-4 gap-4'>
                <div className='fixed'>
                    <SideBar />
                </div>
                <div className='flex-1 ml-[394px]'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;