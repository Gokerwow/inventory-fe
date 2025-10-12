import SimbaLogo from '../assets/Light Logo new 1.png';
import SearchIcon from '../assets/Search.png';
import NotifIcon from '../assets/Notification.png';

export default function TopBar() {
    return (
        <div className="w-full h-16 bg-gray-200 flex items-center px-4">
            <img src={SimbaLogo} alt="Simba Logo" />
            <div className='flex items-center gap-2 text-lg border-2 border-[#CDCFD4] px-4 py-2 rounded-md flex-1'>
                <img src={SearchIcon} alt="Search Icon" className='w-6 h-6' />
                <span>Search</span>
            </div>
            <div className='relative'>
                <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                <div className='bg-white rounded-full w-8 h-8'></div>
            </div>
        </div>
    )
}