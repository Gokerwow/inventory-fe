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

interface ChartData {
    bulan: string;
    value: number;
}

interface StatsData {
    total_stok_barang: number;
    bast_sudah_diterima: number;
    barang_belum_dibayar: number | string; 
}

// Mapping nama bulan
const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsData, masukData, keluarData] = await Promise.all([
                    getDashboardStats(),
                    getChartBarangMasuk(),
                    getChartBarangKeluar()
                ]);

                setStats(statsData.data);
                
                // Transform data dari API ke format yang dibutuhkan chart
                const transformedMasuk = masukData.data.map((item: any) => ({
                    bulan: monthNames[item.month - 1], // Convert month number to name
                    value: item.total
                }));
                
                const transformedKeluar = keluarData.data.map((item: any) => ({
                    bulan: monthNames[item.month - 1],
                    value: item.total
                }));

                setChartMasuk(transformedMasuk);
                setChartKeluar(transformedKeluar);
                setError(null);
            } catch (err) {
                console.error("Gagal memuat data dashboard:", err);
                setError("Gagal memuat data dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, checkAccess, hasAccess]);

    if (!hasAccess(user?.role)) return null;
    if (isLoading) return <Loader />
    if (error) return <div className='flex justify-center items-center h-full text-danger'>{error}</div>;

    return (
        <div className='flex flex-col gap-6 h-full'>
            {/* --- SECTION 1: STATS CARDS --- */}
            <div className="grid grid-cols-3 gap-6">

                {/* Total Stok */}
                <Card title="Total Stok Barang">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">{stats?.total_stok_barang || 0}</span>
                        <span className="text-green-600 text-sm font-medium flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            +12% dari bulan lalu
                        </span>
                    </div>
                </Card>

                {/* BAST Diterima */}
                <Card title="BAST yang sudah diterima">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">{stats?.bast_sudah_diterima || 0}</span>
                        <span className="text-green-600 text-sm mt-1">Dalam bulan ini</span>
                    </div>
                </Card>

                {/* Belum Bayar */}
                <Card title="Barang yang belum dibayar">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">{stats?.barang_belum_dibayar || 0}</span>
                        <span className="text-danger text-sm font-medium flex mt-1">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            -9% dari bulan lalu
                        </span>
                    </div>
                </Card>
            </div>

            {/* --- SECTION 2: CHARTS --- */}
            <div className="grid grid-cols-2 gap-6 h-full">

                {/* Chart Masuk */}
                <Card
                    className="h-full"
                    title="Penerimaan Barang per Bulan"
                >
                    <div className="h-full w-full min-h-[300px]">
                        <DiagramBatang type="masuk" data={chartMasuk} />
                    </div>
                </Card>

                {/* Chart Keluar */}
                <Card
                    className="h-full"
                    title="Pengeluaran Barang per Bulan"
                >
                    <div className="h-full w-full min-h-[300px]">
                        <DiagramBatang type="keluar" data={chartKeluar} />
                    </div>
                </Card>
            </div>
        </div>
    );
}