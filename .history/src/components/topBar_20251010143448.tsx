import SimbaLogo from '../assets/Light Logo new 1.png';
import SearchIcon from '../assets/Search.png';

export default function TopBar() {
    return (
        <div className="w-full h-16 bg-gray-200 text-white flex items-center px-4">
            <img src={SimbaLogo} alt="Simba Logo" />
            <div className=''>
                <img src={SearchIcon} alt="Search Icon" className='w-6 h-6' />
                <span>Search</span>
            </div>
        </div>
    )
}