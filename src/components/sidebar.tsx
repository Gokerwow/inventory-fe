import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import { NavLink, useNavigate } from 'react-router-dom';
import SimbaLogo from '../assets/logoSimbaDark.png';
import LogoutIcon from '../assets/logout.svg?react'
import { useAuth } from '../hooks/useAuth';
import PegawaiIcon from '../assets/hashtag.svg?react'
import { ROLES } from '../constant/roles';


export default function SideBar() {
    const menuItems = [
        { path: '/akun', icon: PenerimaanIcon, label: 'Akun', role: [ROLES.SUPER_ADMIN] },
        { path: '/pegawai', icon: PegawaiIcon, label: 'Pegawai', role: [ROLES.SUPER_ADMIN] },
        { path: '/monitoring', icon: PenerimaanIcon, label: 'Monitoring', role: [ROLES.SUPER_ADMIN] },
        { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard', role: [ROLES.ADMIN_GUDANG] },
        { path: '/stok-barang', icon: ChartIcon, label: 'Stok Barang', role: [ROLES.ADMIN_GUDANG] },
        { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan', role: [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS] },
        { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran', role: [ROLES.PENANGGUNG_JAWAB, ROLES.ADMIN_GUDANG] },
        { path: '/pemesanan', icon: PengeluaranIcon, label: 'Pengeluaran', role: [ROLES.INSTALASI] },
    ];
    
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = () => {
        // Navigasi manual di sidebar
        navigate('/role-pick');
        // Jalankan logout setelah navigasi
        setTimeout(() => {
            logout();
        }, 100);
    };

    const allowedMenuItems = menuItems.filter((menuItem) => {
        if (!user) {
            return false;
        }
        return menuItem.role.includes(user.role);
    })

    return (
        <div className='w-[300px] h-full bg-[#057CFF]'>
            <div className="text-white flex flex-col h-full rounded-lg overflow-hidden shadow-md">
                <div className='flex justify-center items-center border-b-2 border-white'>
                    <img src={SimbaLogo} alt="Simba Logo" />
                </div>
                <ul className='flex flex-col gap-6 px-4 py-10 '>
                    {allowedMenuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive
                                        ? 'bg-white/20 text-white translate-x-5'
                                        : ' text-white hover:bg-white/20 hover:text-white group hover:translate-x-5'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={`w-6 h-6 fill-current transition-colors ${isActive
                                                ? 'text-white'
                                                : 'text-white group-hover:text-white'
                                                }`}
                                        />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <div onClick={handleLogout} className='bg-red-800 p-2 flex justify-center items-center gap-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200'>
                            <LogoutIcon />
                            <span>Logout</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}