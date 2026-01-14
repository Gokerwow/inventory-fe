import Pagination from '../components/pagination';
import { useEffect, useState } from 'react';
import { getLogAktivitas } from '../services/monitoringServices';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { ROLES, type LogItem } from '../constant/roles';
import Loader from '../components/loader';
import SearchBar from '../components/searchBar';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import Status from '../components/status';
import { NavigationTabs } from '../components/navTabs';
import MonitoringIcon from '../assets/svgs/monitoringIcon.svg?react';
import { formatDate } from '../services/utils';

const LOGTabs = [
    {
        id: 'monitoring', label: 'Monitoring', icon: <MonitoringIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

export default function MonitoringPage() {
    const [dataLog, setDataLog] = useState<LogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('monitoring');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { checkAccess, hasAccess } = useAuthorization(ROLES.SUPER_ADMIN);
    const { user } = useAuth();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getLogAktivitas(currentPage, itemsPerPage, debouncedSearch);
                setDataLog(response.data);
                setTotalItems(response.total || 0);
                setItemsPerPage(response.per_page || 10);
                setTotalPages(response.last_page || 1);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat log aktivitas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user?.role, currentPage, debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleClick = (tab: string) => { setActiveTab(tab); setCurrentPage(1); };

    // Jika error, tampilkan pesan di tengah
    if (error) {
        return (
            <div className="flex flex-col h-full w-full gap-5">
                <NavigationTabs tabs={LOGTabs} activeTab={activeTab} onTabClick={handleClick} />
                <div className="flex-1 p-8 bg-white rounded-lg shadow-md flex justify-center items-center border border-red-200">
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const LOGColummns: ColumnDefinition<LogItem>[] = [
        { header: 'NAME', cell: (item) => <span className="font-medium text-gray-900">{item.name}</span> },
        { header: 'WAKTU', cell: (item) => <span className="text-gray-500">{item.waktu.substring(0, 5)} WIB</span> },
        { header: 'TANGGAL', cell: (item) => <span className="text-gray-500">{formatDate(item.tanggal)}</span> },
        {
            header: 'AKTIVITAS',
            cell: (item) => {
                return (
                    // Bungkus Status dengan div agar width terjaga di dalam tabel
                    <div className="w-full max-w-[200px]">
                        <Status
                            value={item.activity}
                            className="w-full text-center"
                        />
                    </div>
                );
            }
        },
    ];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs tabs={LOGTabs} activeTab={activeTab} onTabClick={handleClick} />

            {/* Container Utama dengan flex-col dan min-h-0 untuk scrolling */}
            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 min-h-0">

                {/* Header Section: Judul & Search */}
                <div className='p-4 md:p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 shrink-0">
                        Log Monitoring
                    </h2>

                    {/* Search Bar Wrapper: Full width di mobile, auto di desktop */}
                    <div className="w-full sm:w-72 md:w-96">
                        <SearchBar
                            placeholder='Cari Log Aktivitas...'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section: relative + overflow-hidden penting agar ReusableTable bisa scroll mandiri */}
                <div className="flex-1 overflow-hidden relative border-t border-gray-100">
                    {isLoading ? (
                        <Loader />
                    ) : dataLog.length === 0 ? (
                        <div className='absolute inset-0 flex flex-col items-center justify-center p-8 text-center'>
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <MonitoringIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Belum ada aktivitas</h3>
                            <p className="text-gray-500 max-w-sm mt-1">
                                Data aktivitas pengguna akan muncul di sini setelah ada interaksi pada sistem.
                            </p>
                        </div>
                    ) : (
                        <ReusableTable
                            columns={LOGColummns}
                            currentItems={dataLog}
                        />
                    )}
                </div>
                {/* Pagination Section */}
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