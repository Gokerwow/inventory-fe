import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import DiagramBatang from '../components/DiagramBatang';
import Card from '../components/card';
import {
    getDashboardStats,
    getChartBarangMasuk,
    getChartBarangKeluar
} from '../services/dashboardService';
import { ROLES } from '../constant/roles';
import Loader from '../components/loader';
import { TrendIndicator } from '../components/TrendIndicator';

interface ChartData {
    bulan: string;
    value: number;
}

interface StatsData {
    total_stok_barang: number;
    stok_change_percent: number;   // <-- Tambahan
    stok_change_trend: 'up' | 'down'; // <-- Tambahan
    
    bast_sudah_diterima: number;
    
    barang_belum_dibayar: number; 
    belum_dibayar_change_percent: number; // <-- Tambahan
    belum_dibayar_change_trend: 'up' | 'down'; // <-- Tambahan
}

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    // 1. SETUP TAHUN & STATE TERPISAH
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // State Tahun Terpisah
    const [yearMasuk, setYearMasuk] = useState<number>(currentYear);
    const [yearKeluar, setYearKeluar] = useState<number>(currentYear);

    // State Data
    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    
    // Loading State
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    // Kita bisa buat loading terpisah agar chart tidak blinking semua saat ganti tahun
    const [isLoadingMasuk, setIsLoadingMasuk] = useState(true);
    const [isLoadingKeluar, setIsLoadingKeluar] = useState(true);

    // Helper transform data
    const transformChartData = (data: any[]) => {
        return data.map((item) => ({
            bulan: monthNames[item.month - 1],
            value: item.total
        }));
    };

    // 2. EFFECT 1: Fetch Stats (Hanya sekali saat mount)
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchStats = async () => {
            try {
                const { data } = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Gagal load stats:", err);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, [user, checkAccess, hasAccess]);

    // 3. EFFECT 2: Fetch Chart Masuk (Jalan saat yearMasuk berubah)
    useEffect(() => {
        if (!hasAccess(user?.role)) return;

        const fetchMasuk = async () => {
            setIsLoadingMasuk(true);
            try {
                const { data } = await getChartBarangMasuk(yearMasuk); // Pakai yearMasuk
                setChartMasuk(transformChartData(data));
            } catch (err) {
                console.error("Gagal load chart masuk:", err);
            } finally {
                setIsLoadingMasuk(false);
            }
        };
        fetchMasuk();
    }, [yearMasuk, user, hasAccess]); // Dependency: yearMasuk

    // 4. EFFECT 3: Fetch Chart Keluar (Jalan saat yearKeluar berubah)
    useEffect(() => {
        if (!hasAccess(user?.role)) return;

        const fetchKeluar = async () => {
            setIsLoadingKeluar(true);
            try {
                const { data } = await getChartBarangKeluar(yearKeluar); // Pakai yearKeluar
                setChartKeluar(transformChartData(data));
            } catch (err) {
                console.error("Gagal load chart keluar:", err);
            } finally {
                setIsLoadingKeluar(false);
            }
        };
        fetchKeluar();
    }, [yearKeluar, user, hasAccess]); // Dependency: yearKeluar


    if (!hasAccess(user?.role)) return null;
    
    // Global loader hanya muncul jika stats belum siap (layout awal)
    if (isLoadingStats) return <Loader />;

    return (
        <div className='flex flex-col gap-6 h-full'>

            {/* --- SECTION 1: STATS CARDS --- */}
            <div className="grid grid-cols-3 gap-6">
{/* CARD 1: Stok Barang */}
                <Card title="Total Stok Barang">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">
                            {stats?.total_stok_barang || 0}
                        </span>
                        
                        {/* Panggil Helper Component */}
                        {stats && (
                            <TrendIndicator 
                                percent={stats.stok_change_percent} 
                                trend={stats.stok_change_trend} 
                                // Default: Naik = Hijau (Stok nambah itu biasanya oke/netral)
                            />
                        )}
                    </div>
                </Card>

                {/* CARD 2: BAST (Biasanya tidak ada trend di API kamu, jadi statis/kosong) */}
                <Card title="BAST yang sudah diterima">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">
                            {stats?.bast_sudah_diterima || 0}
                        </span>
                        <span className="text-gray-500 text-sm mt-1">Total Dokumen</span>
                    </div>
                </Card>

                {/* CARD 3: Barang Belum Dibayar */}
                <Card title="Barang yang belum dibayar">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">
                            {stats?.barang_belum_dibayar || 0}
                        </span>

                        {/* Panggil Helper Component dengan INVERSE */}
                        {/* Karena kalau hutang NAIK ('up'), itu BURUK (Merah). Kalau TURUN ('down'), itu BAGUS (Hijau) */}
                        {stats && (
                            <TrendIndicator 
                                percent={stats.belum_dibayar_change_percent} 
                                trend={stats.belum_dibayar_change_trend}
                                inverse={true} // <--- Penting!
                            />
                        )}
                    </div>
                </Card>
            </div>

            {/* --- SECTION 2: CHARTS DENGAN FILTER MASING-MASING --- */}
            <div className="grid grid-cols-2 gap-6 h-full">

                {/* === CARD 1: BARANG MASUK === */}
                <Card className="h-full" title="Penerimaan Barang">
                    {/* Filter Area di dalam Card */}
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                            <span className="text-[10px] font-medium text-gray-500 mr-2 uppercase tracking-wide">Tahun</span>
                            <select 
                                value={yearMasuk}
                                onChange={(e) => setYearMasuk(Number(e.target.value))}
                                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="h-full w-full min-h-[300px]">
                        {/* Loading lokal agar user tahu chart sedang update */}
                        {isLoadingMasuk ? (
                            <Loader />
                        ) : (
                            <DiagramBatang type="masuk" data={chartMasuk} />
                        )}
                    </div>
                </Card>

                {/* === CARD 2: BARANG KELUAR === */}
                <Card className="h-full" title="Pengeluaran Barang">
                    {/* Filter Area di dalam Card */}
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                            <span className="text-[10px] font-medium text-gray-500 mr-2 uppercase tracking-wide">Tahun</span>
                            <select 
                                value={yearKeluar}
                                onChange={(e) => setYearKeluar(Number(e.target.value))}
                                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="h-full w-full min-h-[300px]">
                         {isLoadingKeluar ? (
                            <Loader />
                        ) : (
                            <DiagramBatang type="keluar" data={chartKeluar} />
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
}