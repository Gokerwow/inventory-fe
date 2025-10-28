// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col flex-1 h-full">
                <TopBar />
                <div className="relative flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;