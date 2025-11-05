import { useEffect, useState } from 'react'; // <-- TAMBAHAN: useState
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import DiagramBatang from '../components/DiagramBatang';
// --- TAMBAHAN: Impor service ---
import { 
    getDashboardStats, 
    getChartBarangMasuk, 
    getChartBarangKeluar 
} from '../services/dashboardService';
// ------------------------------

// --- TAMBAHAN: Tipe data ---
interface ChartData {
    bulan: string;
    value: number;
}
interface StatsData {
    totalStok: number;
    bastDiterima: number;
    belumBayar: number;
}
// ---------------------------

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization('Admin Gudang Umum');
    const { user } = useAuth()

    // --- TAMBAHAN: State untuk data, loading, dan error ---
    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // ---------------------------------------------------

    // --- UBAHAN: useEffect sekarang mengambil semua data ---
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Panggil semua service sekaligus (paralel)
                const [statsData, masukData, keluarData] = await Promise.all([
                    getDashboardStats(),
                    getChartBarangMasuk(),
                    getChartBarangKeluar()
                ]);
                
                setStats(statsData);
                setChartMasuk(masukData);
                setChartKeluar(keluarData);
                setError(null);
            } catch (err) {
                console.error("Gagal memuat data dashboard:", err);
                setError("Gagal memuat data dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, checkAccess, hasAccess]); // <-- Dependensi
    // ----------------------------------------------------

    // Early return (sudah ada, bagus)
    if (!hasAccess(user?.role)) {
        return null;
    }

    // --- TAMBAHAN: Tampilkan UI Loading & Error ---
    if (isLoading) {
        return <div className='flex justify-center items-center h-full'>Memuat data dashboard...</div>;
    }
    if (error) {
        return <div className='flex justify-center items-center h-full text-red-500'>{error}</div>;
    }
    // ------------------------------------------

    return (
        <div className='flex flex-col gap-6 h-full'>
            {/* Statistik Cards */}
            <div className="grid grid-cols-3 gap-6">
                {/* Total Stok Barang Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Stok Barang</h3>
                    <div className="flex items-end mt-2">
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold">{stats?.totalStok || 0}</span>
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
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold">{stats?.bastDiterima || 0}</span>
                        <span className="ml-2 text-gray-500 text-sm">Dalam bulan ini</span>
                    </div>
                </div>

                {/* Barang yang belum dibayar Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Barang yang belum dibayar</h3>
                    <div className="flex items-end mt-2">
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold">{stats?.belumBayar || 0}</span>
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
            <div className="grid grid-cols-2 gap-6 h-full">
                {/* Penerimaan Barang per Bulan Chart */}
                <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md h-full flex flex-col">
                    <h1 className='font-bold text-xl mb-4'>
                        Penerimaan Barang per Bulan
                    </h1>
                    <div className="p-4 grow">
                        {/* --- UBAHAN: Kirim data via prop --- */}
                        <DiagramBatang type="masuk" data={chartMasuk} />
                    </div>
                </div>

                {/* Pengeluaran Barang per Bulan Chart */}
                <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md h-full flex flex-col">
                    <h1 className='font-bold text-xl mb-4'>
                        Pengeluaran Barang per Bulan
                    </h1>
                    <div className="p-4 grow">
                        {/* --- UBAHAN: Kirim data via prop --- */}
                        <DiagramBatang type="keluar" data={chartKeluar} />
                    </div>
                </div>
            </div>
        </div>
    )
}