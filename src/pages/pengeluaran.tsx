import { useEffect, useMemo, useState } from 'react';
import SearchIcon from '../assets/svgs/search-01.svg?react'
import EyeIcon from '../assets/svgs/eye.svg?react'
import ReusableTable, { type ColumnDefinition } from '../components/table'; // Pastikan path ini benar
import { NavigationTabs } from '../components/navTabs';
import ShoppingCartIcon from '../assets/svgs/shopping-cart.svg?react'
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES, type APIPemesanan } from '../constant/roles';
import { getPemesananList } from '../services/pemesananService';
import Pagination from '../components/pagination';
import Status from '../components/status';
import Loader from '../components/loader';

const pengeluaranTabs = [
    {
        id: 'pengeluaran', label: 'pengeluaran', icon: <ShoppingCartIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

function Pengeluaran() {
    const [activeTab, setActiveTab] = useState('pengeluaran');

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [pemesananItem, setPemesananItem] = useState<APIPemesanan | null>(null)
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PENANGGUNG_JAWAB],
        []
    );
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchAllData = async () => {
            setIsLoading(true)
            const dataPemesanan = await getPemesananList(currentPage, itemsPerPage, debouncedSearch)
            setPemesananItem(dataPemesanan)
            setTotalItems(dataPemesanan.total || 0);
            setItemsPerPage(dataPemesanan.per_page || 10);
            setTotalPages(dataPemesanan.last_page || 1);
            setIsLoading(false)
        }

        fetchAllData()
    }, [currentPage, user?.role, debouncedSearch])

    // --- EFFECT DEBOUNCE ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);
    // --------------------------------

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Konfigurasi Kolom
    const columns: ColumnDefinition<APIPemesanan>[] = useMemo(() => [
        {
            header: 'INSTALASI',
            key: 'instalasi',
            cell: (item) => <span className="text-gray-900">{item.user_name}</span>
        },
        {
            header: 'RUANGAN',
            key: 'ruangan',
            cell: (item) => <span className="text-gray-900">{item.ruangan}</span>
        },
        {
            header: 'TANGGAL',
            key: 'tanggal',
            cell: (item) => <span className="text-gray-900">{item.tanggal_pemesanan}</span>
        },
        {
            header: 'JUMLAH',
            key: 'jumlah',
            cell: (item) => <Status text={item.status} color='bg-yellow-500' />
        },
        {
            header: 'AKSI',
            key: 'aksi', // 'aksi' bukan key asli di data, tapi untuk render cell
            align: 'center',
            cell: () => (
                <button
                    className="w-full flex items-center justify-center gap-2 text-black cursor-pointer hover:scale-110 transition-all duration-200"
                >
                    <div className="bg-white/20 rounded-full p-0.5">
                        <EyeIcon className='w-5 h-5' />
                    </div>
                    Lihat
                </button>
            )
        }
    ], []);

    return (
        <div className="w-full flex flex-col gap-5 min-h-full"> {/* Container luar untuk padding halaman */}

            <NavigationTabs
                tabs={pengeluaranTabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
            />

            {/* CARD UTAMA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">

                {/* HEADER: Judul & Search */}
                {/* Sesuai gambar: Judul di kiri, Search bar tepat di sebelahnya */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        {/* Judul */}
                        <h1 className="text-xl font-bold text-[#002B5B] whitespace-nowrap">
                            Daftar Pengeluaran
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Cari..."
                                onChange={(e) => setSearch(e.target.value)}

                            />
                        </div>

                    </div>
                </div>

                {/* TABEL */}
                <div className="flex-1 flex justify-center items-center w-full overflow-auto">
                    {/* Menggunakan ReusableTable yang sudah ada */}
                    {isLoading ? <Loader />
                        :
                        <ReusableTable
                            columns={columns}
                            currentItems={pemesananItem?.data}
                        />
                    }

                </div>

                {/* FOOTER: Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />


            </div>
        </div>
    );
}

export default Pengeluaran;