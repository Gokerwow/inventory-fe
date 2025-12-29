import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SimbaLogo from '../assets/svgs/logoSimba.svg?react';
import LogoutIcon from '../assets/svgs/logout.svg?react'
import { useAuth } from '../hooks/useAuth';
import { menuItems } from '../constant/roles';
import { useTag } from '../hooks/useTag';
import { X } from 'lucide-react'; // Gunakan icon X dari lucide-react (sudah ada di package.json)

// Definisi Props
interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { setTag } = useTag();

    useEffect(() => {
        const currentMenuItem = menuItems.find(item =>
            location.pathname.startsWith(item.path)
        );
        if (currentMenuItem) {
            setTag(currentMenuItem.tag);
        }
    }, [location.pathname, setTag]);

    const handleLogout = () => {
        logout();
    };

    const allowedMenuItems = menuItems.filter((menuItem) => {
        if (!user) return false;
        return menuItem.role.includes(user?.role);
    });

    return (
        <>
            {/* 1. Mobile Overlay (Background gelap saat sidebar aktif di HP) */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={onClose}
            />

            {/* 2. Container Sidebar Utama */}
            <div className={`
                fixed top-0 left-0 z-50 h-full w-[256px] 
                bg-linear-to-b from-primary to-primary-dark
                transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="text-white flex flex-col h-full shadow-md relative">
                    
                    {/* Tombol Close untuk Mobile */}
                    <button 
                        onClick={onClose}
                        className="absolute top-0 right-0 p-1 text-white hover:bg-white/20 rounded lg:hidden"
                    >
                        <X size={24} />
                    </button>

                    <div className='flex justify-center items-center border-b-2 border-white h-20'>
                        <SimbaLogo className='w-40 md:w-50' />
                    </div>
                    
                    <div className='flex flex-col justify-between h-full overflow-y-auto'>
                        <ul className='flex flex-col gap-2 md:gap-4 px-4 py-8'>
                            {allowedMenuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${isActive
                                                ? 'bg-white/20 text-white scale-105 font-medium'
                                                : 'text-white hover:bg-white/10 hover:text-white group hover:scale-105'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon
                                                    className={`w-6 h-6 shrink-0 fill-current transition-colors ${isActive
                                                        ? 'text-white'
                                                        : 'text-white group-hover:text-white'
                                                        }`}
                                                />
                                                <span className="text-sm md:text-base">{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className='border-t-2 border-white px-4 py-3 mb-4'>
                            <div onClick={handleLogout} className='p-3 hover:bg-white/20 text-sidebar-text-muted flex items-center gap-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer'>
                                <LogoutIcon className="w-6 h-6 shrink-0" />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}