import './App.css'
import SideBar from './components/sidebar'
import TopBar from './components/topBar'

function App() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar/>
      <div className="flex">
        <SideBar />
        <div className="flex-1 bg-gray-100">Content</div>
      </div>
    </div>
  )
}

export default App
