import { useEffect, useMemo, useState } from 'react';
import EyeIcon from '../assets/svgs/eye.svg?react'
import ReusableTable, { type ColumnDefinition } from '../components/table';
import { NavigationTabs } from '../components/navTabs';
import ShoppingCartIcon from '../assets/svgs/shopping-cart.svg?react'
import ReceiptIcon from '../assets/svgs/receipt-item.svg?react'
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES, type APIPemesanan } from '../constant/roles';
import { getPemesananList } from '../services/pemesananService';
import Pagination from '../components/pagination';
import Status from '../components/status';
import Loader from '../components/loader';
import SearchBar from '../components/searchBar';
import { generatePath, useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import { exportPengeluaranExcel, getPengeluaranList } from '../services/pengeluaranService';

// --- 1. IMPORT LIBARARY PENDUKUNG ---
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Calendar as CalendarIcon, Check, ChevronDown, X } from 'lucide-react'; // Icon
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from 'date-fns'; // Logic Tanggal
import { id as indonesia } from 'date-fns/locale'; // Format Bahasa Indonesia
import CustomCalendar from '../components/calender';
import Button from '../components/button';
import { formatDate } from '../services/utils';

const pengeluaranTabs = [
    { id: 'pengeluaran', label: 'Pengeluaran', icon: <ShoppingCartIcon className="-ml-0.5 mr-2 h-5 w-5" /> },
    { id: 'riwayatPengeluaran', label: 'Riwayat Pengeluaran', icon: <ReceiptIcon className="-ml-0.5 mr-2 h-5 w-5" /> },
];

function Pengeluaran() {
    const [activeTab, setActiveTab] = useState('pengeluaran');
    const navigate = useNavigate()

    // State Pagination & Data
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [pemesananItem, setPemesananItem] = useState<APIPemesanan[]>([])
    const [pengeluaranItem, setPengeluaranItem] = useState<APIPemesanan[]>([])
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false); // State loading untuk export

    // --- STATE DATE PICKER ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activePreset, setActivePreset] = useState('');

    const requiredRoles = useMemo(() => [ROLES.ADMIN_GUDANG, ROLES.PENANGGUNG_JAWAB], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();


    // --- LOGIC PRESET ---
    const handlePresetClick = (type: string) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (type) {
            case 'today': break;
            case 'yesterday': start = subDays(today, 1); end = subDays(today, 1); break;
            case 'thisWeek': start = startOfWeek(today, { weekStartsOn: 1 }); end = endOfWeek(today, { weekStartsOn: 1 }); break;
            case 'last7Days': start = subDays(today, 6); end = today; break;
            case 'thisMonth': start = startOfMonth(today); end = endOfMonth(today); break;
            case 'thisYear': start = startOfYear(today); end = endOfYear(today); break;
            default: break;
        }

        setStartDate(format(start, 'yyyy-MM-dd'));
        setEndDate(format(end, 'yyyy-MM-dd'));
        setActivePreset(type);
        setCurrentPage(1);
    };

    const handleExportClick = async () => {
        setIsExporting(true);
        try {
            // Panggil API dengan filter tanggal saat ini
            const response = await exportPengeluaranExcel(startDate, endDate);

            // Buat URL sementara untuk blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Buat elemen <a> (link) virtual
            const link = document.createElement('a');
            link.href = url;

            // Set nama file (bisa dinamis)
            const fileName = `Pengeluaran_${startDate || 'All'}_to_${endDate || 'All'}.xlsx`;
            link.setAttribute('download', fileName);

            // Masukkan ke body, klik, lalu hapus
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link); // Clean up

            // Hapus object URL agar tidak memory leak
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Gagal mengunduh file Excel", error);
            // Opsional: showToast("Gagal mengunduh file", "error");
        } finally {
            setIsExporting(false);
        }
    };

    const handleCalendarChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            setActivePreset(''); // Reset preset jika manual selection selesai
            setCurrentPage(1);
        }
    };

    const handleResetDate = () => {
        setStartDate('');
        setEndDate('');
        setActivePreset('');
        setCurrentPage(1);
    };

    // --- FETCH DATA ---
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchAllData = async () => {
            setIsLoading(true)
            try {
                if (activeTab === 'pengeluaran') {
                    // Logic Pengeluaran (Tetap)
                    let dataPemesanan;
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        dataPemesanan = await getPemesananList(currentPage, itemsPerPage, debouncedSearch, user.role);
                    } else {
                        dataPemesanan = await getPemesananList(currentPage, itemsPerPage, debouncedSearch);
                    }
                    setPemesananItem(dataPemesanan.data);
                    setTotalItems(dataPemesanan.total || 0);
                    setItemsPerPage(dataPemesanan.per_page || 10);
                    setTotalPages(dataPemesanan.last_page || 1);
                } else {
                    // Logic Riwayat (Dengan Date)
                    const dataPengeluaran = await getPengeluaranList(
                        currentPage, itemsPerPage, debouncedSearch, user?.role, startDate, endDate
                    );
                    setPengeluaranItem(dataPengeluaran.data);
                    setTotalItems(dataPengeluaran.total || 0);
                    setItemsPerPage(dataPengeluaran.per_page || 10);
                    setTotalPages(dataPengeluaran.last_page || 1);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllData()
    }, [currentPage, user?.role, debouncedSearch, activeTab, startDate, endDate])

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleLihatClick = (id: number) => navigate(generatePath(PATHS.PENGELUARAN.LIHAT, { id: id.toString() }));

    // ... Columns Definition (Sama seperti sebelumnya) ...
    const pengeluaranColumns: ColumnDefinition<APIPemesanan>[] = useMemo(() => [
        { header: 'INSTALASI', key: 'instalasi', cell: (item) => <span className="text-gray-900">{item.user_name}</span> },
        { header: 'RUANGAN', key: 'ruangan', cell: (item) => <span className="text-gray-900">{item.ruangan}</span> },
        { header: 'TANGGAL', key: 'tanggal', cell: (item) => <span className="text-gray-900">{formatDate(item.tanggal_pemesanan)}</span> },
        { header: 'STATUS', key: 'status', align: 'center', cell: (item) => <Status code={item.status_code} label={item.status} value={item.status} /> },
        { header: 'AKSI', key: 'aksi', align: 'center', cell: (item) => (<button className="w-full flex items-center justify-center gap-2 text-black cursor-pointer hover:scale-110 transition-all duration-200" onClick={() => handleLihatClick(item.id)}><div className="bg-white/20 rounded-full p-0.5"><EyeIcon className='w-5 h-5' /></div>Lihat</button>) }
    ], []);

    const riwayatPengeluaranColumns: ColumnDefinition<any>[] = useMemo(() => {
        if (user?.role === ROLES.ADMIN_GUDANG) {
            return [
                { header: 'NO SURAT', key: 'no_surat', cell: (item) => <span className="text-gray-900 font-medium">{item.no_surat}</span> },
                { header: 'INSTALASI', key: 'instalasi', cell: (item) => <span className="text-gray-900">{item.instalasi}</span> },
                { header: 'NAMA BARANG', key: 'stok_name', cell: (item) => <span className="text-gray-900">{item.stok_name}</span> },
                { header: 'KATEGORI', key: 'category_name', cell: (item) => <span className="text-gray-500 text-sm">{item.category_name}</span> },
                { header: 'JUMLAH', key: 'quantity', width: '80px', align: 'center', cell: (item) => <span className="text-gray-900 font-bold">{item.quantity}</span> },
                { header: 'TANGGAL KELUAR', key: 'tanggal_pengeluaran', cell: (item) => <span className="text-gray-900 text-xs">{formatDate(item.tanggal_pengeluaran)}</span> }
            ];
        }
        return [
            { header: 'INSTALASI', key: 'user_name', cell: (item) => <span className="text-gray-900 font-medium">{item.user_name}</span> },
            { header: 'RUANGAN', key: 'ruangan', cell: (item) => <span className="text-gray-900">{item.ruangan}</span> },
            { header: 'TANGGAL', key: 'tanggal_pemesanan', cell: (item) => <span className="text-gray-900">{formatDate(item.tanggal_pemesanan)}</span> },
            { header: 'STATUS', key: 'status', align: 'center', cell: (item) => <Status code={item.status_code} label={item.status} value={item.status} /> },
        ];
    }, [user?.role]);

    const currentActiveData = activeTab === 'pengeluaran' ? pemesananItem : pengeluaranItem;

    return (
        <div className="w-full flex flex-col gap-5 h-full">
            <NavigationTabs
                tabs={pengeluaranTabs}
                activeTab={activeTab}
                onTabClick={(tab) => { setActiveTab(tab); setSearch(''); handleResetDate(); }}
            />

            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 shrink-0">
                    {/* PARENT CONTAINER:
                    Menggunakan 'justify-between' untuk memisahkan anak kiri dan kanan 
                */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        {/* --- SISI KIRI (Judul & Search) --- */}
                        <div className='flex items-center gap-3 w-full sm:w-auto'>
                            <h1 className="text-xl font-bold text-[#002B5B] whitespace-nowrap">
                                {activeTab === 'pengeluaran' ? 'Daftar Pengeluaran' : 'Riwayat Pengeluaran'}
                            </h1>
                            <SearchBar placeholder='Cari Pengeluaran...' onChange={(e) => setSearch(e.target.value)} value={search} />
                        </div>

                        {/* --- SISI KANAN (Date Picker & Export) --- */}
                        {/* Kode ini dikeluarkan dari div Sisi Kiri di atas */}
                        {activeTab === 'riwayatPengeluaran' && user?.role === ROLES.ADMIN_GUDANG && (
                            <div className='flex items-center gap-3'> {/* Tambahkan items-center & gap-3 agar rapi */}

                                {/* POP UP CALENDAR & PRESETS */}
                                <Popover className="relative">
                                    {({ open, close }) => (
                                        <>
                                            <PopoverButton className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border outline-none cursor-pointer
                                        ${open || (startDate && endDate) ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100/50' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                                <CalendarIcon size={18} className={startDate ? "text-blue-600" : "text-gray-500"} />
                                                <div className="flex flex-col items-start leading-tight">
                                                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Periode</span>
                                                    <span className="whitespace-nowrap font-semibold">
                                                        {startDate && endDate
                                                            ? `${format(parseISO(startDate), 'dd MMM', { locale: indonesia })} - ${format(parseISO(endDate), 'dd MMM yyyy', { locale: indonesia })}`
                                                            : "Semua Waktu"}
                                                    </span>
                                                </div>
                                                <ChevronDown size={16} className={`ml-2 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
                                            </PopoverButton>

                                            {/* POPOVER PANEL (Isi Calendar) - Kode tetap sama, hanya merapikan indentasi */}
                                            <PopoverPanel className="absolute right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden ring-1 ring-black ring-opacity-5 origin-top-right flex flex-row min-h-[350px] w-[600px]">
                                                <div className="w-40 bg-gray-50 border-r border-gray-100 p-2 flex flex-col gap-1 shrink-0">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 px-2 mt-2">Pilih Cepat</p>
                                                    {[
                                                        { id: 'today', label: 'Hari Ini' },
                                                        { id: 'thisWeek', label: 'Minggu Ini' },
                                                        { id: 'last7Days', label: '7 Hari Terakhir' },
                                                        { id: 'thisMonth', label: 'Bulan Ini' },
                                                        { id: 'thisYear', label: 'Tahun Ini' },
                                                    ].map((preset) => (
                                                        <button key={preset.id} onClick={() => handlePresetClick(preset.id)}
                                                            className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-all flex justify-between items-center cursor-pointer ${activePreset === preset.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-white'}`}>
                                                            {preset.label}
                                                            {activePreset === preset.id && <Check size={14} className="text-blue-600" />}
                                                        </button>
                                                    ))}
                                                    <div className="flex-1"></div>
                                                    {(startDate || endDate) && (
                                                        <button onClick={handleResetDate} className="mb-2 text-xs text-red-500 hover:text-red-700 flex items-center justify-center gap-1 hover:bg-red-50 px-2 py-2 rounded transition-colors w-full border border-transparent hover:border-red-100">
                                                            <X size={12} /> Hapus Filter
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex-1 w-full p-4 bg-white flex flex-col items-center">
                                                    <p className="text-xs text-gray-500 mb-2 w-full text-center px-2">
                                                        {startDate && !endDate ? "Pilih tanggal akhir..." : "Pilih rentang tanggal"}
                                                    </p>
                                                    <CustomCalendar
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        onChange={handleCalendarChange}
                                                    />
                                                    <div className="w-full px-2 mt-2 pt-3 border-t border-gray-100 flex justify-end">
                                                        <button onClick={() => close()} className="bg-[#002B5B] hover:bg-blue-900 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-md transition-all">
                                                            Selesai
                                                        </button>
                                                    </div>
                                                </div>
                                            </PopoverPanel>
                                        </>
                                    )}
                                </Popover>

                                {/* TOMBOL EXPORT */}
                                <Button
                                    variant='primary'
                                    onClick={handleExportClick}
                                    disabled={isExporting} // Tambahkan loading state visual jika mau
                                    className="whitespace-nowrap" // Agar teks tidak turun
                                >
                                    {isExporting ? 'Exporting...' : 'Export Excel'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ... Bagian Table dan Pagination Tetap Sama ... */}
                {isLoading ? <Loader /> : currentActiveData.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                        <span className='font-medium text-gray-500'>DATA KOSONG</span>
                    </div>
                ) : (
                    <>
                        {activeTab === 'pengeluaran' ?
                            <div className="flex-1 overflow-auto min-h-0"><ReusableTable columns={pengeluaranColumns} currentItems={pemesananItem} /></div>
                            :
                            <div className="flex-1 overflow-auto min-h-0"><ReusableTable columns={riwayatPengeluaranColumns} currentItems={pengeluaranItem} /></div>
                        }
                        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Pengeluaran;