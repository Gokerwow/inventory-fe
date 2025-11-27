import { NavLink, useNavigate } from 'react-router-dom';
import SimbaLogo from '../assets/logoSimba.svg?react';
import LogoutIcon from '../assets/logout.svg?react'
import { useAuth } from '../hooks/useAuth';
import { menuItems } from '../constant/roles';
import { useTag } from '../hooks/useTag';


export default function SideBar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const { setTag } = useTag()

    const handleLogout = () => {
        navigate('/role-pick');
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
        <div className='w-[256px] h-full bg-linear-to-b from-[#057CFF] to-[#003F93]'>
            <div className="text-white flex flex-col h-full rounded-lg overflow-hidden shadow-md">
                <div className='flex justify-center items-center border-b-2 border-white h-20'>
                    <SimbaLogo className='w-50'/>
                </div>
                <div className='flex flex-col justify-between h-full'>
                    <ul className='flex flex-col gap-6  px-4 py-8'>
                        {allowedMenuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    onClick={() => setTag(item.tag)}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${isActive
                                            ? 'bg-white/20 text-white scale-105'
                                            : ' text-white hover:bg-white/20 hover:text-white group hover:scale-105'
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
                    <div className='border-t-2 border-white  px-4 py-3'>
                        <div onClick={handleLogout} className='p-3 hover:bg-white/20 text-[#FFD7D7] flex items-center gap-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer'>
                            <LogoutIcon />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}