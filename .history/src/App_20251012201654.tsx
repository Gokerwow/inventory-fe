import './App.css'
import SideBar from './components/sidebar'
import TopBar from './components/topBar'
import Background from './assets/background.png';
import SimbaLogo from './assets/Light Logo new 1.png';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <img src={Background} alt="Background" className='absolute w-full' />
      <div className='flex'>
        <div className='p-4  h-screen fixed top-0 flex flex-col'>
          <div className=' p-4'>
            <img src={SimbaLogo} alt="Simba Logo" className='' />
          </div>
          <SideBar />
        </div>
        <div className="flex flex-col flex-1 ml-[394px]">
          <TopBar />
          <div className="flex-1 bg-gray-100">Content</div>
        </div>
      </div>
    </div>
  )
}

export default App
