import { useState } from 'react';
import UnduhIcon from '../assets/UnduhICON.svg?react'
import { NavLink } from 'react-router-dom';
import Pagination from '../components/pagination';
import PlusIcon from '../assets/plus.svg?react'

const PenerimaanTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const riwayatPenerimaan = [
        {
            id: 1,
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Rahardan',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_903.pdf'
        },
        {
            id: 2,
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Rendy',
            kategori: 'Komputer',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_903_admin.pdf'
        },
        {
            id: 3,
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Almas',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_903_teknis.pdf'
        },
        {
            id: 4,
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Aldi',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_903_aldi.pdf'
        },
        {
            id: 5,
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Syini',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_903_syini.pdf'
        },
        {
            id: 6,
            noSurat: '904 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Fahadza',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_904.pdf'
        },
        {
            id: 7,
            noSurat: '905 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Nabila',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_905.pdf'
        },
        {
            id: 8,
            noSurat: '906 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Budi',
            kategori: 'Komputer',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_906.pdf'
        },
        {
            id: 9,
            noSurat: '907 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Sari',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_907.pdf'
        },
        {
            id: 10,
            noSurat: '908 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Dewi',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_908.pdf'
        },
        {
            id: 11,
            noSurat: '909 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Rizki',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_909.pdf'
        },
        {
            id: 12,
            noSurat: '910 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Maya',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_910.pdf'
        },
        {
            id: 13,
            noSurat: '911 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Ahmad',
            kategori: 'ATK',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_911.pdf'
        },
        {
            id: 14,
            noSurat: '912 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Lina',
            kategori: 'Komputer',
            status: 'Belum Dikonfirmasi',
            linkUnduh: '/dummy/files/surat_912.pdf'
        }
    ];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = riwayatPenerimaan.slice(startIndex, startIndex + itemsPerPage);
    const [activeTab, setActiveTab] = useState('penerimaan');

    const handleClick = (activeTab: string) => {
        setActiveTab(activeTab);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-full p-6 bg-white rounded-lg shadow-md gap-4">
            {/* Header */}
            <div className='flex justify-between'>
                <div className="flex flex-shrink-0 gap-4">
                    <h1
                        onClick={() => handleClick('penerimaan')}
                        className={`text-xl font-semibold border-b-2 py-2 cursor-pointer transition-colors ${activeTab === 'penerimaan'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Penerimaan
                    </h1>
                    <h1
                        onClick={() => handleClick('riwayat')}
                        className={`text-xl font-semibold border-b-2 py-2 cursor-pointer transition-colors ${activeTab === 'riwayat'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Riwayat Penerimaan
                    </h1>
                </div>
                <div>
                    <PlusIcon />
                </div>
            </div>

            {/* Table Container  */}
            <div className="flex-1 overflow-x-auto mb-6">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                NO SURAT
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                ROLE
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                NAMA PEGAWAI
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                KATEGORI
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                AKSI
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr
                                key={startIndex + index}
                                className="hover:bg-gray-50 transition-colors duration-150 shadow-md s"
                            >
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {item.noSurat}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {item.role}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {item.namaPegawai}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.kategori === 'Komputer'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {item.kategori}
                                    </span>
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm cursor-pointer hover:text-blue-600 hover:translate-y-1 transition-all duration-200 '>
                                    <NavLink to={`/penerimaan/unduh/${item.id}`}>
                                        <div className='flex items-center gap-1'>
                                            <UnduhIcon />
                                            <span>Unduh</span>
                                        </div>
                                    </NavLink>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#FFB14C] text-white">
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={riwayatPenerimaan.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PenerimaanTable;