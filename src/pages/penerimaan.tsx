import { useEffect, useState, useMemo } from 'react';
import PlusIcon from '../assets/plus.svg?react'
import PenerimaanTable from '../components/PenerimaanTable';
import RiwayatPenerimaanTable from '../components/RiwayatPenerimaanTable';
import { NavLink } from 'react-router-dom';
import { getPenerimaanList, getRiwayatPenerimaanList } from '../services/penerimaanService'; // <-- Impor service
import { PATHS } from '../Routes/path';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { PenerimaanData, riwayatUpload } from '../Mock Data/data';
type PenerimaanItem = typeof PenerimaanData[0];
type RiwayatItem = typeof riwayatUpload[0];

const PenerimaanPage = () => {
    // --- TAMBAHAN: State untuk loading, error, dan data ---
    const [penerimaanItems, setPenerimaanItems] = useState<PenerimaanItem[]>([]);
    const [riwayatItems, setRiwayatItems] = useState<any[]>([]); // Kita pakai 'any' dulu untuk riwayat
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [activeTab, setActiveTab] = useState('penerimaan');

    const requiredRoles = useMemo(() => 
        ['Admin Gudang Umum', 'Tim PPK', 'Tim Teknis'], 
        [] // <-- Array dependensi kosong, artinya HANYA dibuat 1x
    );

    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth()

    // --- UBAHAN: useEffect ini sekarang juga mengambil data ---
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return; // Berhenti jika tidak ada akses
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Logika untuk memuat data berdasarkan tab yang aktif
                if (activeTab === 'penerimaan') {
                    const data = await getPenerimaanList();
                    setPenerimaanItems(data);
                } else if (activeTab === 'riwayat') {
                    // NOTE: Komponen RiwayatPenerimaanTable Anda 
                    // saat ini masih menggunakan format data yang sama dengan PenerimaanTable.
                    // Untuk sementara, kita panggil service yang benar (getRiwayatPenerimaanList)
                    // Anda mungkin perlu menyesuaikan RiwayatPenerimaanTable agar bisa menampilkan data riwayat.

                    // Untuk sekarang, agar tidak error, kita tetap pakai getPenerimaanList()
                    // seperti logika awal Anda.
                    // const data = await getRiwayatPenerimaanList(); // <-- Ini yang seharusnya
                    const data = await getPenerimaanList(); // <-- Ini mengikuti logika lama Anda agar UI tidak rusak
                    setRiwayatItems(data);
                }
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, checkAccess, hasAccess, activeTab]); // <-- 'activeTab' ditambahkan sebagai dependency

    const handleClick = (activeTab: string) => {
        setActiveTab(activeTab);
        setCurrentPage(1); // Reset ke halaman 1 setiap ganti tab
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const dataToShow = activeTab === 'penerimaan' ? penerimaanItems : riwayatItems;
    const totalItems = dataToShow.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = dataToShow.slice(startIndex, startIndex + itemsPerPage);

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
                {user?.role === 'Tim PPK' ?
                    <div className='cursor-pointer hover:scale-110 transition-all duration-200 active:scale-85'>
                        <NavLink to={PATHS.PENERIMAAN.TAMBAH}>
                            <PlusIcon />
                        </NavLink>
                    </div>
                    :
                    <></>
                }

            </div>

            {/* --- TAMBAHAN: Tampilkan Loading atau Error --- */}
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <p>Memuat data...</p>
                </div>
            ) : error ? (
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                // --- UBAHAN: Gunakan data dinamis ---
                <>
                    {activeTab === 'penerimaan' ?
                        <PenerimaanTable
                            currentItems={currentItems}
                            startIndex={startIndex}
                            currentPage={currentPage}
                            totalItems={totalItems} // <-- Gunakan totalItems dinamis
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                        :
                        <RiwayatPenerimaanTable
                            currentItems={currentItems} // <-- Gunakan currentItems dinamis
                            startIndex={startIndex}
                            currentPage={currentPage}
                            totalItems={totalItems} // <-- Gunakan totalItems dinamis
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange} />
                    }
                </>
            )}
        </div>
    );
};

export default PenerimaanPage;