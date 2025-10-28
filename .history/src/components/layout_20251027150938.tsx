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
<div className="relative flex-1">
    
        {/* 2. Ini adalah "WADAH SCROLL" untuk konten. */}
        {/* Dia diposisikan absolut untuk mengisi 'jangkar'. */}
        <div className="absolute inset-0 overflow-auto p-8">
            <Outlet />
            {/* Saat <Outlet> merender halaman Anda, dan halaman itu
              memanggil <ConfirmationModal>, HTML modal akan
              muncul di sini. Karena modalnya 'absolute',
              ia akan "nempel" ke 'div relative' di atas,
              bukan ke 'div overflow' ini.
            */}
        </div>
    </div>
            </div>
        </div>
    );
}

export default Layout;