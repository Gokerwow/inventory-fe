import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import DiagramBatang from '../components/DiagramBatang';
import {
    getDashboardStats,
    getChartBarangMasuk,
    getChartBarangKeluar
} from '../services/dashboardService';
import { ROLES } from '../constant/roles';

interface ChartData {
    bulan: string;
    value: number;
}
interface StatsData {
    totalStok: number;
    bastDiterima: number;
    belumBayar: number;
}

export default function Dashboard() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth()

    const [stats, setStats] = useState<StatsData | null>(null);
    const [chartMasuk, setChartMasuk] = useState<ChartData[]>([]);
    const [chartKeluar, setChartKeluar] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpenMasuk, setIsOpenMasuk] = useState(false);
    const [isOpenKeluar, setIsOpenKeluar] = useState(false);

    const [selectedSemesterMasuk, setSelectedSemesterMasuk] = useState(1);
    const [selectedSemesterKeluar, setSelectedSemesterKeluar] = useState(1);

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

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

    if (!hasAccess(user?.role)) {
        return null;
    }

    if (isLoading) {
        return <div className='flex justify-center items-center h-full'>Memuat data dashboard...</div>;
    }
    if (error) {
        return <div className='flex justify-center items-center h-full text-red-500'>{error}</div>;
    }

    const semesters = [
        { id: 1, label: 'Semester 1', period: 'Jan - Jun' },
        { id: 2, label: 'Semester 2', period: 'Jul - Des' }
    ];

    const handleSelectMasuk = (semester: number) => {
        setSelectedSemesterMasuk(semester);
    }
    const handleSelectKeluar = (semester: number) => {
        setSelectedSemesterKeluar(semester);
    }

    const currentMasukItems = selectedSemesterMasuk === 1
        ? chartMasuk.slice(0, 6)
        : chartMasuk.slice(6, 12);

    const currentKeluarItems = selectedSemesterKeluar === 1
        ? chartKeluar.slice(0, 6)
        : chartKeluar.slice(6, 12);

    return (
        <div className='flex flex-col gap-6 h-full'>
            {/* Statistik Cards */}
            <div className="grid grid-cols-3 gap-6">
                {/* Total Stok Barang Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-sm font-bold">Total Stok Barang</h3>
                    <div className="flex flex-col justify-center mt-2">
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold text-[#1d4ed8]">{stats?.totalStok || 0}</span>
                        <span className="text-green-500 text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            +12% dari bulan lalu
                        </span>
                    </div>
                </div>

                {/* BAST yang sudah diterima Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-sm font-bold">BAST yang sudah diterima</h3>
                    <div className="flex flex-col justify-center mt-2">
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold text-[#1d4ed8]">{stats?.bastDiterima || 0}</span>
                        <span className="text-green-500 text-sm">Dalam bulan ini</span>
                    </div>
                </div>

                {/* Barang yang belum dibayar Card */}
                <div className="bg-white p-6 border-2 border-white rounded-lg shadow-md">
                    <h3 className="text-sm font-bold">Barang yang belum dibayar</h3>
                    <div className="flex flex-col justify-center mt-2">
                        {/* --- UBAHAN --- */}
                        <span className="text-3xl font-bold text-[#1d4ed8]">{stats?.belumBayar || 0}</span>
                        <span className="text-red-500 text-sm font-medium flex">
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
                    {/* DROPDOWN MENU */}
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpenMasuk(!isOpenMasuk)}
                            className='flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 min-w-[200px] justify-between group'>
                            <span className="text-md font-medium text-slate-700 group-hover:text-blue-600">
                                Semester {selectedSemesterMasuk}
                            </span>
                            <svg
                                className={`w-4 h-4 ms-3 transition-transform duration-200`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>

                        {isOpenMasuk && (

                            <div className='absolute left-0 z-10 mt-2 w-[200px] bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 origin-top'>
                                {semesters.map((index) => (
                                    <button
                                        key={index.id}
                                        onClick={() => handleSelectMasuk(index.id)}
                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group ${selectedSemesterMasuk === index.id
                                            ? 'bg-blue-50 border-l-4 border-blue-500'
                                            : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${selectedSemesterMasuk === index.id
                                                ? 'text-blue-600'
                                                : 'text-slate-700 group-hover:text-blue-600'
                                                }`}>
                                                {index.label}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5">
                                                {index.period}
                                            </span>
                                        </div>
                                        {selectedSemesterMasuk === index.id && (
                                            <svg
                                                className="w-5 h-5 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-4 grow">
                        {/* --- UBAHAN: Kirim data via prop --- */}
                        <DiagramBatang type="masuk" data={currentMasukItems} />
                    </div>
                </div>

                {/* Pengeluaran Barang per Bulan Chart */}
                <div className="bg-white p-4 border-2 border-white rounded-lg shadow-md h-full flex flex-col">
                    <h1 className='font-bold text-xl mb-4'>
                        Pengeluaran Barang per Bulan
                    </h1>
                    {/* DROPDOWN MENU */}
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpenKeluar(!isOpenKeluar)}
                            className='flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 min-w-[200px] justify-between group'>
                            <span className="text-md font-medium text-slate-700 group-hover:text-blue-600">
                                Semesters {selectedSemesterKeluar}
                            </span>
                            <svg
                                className={`w-4 h-4 ms-3 transition-transform duration-200`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>

                        {isOpenKeluar && (

                            <div className='absolute left-0 z-10 mt-2 w-[200px] bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 origin-top'>
                                {semesters.map((index) => (
                                    <button
                                        key={index.id}
                                        onClick={() => handleSelectKeluar(index.id)}
                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group ${selectedSemesterKeluar === index.id
                                            ? 'bg-blue-50 border-l-4 border-blue-500'
                                            : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${selectedSemesterKeluar === index.id
                                                ? 'text-blue-600'
                                                : 'text-slate-700 group-hover:text-blue-600'
                                                }`}>
                                                {index.label}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5">
                                                {index.period}
                                            </span>
                                        </div>
                                        {selectedSemesterKeluar === index.id && (
                                            <svg
                                                className="w-5 h-5 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                    <div className="p-4 grow">
                        {/* --- UBAHAN: Kirim data via prop --- */}
                        <DiagramBatang type="keluar" data={currentKeluarItems} />
                    </div>
                </div>
            </div>
        </div >
    )
}