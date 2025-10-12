import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/penerimaan'
import StokBarang from './pages/StokBarang'
import Penerimaan from './pages/Penerimaan'
import Pengeluaran from './pages/Pengeluaran'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stok-barang" element={<StokBarang />} />
        <Route path="penerimaan" element={<Penerimaan />} />
        <Route path="pengeluaran" element={<Pengeluaran />} />
      </Route>
    </Routes>
  )
}

export default App
