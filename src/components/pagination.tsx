// components/Pagination.tsx

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages?: number; // TAMBAHAN: Optional, jika backend sudah mengirim totalPages
}

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    totalPages: providedTotalPages // TAMBAHAN: Terima dari props jika ada
}: PaginationProps) => {
    // PERUBAHAN: Gunakan totalPages dari backend jika tersedia, jika tidak hitung sendiri
    const totalPages = providedTotalPages ?? Math.ceil(totalItems / itemsPerPage);
    
    // PERUBAHAN: Untuk server-side pagination, startIndex dihitung dari currentPage
    // karena data yang ditampilkan adalah data halaman tersebut saja
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    // PERUBAHAN: endIndex untuk menampilkan "Menampilkan X sampai Y dari Z entri"
    // Pastikan tidak melebihi totalItems
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const handlePageChange = (page: number) => {
        // PERUBAHAN: Tambahkan validasi untuk memastikan page dalam range yang valid
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
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
                Sebelumnya
            </button>
        );

        // Page numbers
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
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

        // Middle pages
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

        // Last page
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
                Selanjutnya
            </button>
        );

        return buttons;
    };

    return (
            <div className="border-t border-gray-200 ">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                    <div className="text-sm text-gray-500">
                        {/* PERUBAHAN: Tampilkan informasi yang lebih akurat */}
                        Menampilkan {totalItems > 0 ? startIndex + 1 : 0} sampai {endIndex} dari {totalItems} hasil
                    </div>
                    <div className="flex items-center space-x-2">
                        {renderPaginationButtons()}
                    </div>
                </div>
            </div>
    );
};

export default Pagination;