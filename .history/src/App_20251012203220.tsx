import './App.css'
import SideBar from './components/sidebar'
import TopBar from './components/topBar'
import Background from './assets/background.png';
import SimbaLogo from './assets/Light Logo new 1.png';
import CategoryBarChart from './components/categoryBarChart';
import LineChart from './components/lineChart';

function App() {
  return (
    <div className="flex flex-col">
      <img src={Background} alt="Background" className='absolute w-full' />
      <div className='flex'>
        <div className='p-4  fixed top-0 flex flex-col'>
          <div className='p-4'>
            <img src={SimbaLogo} alt="Simba Logo" className='' />
          </div>
          <SideBar />
        </div>
        <div className="flex flex-col flex-1 ml-[394px]">
          <div className='p-4'>
            <TopBar />
            <div className='flex flex-col gap-6'>
              <div className="flex-1 bg-[#CADCF2] p-4">
                <h1 className='font-bold text-2xl text-center'>
                  Penerimaan Barang per Kategori
                </h1>
                <div className="p-4">
                  <CategoryBarChart />
                </div>
              </div>
              <div className="flex-1 bg-[#CADCF2] p-4">
                <h1 className='font-bold text-2xl text-center'>
                  Pengeluaran Barang per Bulan
                </h1>
                <div className="p-4">
                  <LineChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
