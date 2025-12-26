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
import { formatDate, formatTime } from '../services/utils';

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
                // Fetch data tanpa sorting backend (atau sesuaikan jika backend support)
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

    const handleClick = (tab: string) => { setActiveTab(tab); setCurrentPage(1); };

    if (error) {
        return (
            <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const LOGColummns: ColumnDefinition<LogItem>[] = [
        { header: 'NAME', cell: (item) => item.name },
        { header: 'WAKTU ', cell: (item) => `${item.waktu.substring(0, 5)} WIB` },
        { header: 'TANGGAL ', cell: (item) => formatDate(item.tanggal) },
        {
            header: 'AKTIVITAS',
            cell: (item) => {
                return <Status
                    value={item.activity}
                    className="w-48 text-center" // Custom width agar rapi
                />;
            }
        },
    ];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs tabs={LOGTabs} activeTab={activeTab} onTabClick={handleClick} />

            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className='p-6 pb-4 flex gap-4 items-center'>
                    <h2 className="text-xl font-semibold">Log Monitoring</h2>
                    {/* Search Input */}
                    <SearchBar
                        placeholder='Cari Log Aktivitas...'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* TABEL */}
                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <div className="flex-1 flex justify-center items-center py-10"><p className="text-red-500">{error}</p></div>
                    ) : dataLog.length === 0 ? (
                        <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                            <span className='font-medium text-gray-500'>DATA KOSONG</span>
                        </div>
                    ) : (
                        <ReusableTable
                            columns={LOGColummns}
                            currentItems={dataLog}
                        />
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
    );
}