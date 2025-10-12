import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import ProfilIcon from '../assets/Pengeluaran.svg?react';
import LogoutIcon from '../assets/LogoutIcon.svg?react';


export default function SideBar() {
    return (
        <div className='w-[394px] h-screen p-4'> {/* Parent harus h-screen */}
            <div className="bg-[#CADCF2] text-white flex flex-col justify-between h-full"> {/* Tambah h-full */}
                <ul className='flex flex-col gap-6 p-4'>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                    </li>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <ChartIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Pencatatan Stok</span>
                    </li>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <PenerimaanIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Penerimaan</span>
                    </li>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <PengeluaranIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Pengeluaran</span>
                    </li>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <ProfilIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Profil</span>
                    </li>
                    <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                        <LogoutIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                        <span className='text-[#6E7781] group-hover:text-white'>Logout</span>
                    </li>
                </ul>
                <div className='w-full h-[21%] bg-[#ADCDF4]'></div>
            </div>
        </div>
    );
}