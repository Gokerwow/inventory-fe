import NotifIcon from '../assets/Notification.png';
import PfpExample from '../assets/Pfp Example.jpeg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function TopBar() {
    const { user } = useAuth()

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-lg z-50 h-29 border-b-2 border-white px-8">
            <div className='overflow-hidden flex h-20 items-stretch flex-1 justify-between'>
                <div className='text-2xl font-bold h-full flex flex-col justify-center'>
                    <p className=''>Selamat Datang</p>
                    <p className=' text-[#4D5ED1]'>{user?.username}</p>
                </div>
                <NavLink to={'/profil'}>
                    <div className='flex items-center justify-center gap-4 px-4 py-4.5 cursor-pointer hover:bg-gray-200 transition-all duration-200'>
                        <div className='bg-white rounded-full w-9 h-9 flex items-center justify-center'>
                            <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden'>
                                <img src={PfpExample} alt="Profile Picture" className='w-full' />
                            </div>
                            <span className='max-w-[100px] break-words leading-tight font-semibold text-sm'>Admin Gudang Umum</span>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}