import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import { NavLink } from 'react-router-dom';
import SimbaLogo from '../assets/Light Logo new 1.png';


export default function SideBar() {
    const menuItems = [
        { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
        { path: '/pencatatan-stok', icon: ChartIcon, label: 'Stok Barang' },
        { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan' },
        { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran' },
    ];

    return (
        <div className='w-[394px] h-full'>
            <div className="bg-[#057CFF] text-white flex flex-col h-full rounded-lg overflow-hidden shadow-md border-2 border-white">
                <div className='flex justify-center items-center'>
                    <img src={SimbaLogo} alt="Simba Logo" />
                </div>
                <ul className='flex flex-col gap-6 px-4 py-10'>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 border-2 border-gray-300 ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : ' text-[#6E7781] hover:bg-blue-500 hover:text-white group text-red-700'
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
            </div>
        </div>
    );
}