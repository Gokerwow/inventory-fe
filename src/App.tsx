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
import AkunPage from './pages/akun'
import PegawaiPage from './pages/pegawai'
import MonitoringPage from './pages/monitoring'
import FormAkunPage from './pages/FormAkun'
import { PATHS } from './Routes/path'
import Unauthorized from './pages/unauthorized'
import UnduhBast from './pages/unduhBAST'
import LihatPenerimaan from './pages/unggahPenerimaan'
import PemesananPage from './pages/pemesanan'
import PenerimaanLayout from './components/PenerimaanLayout'
import { FormPegawaiPage } from './pages/FormPegawai'
import DetailStokBarang from './pages/detailStokBarang'
import { DetailPengeluaranPage } from './pages/detailPengeluaran'
import SSOCallback from './pages/SSOCallback'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { menuItems } from './constant/roles'

// 1. Buat Komponen Kecil untuk Menangani Akar Aplikasi ("/")
const RootHandler = () => {
  const { isAuthenticated, login, user, isLoggingOut } = useAuth();


  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated, login]);

  // --- LOGIKA BARU ---
  // Jika sedang logout, TAHAN! Jangan lakukan apa-apa, tampilkan loading saja.
  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Sedang Logout...</p>
      </div>
    );
  }
  // -------------------

  if (isAuthenticated && user) {
    // --- LOGIKA BARU: Cari Halaman Rumah berdasarkan Role ---

    // 1. Ambil role user saat ini
    const userRole = user.role;
    console.log(user)

    // 2. Cari menu pertama yang mengizinkan role ini
    const allowedMenu = menuItems.find(item => item.role.includes(userRole));

    // 3. Tentukan tujuan: kalau ketemu pakai path-nya, kalau tidak lempar ke unauthorized
    const targetPath = allowedMenu ? allowedMenu.path : '/unauthorized';

    // 4. Redirect ke halaman yang sesuai
    return <Navigate to={targetPath} replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Mengalihkan ke Login SSO...</p>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/auth/sso-callback" element={<SSOCallback />} />

      <Route path={PATHS.ROLE_PICK} element={<RolePick />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />

      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
        <Route index element={<RootHandler />} />
        <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
        <Route path={PATHS.STOK_BARANG.INDEX}>
          <Route index element={<StokBarang />} />
          <Route path={PATHS.STOK_BARANG.LIHAT} element={<DetailStokBarang />} />
        </Route>
        <Route path={PATHS.PENERIMAAN.INDEX}>
          <Route index element={<Penerimaan />} />
          <Route element={<PenerimaanLayout />}>
            {/* Mode: Create (Form Kosong) */}
            <Route
              path={PATHS.PENERIMAAN.TAMBAH}
              element={<FormPenerimaan mode="create" />}
            />

            {/* Mode: Edit (PPK Edit Data) */}
            <Route
              path={PATHS.PENERIMAAN.EDIT}
              element={<FormPenerimaan mode="edit" />}
            />

            {/* Mode: Inspect (Tim Teknis Cek Barang) */}
            <Route
              path={PATHS.PENERIMAAN.INSPECT}
              element={<FormPenerimaan mode="inspect" />}
            />

            {/* Mode: Finance (Keuangan Cek/Bayar) - Dulunya isView */}
            <Route
              path={PATHS.PENERIMAAN.LIHAT}
              element={<FormPenerimaan mode="finance" />}
            />

            {/* JIKA INGIN MENAMBAH ROUTE BARU (Hanya Lihat / Preview Saja) */}
            <Route path={PATHS.PENERIMAAN.PREVIEW} element={<FormPenerimaan mode="preview" />} />

            <Route path={PATHS.PENERIMAAN.UNDUH} element={<UnduhBast />} />
            <Route path={PATHS.PENERIMAAN.UNGGAH} element={<LihatPenerimaan />} />
          </Route>
        </Route>
        <Route path={PATHS.PENGELUARAN.INDEX}>
          <Route index element={<Pengeluaran />} />
          <Route path={PATHS.PENGELUARAN.LIHAT} element={<DetailPengeluaranPage />} />
        </Route>
        <Route path={PATHS.PROFIL.INDEX}>
          <Route index element={<Profil />} />
          <Route path={PATHS.PROFIL.EDIT} element={<FormAkunPage isEdit={true} />} />
        </Route>
        <Route path={PATHS.AKUN.INDEX}>
          <Route index element={<AkunPage />} />
          <Route path={PATHS.AKUN.TAMBAH} element={<FormAkunPage />} />
        </Route>
        <Route path={PATHS.PEGAWAI.INDEX}>
          <Route index element={<PegawaiPage />} />
          <Route path={PATHS.PEGAWAI.TAMBAH} element={<FormPegawaiPage />} />
          <Route path={PATHS.PEGAWAI.EDIT} element={<FormPegawaiPage isEdit={true} />} />
        </Route>
        <Route path={PATHS.MONITORING} element={<MonitoringPage />} />
        <Route path={PATHS.PEMESANAN} element={<PemesananPage />} />
      </Route>
    </Routes>
  )
}

export default App
