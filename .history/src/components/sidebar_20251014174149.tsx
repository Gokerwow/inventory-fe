import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import ProfilIcon from '../assets/profil.svg?react';
import LogoutIcon from '../assets/LogoutIcon.svg?react';
import { NavLink } from 'react-router-dom';

export default function SideBar() {
    const menuItems = [
        { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { path: '/pencatatan-stok', icon: ChartIcon, label: 'Pencatatan Stok' },
        { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan' },
        { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran' },
        { path: '/profil', icon: ProfilIcon, label: 'Profil' },
    ];

    return (
        <div className='w-[394px] p-4 flex-1'>
            <div className="bg-[#CADCF2] text-white flex flex-col justify-between h-full rounded-lg overflow-hidden shadow-md border-2 border-white">
                <ul className='flex flex-col gap-6 px-4 py-10'>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-white text-[#6E7781] hover:bg-gray-700 hover:text-white group'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={`w-6 h-6 fill-current transition-colors ${isActive
                                                ? 'text-white'
                                                : 'text-[#6E7781] group-hover:text-white'
                                                }`}
                                        />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}

                </ul>
                <div className='w-full h-[21%] flex justify-center items-end bg-[#ADCDF4] px-4 py-10'>
                    {/* Logout - Pisah karena bukan navigasi biasa */}
                    <button
                        onClick={() => {
                            // Handle logout logic di sini
                            console.log('Logout clicked');
                        }}
                        className='flex items-center gap-4 p-2 bg-white hover:bg-red-600 group rounded-md cursor-pointer transition-all duration-300 w-full text-left'
                    >
                        <LogoutIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Logout</span>
                    </button>

                </div>
            </div>
        </div>
    );
}