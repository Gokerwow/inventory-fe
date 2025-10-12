import DashboardIcon from '../assets/DashboardIcon.png'

export default function SideBar() {
    return  ( 
        <div className="w-64 h-screen bg-[#ADCDF4] text-white p-4"> 
            <ul>
                <li className='flex items-center gap-4 p-2 hover:bg-gray-700 rounded-md cursor-pointer'>
                    <img src={DashboardIcon} alt="Dashboard Icon" />
                    <span className='text-[#6E7781]'>Dashboard</span>
                </li>
            </ul>
        </div>
    )
}