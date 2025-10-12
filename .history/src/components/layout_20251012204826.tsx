export default function DashboardLayout() {
    <div className="flex flex-col relative">
        <div
            className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-top"
            style={{ backgroundImage: `url(${Background})` }}
        />
        <div className='flex'>
            <div className='p-4  h-screen fixed top-0 flex flex-col'>
                <div className='p-4'>
                    <img src={SimbaLogo} alt="Simba Logo" className='' />
                </div>
                <SideBar />
            </div>
            <div className="flex flex-col flex-1 ml-[394px]">
                <div className='p-3 px-6'>
                    <TopBar />


                </div>
            </div>
        </div>
    </div>
}