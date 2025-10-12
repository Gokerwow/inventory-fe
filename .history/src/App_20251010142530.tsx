import './App.css'
// import SideBar from './components/sidebar'
import TopBar from './components/topBar'

function App() {
  return (
    <div className="flex">
      {/* <SideBar /> */}
      <TopBar/>
      <div className="flex-1 p-4">
        <h1 className="text-white">Halo</h1>
      </div>
    </div>
  )
}

export default App
