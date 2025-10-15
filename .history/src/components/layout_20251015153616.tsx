// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
        <div className="flex flex-col h-screen">

            <div className='flex'>
                    <TopBar />
                {/* Sidebar  */}
                <div className='p-4 h-screen fixed top-0 left-0 flex flex-col w-[394px] z-10'>
                    <SideBar />
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 ml-[394px]">
                    <div className="flex-1 overflow-auto mb-4  p-3 px-6">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;