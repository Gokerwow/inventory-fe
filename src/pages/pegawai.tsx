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
import { Plus } from "lucide-react";

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

    // Fungsi untuk toggle status per pegawai
    const handleToggleStatus = async (pegawai: DaftarPegawai) => {
        // Cegah multiple clicks
        if (updatingStatus[pegawai.nip]) return;

        try {
            setUpdatingStatus(prev => ({ ...prev, [pegawai.nip]: true }));

            // Panggil API untuk update status
            await updateStatusPegawai(pegawai.id);

            // Update status di local state setelah berhasil
            setCurrentItems(prevItems =>
                prevItems.map(item =>
                    item.nip === pegawai.nip
                        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
                        : item
                )
            );

            console.log(`✅ Status pegawai ${pegawai.name} berhasil diupdate`);
            showToast(`Status pegawai ${pegawai.name} berhasil diupdate.`, "success");
        } catch (err) {
            console.error("❌ Error updating status:", err);
            setError("Gagal mengubah status pegawai.");
            // Bisa tambahkan toast notification di sini
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [pegawai.nip]: false }));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterJabatanChange = (jabatanId: number) => {
        console.log("Filter jabatan berubah:", jabatanId);
        setSelectedJabatan(jabatanId);
    }

    const handleFilterStatusChange = (status: string) => {
        console.log("Filter status berubah:", status);
        setSelectedStatus(status);
    }

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

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log('Fetching Data Pegawai....')
                const [responsePegawai, responseJabatan] = await Promise.all([
                    getDaftarPegawai(currentPage, itemsPerPage, selectedJabatan, selectedStatus, debouncedSearch),
                    getJabatanSelect() // Asumsi fungsi ini tidak butuh parameter pagination
                ]);
                console.log("📦 Pegawai Response:", responsePegawai);
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
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {/* Tambahkan min-w-0 agar flex item bisa mengecil (truncate) */}
                    <div className="ml-4 min-w-0 flex-1">
                        <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={item.name} // Tooltip native saat hover
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
                <div className="truncate" title={item.nip}>
                    {item.nip}
                </div>
            )
        },
        {
            header: 'Jabatan',
            cell: (item) => (
                <div className="truncate" title={item.jabatan.name}>
                    {item.jabatan.name}
                </div>
            )
        },
        {
            header: 'No. Telepon',
            cell: (item) => (
                <div className="truncate" title={item.phone}>
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
                        className={`relative inline-flex items-center h-6 rounded-full w-11 ${isActive ? 'bg-blue-600' : 'bg-gray-500'
                            } transition-all duration-200 focus:outline-none ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <span className="sr-only">
                            {isActive ? 'Nonaktifkan' : 'Aktifkan'} pegawai
                        </span>
                        <span
                            className={`${isActive ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}
                        ></span>
                    </button>
                );
            }
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <button
                    onClick={() => handleEditClick(item)}
                    className="flex items-center hover:text-blue-600 font-medium truncate"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="truncate">Edit</span>
                </button>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs tabs={PegawaiTabs} activeTab={activeTab} onTabClick={handleClick} />

            {/* Table Card */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className='p-6 pb-4 flex justify-between items-center'>
                    <div className="flex items-center justify-center gap-3">
                        <h2 className="text-xl font-semibold">Daftar Pegawai</h2>
                        {/* Search Input */}
                        <SearchBar
                            placeholder='Cari Pegawai...'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="relative w-full sm:w-auto">
                            <select onChange={(e) => handleFilterJabatanChange(e.target.value)} className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                                <option value=''>Semua Jabatan</option>
                                {jabatanList.map((jabatan) => (
                                    <option key={jabatan.id} value={jabatan.id}>{jabatan.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <select onChange={(e) => handleFilterStatusChange(e.target.value)} className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                                <option value=''>Semua Status</option>
                                {PegawaiStatus.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleTambahClick} variant="primary" className="flex items-center gap-2 shadow-sm">
                        <Plus className="w-5 h-5" />
                        Tambah Pegawai
                    </Button>

                </div>

                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <div className="flex-1 flex justify-center items-center py-10"><p className="text-red-500">{error}</p></div>
                    ) : currentItems.length === 0 ? (
                        <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                            <span className='font-medium text-gray-500'>DATA KOSONG</span>
                        </div>
                    ) : (
                        <ReusableTable
                            columns={pegawaiColumns}
                            currentItems={currentItems}
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
    )
}