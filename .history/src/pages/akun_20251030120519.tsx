import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Impor locale Indonesia
import BurgerDot from '../assets/burgerDot.svg?react'
import PencilIcon from '../assets/pencilIcon2.svg?react'
import { MOCK_USERS } from '../Mock Data/data';
import Pagination from '../components/pagination';
import { useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';

function FormatTanggal(props) {
    const { isoString } = props
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = MOCK_USERS.slice(startIndex, startIndex + itemsPerPage);


    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('A - Z');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectedSort = (option: SortOption) => {
        setSelectedSort(option.label);
        setIsOpen(false)
        console.log('Sorting by:', option.value);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-full p-8 bg-[#F3F7FA] rounded-lg shadow-md">
            <div className="relative mb-8" ref={dropdownRef}>
                <div className="w-full text-center">

                    <h1 className="text-2xl font-semibold text-black border-b-4 border-black inline-flex leading-15">
                        Daftar Data Akun Pengguna
                    </h1>

                </div>

                <button onClick={() => setIsOpen(!isOpen)} aria-label='Menu' className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer  hover:scale-110 active:scale-95 transition-all duration-200">
                    <BurgerDot className='w-10 h-10' />
                </button>

                <Transition>
                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white rounded-lg shadow-lg ">
                            {/* Header */}
                            <div className="px-4 py-3">
                                <h3 className="text-sm font-semibold text-gray-900">Urutkan dari</h3>
                            </div>
                            {/* Options */}
                            <div className="py-2 px-4 flex flex-col gap-2 text-black">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelectedSort(option)}
                                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-150 rounded-lg border ${selectedSort === option.label
                                            ? 'bg-black text-white'
                                            : 'text-black hover:text-white hover:bg-black border-gray-300'
                                            }`}
                                    >
                                        <span className="w-6 text-lg">{option.icon}</span>
                                        <span className="flex-1 text-left">{option.label}</span>
                                        {selectedSort === option.label && (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Transition>
            </div>

            {/* TABEL */}
            <div className="space-y-3">
                <div className="grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center py-2">
                    <div className="col-span-1 text-sm font-medium text-gray-500"></div>
                    <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 ">Username</div>
                    <div className="col-span-3 text-sm font-medium text-gray-500">Email</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal Dibuat</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 text-center">Aktivitas</div>
                </div>

                {currentItems.map((user, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center bg-white rounded-xl shadow-md"
                    >
                        <div className={`col-span-1 h-full bg-[#EFF8FF] rounded-l-lg py-3`}></div>

                        {/* Foto Akun */}
                        <div className="col-span-1 py-3">
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                        </div>

                        {/* Role */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-800 font-medium">{user.role}</p>
                        </div>

                        {/* Username */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">{user.username}</p>
                        </div>

                        {/* Email */}
                        <div className="col-span-3 py-3">
                            <p className="text-gray-600">{user.email}</p>
                        </div>

                        {/* Tanggal dibuat */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">
                                <FormatTanggal
                                    isoString={user.created_at}
                                />
                            </p>
                        </div>

                        {/* Aksi */}
                        <div className="col-span-2 flex justify-center py-3">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-800 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200">
                                <PencilIcon />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={MOCK_USERS.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />

        </div>
    )
}