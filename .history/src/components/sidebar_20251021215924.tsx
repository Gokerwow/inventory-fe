import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import { NavLink } from 'react-router-dom';
import SimbaLogo from '../assets/logoSimbaDark.png';


export default function SideBar() {
    const menuItems = [
        { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { path: '/pencatatan-stok', icon: ChartIcon, label: 'Stok Barang' },
        { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan' },
        { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran' },
    ];

    return (
        <div className='w-[394px] h-full bg-[#057CFF]'>
            <div className="text-white flex flex-col h-full rounded-lg overflow-hidden shadow-md">
                <div className='flex justify-center items-center border-b-2 border-white'>
                    <img src={SimbaLogo} alt="Simba Logo" />
                </div>
                <ul className='flex flex-col gap-6 px-4 py-10 '>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive
                                        ? 'bg-white/20 text-white'
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

                </ul>
            </div>
        </div>
    );
}