// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="relative flex flex-col h-screen">
            {/* <TopBar />   */}
            <div className='relative flex flex-1 p-4 gap-4 pt-20 h-full bg-amber-600'>
                <SideBar />
                <div className='flex-1 ml-[394px] pl-4'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;