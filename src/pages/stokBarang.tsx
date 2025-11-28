import AtkIcon from '../assets/AtkIcon.svg?react'
import CetakIcon from '../assets/CetakIcon.svg?react'
import ListrikIcon from '../assets/ListrikIcon.svg?react'
import KomputerIcon from '../assets/KomputerIcon.svg?react'
import KertasIcon from '../assets/KertasIcon.svg?react'
import PaluIcon from '../assets/PaluIcon.svg?react'
import PembersihIcon from '../assets/PembersihIcon.svg?react'
import { ROLES, type BARANG_STOK } from '../constant/roles'
import type { ColumnDefinition } from '../components/table'
import { useEffect, useState, useMemo } from 'react'
import { useAuthorization } from '../hooks/useAuthorization'
import { useAuth } from '../hooks/useAuth'
import { getStokBarang } from '../services/barangService'
import ReusableTable from '../components/table'
import Pagination from '../components/pagination'
import Loader from '../components/loader'

const CATEGORY_DATA = [
    {
        id: 1,
        name: 'ATK',
        Icon: AtkIcon,
        colorClass: 'bg-blue-100 text-blue-700',
        hoverClass: 'hover:bg-blue-200'
    },
    {
        id: 2,
        name: 'Cetak',
        Icon: CetakIcon,
        colorClass: 'bg-green-100 text-green-700',
        hoverClass: 'hover:bg-green-200'
    },
    {
        id: 3,
        name: 'Alat Listrik',
        Icon: ListrikIcon,
        colorClass: 'bg-yellow-100 text-yellow-700',
        hoverClass: 'hover:bg-yellow-200'
    },
    {
        id: 4,
        name: 'Bahan Komputer',
        Icon: KomputerIcon,
        colorClass: 'bg-purple-100 text-purple-700',
        hoverClass: 'hover:bg-purple-200'
    },
    {
        id: 5,
        name: 'Kertas dan Cover',
        Icon: KertasIcon,
        colorClass: 'bg-red-100 text-red-700',
        hoverClass: 'hover:bg-red-200'
    },
    {
        id: 6,
        name: 'Bahan Bangunan',
        Icon: PaluIcon,
        colorClass: 'bg-indigo-100 text-indigo-700',
        hoverClass: 'hover:bg-indigo-200'
    },
    {
        id: 7,
        name: 'Bahan Pembersih',
        Icon: PembersihIcon,
        colorClass: 'bg-teal-100 text-teal-700',
        hoverClass: 'hover:bg-teal-200'
    },
];

function StokBarang() {
    // 1. Definisikan Tahun Saat Ini
    const currentYear = new Date().getFullYear();

    // 2. Buat Opsi Tahun (Tahun ini, -1, -2)
    const yearOptions = useMemo(() => {
        return [currentYear, currentYear - 1, currentYear - 2];
    }, [currentYear]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<BARANG_STOK[]>([]);

    // 3. Set default state year ke string tahun saat ini
    const [year, setYear] = useState(String(currentYear)); 
    const [activeTab, setActiveTab] = useState('stokBarang')
    
    const [search, setSearch] = useState(''); 
    const [debouncedSearch, setDebouncedSearch] = useState(''); 

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

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

        const FetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log('Fetching Stok Data....')
                // Pastikan parameter year dikirim jika API mendukung filter tahun
                // Contoh: getStokBarang(..., debouncedSearch, year)
                const response = await getStokBarang(currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, year);
                console.log("📦 Stok Response:", response);
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
        FetchData();
        // Tambahkan year ke dependency array agar refresh saat tahun diganti
    }, [checkAccess, hasAccess, user?.role, currentPage, itemsPerPage, selectedCategoryId, debouncedSearch, year])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleCategoryClick = (id: number) => {
        if (selectedCategoryId === id) {
            setSelectedCategoryId(undefined);
        } else {
            setSelectedCategoryId(id);
        }
        setCurrentPage(1);
    }

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

    const barangColumns: ColumnDefinition<BARANG_STOK>[] = [
        {
            header: 'Nama Barang',
            cell: (item) => {
                const config = CATEGORY_DATA.find(c => c.name === item.category_name);

                const IconComponent = config?.Icon || AtkIcon;
                const colorClass = config?.colorClass || 'bg-gray-100 text-gray-700';

                return (
                    <div className="flex items-center">
                        <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <IconComponent className='w-6 h-6' />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">Kategori: {item.category_name}</div>
                        </div>
                    </div>
                )
            }
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
            cell: (item) => <>{item.minimum_stok}</>
        },
        {
            header: 'Satuan',
            cell: (item) => <>{item.satuan}</>
        },
        {
            header: 'Harga',
            cell: (item) => <>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</>
        },
        {
            header: 'Aksi',
            cell: () => (
                <button className="text-gray-900 hover:text-blue-600 flex items-center justify-start gap-1 w-full cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit
                </button>
            )
        }
    ];

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-5">
            {/* Navigation Tabs */}
            <nav className="flex gap-2" aria-label="Tabs">
                <button onClick={() => handleTabClick('stokBarang')} className={` ${ activeTab === 'stokBarang' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } bg-white rounded-t-lg group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm`}>
                    <svg className="-ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Stok Barang
                </button>
                <button onClick={() => handleTabClick('kategoriBarang')} className={`${ activeTab === 'kategoriBarang' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } rounded-t-lg bg-white group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm`}>
                    <svg className="group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.968 7.968 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Kategori Barang
                </button>
            </nav>

            {/* Filter Buttons Section */}
            <div className="bg-white p-4 rounded-lg">
                <h3 className="text-base font-medium text-gray-900 mb-3">Urutkan Berdasarkan Kategori</h3>
                <div className="flex flex-wrap gap-3">
                    {CATEGORY_DATA.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                    ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg scale-105'
                                    : ''
                                    } ${cat.colorClass} ${cat.hoverClass}`}
                            >
                                <cat.Icon className="mr-2 h-4 w-4" />
                                {cat.name}
                                {isSelected && (
                                    <svg
                                        className="ml-2 h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className='flex items-center gap-4'>
                        <h2 className="text-xl font-bold text-blue-900">Daftar Stok Barang</h2>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 text-gray-700 outline-none rounded-lg transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
                                placeholder="Cari barang..."
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

                    <div className="relative">
                        {/* 4. Implementasi Dropdown Dinamis */}
                        <select 
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                        >
                            {yearOptions.map((optionYear) => (
                                <option key={optionYear} value={optionYear}>
                                    {optionYear}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-hidden">
                        {isLoading ? <Loader />
                            :
                            activeTab === 'stokBarang' ? 
                            <ReusableTable
                                columns={barangColumns}
                                currentItems={currentItems}
                            />
                            :
                            <div>tes</div>
                        }
                    </div>

                    <div className="px-4 bg-white shrink-0">
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
        </div>
    );
}

export default StokBarang;