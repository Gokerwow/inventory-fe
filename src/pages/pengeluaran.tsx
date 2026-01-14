/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import EyeIcon from '../assets/svgs/eye.svg?react';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import { NavigationTabs } from '../components/navTabs';
import ShoppingCartIcon from '../assets/svgs/shopping-cart.svg?react';
import ReceiptIcon from '../assets/svgs/receipt-item.svg?react';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { ROLES, type APIPemesanan, type APIPengeluaranList } from '../constant/roles';
import { getPemesananList } from '../services/pemesananService';
import Pagination from '../components/pagination';
import Status from '../components/status';
import Loader from '../components/loader';
import SearchBar from '../components/searchBar';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import { exportPengeluaranExcel, getPengeluaranList } from '../services/pengeluaranService';
// --- 1. IMPORT LIBARARY PENDUKUNG ---
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Calendar as CalendarIcon, Check, ChevronDown, Download, X } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';
import CustomCalendar from '../components/calender';
import Button from '../components/button';
import { formatDate } from '../services/utils';

const pengeluaranTabs = [
    { id: 'pengeluaran', label: 'Pengeluaran', icon: <ShoppingCartIcon className="-ml-0.5 mr-2 h-5 w-5" /> },
    { id: 'riwayatPengeluaran', label: 'Riwayat Pengeluaran', icon: <ReceiptIcon className="-ml-0.5 mr-2 h-5 w-5" /> },
];

function Pengeluaran() {
    const [activeTab, setActiveTab] = useState('pengeluaran');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'riwayat') {
            setActiveTab('riwayatPengeluaran');
        } else if (tab === 'daftar') {
            setActiveTab('pengeluaran');
        }
    }, [searchParams]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setSearch('');
        handleResetDate();

        if (tabId === 'riwayatPengeluaran') {
            setSearchParams({ tab: 'riwayat' });
        } else {
            setSearchParams({ tab: 'daftar' });
        }
    };
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [pemesananItem, setPemesananItem] = useState<APIPemesanan[]>([]);
    const [pengeluaranItem, setPengeluaranItem] = useState<APIPengeluaranList[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // --- STATE DATE PICKER ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activePreset, setActivePreset] = useState('');

    const requiredRoles = useMemo(() => [ROLES.ADMIN_GUDANG, ROLES.PENANGGUNG_JAWAB], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();


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
            const response = await exportPengeluaranExcel(startDate, endDate);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `Pengeluaran_${startDate || 'All'}_to_${endDate || 'All'}.xlsx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Gagal mengunduh file Excel", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleCalendarChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            setActivePreset('');
            setCurrentPage(1);
        }
    };

    const handleResetDate = () => {
        setStartDate('');
        setEndDate('');
        setActivePreset('');
        setCurrentPage(1);
    };

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'pengeluaran') {
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
        };
        fetchAllData();
    }, [currentPage, user?.role, debouncedSearch, activeTab, startDate, endDate, checkAccess, hasAccess, itemsPerPage]);

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleLihatClick = (id: number) => navigate(generatePath(PATHS.PENGELUARAN.LIHAT, { id: id.toString() }));

    const pengeluaranColumns: ColumnDefinition<APIPemesanan>[] = useMemo(() => [
        { header: 'INSTALASI', key: 'instalasi', cell: (item) => <span className="text-gray-900">{item.user_name}</span> },
        { header: 'RUANGAN', key: 'ruangan', cell: (item) => <span className="text-gray-900">{item.ruangan}</span> },
        { header: 'TANGGAL', key: 'tanggal', cell: (item) => <span className="text-gray-900">{formatDate(item.tanggal_pemesanan)}</span> },
        { header: 'STATUS', key: 'status', align: 'center', cell: (item) => <Status label={item.status} value={item.status} /> },
        { header: 'AKSI', key: 'aksi', align: 'center', cell: (item) => (<button className="flex items-center justify-end md:justify-center w-full gap-2 text-black cursor-pointer hover:text-blue-600 transition-all duration-200" onClick={() => handleLihatClick(item.id)}><div className="bg-gray-100 p-1 rounded-md"><EyeIcon className='w-4 h-4' /></div><span className="text-sm font-medium">Lihat</span></button>) }
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
        <div className="w-full flex flex-col gap-5 h-full min-h-screen">
            <NavigationTabs
                tabs={pengeluaranTabs}
                activeTab={activeTab}
                onTabClick={handleTabChange}
            />

            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-0">
                {/* Header Container */}
                <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
                    <div className="flex flex-col xl:flex-row justify-between gap-4 xl:items-center">

                        {/* --- SISI KIRI (Judul & Search) --- */}
                        <div className='flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto flex-1'>
                            <h1 className="text-lg md:text-xl font-bold text-[#002B5B] whitespace-nowrap shrink-0">
                                {activeTab === 'pengeluaran' ? 'Daftar Pengeluaran' : 'Riwayat Pengeluaran'}
                            </h1>
                            <div className='flex gap-2 w-full md:w-auto'>
                                <div className="md:w-72">
                                    <SearchBar placeholder='Cari Pengeluaran...' onChange={(e) => setSearch(e.target.value)} value={search} />
                                </div>
                                {/* TOMBOL EXPORT */}
                                {activeTab === 'riwayatPengeluaran' && user?.role === ROLES.ADMIN_GUDANG &&
                                    <Button
                                        variant='primary'
                                        onClick={handleExportClick}
                                        disabled={isExporting || currentActiveData.length === 0}
                                        className="flex-1 sm:hidden"
                                    >
                                        <Download size={20} />
                                    </Button>
                                }
                            </div>
                        </div>

                        {/* --- SISI KANAN (Date Picker & Export) --- */}
                        {activeTab === 'riwayatPengeluaran' && user?.role === ROLES.ADMIN_GUDANG && (
                            <div className='flex flex-col sm:flex-row gap-3 w-full xl:w-auto'>

                                {/* POP UP CALENDAR & PRESETS */}
                                <Popover className="relative w-full sm:w-auto">
                                    {({ open, close }) => (
                                        <>
                                            <PopoverButton className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border outline-none cursor-pointer
                                        ${open || (startDate && endDate) ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100/50' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon size={18} className={startDate ? "text-blue-600" : "text-gray-500"} />
                                                    <div className="flex flex-col items-start leading-tight">
                                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Periode</span>
                                                        <span className="whitespace-nowrap font-semibold">
                                                            {startDate && endDate
                                                                ? `${format(parseISO(startDate), 'dd MMM', { locale: indonesia })} - ${format(parseISO(endDate), 'dd MMM yyyy', { locale: indonesia })}`
                                                                : "Semua Waktu"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronDown size={16} className={`ml-2 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
                                            </PopoverButton>

                                            {/* POPOVER PANEL RESPONSIVE */}
                                            {/* Gunakan w-[85vw] untuk mobile agar pas layar, dan sm:w-[600px] untuk desktop */}
                                            <PopoverPanel className="absolute right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden ring-1 ring-black ring-opacity-5 origin-top-right flex flex-col sm:flex-row w-[85vw] sm:w-[600px] max-w-[600px]">

                                                {/* Sidebar Preset: Scroll Horizontal di Mobile, Vertikal di Desktop */}
                                                <div className="w-full sm:w-40 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100 p-2 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-visible shrink-0 no-scrollbar">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 px-2 hidden sm:block mt-2">Pilih Cepat</p>
                                                    {[
                                                        { id: 'today', label: 'Hari Ini' },
                                                        { id: 'thisWeek', label: 'Minggu Ini' },
                                                        { id: 'last7Days', label: '7 Hari Terakhir' },
                                                        { id: 'thisMonth', label: 'Bulan Ini' },
                                                        { id: 'thisYear', label: 'Tahun Ini' },
                                                    ].map((preset) => (
                                                        <button key={preset.id} onClick={() => handlePresetClick(preset.id)}
                                                            className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-all flex justify-between items-center cursor-pointer whitespace-nowrap shrink-0 ${activePreset === preset.id ? 'bg-blue-100 text-blue-700' : 'bg-white sm:bg-transparent text-gray-600 hover:bg-white border border-gray-200 sm:border-transparent'}`}>
                                                            {preset.label}
                                                            {activePreset === preset.id && <Check size={14} className="text-blue-600 hidden sm:block" />}
                                                        </button>
                                                    ))}
                                                    <div className="flex-1 hidden sm:block"></div>
                                                    {(startDate || endDate) && (
                                                        <button onClick={handleResetDate} className="hidden sm:flex mb-2 text-xs text-red-500 hover:text-red-700 items-center justify-center gap-1 hover:bg-red-50 px-2 py-2 rounded transition-colors w-full border border-transparent hover:border-red-100">
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
                                                    <div className="w-full px-2 mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                        {/* Tombol Hapus Filter Mobile */}
                                                        {(startDate || endDate) ? (
                                                            <button onClick={handleResetDate} className="sm:hidden text-xs text-red-500 flex items-center gap-1">
                                                                <X size={12} /> Reset
                                                            </button>
                                                        ) : <div></div>}

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
                                    disabled={isExporting || currentActiveData.length === 0}
                                    className="w-full hidden! sm:w-auto whitespace-nowrap sm:flex! items-center justify-center gap-2"
                                >
                                    <Download size={20} />
                                    {isExporting ? 'Exporting...' : 'Export Excel'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {isLoading ? <Loader /> : currentActiveData.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                        <span className='font-medium text-gray-500'>DATA KOSONG</span>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-hidden relative">
                            {activeTab === 'pengeluaran' ?
                                <ReusableTable columns={pengeluaranColumns} currentItems={pemesananItem} />
                                :
                                <ReusableTable columns={riwayatPengeluaranColumns} currentItems={pengeluaranItem} />
                            }
                        </div>
                        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Pengeluaran;