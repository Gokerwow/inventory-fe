import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/penerimaan'
import StokBarang from './pages/stokBarang'
import Penerimaan from './pages/penerimaan'
import Pengeluaran from './pages/pengeluaran'
import Profil from './pages/profil'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pencatatan-stok" element={<StokBarang />} />
        <Route path="penerimaan" element={<Penerimaan />} />
        <Route path="pengeluaran" element={<Pengeluaran />} />
        <Route path="profil" element={<Profil />} />
      </Route>
    </Routes>
  )
}

export default App
