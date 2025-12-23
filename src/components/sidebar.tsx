import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SimbaLogo from '../assets/svgs/logoSimba.svg?react';
import LogoutIcon from '../assets/svgs/logout.svg?react'
import { useAuth } from '../hooks/useAuth';
import { menuItems } from '../constant/roles';
import { useTag } from '../hooks/useTag';

export default function SideBar() {
    const location = useLocation(); // ✅ Tambahkan ini
    const { user, logout } = useAuth();
    const { setTag } = useTag();

    // ✅ Auto-set tag berdasarkan current path
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
        if (!user) {
            return false;
        }
        return menuItem.role.includes(user?.role);
    });

    return (
        <div className='w-[256px] h-full bg-linear-to-b from-primary to-primary-dark'>
            <div className="text-white flex flex-col h-full rounded-lg overflow-hidden shadow-md">
                <div className='flex justify-center items-center border-b-2 border-white h-20'>
                    <SimbaLogo className='w-50' />
                </div>
                <div className='flex flex-col justify-between h-full'>
                    <ul className='flex flex-col gap-6 px-4 py-8'>
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
                    <div className='border-t-2 border-white px-4 py-3'>
                        <div onClick={handleLogout} className='p-3 hover:bg-white/20 text-sidebar-text-muted flex items-center gap-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer'>
                            <LogoutIcon />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}