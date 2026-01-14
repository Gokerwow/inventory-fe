/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import NotifIcon from '../assets/images/Notification.png';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTag } from '../hooks/useTag';
import Avatar from '../assets/svgs/Avatar.svg'
import { ROLES } from '../constant/roles';
import { PATHS } from '../Routes/path';
import { getDaftarNotifikasi } from '../services/notifikasiService';
import { Menu } from 'lucide-react'; // Import Icon Menu

// Definisi Props
interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const { user } = useAuth()
    const { tag } = useTag()
    const [hasUnread, setHasUnread] = useState(false);
    const requiredRoles = [ROLES.ADMIN_GUDANG, ROLES.TEKNIS, ROLES.PENANGGUNG_JAWAB]

    useEffect(() => {
        if (!user) return;
        const checkUnread = async () => {
            try {
                const response = await getDaftarNotifikasi(1, 10, '');
                const result = response as any;
                if (response.data && typeof response.data === 'number') {
                    setHasUnread(result.unread_count > 0);
                } else {
                    const notifList = result.list?.data || [];
                    const unread = notifList.some((n: any) => n.isRead === false);
                    setHasUnread(unread);
                }
            } catch (error) {
                console.error("Gagal mengecek notifikasi", error);
            }
        };

        if (user && requiredRoles.includes(user.role)) {
            checkUnread();
            const interval = setInterval(checkUnread, 30000);
            return () => clearInterval(interval);
        }
    }, [requiredRoles, user]);

    if (!user) return false;

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-lg z-30 h-16 md:h-20 px-4 md:px-8 sticky top-0">
            <div className='overflow-hidden flex h-full items-center flex-1 justify-between gap-4'>
                
                {/* Bagian Kiri: Tombol Menu & Judul */}
                <div className='flex items-center gap-4 h-full'>
                    {/* Tombol Hamburger (Hanya muncul di Mobile 'lg:hidden') */}
                    <button 
                        onClick={onMenuClick}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-600"
                    >
                        <Menu size={24} />
                    </button>

                    <div className='text-xl md:text-2xl font-bold flex flex-col justify-center'>
                        <h1 className='text-lg md:text-3xl truncate max-w-[200px] md:max-w-none'>{tag}</h1>
                    </div>
                </div>

                {/* Bagian Kanan: Notif & Profil */}
                <div className='flex items-center justify-end gap-2 md:gap-4 h-full'>
                    {requiredRoles.includes(user.role) &&
                        <NavLink to={PATHS.NOTIFICATION} className='bg-white hover:bg-gray-200 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-200 relative shrink-0'>
                            <img src={NotifIcon} alt="Notification Icon" className='h-5 md:h-6' />
                            {hasUnread && (
                                <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                                </span>
                            )}
                        </NavLink>
                    }
                    
                    <NavLink to={PATHS.PROFIL.INDEX} className='flex items-center gap-2 md:gap-4 cursor-pointer lg:w-60 px-4 py-4.5 hover:bg-gray-200 transition-all duration-200 h-auto md:h-full'>
                        <div className='bg-gray-100 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center overflow-hidden shrink-0'>
                            <img src={user?.photo ?? Avatar} alt="Profile Picture" className='w-full h-full object-cover' />
                        </div>
                        {/* Sembunyikan nama di layar sangat kecil jika perlu, atau biarkan truncate */}
                        <span className='hidden sm:block max-w-[100px] md:max-w-[150px] truncate leading-tight font-semibold text-xs md:text-sm'>
                            {user?.name}
                        </span>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}