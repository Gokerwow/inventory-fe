import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './pages/dashboard'
import StokBarang from './pages/stokBarang'
import Penerimaan from './pages/penerimaan'
import Pengeluaran from './pages/pengeluaran'
import Profil from './pages/profil'
import RolePick from './pages/rolePick'
import FormPenerimaan from './pages/FormPenerimaan'
import FormDataBarangBelanja from './pages/FormDataBarangBelanja'
import AkunPage from './pages/akun'
import PegawaiPage from './pages/pegawai'
import MonitoringPage from './pages/monitoring'
import FormAkunPage from './pages/FormAkun'
import { PATHS } from './Routes/path'
import Unauthorized from './pages/unauthorized'
import UnduhBast from './pages/unduhBAST'
import LihatPenerimaan from './pages/lihatPenerimaan'
import PemesananPage from './pages/pemesanan'

function App() {
  return (
    <Routes>
      <Route path={PATHS.ROLE_PICK} element={<RolePick />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
        <Route index element={<Navigate to={PATHS.ROLE_PICK} replace />} />
        <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
        <Route path={PATHS.STOK_BARANG} element={<StokBarang />} />
        <Route path={PATHS.PENERIMAAN.INDEX}>
          <Route index element={<Penerimaan />} />
          <Route path={PATHS.PENERIMAAN.TAMBAH} element={<FormPenerimaan />} />
          <Route path={PATHS.PENERIMAAN.BARANG_BELANJA} element={<FormDataBarangBelanja />} />
          <Route path={PATHS.PENERIMAAN.EDIT} element={<FormPenerimaan isEdit={true}/>} />
          <Route path={PATHS.PENERIMAAN.UNDUH} element={<UnduhBast />} />
          <Route path={PATHS.PENERIMAAN.LIHAT} element={<LihatPenerimaan />} />
        </Route>
        <Route path={PATHS.PENGELUARAN} element={<Pengeluaran />} />
        <Route path={PATHS.PROFIL.INDEX}>
            <Route index element={<Profil />} />
            <Route path={PATHS.PROFIL.EDIT} element={<FormAkunPage isEdit={true}/>}/>
        </Route>
        <Route path={PATHS.AKUN.INDEX}>
            <Route index element={<AkunPage />} />
            <Route path={PATHS.AKUN.TAMBAH} element={<FormAkunPage/>}/>
        </Route>
        <Route path={PATHS.PEGAWAI} element={<PegawaiPage />} />
        <Route path={PATHS.MONITORING} element={<MonitoringPage />} />
      </Route>
    </Routes>
  )
}

export default App
