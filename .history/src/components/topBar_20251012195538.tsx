import NotifIcon from '../assets/Notification.png';
import ChevronDown from '../assets/ChevronDown.png';
import PfpExample from '../assets/Pfp Example.jpeg';

export default function TopBar() {
    return (
        <div className="w-full flex items-center justify-between gap-6 py-4 pl-4">
            <div className='flex items-center justify-center gap-4 bg-white/30 rounded-l-full px-4 py-6'>
                <div className='bg-white rounded-full w-9 h-9 flex items-center justify-center'>
                    <img src={NotifIcon} alt="Notification Icon" className='h-6' />
                </div>
                <div className='flex items-center gap-4'>
                    <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden'>
                        <img src={PfpExample} alt="Profile Picture" className='w-full' />
                    </div>
                    <span className='max-w-[100px] break-words leading-tight font-semibold text-sm'>Admin Club Yuna</span>
                </div>
                <div className='bg-white rounded-full w-9 h-9 flex items-center justify-center'>
                    <img src={ChevronDown} alt="Notification Icon" className='h-2' />
                </div>
            </div>
        </div>
    )
}