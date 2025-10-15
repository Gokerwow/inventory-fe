// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">

            <div className='flex'>
                {/* Content Area */}
                <div className="flex flex-col flex-1 ml-[394px]">
                        <SideBar />
                    <TopBar />
                    <div className="flex-1 overflow-auto mb-4  p-3 px-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;