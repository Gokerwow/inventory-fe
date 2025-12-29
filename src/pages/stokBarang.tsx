import AtkIcon from '../assets/svgs/AtkIcon.svg?react';
import { ROLES, type APIStokUpdate, type BARANG_STOK, type BASTAPI, CATEGORY_DATA } from '../constant/roles';
import type { ColumnDefinition } from '../components/table';
import { useEffect, useState } from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { getDetailStokBarang, getStokBarang, updateBarangStok } from '../services/barangService';
import ReusableTable from '../components/table';
import Pagination from '../components/pagination';
import Loader from '../components/loader';
import { useToast } from '../hooks/useToast';
import Modal from '../components/modal';
import Input from '../components/input';
import Status from '../components/status';
import { getBASTUnpaidList } from '../services/bastService';
import EyeIcon from '../assets/svgs/eye.svg?react';
import { generatePath, useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import { CategoryFilter } from '../components/categoryFilter';
import { NavigationTabs } from '../components/navTabs';
import Button from '../components/button';
import SearchBar from '../components/searchBar';
import { AlertTriangle, Pencil } from 'lucide-react'; // Import Icon Pencil

const stokTabs = [
    {
        id: 'stokBarang', label: 'Stok Barang', icon: <svg className="-ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
    },
    {
        id: 'KategoriBarang', label: 'Status Pembayaran BAST', icon: <svg className="group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.968 7.968 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
    },
];

function StokBarang() {

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | ''>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStokItems, setCurrentStokItems] = useState<BARANG_STOK[]>([]);
    const [currentBASTItems, setCurrentBASTItems] = useState<BASTAPI[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<APIStokUpdate>({ id: 0, name: '', minimum_stok: '' });
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('stokBarang');

    const { showToast } = useToast();

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

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

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const FetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === 'stokBarang') {
                    const response = await getStokBarang(currentPage, itemsPerPage, selectedCategoryId, debouncedSearch);
                    setCurrentStokItems(response.data.flat());
                    setTotalItems(response.total || 0);
                    setItemsPerPage(response.per_page || 10);
                    setTotalPages(response.last_page || 1);
                    const lowStockItems = response.data.flat().filter((item: any) => item.total_stok <= item.minimum_stok);

                    if (lowStockItems.length > 0) {
                        showToast(`Perhatian: Terdapat ${lowStockItems.length} barang dengan stok menipis/habis!`, 'warning');
                    }
                } else {
                    const response = await getBASTUnpaidList(currentPage, itemsPerPage, paymentStatus, selectedCategoryId, debouncedSearch);
                    setCurrentBASTItems(response.data.flat());
                    setTotalItems(response.total || 0);
                    setItemsPerPage(response.per_page || 10);
                    setTotalPages(response.last_page || 1);
                }
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };
        FetchData();
    }, [checkAccess, hasAccess, user?.role, currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, activeTab, refreshTrigger, paymentStatus]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCategoryClick = (id: number) => {
        if (selectedCategoryId === id) {
            setSelectedCategoryId(undefined);
        } else {
            setSelectedCategoryId(id);
        }
        setCurrentPage(1);
    };

    const handleTabClick = (tab: string) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setSelectedCategoryId(undefined);
        setPaymentStatus('');
        setSearch('');
        setDebouncedSearch('');
        setCurrentPage(1);
    };

    const handleLihatClick = async (id: number, type: 'penerimaan' | 'barang') => {
        if (type === 'penerimaan') {
            navigate(generatePath(PATHS.PENERIMAAN.LIHAT, { id: id.toString() }));
        } else {
            navigate(generatePath(PATHS.STOK_BARANG.LIHAT, { id: id.toString() }));
        }
    };

    const handleEditClick = async (id: number) => {
        setIsFormLoading(true);
        setIsModalOpen(true);
        try {
            const detail = await getDetailStokBarang(id);
            const dataToSet = {
                id: id,
                name: detail.name,
                minimum_stok: String(detail.minimum_stok)
            };
            setFormData(dataToSet);
            setIsFormLoading(false);
        } catch (error) {
            console.error("Error fetching detail stok barang:", error);
        }
    };

    const handleConfirmSubmit = async () => {
        setIsModalOpen(false);
        try {
            const FixData = {
                name: formData.name,
                minimum_stok: parseInt(String(formData.minimum_stok))
            };

            const response = await updateBarangStok(FixData, formData.id || 0);
            showToast("Berhasil memperbarui data stok barang.", "success");
            setIsModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error fetching detail stok barang:", error);
            showToast("Gagal memperbarui data stok barang.", "error");
        }
    };

    // --- DEFINISI KOLOM DENGAN RESPONSIVE ALIGNMENT ---
    const barangColumns: ColumnDefinition<BARANG_STOK>[] = [
        {
            header: 'Nama Barang',
            cell: (item) => {
                const config = CATEGORY_DATA.find(c => c.name === item.category_name);
                const IconComponent = config?.Icon || AtkIcon;
                const colorClass = config?.colorClass || 'bg-gray-100 text-gray-700';

                return (
                    // Tambahkan w-full agar flex mengisi area kartu di mobile
                    <div className="flex items-center w-full">
                        <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <IconComponent className='w-6 h-6' />
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                            <div className="text-sm font-semibold text-gray-900 truncate" title={item.name}>
                                {item.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {item.category_name}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Total Stok',
            cell: (item) => {
                const isCritical = item.total_stok <= item.minimum_stok;
                return (
                    <div className={`flex items-center gap-2 ${isCritical ? 'text-red-600 font-bold' : ''}`}>
                        {item.total_stok}
                        {isCritical && <span title="Stok menipis!"><AlertTriangle size={16} /></span>}
                    </div>
                )
            }
        },
        {
            header: 'Min. Stok',
            cell: (item) => <>{item.minimum_stok}</>
        },
        {
            header: 'Satuan',
            cell: (item) => <>{item.satuan}</>
        },
        {
            header: 'Aksi',
            cell: (item) => (
                // justify-end di mobile agar tombol rata kanan di kartu
                <div className="flex gap-3 justify-end md:justify-start w-full">
                    <button 
                        onClick={() => handleEditClick(item.id)} 
                        className="text-gray-600 hover:text-blue-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button 
                        onClick={() => handleLihatClick(item.id, 'barang')} 
                        className="text-gray-600 hover:text-blue-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                        <EyeIcon className='w-4 h-4' />
                        <span className="text-sm font-medium">Lihat</span>
                    </button>
                </div>
            )
        }
    ];

    const BASTColumns: ColumnDefinition<BASTAPI>[] = [
        { header: 'No Surat', cell: (item) => item.no_surat },
        { header: 'Role', cell: (item) => item.role_user },
        { header: 'Nama Pegawai', cell: (item) => item.pegawai_name },
        {
            header: 'Kategori',
            cell: (item) => {
                const config = CATEGORY_DATA.find(c => c.name === item.category_name);
                const IconComponent = config?.Icon || AtkIcon;
                const colorClass = config?.colorClass || 'bg-gray-100 text-gray-700';

                return (
                    <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded-full ${colorClass}`}>
                        <IconComponent className='w-3 h-3' />
                        <span className={`text-xs font-medium`}>{item.category_name}</span>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            cell: (item) => <Status label={item.status} value={item.status} />
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <div className="flex justify-end md:justify-start w-full">
                    <button 
                        onClick={() => handleLihatClick(item.id, 'penerimaan')} 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
                    >
                        <EyeIcon className='w-4 h-4' />
                        <span className="text-sm font-medium">Lihat</span>
                    </button>
                </div>
            )
        },
    ];


    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <NavigationTabs
                tabs={stokTabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />

            <CategoryFilter
                selectedCategoryId={selectedCategoryId}
                onCategoryClick={handleCategoryClick}
                categoryData={CATEGORY_DATA}
            />

            {/* Main Card Container */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                
                {/* Responsive Header: Stack di Mobile, Row di Desktop */}
                <div className="p-4 md:px-6 md:py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    
                    {/* Title & Search */}
                    <div className='flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto flex-1'>
                        <h2 className="text-lg md:text-xl font-bold text-blue-900 shrink-0">
                            Daftar {activeTab === "stokBarang" ? "Stok Barang" : "Pembayaran BAST"}
                        </h2>
                        <div className="w-full md:w-64">
                            <SearchBar
                                placeholder='Cari Barang...'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Status Pembayaran (Mobile: Full Width, Desktop: Auto) */}
                    <div className="w-full md:w-auto flex justify-end"> 
                        {activeTab !== 'stokBarang' && (
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => {
                                        setPaymentStatus(e.target.value as 'paid' | 'unpaid' | '');
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none w-full md:w-auto bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium cursor-pointer"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="paid">Terbayar</option>
                                    <option value="unpaid">Belum Dibayar</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Container - Gunakan flex-1 agar mengisi sisa ruang & min-h untuk mobile */}
                <div className="flex-1 overflow-hidden relative min-h-[400px] flex justify-center items-center">
                    {isLoading ? <Loader />
                        :
                        <div className='w-full h-full'>
                            {activeTab === 'stokBarang' ?
                                <ReusableTable
                                    columns={barangColumns}
                                    currentItems={currentStokItems}
                                />
                                :
                                <ReusableTable
                                    columns={BASTColumns}
                                    currentItems={currentBASTItems}
                                />}
                        </div>
                    }
                </div>

                <div className="bg-white shrink-0 border-t border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>
            </div>

            {/* Modal Input */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isForm={true}
            >
                <div className="flex flex-col gap-6 w-full p-6">
                    <h1 className="text-xl md:text-2xl text-center font-bold text-[#057CFF]">
                        FORM DETAIL STOK BARANG
                    </h1>
                    <div className='flex flex-col gap-4'>
                        <Input
                            id='name'
                            judul='Nama Barang'
                            placeholder='Masukkan Nama Barang'
                            name='name'
                            value={isFormLoading ? 'Memuat Data...' : formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            id='minimum_stok'
                            judul='Minimum Stok'
                            placeholder='Masukkan Minimum Stok'
                            name='minimum_stok'
                            type="number"
                            step="0.01"
                            value={isFormLoading ? 'Memuat Data...' : formData.minimum_stok}
                            onChange={(e) => setFormData({ ...formData, minimum_stok: e.target.value })}
                        />
                    </div>
                    <div className='flex items-center justify-end gap-3 mt-4'>
                        <Button variant="danger" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button variant="success" onClick={handleConfirmSubmit}>Simpan</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default StokBarang;