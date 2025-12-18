import { useEffect, useMemo, useState } from 'react';
import EyeIcon from '../assets/svgs/eye.svg?react'
import ReusableTable, { type ColumnDefinition } from '../components/table'; // Pastikan path ini benar
import { NavigationTabs } from '../components/navTabs';
import ShoppingCartIcon from '../assets/svgs/shopping-cart.svg?react'
import ReceiptIcon from '../assets/svgs/receipt-item.svg?react'
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES, type APIPemesanan, type APIPengeluaranList } from '../constant/roles';
import { getPemesananList } from '../services/pemesananService';
import Pagination from '../components/pagination';
import Status from '../components/status';
import Loader from '../components/loader';
import SearchBar from '../components/searchBar';
import { generatePath, useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import { getPengeluaranList } from '../services/pengeluaranService';

const pengeluaranTabs = [
    {
        id: 'pengeluaran', label: 'Pengeluaran', icon: <ShoppingCartIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
    {
        id: 'riwayatPengeluaran', label: 'Riwayat Pengeluaran', icon: <ReceiptIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

function Pengeluaran() {
    const [activeTab, setActiveTab] = useState('pengeluaran');
    const navigate = useNavigate()

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [pemesananItem, setPemesananItem] = useState<APIPemesanan[]>([])
    const [pengeluaranItem, setPengeluaranItem] = useState<APIPemesanan[]>([])
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
            try {
                if (activeTab === 'pengeluaran') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        const dataPemesanan = await getPemesananList(currentPage, itemsPerPage, debouncedSearch, user.role)
                        setPemesananItem(dataPemesanan.data)
                        setTotalItems(dataPemesanan.total || 0);
                        setItemsPerPage(dataPemesanan.per_page || 10);
                        setTotalPages(dataPemesanan.last_page || 1);
                    } else {
                        const dataPemesanan = await getPemesananList(currentPage, itemsPerPage, debouncedSearch)
                        setPemesananItem(dataPemesanan.data)
                        setTotalItems(dataPemesanan.total || 0);
                        setItemsPerPage(dataPemesanan.per_page || 10);
                        setTotalPages(dataPemesanan.last_page || 1);
                    }
                } else {
                    const dataPengeluaran = await getPengeluaranList(currentPage, itemsPerPage, debouncedSearch)
                    setPengeluaranItem(dataPengeluaran.data)
                    setTotalItems(dataPengeluaran.total || 0);
                    setItemsPerPage(dataPengeluaran.per_page || 10);
                    setTotalPages(dataPengeluaran.last_page || 1);
                }
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                // setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllData()
    }, [currentPage, user?.role, debouncedSearch, activeTab])

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

    console.log(pengeluaranItem)

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLihatClick = (id: number) => {
        navigate(generatePath(PATHS.PENGELUARAN.LIHAT, { id: id.toString() }))
    }

    // Konfigurasi Kolom
    const pengeluaranColumns: ColumnDefinition<APIPemesanan>[] = useMemo(() => [
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
            header: 'STATUS',
            key: 'status',
            align: 'center',
            cell: (item) => <Status text={item.status === 'pending' ? 'Belum Dikonfirmasi' : 'Telah Dikonfirmasi'} variant={item.status === 'pending' ? 'pending' : 'success'} />
        },
        {
            header: 'AKSI',
            key: 'aksi', // 'aksi' bukan key asli di data, tapi untuk render cell
            align: 'center',
            cell: (item) => (
                <button
                    className="w-full flex items-center justify-center gap-2 text-black cursor-pointer hover:scale-110 transition-all duration-200"
                    onClick={() => handleLihatClick(item.id)}
                >
                    <div className="bg-white/20 rounded-full p-0.5">
                        <EyeIcon className='w-5 h-5' />
                    </div>
                    Lihat
                </button>
            )
        }
    ], []);

    const riwatatPengeluaranColumns: ColumnDefinition<APIPengeluaranList>[] = useMemo(() => [
        {
            header: 'NO SURAT',
            key: 'noSurat',
            cell: (item) => <span className="text-gray-900">{item.no_surat}</span>
        },
        {
            header: 'INSTALASI',
            key: 'instalasi',
            cell: (item) => <span className="text-gray-900">{item.instalasi}</span>
        },
        {
            header: 'NAMA BARANG',
            key: 'namaBarang',
            cell: (item) => <span className="text-gray-900">{item.stok_name}</span>
        },
        {
            header: 'KATEGORI',
            key: 'kategori',
            cell: (item) => <span className="text-gray-900">{item.category_name}</span>
        },
        {
            header: 'JUMLAH',
            key: 'jumlah',
            cell: (item) => <span className="text-gray-900">{item.quantity}</span>
        },
        {
            header: 'TANGGAL',
            key: 'tanggal',
            align: 'center',
            cell: (item) => <span className="text-gray-900">{item.tanggal_pengeluaran}</span>
        },
    ], []);

    return (
        <div className="w-full flex flex-col gap-5 h-full"> {/* Container Utama */}

            {/* TAB NAVIGASI */}
            <NavigationTabs
                tabs={pengeluaranTabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
            />

            {/* CARD UTAMA: UBAH DI SINI */}
            {/* Hapus min-h-[700px], ganti dengan flex-1 agar mengisi sisa layar */}
            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* HEADER: Judul & Search (Shrink-0 agar tidak tergencet) */}
                <div className="p-6 border-b border-gray-100 shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <h1 className="text-xl font-bold text-[#002B5B] whitespace-nowrap">
                            Daftar Pengeluaran
                        </h1>
                        <SearchBar
                            placeholder='Cari Pengeluaran...'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* KONTEN UTAMA: LOADING / KOSONG / TABEL */}
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {/* WRAPPER TABEL: flex-1 dan overflow-auto agar scroll di dalam sini */}
                        {activeTab === 'pengeluaran' ?

                            <div className="flex-1 overflow-auto min-h-0">
                                <ReusableTable
                                    columns={pengeluaranColumns}
                                    currentItems={pemesananItem}
                                />
                            </div>
                            :

                            <div className="flex-1 overflow-auto min-h-0">
                                <ReusableTable
                                    columns={riwatatPengeluaranColumns}
                                    currentItems={pengeluaranItem}
                                />
                            </div>
                        }

                        {/* FOOTER: Pagination (Shrink-0 agar selalu di bawah) */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            totalPages={totalPages}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Pengeluaran;