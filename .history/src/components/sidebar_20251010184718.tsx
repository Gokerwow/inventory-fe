import DashboardIcon from '../assets/DashboardIcon.svg?react';
import DashboardIcon from '../assets/DashboardIcon.svg?react';

export default function SideBar() {
    return (
        <div className="w-64 h-screen bg-[#CADCF2] text-white p-4">
            <ul className='flex flex-col gap-6'>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
                <li className='flex items-center gap-4 p-2 bg-white hover:bg-gray-700 group rounded-md cursor-pointer transition-all duration-300'>
                    <DashboardIcon className="w-6 h-6 fill-current text-[#6E7781] group-hover:text-white" />
                    <span className='text-[#6E7781] group-hover:text-white'>Dashboard</span>
                </li>
            </ul>
        </div>
    );
}