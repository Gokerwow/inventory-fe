import { useEffect, useState, useMemo } from 'react';
import PlusIcon from '../assets/plus.svg?react'
import PenerimaanTable from '../components/PenerimaanTable';
import { NavLink } from 'react-router-dom';
import { getPenerimaanList, getRiwayatPenerimaanList } from '../services/penerimaanService';
import { PATHS } from '../Routes/path';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { PenerimaanData, RiwayatPenerimaanData } from '../Mock Data/data';
import { ROLES, type BASTAPI } from '../constant/roles';
import { getBASTList, getRiwayatBASTList } from '../services/bastService';
import Pagination from '../components/pagination';

type PenerimaanItem = typeof PenerimaanData[0];
type RiwayatItem = typeof RiwayatPenerimaanData[0];


const PenerimaanPage = () => {
    const [penerimaanItems, setPenerimaanItems] = useState<PenerimaanItem[]>([]);
    const [riwayatItems, setRiwayatItems] = useState<RiwayatItem[]>([]);

    const [bastItems, setBastItems] = useState<BASTAPI[]>([])
    const [riwayatBastItems, setRiwayatBastItems] = useState<BASTAPI[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State untuk pagination dari backend
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [activeTab, setActiveTab] = useState('penerimaan');

    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS],
        []
    );

    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === 'penerimaan') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        console.log("🔄 Fetching BAST data...");
                        const response = await getBASTList(currentPage);

                        // ✅ Debug: Cek data yang diterima
                        console.log("📦 BAST Response:", response);
                        console.log("📊 BAST Data:", response.data);

                        // ✅ Set data dengan benar
                        setBastItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);

                        console.log("✅ State updated - Items count:", response.data?.length);
                    } else {
                        const response = await getPenerimaanList(currentPage);
                        setPenerimaanItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    }
                } else if (activeTab === 'riwayat') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        const response = await getRiwayatBASTList(currentPage);
                        setRiwayatBastItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    } else {
                        const response = await getRiwayatPenerimaanList(currentPage);
                        setRiwayatItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    }
                }
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, checkAccess, hasAccess, activeTab, currentPage]);

    // ✅ Debug: Cek data yang akan ditampilkan

    const handleClick = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset ke halaman 1 saat ganti tab
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Data yang ditampilkan langsung dari state (sudah dipaginate dari backend)
    const dataToShow = user?.role === ROLES.ADMIN_GUDANG ? (activeTab === 'penerimaan' ? bastItems : riwayatBastItems) : (activeTab === 'penerimaan' ? penerimaanItems : riwayatItems);
    useEffect(() => {
        console.log("🎯 Data to show:", dataToShow);
        console.log("📊 Data count:", dataToShow?.length);
    }, [dataToShow]);

    return (
        <div className="flex flex-col h-full p-6 bg-white rounded-lg shadow-md gap-4">
            {/* Header */}
            <div className='flex justify-between'>
                <div className="flex shrink-0 gap-4">
                    <h1
                        onClick={() => handleClick('penerimaan')}
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'penerimaan'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Penerimaan
                    </h1>
                    <h1
                        onClick={() => handleClick('riwayat')}
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'riwayat'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Riwayat Penerimaan
                    </h1>
                </div>
                {user?.role === ROLES.PPK && activeTab === 'penerimaan' && (
                    <div className='cursor-pointer hover:scale-110 transition-all duration-200 active:scale-85'>
                        <NavLink to={PATHS.PENERIMAAN.TAMBAH}>
                            <PlusIcon />
                        </NavLink>
                    </div>
                )}
            </div>

            {/* Loading dan Error State */}
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <p>Memuat data...</p>
                </div>
            ) : error ? (
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : dataToShow.length === 0 ? (
                <div className='text-center w-full h-full flex items-center justify-center'><span className='font-bold text-2xl'>DATA {activeTab === 'penerimaan' ? '' : 'RIWAYAT'}  {user?.role === ROLES.ADMIN_GUDANG ? 'BAST' : 'PENERIMAAN'} KOSONG</span></div>
            ) : (
                <div className="flex flex-col flex-1 min-h-0">

                    {/* 1. TABEL (Mengisi ruang tersisa) */}
                    <div className="flex-1 overflow-hidden mb-4">
                        <PenerimaanTable
                            data={dataToShow}
                            // Kirim prop variant untuk membedakan logika tombol
                            variant={activeTab === 'penerimaan' ? 'active' : 'history'}
                        />
                    </div>

                    {/* 2. PAGINATION (Di luar tabel, menempel di bawah) */}
                    <div className="border-t border-gray-200 pt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PenerimaanPage;