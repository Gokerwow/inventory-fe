// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import toast from 'react-hot-toast';

function Layout() {
    return (
        <div className="flex h-screen fixed w-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
                <TopBar />
                <div className="overflow-auto p-8 flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;