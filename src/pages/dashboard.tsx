import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import DiagramBatang from '../components/DiagramBatang';
import Card from '../components/Card'; // Import the new Card component
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
    totalStok: number;
    bastDiterima: number;
    belumBayar: number;
}

const semesters = [
    { id: 1, label: 'Semester 1', period: 'Jan - Jun' },
    { id: 2, label: 'Semester 2', period: 'Jul - Des' }
];

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dropdown states
    const [isOpenMasuk, setIsOpenMasuk] = useState(false);
    const [isOpenKeluar, setIsOpenKeluar] = useState(false);
    const [selectedSemesterMasuk, setSelectedSemesterMasuk] = useState(1);
    const [selectedSemesterKeluar, setSelectedSemesterKeluar] = useState(1);

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
    }, [user, checkAccess, hasAccess]);

    if (!hasAccess(user?.role)) return null;
    if (isLoading) return <Loader />
    if (error) return <div className='flex justify-center items-center h-full text-danger'>{error}</div>;

    // Helper for chart slicing
    const getChartData = (data: ChartData[], semester: number) => {
        return semester === 1 ? data.slice(0, 6) : data.slice(6, 12);
    };

    return (
        <div className='flex flex-col gap-6 h-full'>
            {/* --- SECTION 1: STATS CARDS --- */}
            <div className="grid grid-cols-3 gap-6">

                {/* Total Stok */}
                <Card title="Total Stok Barang">
                    <div className="flex flex-col justify-center mt-2">
                        {/* Uses CSS variable --color-primary-text defined in index.css */}
                        <span className="text-3xl font-bold text-primary-text">{stats?.totalStok || 0}</span>
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
                        <span className="text-3xl font-bold text-primary-text">{stats?.bastDiterima || 0}</span>
                        <span className="text-green-600 text-sm mt-1">Dalam bulan ini</span>
                    </div>
                </Card>

                {/* Belum Bayar */}
                <Card title="Barang yang belum dibayar">
                    <div className="flex flex-col justify-center mt-2">
                        <span className="text-3xl font-bold text-primary-text">{stats?.belumBayar || 0}</span>
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
                    action={
                        <SemesterDropdown
                            isOpen={isOpenMasuk}
                            setIsOpen={setIsOpenMasuk}
                            selectedSemester={selectedSemesterMasuk}
                            onSelect={setSelectedSemesterMasuk}
                        />
                    }
                >
                    <div className="h-full w-full min-h-[300px]">
                        <DiagramBatang type="masuk" data={getChartData(chartMasuk, selectedSemesterMasuk)} />
                    </div>
                </Card>

                {/* Chart Keluar */}
                <Card
                    className="h-full"
                    title="Pengeluaran Barang per Bulan"
                    action={
                        <SemesterDropdown
                            isOpen={isOpenKeluar}
                            setIsOpen={setIsOpenKeluar}
                            selectedSemester={selectedSemesterKeluar}
                            onSelect={setSelectedSemesterKeluar}
                        />
                    }
                >
                    <div className="h-full w-full min-h-[300px]">
                        <DiagramBatang type="keluar" data={getChartData(chartKeluar, selectedSemesterKeluar)} />
                    </div>
                </Card>
            </div>
        </div>
    );
}

// --- Internal Helper Component for the Dropdown (Keeps the main component clean) ---
function SemesterDropdown({ isOpen, setIsOpen, selectedSemester, onSelect }: any) {
    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-3 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-200 min-w-[160px] justify-between group text-sm'
            >
                <span className="font-medium text-slate-700 group-hover:text-primary">
                    Semester {selectedSemester}
                </span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className='absolute right-0 z-10 mt-1 w-[180px] bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden'>
                    {semesters.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSelect(item.id);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex flex-col ${selectedSemester === item.id ? 'bg-blue-50 border-l-4 border-primary' : 'border-l-4 border-transparent'
                                }`}
                        >
                            <span className={`text-sm font-medium ${selectedSemester === item.id ? 'text-primary' : 'text-slate-700'}`}>
                                {item.label}
                            </span>
                            <span className="text-xs text-slate-500">{item.period}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}