import CategoryBarChart from '../components/categoryBarChart';
import LineChart from '../components/lineChart';

export default function Dashboard() {
    return (
        <div className='flex flex-col gap-6 p-8'>
            {/* Statistik Cards */}
            <div className="grid grid-cols-3 gap-6">
                {/* Total Stok Barang Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Stok Barang</h3>
                    <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold">1.248</span>
                        <span className="ml-2 text-green-500 text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            +12% dari bulan lalu
                        </span>
                    </div>
                </div>
                
                {/* BAST yang sudah diterima Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">BAST yang sudah diterima</h3>
                    <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold">9</span>
                        <span className="ml-2 text-gray-500 text-sm">Dalam bulan ini</span>
                    </div>
                </div>
                
                {/* Barang yang belum dibayar Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Barang yang belum dibayar</h3>
                    <div className="flex items-end mt-2">
                        <span className="text-3xl font-bold">20</span>
                        <span className="ml-2 text-red-500 text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            -9% dari bulan lalu
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-6">
                {/* Penerimaan Barang per Bulan Chart */}
                <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md">
                    <h1 className='font-bold text-xl mb-4'>
                        Penerimaan Barang per Bulan
                    </h1>
                    <div className="p-4">
                        <LineChart />
                    </div>
                </div>
                
                {/* Pengeluaran Barang per Bulan Chart */}
                <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md">
                    <h1 className='font-bold text-xl mb-4'>
                        Pengeluaran Barang per Bulan
                    </h1>
                    <div className="p-4">
                        <LineChart />
                    </div>
                </div>
            </div>
            
            {/* Penerimaan Barang per Kategori Chart */}
            <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md">
                <h1 className='font-bold text-xl mb-4 text-center'>
                    Penerimaan Barang per Kategori
                </h1>
                <div className="p-4">
                    <CategoryBarChart />
                </div>
            </div>
        </div>
    )
}