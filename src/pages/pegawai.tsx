import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { PATHS } from "../Routes/path";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { ROLES, type DaftarPegawai } from "../constant/roles";
import { getDaftarPegawai, updateStatusPegawai } from "../services/pegawaiService";
import type { ColumnDefinition } from "../components/table";
import Loader from "../components/loader";
import ReusableTable from "../components/table";
import Pagination from "../components/pagination";


export default function PegawaiPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<DaftarPegawai[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

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

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log('Fetching Data Pegawai....')
                const response = await getDaftarPegawai(currentPage, itemsPerPage)
                console.log("📦 Pegawai Response:", response);
                setCurrentItems(response.data);
                setTotalItems(response.total || 0);
                setItemsPerPage(response.per_page || 10);
                setTotalPages(response.last_page || 1);

            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData()
    }, [user?.role, currentPage])

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
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'NIP',
            cell: (item) => <>{item.nip}</>
        },
        {
            header: 'Jabatan',
            cell: (item) => <>{item.jabatan.name}</>
        },
        {
            header: 'No. Telepon',
            cell: (item) => <>{item.phone}</>
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
                        className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                            isActive ? 'bg-blue-600' : 'bg-gray-500'
                        } transition-all duration-200 focus:outline-none ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                        <span className="sr-only">
                            {isActive ? 'Nonaktifkan' : 'Aktifkan'} pegawai
                        </span>
                        <span 
                            className={`${
                                isActive ? 'translate-x-6' : 'translate-x-1'
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
                    className="flex items-center hover:text-blue-600 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                </button>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col">

            <div className="w-full mb-6 flex justify-between items-center gap-4 shrink-0">
                <div className="flex gap-4 w-full">
                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                            <option>Semua Jabatan</option>
                            <option>Tim PPK</option>
                            <option>Tim Teknis</option>
                            <option>Admin Gudang</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Non-Aktif</option>
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
                <div className="p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <h1 className="text-lg font-semibold text-gray-900">Daftar Pegawai</h1>
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