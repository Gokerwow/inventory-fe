import './App.css'
import SideBar from './components/sidebar'
import TopBar from './components/topBar'
import Background from './assets/background.png';
import SimbaLogo from './assets/Light Logo new 1.png';

function App() {
  return (
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
  )
}

export default App
