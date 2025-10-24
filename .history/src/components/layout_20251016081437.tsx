// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'
import SimbaLogo from '../assets/Light Logo new 1.png';

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            {/* <SideBar />
            <div> */}
                <TopBar />
                {/* <Outlet />
            </div> */}
        </div>
    );
}

export default Layout;