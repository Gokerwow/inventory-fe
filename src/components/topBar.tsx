import NotifIcon from '../assets/images/Notification.png';
import PfpExample from '../assets/images/Pfp Example.jpeg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTag } from '../hooks/useTag';

export default function TopBar() {
    const { user } = useAuth()

    const { tag } = useTag()

    if (!user) {
        return false
    }

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-lg z-50 h-20 px-8">
            <div className='overflow-hidden flex h-full items-stretch flex-1 justify-between'>
                <div className='text-2xl font-bold h-full flex flex-col justify-center'>
                    <h1 className=' text-3xl'>{tag}</h1>
                </div>
                <NavLink to={'/profil'}>
                    <div className='flex items-center justify-center gap-4 h-full'>
                        <div className='bg-white rounded-full w-9 h-9 flex items-center justify-center'>
                            <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                        </div>
                        <div className='flex items-center gap-4 cursor-pointer w-60 px-4 py-4.5 hover:bg-gray-200 transition-all duration-200 h-full'>
                            <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden'>
                                <img src={PfpExample} alt="Profile Picture" className='w-full' />
                            </div>
                            <span className='max-w-[150px] wrap-break-word leading-tight font-semibold text-sm'>{user?.role}</span>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}