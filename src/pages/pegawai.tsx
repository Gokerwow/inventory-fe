import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { PATHS } from "../Routes/path";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { ROLES, type APIJabatan, type DaftarPegawai } from "../constant/roles";
import { getDaftarPegawai, updateStatusPegawai } from "../services/pegawaiService";
import type { ColumnDefinition } from "../components/table";
import Loader from "../components/loader";
import ReusableTable from "../components/table";
import Pagination from "../components/pagination";
import { getJabatanSelect } from "../services/jabatanService";
import { useToast } from "../hooks/useToast";
import SearchBar from "../components/searchBar";
import { NavigationTabs } from "../components/navTabs";
import PegawaiIcon from '../assets/svgs/Akun Icon.svg?react'
import Button from "../components/button";
import { Plus, Filter } from "lucide-react"; // Tambahkan icon Filter optional untuk UI mobile
import CustomSelect from "../components/customFilter";

const PegawaiTabs = [
    {
        id: 'pegawai', label: 'Pegawai', icon: <PegawaiIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

export default function PegawaiPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<DaftarPegawai[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedJabatan, setSelectedJabatan] = useState<number>(0);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [jabatanList, setJabatanList] = useState<APIJabatan[]>([]);
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState('pegawai');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const PegawaiStatus = [
        { label: 'Aktif', value: 'active' },
        { label: 'Non-Aktif', value: 'inactive' },
    ]

    const { showToast } = useToast();

    const { checkAccess, hasAccess } = useAuthorization(ROLES.SUPER_ADMIN);
    const { user } = useAuth();

    const navigate = useNavigate();
    const handleTambahClick = () => {
        navigate(PATHS.PEGAWAI.TAMBAH)
    }

    const handleClick = (tab: string) => { setActiveTab(tab); setCurrentPage(1); };

    const handleEditClick = (pegawaiData: DaftarPegawai) => {
        navigate(PATHS.PEGAWAI.EDIT, {
            state: {
                data: pegawaiData,
            }
        })
    }

    const handleToggleDropdown = (id: string) => {
        // Jika id yang diklik sama dengan yang aktif -> tutup (null)
        // Jika beda -> buka yang baru (id)
        setActiveDropdown(prev => prev === id ? null : id);
    };

    const handleToggleStatus = async (pegawai: DaftarPegawai) => {
        if (updatingStatus[pegawai.nip]) return;

        try {
            setUpdatingStatus(prev => ({ ...prev, [pegawai.nip]: true }));
            await updateStatusPegawai(pegawai.id);

            setCurrentItems(prevItems =>
                prevItems.map(item =>
                    item.nip === pegawai.nip
                        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
                        : item
                )
            );

            showToast(`Status pegawai ${pegawai.name} berhasil diupdate.`, "success");
        } catch (err) {
            console.error("❌ Error updating status:", err);
            setError("Gagal mengubah status pegawai.");
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [pegawai.nip]: false }));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterJabatanChange = (jabatanId: number) => {
        setSelectedJabatan(jabatanId);
    }

    const handleFilterStatusChange = (status: string) => {
        setSelectedStatus(status);
    }

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

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [responsePegawai, responseJabatan] = await Promise.all([
                    getDaftarPegawai(currentPage, itemsPerPage, selectedJabatan, selectedStatus, debouncedSearch),
                    getJabatanSelect()
                ]);
                setCurrentItems(responsePegawai.data);
                setJabatanList(responseJabatan);
                setTotalItems(responsePegawai.total || 0);
                setItemsPerPage(responsePegawai.per_page || 10);
                setTotalPages(responsePegawai.last_page || 1);

            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData()
    }, [user?.role, currentPage, selectedJabatan, selectedStatus, debouncedSearch])

    const pegawaiColumns: ColumnDefinition<DaftarPegawai>[] = [
        {
            header: 'Nama Pegawai',
            cell: (item) => (
                <div className="flex items-center justify-end md:justify-start w-full">

                    <div className="shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <span className="font-semibold text-sm">{item.name.charAt(0).toUpperCase()}</span>
                    </div>

                    <div className="ml-4 min-w-0 flex-1">
                        <div
                            className="text-sm font-medium text-gray-900 truncate max-w-[150px] text-right md:text-left"
                            title={item.name}
                        >
                            {item.name}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'NIP',
            cell: (item) => (
                <div className="truncate text-gray-500" title={item.nip}>
                    {item.nip}
                </div>
            )
        },
        {
            header: 'Jabatan',
            cell: (item) =>
                <div className="truncate" title={item.jabatan}>
                    {item.jabatan}
                </div>
        },
        {
            header: 'No. Telepon',
            cell: (item) => (
                <div className="truncate text-gray-500" title={item.phone}>
                    {item.phone}
                </div>
            )
        },
        {
            header: 'Status',
            cell: (item) => {
                const isActive = item.status === 'active';
                const isUpdating = updatingStatus[item.nip];
                return (
                    <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={isUpdating}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 ${isActive ? 'bg-blue-600' : 'bg-gray-300'
                            } transition-colors duration-200 focus:outline-none ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <span className={`transform transition ease-in-out duration-200 ${isActive ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 bg-white rounded-full shadow`} />
                    </button>
                );
            }
        },
        {
            header: 'Aksi',
            align: 'center',
            cell: (item) => (
                <Button
                    onClick={() => handleEditClick(item)}
                    variant="ghost"
                    className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                </Button>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs tabs={PegawaiTabs} activeTab={activeTab} onTabClick={handleClick} />

            {/* Main Card Container */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">

                {/* Responsive Header */}
                <div className="p-4 md:p-6 flex flex-col xl:flex-row justify-between gap-4 border-b border-gray-100">

                    {/* Top Section: Title & Controls */}
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:items-center">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 shrink-0">
                            Daftar Pegawai
                        </h2>

                        {/* Wrapper Filter & Search */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1">
                            {/* Search Bar - Flex Grow */}
                            <div className="flex-1 flex gap-4">
                                <SearchBar
                                    placeholder='Cari Pegawai...'
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleTambahClick}
                                    variant="primary"
                                    className="w-auto"
                                >
                                    <Plus className="w-4 h-4 flex! sm:hidden!" />
                                </Button>
                            </div>

                            <div className="relative grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">

                                {/* Filter Jabatan */}
                                <CustomSelect
                                    options={[
                                        { value: 0, label: 'Semua Jabatan' },
                                        ...jabatanList.map(j => ({ value: j.id, label: j.name }))
                                    ]}
                                    value={selectedJabatan}
                                    onChange={handleFilterJabatanChange}
                                    placeholder="Semua Jabatan"

                                    // Styling
                                    className="static sm:relative w-full sm:w-36"
                                    dropdownClassName="w-full"

                                    // Logic Kontrol
                                    isOpen={activeDropdown === 'jabatan'}
                                    onToggle={() => handleToggleDropdown('jabatan')}
                                    onClose={() => setActiveDropdown(null)}
                                />

                                {/* Filter Status */}
                                <CustomSelect
                                    options={[
                                        { value: '', label: 'Semua Status' },
                                        ...PegawaiStatus.map(j => ({ value: j.value, label: j.label }))
                                    ]}
                                    value={selectedStatus}
                                    onChange={handleFilterStatusChange}
                                    placeholder="Semua Status"

                                    // Styling
                                    className="static sm:relative w-full sm:w-36"
                                    dropdownClassName="w-full"

                                    // Logic Kontrol
                                    isOpen={activeDropdown === 'status'}
                                    onToggle={() => handleToggleDropdown('status')}
                                    onClose={() => setActiveDropdown(null)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Button - Full width on Mobile */}
                    <Button
                        onClick={handleTambahClick}
                        variant="primary"
                        className="sm:flex items-center justify-center gap-2 shadow-sm shrink-0 hidden!"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pegawai</span>
                    </Button>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-hidden relative">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <div className="flex h-full justify-center items-center p-10 text-red-500 bg-red-50 mx-6 my-6 rounded-lg">
                            <p>{error}</p>
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className='flex h-full items-center justify-center bg-gray-50 mx-6 mb-6 mt-6 rounded-lg border border-dashed border-gray-300'>
                            <div className="text-center p-10">
                                <p className='font-medium text-gray-500'>Tidak ada data pegawai</p>
                            </div>
                        </div>
                    ) : (
                        <ReusableTable
                            columns={pegawaiColumns}
                            currentItems={currentItems}
                            mobileContainerClassName="pb-20 sm:pb-4"
                        />
                    )}
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />

            </div>
        </div>
    )
}