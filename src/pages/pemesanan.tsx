import { useEffect, useRef, useState } from "react";
import { CategoryFilter } from "../components/categoryFilter";
import { NavigationTabs } from "../components/navTabs";
import { useAuth } from "../hooks/useAuth";
import { useAuthorization } from "../hooks/useAuthorization";
import { CATEGORY_DATA, ROLES, type APIPemesanan, type APIPemesananBaru, type APIPemesananBaruItem, type APIStokPemesanan } from "../constant/roles";
import { createPemesanan, getPemesananList, getStokPemesanan } from "../services/pemesananService";
import Pagination from "../components/pagination";
import ReusableTable, { type ColumnDefinition } from "../components/table";
import Loader from "../components/loader";
import ShoppingCartIcon from '../assets/svgs/shopping-cart.svg?react'
import AtkIcon from '../assets/svgs/AtkIcon.svg?react'
import Status from "../components/status";
import ReceiptIcon from "../assets/svgs/receipt-item.svg?react";
import Input from "../components/input";
import ConfirmModal from "../components/confirmModal";
import { useToast } from "../hooks/useToast";
import Button from "../components/button";

const pemesananTabs = [
    {
        id: 'pemesanan', label: 'Pemesanan', icon: <ShoppingCartIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
    {
        id: 'statusPemesanan', label: 'Status Pemesanan', icon: <ReceiptIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];


export default function PemesananPage() {
    const [activeTab, setActiveTab] = useState('pemesanan')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStokItems, setCurrentStokItems] = useState<APIStokPemesanan[]>([]);
    const [currentPemesananItems, setCurrentPemesananItems] = useState<APIPemesanan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [BarangPesanan, setBarangPesanan] = useState<APIPemesananBaruItem[]>([])
    const [formData, setFormData] = useState<APIPemesananBaru>({
        ruangan: '',
        nama_pj_instalasi: '',
        items: []
    });

    const { checkAccess, hasAccess } = useAuthorization(ROLES.INSTALASI);
    const { user } = useAuth();

    const { showToast } = useToast()

    const targetRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === 'pemesanan') {
                    console.log('Fetching Stok Data....')
                    // Pastikan parameter year dikirim jika API mendukung filter tahun
                    // Contoh: getStokBarang(..., debouncedSearch, year)
                    const response = await getStokPemesanan(currentPage, itemsPerPage, selectedCategoryId, debouncedSearch);
                    console.log("📦 Stok Response:", response);
                    setCurrentStokItems(response.data.flat());
                    setTotalItems(response.total || 0);
                    setItemsPerPage(response.per_page || 10);
                    setTotalPages(response.last_page || 1);
                } else {
                    console.log('Fetching BAST Data....')
                    // Pastikan parameter year dikirim jika API mendukung filter tahun
                    // Contoh: getStokBarang(..., debouncedSearch, year)
                    const response = await getPemesananList(currentPage, itemsPerPage, debouncedSearch, user?.role);
                    console.log("📦 BAST Response:", response);
                    setCurrentPemesananItems(response.data.flat());
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
        }

        fetchData();
    }, [activeTab, currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, user?.role, refreshKey, checkAccess, hasAccess]);

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

    const handleCategoryClick = (id: number) => {
        if (selectedCategoryId === id) {
            setSelectedCategoryId(undefined);
        } else {
            setSelectedCategoryId(id);
        }
        setCurrentPage(1);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleScrollToTarget = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const handlePesanClick = (item: APIStokPemesanan, action: true | false = true) => {
        handleScrollToTarget();
        setBarangPesanan(prev => {
            const updated = [...prev];

            // Cari index item yang sudah ada
            const existingIndex = updated.findIndex(p => p.stok_id === item.id);

            if (action === true) {
                if (existingIndex !== -1) {
                    // Jika sudah ada, tambah quantity
                    updated[existingIndex].quantity += 1;
                } else {
                    // Jika belum ada, tambah item baru
                    updated.push({
                        name: item.name,
                        stok_id: item.id,
                        quantity: 1
                    });
                }
            } else {
                if (existingIndex !== -1) {
                    // Jika sudah ada, tambah quantity
                    updated[existingIndex].quantity -= 1;
                }
            }

            return updated;
        });
    }

    // Tambahkan fungsi baru
    const handleUpdateQuantity = (stokId: number, increment: boolean) => {
        console.log("Updating quantity for stok ID:", stokId, "Increment:", increment);
        setBarangPesanan(prev => {
            const updated = [...prev];
            const existingIndex = updated.findIndex(p => p.stok_id === stokId);

            if (existingIndex !== -1) {
                if (increment) {
                    updated[existingIndex].quantity += 1;
                } else {
                    updated[existingIndex].quantity -= 1;

                    // Hapus jika quantity jadi 0
                    if (updated[existingIndex].quantity === 0) {
                        updated.splice(existingIndex, 1);
                    }
                }
            }

            return updated;
        });
    }

    const handleRemoveItem = (stokId: number) => {
        setBarangPesanan(prev => prev.filter(item => item.stok_id !== stokId));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsModalOpen(true);
    }

    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const dataFinal = {
                ruangan: formData.ruangan,
                nama_pj_instalasi: formData.nama_pj_instalasi,
                items: BarangPesanan.map(item => ({
                    stok_id: item.stok_id,
                    quantity: item.quantity
                }))
            }

            const payload = await createPemesanan(dataFinal);
            console.log("✅ Pemesanan created:", payload);
            showToast('Pemesanan berhasil dibuat!', 'success');
            setIsSubmitting(false);
            setIsModalOpen(false);
            setFormData({
                ruangan: '',
                nama_pj_instalasi: '',
                items: []
            });
            setBarangPesanan([]);
            showToast('Anda berhasil membuat pesanan baru!', 'success')
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            console.error("❌ Error submitting form:", err);
            showToast('Gagal membuat pemesanan', 'error');
        } finally {
            setIsSubmitting(false); // ✅ Pindahkan ke finally agar selalu dijalankan
        }
    }

    const pemesananColumns: ColumnDefinition<APIPemesanan>[] = [
        { header: 'Nama Instalasi', cell: (item) => item.user_name },
        { header: 'Tanggal Dibuat', cell: (item) => item.tanggal_pemesanan },
        { header: 'Ruangan', cell: (item) => item.ruangan },
        {
            header: 'Status',
            cell: (item) => {
                return <Status
                    label={item.status}
                    value={item.status}
                />
            }
        },
    ];

    const stokPemesananColumns: ColumnDefinition<APIStokPemesanan>[] = [
        { header: 'Nama', cell: (item) => item.name },
        { header: 'Jumlah Stok', cell: (item) => item.total_stok },
        { header: 'Satuan', cell: (item) => item.satuan },
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
                )
            }
        },
        {
            header: 'Aksi',
            cell: (item) => {
                // 1. Cek apakah stok habis
                const isHabis = item.total_stok <= 0;

                return (
                    <button
                        // 2. Nonaktifkan klik jika habis
                        onClick={() => !isHabis && handlePesanClick(item)}
                        disabled={isHabis}
                        // 3. Ubah styling berdasarkan status stok
                        className={`flex items-center justify-start gap-1 w-full transition-colors ${isHabis
                            ? 'text-gray-400 cursor-not-allowed' // Style jika habis
                            : 'text-gray-900 hover:text-blue-600 cursor-pointer' // Style jika ada
                            }`}
                    >
                        <ShoppingCartIcon className={`w-5 h-5 ${isHabis ? 'text-gray-400' : ''}`} />
                        {/* 4. Ubah teks tombol */}
                        {isHabis ? 'Stok Habis' : 'Pesan'}
                    </button>
                )
            }
        },
    ];

    const currentActiveData = activeTab === 'pemesanan' ? currentStokItems : currentPemesananItems;

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className={`w-full min-h-full flex flex-col gap-5 ${activeTab === 'pemesanan' ? '' : 'min-h-full'}`}>

            {/* Navigation Tabs */}
            <NavigationTabs
                tabs={pemesananTabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
            />

            {/* Filter Buttons Section */}
            {activeTab === 'pemesanan' &&
                <CategoryFilter
                    selectedCategoryId={selectedCategoryId}
                    onCategoryClick={handleCategoryClick}
                    categoryData={CATEGORY_DATA}
                />
            }

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-auto">
                <div className="border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className="px-4 py-4 md:px-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                        <h2 className="text-lg md:text-xl font-bold text-blue-900 whitespace-nowrap">
                            {activeTab === 'pemesanan' ? 'Katalog Barang' : 'Status Pemesanan'}
                        </h2>

                        {/* Search Input - Full Width di Mobile */}
                        <div className="relative w-full md:w-64">
                            {activeTab === 'pemesanan' &&
                                <>
                                    <input
                                        type="text"
                                        name="search"
                                        className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 text-gray-700 outline-none rounded-lg transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
                                        placeholder="Cari barang..."
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
                                            <path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M338.29 338.29L448 448" />
                                        </svg>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    {/* ✅ Ubah div ini dengan height yang konsisten */}
                    <div className="w-full h-[700px] flex items-center justify-center">
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <div className="flex-1 flex justify-center items-center py-10"><p className="text-red-500">{error}</p></div>
                        ) : currentActiveData.length === 0 ? (
                            <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                                <span className='font-medium text-gray-500'>DATA KOSONG</span>
                            </div>
                        ) : (
                            <div className="w-full h-full overflow-auto">
                                {activeTab === 'pemesanan' ?
                                    <ReusableTable
                                        columns={stokPemesananColumns}
                                        currentItems={currentStokItems}
                                    />
                                    :
                                    <ReusableTable
                                        columns={pemesananColumns}
                                        currentItems={currentPemesananItems}
                                    />
                                }
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>
            </div>

            {/* Form Pemesanan */}
            {activeTab === 'pemesanan' &&
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Pesanan Barang</h2>

                    {/* Table */}
                    <div className="overflow-x-auto mb-6">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase">
                                            Barang
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase">
                                            Jumlah
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BarangPesanan.length > 0 ? (
                                        BarangPesanan.map((pesanan) => (
                                            <tr key={pesanan.stok_id} className="border-b border-gray-100">
                                                <td className="py-4 px-4 text-gray-800">{pesanan.name}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(pesanan.stok_id, false)}
                                                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>

                                                        <span className="text-gray-800 font-medium min-w-5 text-center">
                                                            {pesanan.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(pesanan.stok_id, true)}
                                                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => handleRemoveItem(pesanan.stok_id)}
                                                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center text-gray-400 py-8">
                                                Belum ada barang di pesanan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                                <tfoot>
                                    <tr className="border-y-2 border-gray-200">
                                        <td className="py-4 px-4 font-semibold text-gray-800">
                                            Total
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-gray-800 pl-14">
                                            {/* pl-14 ditambahkan untuk menyesuaikan posisi dengan angka di atas yang tergeser oleh tombol minus */}
                                            {BarangPesanan.reduce((total, item) => total + item.quantity, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    {/* Form Inputs */}
                    <div ref={targetRef} className="grid md:grid-cols-2 gap-4 mb-6 ">
                        <Input
                            id="nama_pj_instalasi"
                            name="nama_pj_instalasi"
                            judul="Penanggung Jawab"
                            placeholder="John Doe"
                            value={formData.nama_pj_instalasi}
                            onChange={handleChange}
                        />
                        <Input
                            id="ruangan"
                            name="ruangan"
                            judul="Ruangan"
                            placeholder="Masukkan ruangan yang memesan"
                            value={formData.ruangan}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type='submit'
                            disabled={BarangPesanan.length === 0 || !formData.nama_pj_instalasi || !formData.ruangan}
                            className="self-end"
                        >
                            Ajukan Pemesanan
                        </Button>
                    </div>
                </form>
            }
            {/* --- MODAL COMPONENTS (Biarkan tetap di bawah) --- */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                isLoading={isSubmitting}
                text={"Apakah Anda yakin ingin dengan pesanan ini?"}
            />
        </div>
    )
}