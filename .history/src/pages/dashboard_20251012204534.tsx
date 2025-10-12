export default function Dashboard() {
    return (
        < div className = 'flex flex-col gap-6' >
              <div className="flex-1 bg-[#CADCF2] z-10 p-4 border-2 border-white rounded-lg shadow-md">
                <h1 className='font-bold text-2xl text-center'>
                  Penerimaan Barang per Kategori
                </h1>
                <div className="p-4">
                  <CategoryBarChart />
                </div>
              </div>
              <div className="flex-1 bg-[#CADCF2] z-10 p-4 border-2 border-white rounded-lg shadow-md">
                <h1 className='font-bold text-2xl text-center'>
                  Pengeluaran Barang per Bulan
                </h1>
                <div className="p-4">
                  <LineChart />
                </div>
              </div>
            </ >
    )
}