import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/dashboard'
import StokBarang from './pages/stokBarang'
import Penerimaan from './pages/penerimaan'
import Pengeluaran from './pages/pengeluaran'
import Profil from './pages/profil'
import RolePick from './pages/rolePick'
import TambahPenerimaan from './pages/TambahPenerimaan'
import FormDataBarangBelanja from './pages/FormDataBarangBelanja'
import AkunPage from './pages/akun'
import PegawaiPage from './pages/pegawai'
import MonitoringPage from './pages/monitoring'
import TambahAkunPage from './pages/TambahAkun'

function App() {
  return (
    <Routes>
      <Route path="/role-pick" element={<RolePick />} />
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
        <Route index element={<Navigate to="/role-pick" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stok-barang" element={<StokBarang />} />
        <Route path="penerimaan">
          <Route index element={<Penerimaan />} />
          <Route path="tambah/barang-belanja" element={<FormDataBarangBelanja />} />
          <Route path="tambah" element={<TambahPenerimaan />} />
          {/* <Route path="edit/:id" element={<EditPenerimaan />} />
          <Route path="detail/:id" element={<DetailPenerimaan />} /> */}
        </Route>
        <Route path="pengeluaran" element={<Pengeluaran />} />
        <Route path="profil" element={<Profil />} />
        <Route path="akun">
            <Route index element={<AkunPage />} />
            <Route path="tambah" element={<TambahAkunPage/>}/>
        </Route>
        <Route path="pegawai" element={<PegawaiPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
  )
}

export default App
