import React, { useState } from 'react';

const PenerimaanTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const riwayatPenerimaan = [
        {
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Rahardan',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Rendy',
            kategori: 'Komputer',
            status: 'Ursiah'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Almas',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Aldi',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Syini',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '904 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Fahadza',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '905 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Nabila',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '906 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Budi',
            kategori: 'Komputer',
            status: 'Ursiah'
        },
        {
            noSurat: '907 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Sari',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '908 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Dewi',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '909 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Rizki',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '910 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Maya',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '911 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'PPK',
            namaPegawai: 'Ahmad',
            kategori: 'ATK',
            status: 'Ursiah'
        },
        {
            noSurat: '912 /3.2c/35.09.61/PPI_085/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Lina',
            kategori: 'Komputer',
            status: 'Ursiah'
        }
    ];

    const totalPages = Math.ceil(riwayatPenerimaan.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = riwayatPenerimaan.slice(startIndex, startIndex + itemsPerPage);
    const [isActive, setIsActive] = useState(false);

    const handleClick = (isActive) => {
        setIsActive(isActive);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        
        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
                Previous
            </button>
        );

        // Page numbers
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-3 py-2 rounded-md text-sm ${
                        1 === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-md text-sm ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-2 rounded-md text-sm ${
                        totalPages === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
                Next
            </button>
        );

        return buttons;
    };

    return (
        <div className="flex flex-col h-full p-6 bg-white rounded-lg shadow-md gap-4">
            {/* Header */}
<div className="flex flex-shrink-0 gap-4">
    <h1 
        onClick={() => handleClick('penerimaan')} 
        className={`text-xl font-semibold border-b-2 py-2 cursor-pointer transition-colors ${
            activeTab === 'penerimaan' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-800 border-gray-400 hover:text-blue-500'
        }`}
    >
        Penerimaan
    </h1>
    <h1 
        onClick={() => handleClick('riwayat')} 
        className={`text-xl font-semibold border-b-2 py-2 cursor-pointer transition-colors ${
            activeTab === 'riwayat' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-800 border-gray-400 hover:text-blue-500'
        }`}
    >
        Riwayat Penerimaan
    </h1>
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
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr
                                key={startIndex + index}
                                className="hover:bg-gray-50 transition-colors duration-150"
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
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        item.kategori === 'Komputer' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {item.kategori}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination - selalu di paling bawah */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 mt-auto">
                <div className="text-sm text-gray-700">
                    Menampilkan {startIndex + 1} sampai {Math.min(startIndex + itemsPerPage, riwayatPenerimaan.length)} dari {riwayatPenerimaan.length} entri
                </div>
                <div className="flex items-center space-x-2">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
};

export default PenerimaanTable;