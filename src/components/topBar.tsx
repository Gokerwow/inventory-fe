import { useEffect, useState } from 'react';
import NotifIcon from '../assets/images/Notification.png';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTag } from '../hooks/useTag';
import Avatar from '../assets/svgs/Avatar.svg'
import { ROLES } from '../constant/roles';
import { PATHS } from '../Routes/path';
import { getDaftarNotifikasi } from '../services/notifikasiService';

export default function TopBar() {
    const { user } = useAuth()
    const { tag } = useTag()
    
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (!user) return;

        const checkUnread = async () => {
            try {
                const response = await getDaftarNotifikasi(1, 10, '');
                console.log(response.unread_count, 'WOI INI')
                
                // CARA 1: Paling Mudah & Akurat (Gunakan unread_count dari backend)
                // Jika unread_count > 0, berarti ada pesan belum dibaca.
                if (response.data && typeof response.unread_count === 'number') {
                    setHasUnread(response.unread_count > 0);
                } 
                // CARA 2: Manual Check Array (Backup jika cara 1 gagal)
                else {
                    // Akses array yang benar: response.data.list.data
                    const notifList = response.list?.data || [];
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
    }, [user]);

    if (!user) {
        return false
    }

    const requiredRoles = [ROLES.ADMIN_GUDANG, ROLES.TEKNIS, ROLES.PENANGGUNG_JAWAB]

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-lg z-50 h-20 px-8">
            <div className='overflow-hidden flex h-full items-stretch flex-1 justify-between'>
                <div className='text-2xl font-bold h-full flex flex-col justify-center'>
                    <h1 className=' text-3xl'>{tag}</h1>
                </div>
                <div className='flex items-center justify-center gap-4 h-full'>
                    {requiredRoles.includes(user.role) &&
                        <NavLink to={PATHS.NOTIFICATION} className='bg-white hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 relative'>
                            <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                            
                            {hasUnread && (
                                <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                                </span>
                            )}
                        </NavLink>
                    }
                    <NavLink to={PATHS.PROFIL.INDEX} className='flex items-center gap-4 cursor-pointer w-60 px-4 py-4.5 hover:bg-gray-200 transition-all duration-200 h-full'>
                        <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden'>
                            <img src={user?.photo ?? Avatar} alt="Profile Picture" className='w-full' />
                        </div>
                        <span className='max-w-[150px] wrap-break-word leading-tight font-semibold text-sm'>{user?.name}</span>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}