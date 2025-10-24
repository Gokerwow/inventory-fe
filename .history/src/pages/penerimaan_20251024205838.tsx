import { useState } from 'react';
import PlusIcon from '../assets/plus.svg?react'
import PenerimaanTable from '../components/PenerimaanTable';
import RiwayatPenerimaanTable from '../components/RiwayatPenerimaanTable';

const PenerimaanPage = () => {
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
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'penerimaan'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Penerimaan
                    </h1>
                    <h1
                        onClick={() => handleClick('riwayat')}
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'riwayat'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Riwayat Penerimaan
                    </h1>
                </div>
                <div className='cursor-pointer hover:scale-110 transition-all duration-200'>
                    <PlusIcon />
                </div>
            </div>

            {activeTab === 'penerimaan' ? 
            
        }

            <PenerimaanTable 
            currentItems={currentItems}
            startIndex={startIndex}
            currentPage={currentPage}
            totalItems={riwayatPenerimaan.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            />

            <RiwayatPenerimaanTable 
            currentItems={currentItems}
            startIndex={startIndex}
            currentPage={currentPage}
            totalItems={riwayatPenerimaan.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}/>
        </div>
    );
};

export default PenerimaanPage;