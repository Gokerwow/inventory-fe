import SimbaLogo from '../assets/Light Logo new 1.png';
import SearchIcon from '../assets/Search.png';
import NotifIcon from '../assets/Notification.png';
import PfpExample from '../assets/Pfp Example.jpeg';

export default function TopBar() {
    return (
        <div className="w-full bg-gray-200 flex items-center px-4">
            <img src={SimbaLogo} alt="Simba Logo" />
            <div className='flex items-center gap-2 text-lg border-2 border-[#CDCFD4] px-4 py-2 rounded-md flex-1'>
                <img src={SearchIcon} alt="Search Icon" className='w-6 h-6' />
                <span>Search</span>
            </div>
            <div className='flex items-center justify-center gap-4 bg-white rounded-l-full p-4'>
                <div className='bg-white rounded-full w-8 h-8 flex items-center justify-center'>
                    <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                </div>
                <div className='flex items-center gap-4'>
                    <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden'>
                        <img src={PfpExample} alt="Profile Picture" className='w-full' />
                    </div>
                    <span className='max-w-[100px] break-words leading-tight font-semibold'>Admin Club Yuna</span>
                </div>
            </div>
        </div>
    )
}