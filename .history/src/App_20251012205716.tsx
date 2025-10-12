import './App.css'

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
