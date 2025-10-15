// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar'
import TopBar from '../components/topBar'

function Layout() {
    return (
<div className="flex flex-col h-screen">
    <TopBar />

    {/* Ganti dari flex-col menjadi flex (defaultnya row) */}
    <div className="flex flex-1"> 
        {/* Hapus class 'fixed', 'top-0', 'left-0', 'z-10', dan 'h-full' */}
        <div className='w-[394px]'>
            <SideBar />
        </div>
        
        {/* Hapus 'ml-[394px]' dan pindahkan background oranye ke sini */}
        <div className="flex-1 overflow-auto bg-amber-500 p-6">
            <Outlet />
        </div>
    </div>
</div>
    );
}

export default Layout;