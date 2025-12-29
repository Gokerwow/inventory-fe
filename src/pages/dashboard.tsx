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
    stok_change_percent: number;
    stok_change_trend: 'up' | 'down';
    bast_sudah_diterima: number;
    barang_belum_dibayar: number;
    belum_dibayar_change_percent: number;
    belum_dibayar_change_trend: 'up' | 'down';
}

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const [yearMasuk, setYearMasuk] = useState<number>(currentYear);
    const [yearKeluar, setYearKeluar] = useState<number>(currentYear);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingMasuk, setIsLoadingMasuk] = useState(true);
    const [isLoadingKeluar, setIsLoadingKeluar] = useState(true);

    const transformChartData = (data: any[]) => {
        return data.map((item) => ({
            bulan: monthNames[item.month - 1],
            value: item.total
        }));
    };

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

    useEffect(() => {
        if (!hasAccess(user?.role)) return;

        const fetchMasuk = async () => {
            setIsLoadingMasuk(true);
            try {
                const { data } = await getChartBarangMasuk(yearMasuk);
                setChartMasuk(transformChartData(data));
            } catch (err) {
                console.error("Gagal load chart masuk:", err);
            } finally {
                setIsLoadingMasuk(false);
            }
        };
        fetchMasuk();
    }, [yearMasuk, user, hasAccess]);

    useEffect(() => {
        if (!hasAccess(user?.role)) return;

        const fetchKeluar = async () => {
            setIsLoadingKeluar(true);
            try {
                const { data } = await getChartBarangKeluar(yearKeluar);
                setChartKeluar(transformChartData(data));
            } catch (err) {
                console.error("Gagal load chart keluar:", err);
            } finally {
                setIsLoadingKeluar(false);
            }
        };
        fetchKeluar();
    }, [yearKeluar, user, hasAccess]);


    if (!hasAccess(user?.role)) return null;
    if (isLoadingStats) return <Loader />;

    return (
        <div className='flex flex-col gap-6 min-h-full'>
            
            {/* --- SECTION 1: STATS CARDS --- */}
            {/* Layout: 1 kolom (Mobile) -> 2 kolom (Tablet) -> 3 kolom (Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* CARD 1: Stok Barang */}
                <Card title="Total Stok Barang">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">
                            {stats?.total_stok_barang || 0}
                        </span>
                        {stats && (
                            <TrendIndicator
                                percent={stats.stok_change_percent}
                                trend={stats.stok_change_trend}
                            />
                        )}
                    </div>
                </Card>

                {/* CARD 2: BAST */}
                <Card title="BAST yang sudah diterima">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">
                            {stats?.bast_sudah_diterima || 0}
                        </span>
                        <span className="text-gray-500 text-sm mt-1">Total Dokumen</span>
                    </div>
                </Card>

                {/* CARD 3: Barang Belum Dibayar */}
                {/* Di Tablet (2 kolom), card ini akan full width di baris kedua agar rapi */}
                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                    <Card title="Barang yang belum dibayar">
                        <div className="flex flex-col justify-center mt-2">
                            <span className="text-3xl font-bold text-primary-text">
                                {stats?.barang_belum_dibayar || 0}
                            </span>
                            {stats && (
                                <TrendIndicator
                                    percent={stats.belum_dibayar_change_percent}
                                    trend={stats.belum_dibayar_change_trend}
                                    inverse={true}
                                />
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* --- SECTION 2: CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

                {/* === CARD 1: BARANG MASUK === */}
                <Card className="h-full flex flex-col">
                    {/* Header Card */}
                    <div className="flex justify-between items-start sm:items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Penerimaan Barang</h2>
                        <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 shadow-sm shrink-0 ml-2">
                            <span className="text-[10px] font-medium text-gray-500 mr-2 uppercase tracking-wide hidden sm:inline">Tahun</span>
                            <select
                                value={yearMasuk}
                                onChange={(e) => setYearMasuk(Number(e.target.value))}
                                className="bg-transparent text-xs md:text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="flex-1 w-full min-h-[250px] md:min-h-[300px] flex items-center justify-center">
                        {isLoadingMasuk ? (
                            <Loader />
                        ) : (
                            <div className="w-full h-full">
                                <DiagramBatang type="masuk" data={chartMasuk} />
                            </div>
                        )}
                    </div>
                </Card>

                {/* === CARD 2: BARANG KELUAR === */}
                <Card className="h-full flex flex-col">
                    {/* Header Card */}
                    <div className="flex justify-between items-start sm:items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Pengeluaran Barang</h2>
                        <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 shadow-sm shrink-0 ml-2">
                            <span className="text-[10px] font-medium text-gray-500 mr-2 uppercase tracking-wide hidden sm:inline">Tahun</span>
                            <select
                                value={yearKeluar}
                                onChange={(e) => setYearKeluar(Number(e.target.value))}
                                className="bg-transparent text-xs md:text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Chart Container */}
                    {/* UBAH DI SINI: Tambahkan 'flex items-center justify-center' */}
                    <div className="flex-1 w-full min-h-[250px] md:min-h-[300px] flex items-center justify-center">
                        {isLoadingKeluar ? (
                            <Loader />
                        ) : (
                            <div className="w-full h-full">
                                <DiagramBatang type="keluar" data={chartKeluar} />
                            </div>
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
}