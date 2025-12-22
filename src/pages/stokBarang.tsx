import AtkIcon from '../assets/svgs/AtkIcon.svg?react';
import { ROLES, type APIStokUpdate, type BARANG_STOK, type BASTAPI, CATEGORY_DATA } from '../constant/roles';
import type { ColumnDefinition } from '../components/table';
import { useEffect, useState, useMemo } from 'react';
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
    // 1. Definisikan Tahun Saat Ini
    const currentYear = new Date().getFullYear();

    // 2. Buat Opsi Tahun (Tahun ini, -1, -2)
    const yearOptions = useMemo(() => {
        return [currentYear, currentYear - 1, currentYear - 2];
    }, [currentYear]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | ''>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStokItems, setCurrentStokItems] = useState<BARANG_STOK[]>([]);
    const [currentBASTItems, setCurrentBASTItems] = useState<BASTAPI[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialFormData, setInitialFormData] = useState<APIStokUpdate | null>(null);
    const [formData, setFormData] = useState<APIStokUpdate>({ id: 0, name: '', minimum_stok: 0 });
    const navigate = useNavigate();

    // 3. Set default state year ke string tahun saat ini
    const [year, setYear] = useState(String(currentYear));
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
    // --------------------------------

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const FetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === 'stokBarang') {
                    console.log('Fetching Stok Data....');
                    // Pastikan parameter year dikirim jika API mendukung filter tahun
                    // Contoh: getStokBarang(..., debouncedSearch, year)
                    const response = await getStokBarang(currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, year);
                    console.log("📦 Stok Response:", response);
                    setCurrentStokItems(response.data.flat());
                    setTotalItems(response.total || 0);
                    setItemsPerPage(response.per_page || 10);
                    setTotalPages(response.last_page || 1);
                } else {
                    console.log('Fetching BAST Data....');
                    // Pastikan parameter year dikirim jika API mendukung filter tahun
                    // Contoh: getStokBarang(..., debouncedSearch, year)
                    const response = await getBASTUnpaidList(currentPage, itemsPerPage, paymentStatus, selectedCategoryId, debouncedSearch, year);
                    console.log("📦 BAST Response:", response);
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
        // Tambahkan year ke dependency array agar refresh saat tahun diganti
    }, [checkAccess, hasAccess, user?.role, currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, year, activeTab, refreshTrigger, paymentStatus]);

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
        // Reset semua filter agar data tab baru bersih
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
                minimum_stok: detail.minimum_stok
            };

            // Hapus atau abaikan setItemDetail jika hanya digunakan untuk form
            // Masukkan data langsung ke formData
            setFormData(dataToSet);
            setInitialFormData(dataToSet);
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
            console.log("Update Success:", response);
            showToast("Berhasil memperbarui data stok barang.", "success");
            setIsModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error fetching detail stok barang:", error);
            showToast("Gagal memperbarui data stok barang.", "error");
        }
        // try {
        //     const updatedItem = await getDetailStokBarang(itemDetail?.id || 0, formData);
        // }
    };
    const barangColumns: ColumnDefinition<BARANG_STOK>[] = [
        {
            header: 'Nama Barang',
            cell: (item) => {
                const config = CATEGORY_DATA.find(c => c.name === item.category_name);
                const IconComponent = config?.Icon || AtkIcon;
                const colorClass = config?.colorClass || 'bg-gray-100 text-gray-700';

                return (
                    <div className="flex items-center">
                        {/* Icon */}
                        <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <IconComponent className='w-6 h-6' />
                        </div>

                        {/* Wrapper Teks dengan min-w-0 agar flex item bisa mengecil */}
                        <div className="ml-4 min-w-0 flex-1">
                            <div
                                className="text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px]"
                                title={item.name} // Tooltip bawaan browser saat di-hover
                            >
                                {item.name}
                            </div>
                            <div
                                className="text-xs text-gray-500 truncate"
                                title={`Kategori: ${item.category_name}`}
                            >
                                Kategori: {item.category_name}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Stok Lama',
            cell: (item) => <>{item.stok_lama}</>
        },
        {
            header: 'Total Stok',
            cell: (item) => <>{item.total_stok}</>
        },
        {
            header: 'Minimum Stok',
            cell: (item) => <>{item.minimum_stok}</>
        },
        {
            header: 'Satuan',
            cell: (item) => <>{item.satuan}</>
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <div className="flex w-fit gap-5">
                    <button onClick={() => handleEditClick(item.id)} className="text-gray-900 hover:text-blue-600 flex items-center justify-start gap-1 w-full cursor-pointer transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Edit
                    </button>
                    <button onClick={() => handleLihatClick(item.id, 'barang')} className="text-gray-900 hover:text-blue-600 flex items-center justify-start gap-1 w-full cursor-pointer transition-colors">
                        <EyeIcon className='w-5 h-5' />
                        Lihat
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
                    <div className={`flex items-center gap-3 w-fit px-3 py-2 rounded-2xl ${colorClass}`}>
                        <div className={`shrink-0 rounded-lg flex items-center justify-center`}>
                            <IconComponent className='w-4 h-4' />
                        </div>
                        <span className={`rounded-full text-xs font-medium`}>
                            {item.category_name}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            cell: (item) => {
                return <Status
                    text={item.status}
                    color={item.status.toLowerCase().includes('telah dibayar') ? 'bg-green-600' : 'bg-[#FFB14C]'}
                />;
            }
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <button onClick={() => handleLihatClick(item.id, 'penerimaan')} className="text-gray-900 hover:text-blue-600 flex items-center justify-start gap-1 w-full cursor-pointer transition-colors">
                    <EyeIcon className='w-5 h-5' />
                    Lihat
                </button>
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
            {/* Navigation Tabs */}
            <NavigationTabs
                tabs={stokTabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />

            {/* Filter Buttons Section */}
            <CategoryFilter
                selectedCategoryId={selectedCategoryId}
                onCategoryClick={handleCategoryClick}
                categoryData={CATEGORY_DATA}
            />

            {/* Table Card */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className='flex items-center gap-4'>
                        <h2 className="text-xl font-bold text-blue-900">Daftar {activeTab == "stokBarang" ? "Stok Barang" : "Pembayaran BAST"}</h2>

                        {/* Search Input */}
                        <SearchBar
                            placeholder='Cari Barang...'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3"> {/* Wrapper baru agar dropdown sejajar */}

                        {/* --- TAMBAHAN 4: Dropdown Filter Status Pembayaran --- */}
                        {activeTab !== 'stokBarang' && (
                            <div className="relative">
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => {
                                        setPaymentStatus(e.target.value as 'paid' | 'unpaid' | '');
                                        setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
                                    }}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="paid">Terbayar</option>
                                    <option value="unpaid">Belum Dibayar</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            {/* 4. Implementasi Dropdown Dinamis (Tahun) - Kode Lama Tetap Ada */}
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                            >
                                {yearOptions.map((optionYear) => (
                                    <option key={optionYear} value={optionYear}>
                                        {optionYear}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="w-full h-[700px] overflow-hidden flex justify-center items-center">
                        {isLoading ? <Loader />
                            :
                            <div className='w-full h-full overflow-auto'>
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

                    <div className="px-4 bg-white shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </div>
            {/* Modal Input */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isForm={true}
            >
                <div className="flex flex-col gap-10 w-full p-6">
                    {/* Judul sesuai Desain (Warna Biru) */}
                    <h1 className="text-2xl text-center font-bold text-[#057CFF]">
                        FORM DETAIL STOK BARANG
                    </h1>
                    <div className='flex flex-col gap-4'>
                        {/* Field 1: Nama Barang */}
                        <Input
                            id='name'
                            judul='Nama Barang'
                            placeholder='Masukkan Nama Barang'
                            name='name'
                            // UBAH DISINI: Langsung baca dari formData
                            value={isFormLoading ? 'Memuat Data...' : formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        {/* Field 2: Minimum Stok */}
                        <Input
                            id='minimum_stok'
                            judul='Minimum Stok'
                            placeholder='Masukkan Minimum Stok'
                            name='minimum_stok'
                            type="number"
                            // UBAH DISINI: Langsung baca dari formData (handle angka 0 agar tidak kosong stringnya)
                            value={isFormLoading ? 'Memuat Data...' : String(formData.minimum_stok)}
                            onChange={(e) => setFormData({ ...formData, minimum_stok: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className='flex items-center justify-center gap-3'>
                        <Button variant="danger" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="success" onClick={handleConfirmSubmit}>Selesai</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default StokBarang;