import React, { useState } from 'react';

const PenerimaanTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const riwayatPenerimaan = [
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Rahardan',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Rendy',
            kategori: 'Komputer',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Almas',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Aldi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Sylivi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Fahadza',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Nabila',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '904 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Budi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '905 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Sari',
            kategori: 'Komputer',
            status: 'Unduh'
        },
        {
            noSurat: '906 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Dewi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '907 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Rizki',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '908 /3.2c/35.09.61/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Maya',
            kategori: 'Atk',
            status: 'Unduh'
        }
    ];

    // Calculate pagination
    const totalPages = Math.ceil(riwayatPenerimaan.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = riwayatPenerimaan.slice(startIndex, startIndex + itemsPerPage);

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
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
                Previous
            </button>
        );

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded-md ${
                            currentPage === i
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                buttons.push(
                    <span key={i} className="px-2 py-1 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
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
        <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Penerimaan</h1>
                <h2 className="text-lg font-semibold text-gray-700 mb-6">Riwayat Penerimaan</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    No Surat
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Nama Pegawai
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                        {item.noSurat}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                        {item.role}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                        {item.namaPegawai}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.kategori === 'Komputer'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                            {item.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                    Menampilkan {startIndex + 1} sampai {Math.min(startIndex + itemsPerPage, riwayatPenerimaan.length)} dari {riwayatPenerimaan.length} entri
                </div>
                <div className="flex items-center space-x-1">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
};

export default PenerimaanTable;