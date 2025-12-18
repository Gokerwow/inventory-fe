import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Impor locale Indonesia
import BurgerDot from '../assets/svgs/burgerDot.svg?react';
import PencilIcon from '../assets/svgs/pencilIcon2.svg?react';
import { getAkunUsers } from '../services/akunService'; // <-- TAMBAHKAN INI
import Pagination from '../components/pagination';
import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
// import PlusAkun from '../assets/svgs/plusAkun.svg?react'
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import { PATHS } from '../Routes/path';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { type User } from '../constant/roles';
import { ROLES } from '../constant/roles';
import PfpExample from '../assets/images/Pfp Example.jpeg';
import Loader from '../components/loader';
import { useTag } from '../hooks/useTag';

interface FormatTanggalProps {
    isoString: string;
}

function FormatTanggal({ isoString }: FormatTanggalProps) {
    if (!isoString) return null;

    const date = new Date(isoString);
    const formatted = format(date, 'dd MMMM yyyy', { locale: id })

    return <>{formatted}</>
}

interface SortOption {
    label: string;
    value: string;
    icon: string;
}

const sortOptions: SortOption[] = [
    { label: 'A - Z', value: 'asc', icon: '↑' },
    { label: 'Z - A', value: 'desc', icon: '↓' }
];

export default function MonitoringPage() {
    const { checkAccess, hasAccess } = useAuthorization(ROLES.SUPER_ADMIN);
    const { user } = useAuth()

    const navigate = useNavigate();
    const { setTag } = useTag()

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const currentItems = MOCK_USERS.slice(startIndex, startIndex + itemsPerPage);

    const [dataAkun, setDataAkun] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('A - Z');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const transitionRef = useRef(null)

    const handleSelectedSort = (option: SortOption) => {
        setSelectedSort(option.label);
        setIsOpen(false)
        console.log('Sorting by:', option.value);
        // --- TAMBAHAN: Logika sorting (opsional tapi bagus) ---
        setDataAkun(prevData => {
            const sortedData = [...prevData]; // Buat salinan
            sortedData.sort((a, b) => {
                if (option.value === 'asc') {
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            });
            return sortedData;
        });
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // const handleAddClick = () => {
    //     navigate(PATHS.AKUN.TAMBAH)
    // }

    const handleEditClick = (userData: User) => {
        navigate(PATHS.PROFIL.EDIT, {
            state: {
                data: userData,
            }
        })
    }

    // --- TAMBAHAN: useEffect untuk mengambil data ---
    useEffect(() => {
        checkAccess(user?.role); // Cek akses dulu
        if (!hasAccess(user?.role)) {
            return; // Berhenti jika tidak ada akses
        }

        const fetchData = async () => {
            try {
                setIsLoading(true); // Mulai loading
                const users = await getAkunUsers(); // Panggil service
                setDataAkun(users); // Simpan data ke state
                setError(null); // Bersihkan error jika sukses
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data akun.'); // Simpan pesan error
            } finally {
                setIsLoading(false); // Selesai loading
            }
        };

        fetchData();
    }, [user, checkAccess, hasAccess]); // <-- Dependency array

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Early return jika tidak memiliki akses
    if (!hasAccess(user?.role)) {
        return null;
    }

    // --- TAMBAHAN: Tampilkan UI Error ---
    if (error) {
        return (
            <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = dataAkun.slice(startIndex, startIndex + itemsPerPage); // <-- Gunakan dataAkun dari state

    return (
        // UBAH 1: Container Utama
        // - Ganti 'min-h-full' menjadi 'h-full' (pastikan parent element di router juga h-full/h-screen)
        // - Tambah 'flex flex-col' dan 'overflow-hidden' agar halaman tidak scroll
        <div className="h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex flex-col overflow-hidden">

            {/* Bagian Judul & Tombol Burger (Flex-none: Ukuran tetap) */}
            <div className="relative mb-6 flex-none" ref={dropdownRef}>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold text-black border-b-4 border-black inline-flex leading-15">
                        Daftar Data Akun Pengguna
                    </h1>
                </div>

                <button onClick={() => setIsOpen(!isOpen)} aria-label='Menu' className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer  hover:scale-110 active:scale-95 transition-all duration-200">
                    <BurgerDot className='w-10 h-10' />
                </button>

                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95 -translate-y-2"
                    enterTo="transform opacity-100 scale-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100 translate-y-0"
                    leaveTo="transform opacity-0 scale-95 -translate-y-2"
                >
                    <div
                        ref={transitionRef}
                        className="absolute right-0 z-50 w-56 mt-2 origin-top-right"
                    >
                        <Dropdown
                            options={sortOptions}
                            onClick={handleSelectedSort}
                            selected={selectedSort}
                        />
                    </div>
                </Transition>
            </div>

            {/* Wrapper Tabel (Flex-1: Mengambil sisa ruang) */}
            <div className="flex-1 flex flex-col min-h-0 space-y-3">

                {/* UBAH 2: Header Kolom
                    Ditaruh di luar area scroll agar tetap terlihat saat di-scroll (Sticky effect)
                    Class 'flex-none' agar tingginya tidak berubah
                */}
                <div className="flex-none grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center py-2 pr-4"> {/* pr-4 untuk kompensasi lebar scrollbar */}
                    <div className="col-span-1 text-sm font-medium text-gray-500"></div>
                    <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 ">Username</div>
                    <div className="col-span-3 text-sm font-medium text-gray-500">Email</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal Dibuat</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 text-center">Aktivitas</div>
                </div>

                {/* UBAH 3: Area Scrollable
                    - 'flex-1': Mengisi sisa tinggi
                    - 'overflow-y-auto': Mengaktifkan scroll hanya di sini
                    - 'pr-2': Memberi jarak agar scrollbar tidak menempel konten
                */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {isLoading ? (
                        <div className="h-full flex justify-center items-center">
                            <Loader />
                        </div>
                    ) : (
                        currentItems.map((akun) => (
                            <div
                                key={akun.id}
                                className="grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center bg-white rounded-xl shadow-md"
                            >
                                <div className={`col-span-1 h-full bg-[#EFF8FF] rounded-l-lg py-3`}></div>

                                {/* Foto Akun */}
                                <div className="col-span-1 py-3">
                                    <img
                                        src={akun.photo ?? PfpExample}
                                        alt="Avatar"
                                        className="w-14 h-14 rounded-full"
                                    />
                                </div>

                                {/* Role */}
                                <div className="col-span-2 py-3">
                                    <p className="text-gray-800 font-medium">{akun.role}</p>
                                </div>

                                {/* Username */}
                                <div className="col-span-2 py-3">
                                    <p className="text-gray-600">{akun.name}</p>
                                </div>

                                {/* Email */}
                                <div className="col-span-3 py-3">
                                    <p className="text-gray-600">{akun.email}</p>
                                </div>

                                {/* Tanggal dibuat */}
                                <div className="col-span-2 py-3">
                                    <p className="text-gray-600">
                                        <FormatTanggal isoString={akun.created_at} />
                                    </p>
                                </div>

                                {/* Aksi */}
                                <div className="col-span-2 flex justify-center py-3">
                                    <button
                                        onClick={() => handleEditClick(akun)}
                                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-800 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"
                                    >
                                        <PencilIcon />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination (Flex-none: Selalu di bawah, tidak ikut scroll) */}
            <div className="flex-none pt-4">
                <Pagination
                    currentPage={currentPage}
                    totalItems={dataAkun.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>

        </div>
    )
}