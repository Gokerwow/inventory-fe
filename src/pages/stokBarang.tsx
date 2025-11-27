import AtkIcon from '../assets/AtkIcon.svg?react'
import CetakIcon from '../assets/CetakIcon.svg?react'
import ListrikIcon from '../assets/ListrikIcon.svg?react'
import KomputerIcon from '../assets/KomputerIcon.svg?react'
import KertasIcon from '../assets/KertasIcon.svg?react'
import PaluIcon from '../assets/PaluIcon.svg?react'
import PembersihIcon from '../assets/PembersihIcon.svg?react'
import { ROLES, type BARANG_STOK } from '../constant/roles'
import type { ColumnDefinition } from '../components/table'
import { useEffect, useState } from 'react'
import { useAuthorization } from '../hooks/useAuthorization'
import { useAuth } from '../hooks/useAuth'
import { getStokBarang } from '../services/barangService'
import ReusableTable from '../components/table'

function StokBarang() {
    // State untuk pagination dari backend
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<BARANG_STOK[]>([]);
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const FetchData = async () => {
            // setIsLoading(true);
            // setError(null);
            try {
                console.log('Fetching Stok Data....')
                const response = await getStokBarang(currentPage)
                console.log("📦 BAST Response:", response);
                setCurrentItems(response.data);
                setTotalItems(response.total || 0);
                setItemsPerPage(response.per_page || 10);
                setTotalPages(response.last_page || 1);
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            }
        }
        FetchData();
    }, [checkAccess, hasAccess, user?.role, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const barangColumns: ColumnDefinition<BARANG_STOK>[] = [
        {
            header: 'Nama Barang',
            cell: (item) => <>{
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">Kategori: {item.category_name}</div>
                    </div>
                </div>
            }</>
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
            cell: (item) => (item.minimum_stok)
        },
        {
            header: 'Satuan',
            cell: (item) => (item.satuan)
        },
        {
            header: 'Harga',
            cell: (item) => (item.price)
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <button className="text-gray-900 hover:text-blue-600 flex items-center justify-start gap-1 w-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit
                </button>
            )
        }
    ];
    return (
        <div className="w-full h-full flex flex-col gap-5">
            <nav className="flex gap-2" aria-label="Tabs">
                <a href="#" className="border-blue-500 text-blue-600 bg-white rounded-t-lg group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm">
                    <svg className="text-blue-500 -ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Stok Barang
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 rounded-t-lg bg-white hover:border-gray-300 group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm">
                    <svg className="text-gray-400 group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.968 7.968 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Kategori Barang
                </a>
            </nav>

            <div className=" bg-white p-4 rounded-lg">
                <h3 className="text-base font-medium text-gray-900 mb-3">Urutkan Berdasarkan Kategori</h3>
                <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <AtkIcon className="mr-2 h-4 w-4" />
                        ATK
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200">
                        <CetakIcon className="mr-2 h-4 w-4" />
                        Cetak
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                        <ListrikIcon className="mr-2 h-4 w-4" />
                        Alat Listrik
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                        <KomputerIcon className="mr-2 h-4 w-4" />
                        Bahan Komputer
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200">
                        <KertasIcon className="mr-2 h-4 w-4" />
                        Kertas dan Cover
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        <PaluIcon className="mr-2 h-4 w-4" />
                        Bahan bangunan
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-teal-100 text-teal-700 hover:bg-teal-200">
                        <PembersihIcon className="mr-2 h-4 w-4" />
                        Bahan Pembersih
                    </button>
                </div>
            </div>

            {/* Tambahkan 'flex flex-col' di sini agar children-nya bisa diatur tingginya */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

                {/* Header Card (Tinggi tetap) */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-blue-900">Daftar Stok Barang</h2>
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                            <option>2024</option>
                            <option>2023</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* AREA SCROLL: Tambahkan 'flex-1' dan 'min-h-0' */}
                {/* min-h-0 sangat penting di Firefox/Chrome untuk nested flex scroll */}
                <div className="overflow-auto flex-1 min-h-0 relative p-4">
                    {/* Pastikan container tabel di ReusableTable juga support full width */}
                    <ReusableTable
                        columns={barangColumns}
                        currentItems={currentItems}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        startIndex={0}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>

            </div>

        </div>
    );
}

export default StokBarang;