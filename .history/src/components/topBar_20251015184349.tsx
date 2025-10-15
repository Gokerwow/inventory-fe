import NotifIcon from '../assets/Notification.png';
import ChevronDown from '../assets/ChevronDown.png';
import PfpExample from '../assets/Pfp Example.jpeg';
import SimbaLogo from '../assets/Light Logo new 1.png';


export default function TopBar() {
    return (
        <div className="w-full flex items-center justify-between rounded-b-4xl bg-white">
            <div className='overflow-hidden rounded-b-4xl flex h-20 items-stretch flex-1 justify-between'>
                <div className='bg-amber-600 h-full'>
                    <img src={SimbaLogo} alt="Simba Logo"/>
                </div>
                <div className='text-2xl font-bold bg-amber-400 h-full'>
                    <p className='text-center'>Selamat Datang</p>
                    <p className='text-center text-[#4D5ED1]'>Admin Gudang Umum 👋🏻!</p>
                </div>
                <div className='flex items-center justify-center gap-4 px-4 py-6 bg-gray-40 h-full bg-red-600   '>
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
        </div>
    )
}