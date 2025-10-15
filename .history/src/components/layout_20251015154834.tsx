// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar />
            <div>
                <SideBar />
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;