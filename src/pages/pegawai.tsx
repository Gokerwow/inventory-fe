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
        <div className="h-full flex flex-col">

            <div className="w-full mb-6 flex justify-between items-center gap-4 shrink-0">
                <div className="flex gap-4 w-full">
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

                <button onClick={handleTambahClick} className="w-70 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Pegawai
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="p-4 border-b border-gray-200 flex items-center gap-4 shrink-0">
                    <h1 className="text-lg font-semibold text-gray-900">Daftar Pegawai</h1>
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            name="search"
                            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 text-gray-700 outline-none rounded-lg transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
                            placeholder="Cari pegawai..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeMiterlimit="10"
                                    strokeWidth="32"
                                />
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="32"
                                    d="M338.29 338.29L448 448"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <ReusableTable
                            columns={pegawaiColumns}
                            currentItems={currentItems}
                        />
                    )}
                </div>

                <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0">
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
    )
}