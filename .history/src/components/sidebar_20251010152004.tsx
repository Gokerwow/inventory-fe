import DashboardIcon from '../assets/DashboardIcon.png'

export default function SideBar() {
    return  ( 
        <div className="w-64 h-screen bg-gray-800 text-white p-4"> 
            <ul>
                <li>
                    <img src={DashboardIcon} alt="Dashboard Icon" />
                    <span className='text-[#6E7781]'>Dashboard</span>
                </li>
            </ul>
        </div>
    )
}