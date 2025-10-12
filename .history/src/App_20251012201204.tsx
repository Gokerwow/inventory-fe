import './App.css'
import SideBar from './components/sidebar'
import TopBar from './components/topBar'
import Background from './assets/background.png';
import SimbaLogo from './assets/Light Logo new 1.png';

function App() {
  return (
<div className="flex h-screen">
  <img src={Background} alt="Background" className='absolute w-full' />
  
  {/* Sidebar - tidak fixed */}
  <div className='p-4 flex flex-col w-64 flex-shrink-0'>
    <div className='p-4'>
      <img src={SimbaLogo} alt="Simba Logo" className='' />
    </div>
    <SideBar />
  </div>
  
  {/* Content area */}
  <div className="flex flex-col flex-1">
    <TopBar />
    <div className="flex-1 bg-gray-100 overflow-auto">Content</div>
  </div>
</div>
  )
}

export default App
