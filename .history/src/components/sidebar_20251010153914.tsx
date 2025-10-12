// Tambahkan ?react di akhir
import { ReactComponent as DashboardIcon } from '../assets/DashboardIcon.svg?react';

export default function SideBar() {
    return (
        <div className="w-64 h-screen bg-[#ADCDF4] text-white p-4">
            <ul>
                <li className='flex items-center gap-4 p-2 hover:bg-gray-700 group rounded-md cursor-pointer'>
                    {/* Sekarang DashboardIcon adalah komponen dan bisa di-style */}
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
            </ul>
        </div>
    );
}