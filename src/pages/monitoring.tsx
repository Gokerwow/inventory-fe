import BurgerDot from '../assets/burgerDot.svg?react'
import Status from '../components/status';
import Pagination from '../components/pagination';
import { useEffect, useRef, useState, useMemo } from 'react';
import { getLogAktivitas } from '../services/monitoringServices';
import { Transition } from '@headlessui/react';
import Dropdown from '../components/dropdown';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { ROLES, type LogItem } from '../constant/roles';
import PfpExample from '../assets/Pfp Example.jpeg';
import type { SortOption } from '../Mock Data/data';

// ✅ UPDATE: Tambahkan properti 'icon' pada opsi sort
const sortOptions: SortOption[] = [
    { label: 'Terbaru', value: 'latest', icon: '↓' }, // Descending (Waktu Besar ke Kecil)
    { label: 'Terlama', value: 'oldest', icon: '↑' }, // Ascending (Waktu Kecil ke Besar)
];

export default function MonitoringPage() {
    const [dataLog, setDataLog] = useState<LogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 7;

    const [isOpen, setIsOpen] = useState(false);

    // State sorting
    const [selectedSortValue, setSelectedSortValue] = useState('latest');
    const [selectedSortLabel, setSelectedSortLabel] = useState('Terbaru');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const transitionRef = useRef(null)

    const { checkAccess, hasAccess } = useAuthorization(ROLES.SUPER_ADMIN);
    const { user } = useAuth()

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch data tanpa sorting backend (atau sesuaikan jika backend support)
                const response = await getLogAktivitas(currentPage, itemsPerPage);

                if (Array.isArray(response)) {
                    setDataLog(response);
                } else {
                    setDataLog(response.data);
                    setTotalItems(response.total);
                }
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat log aktivitas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, checkAccess, hasAccess, currentPage]);

    // Logika Sorting Frontend (Updated)
    const sortedData = useMemo(() => {
        const dataToSort = [...dataLog];

        return dataToSort.sort((a, b) => {
            // Gabungkan string tanggal & waktu secara manual agar lebih aman lintas browser
            // Asumsi format backend: YYYY-MM-DD dan HH:mm:ss
            // Mengubah spasi menjadi 'T' membantu kompatibilitas ISO (YYYY-MM-DDTHH:mm:ss)
            const dateStrA = `${a.tanggal}T${a.waktu}`;
            const dateStrB = `${b.tanggal}T${b.waktu}`;

            const dateA = new Date(dateStrA).getTime() || 0; // Fallback ke 0 jika NaN
            const dateB = new Date(dateStrB).getTime() || 0;

            if (selectedSortValue === 'latest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    }, [dataLog, selectedSortValue]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSelectedSort = (option: SortOption) => {
        setSelectedSortLabel(option.label);
        setSelectedSortValue(option.value);
        setIsOpen(false);
    }

    if (!hasAccess(user?.role)) return null;

    if (isLoading) {
        return (
            <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex justify-center items-center">
                <p>Memuat log aktivitas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md flex flex-col">
            <div className="relative mb-8" ref={dropdownRef}>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold text-black border-b-4 border-black inline-flex leading-15">
                        Log Aktivitas pengguna
                    </h1>
                </div>

                {/* Tombol Dropdown Sort */}
                <button onClick={() => setIsOpen(!isOpen)} className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200">
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
                    <div ref={transitionRef} className="absolute right-0 z-50 w-56 mt-2 origin-top-right">
                        <Dropdown
                            options={sortOptions}
                            onClick={handleSelectedSort}
                            selected={selectedSortLabel}
                        />
                    </div>
                </Transition>
            </div>

            {/* TABEL */}
            <div className="space-y-3 flex-1">
                <div className="grid grid-cols-[30px_repeat(9,minmax(0,1fr))] gap-4 items-center py-2">
                    <div className="col-span-1 text-sm font-medium text-gray-500"></div>
                    <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Waktu</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 text-center">Aktivitas</div>
                </div>

                {/* MAPPING DATA TERURUT */}
                {sortedData.map((log, index) => (
                    <div
                        key={`${log.waktu}-${index}`}
                        className="grid grid-cols-[30px_repeat(9,minmax(0,1fr))] gap-4 items-center bg-white rounded-xl shadow-md"
                    >
                        <div className={`col-span-1 h-full bg-[#EFF8FF] rounded-l-lg py-3`}></div>
                        <div className="col-span-1 py-3">
                            <img src={log.foto ?? PfpExample} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                        </div>
                        <div className="col-span-2 py-3">
                            <p className="text-gray-800 font-medium">{log.role}</p>
                        </div>
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">{log.waktu}</p>
                        </div>
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">{log.tanggal}</p>
                        </div>
                        <div className="col-span-2 flex justify-center py-3">
                            <Status
                                text={log.activity}
                                className="w-48 text-center"
                                color={log.activity.toLowerCase().includes('logout') ? 'bg-[#FF4C4C]' : 'bg-[#00B998]'}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    )
}