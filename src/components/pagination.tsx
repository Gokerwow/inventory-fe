import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import Icon

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages?: number;
}

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    totalPages: providedTotalPages
}: PaginationProps) => {
    
    const totalPages = providedTotalPages ?? Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        // === Tombol PREVIOUS ===
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center justify-center px-2 py-2 md:px-4 md:py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:text-blue-600'
                }`}
                aria-label="Sebelumnya"
            >
                {/* Icon untuk Mobile */}
                <ChevronLeft className="w-5 h-5 md:mr-1" />
                {/* Teks untuk Desktop */}
                <span className="hidden md:inline">Sebelumnya</span>
            </button>
        );

        // Logic ellipsis halaman (tetap sama, disesuaikan styling-nya)
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        1 === currentPage
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-1 py-2 text-gray-400">...</span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === i
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-1 py-2 text-gray-400">...</span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        totalPages === currentPage
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                    {totalPages}
                </button>
            );
        }

        // === Tombol NEXT ===
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center justify-center px-2 py-2 md:px-4 md:py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:text-blue-600'
                }`}
                aria-label="Selanjutnya"
            >
                <span className="hidden md:inline">Selanjutnya</span>
                <ChevronRight className="w-5 h-5 md:ml-1" />
            </button>
        );

        return buttons;
    };

    if (totalItems === 0) return null;

    return (
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Informasi Halaman (Mobile: Center, Desktop: Left) */}
                    <div className="text-sm text-gray-500 hidden sm:block">
                        {/* PERUBAHAN: Tampilkan informasi yang lebih akurat */}
                        Menampilkan {totalItems > 0 ? startIndex + 1 : 0} sampai {endIndex} dari {totalItems} hasil
                    </div>

                {/* Tombol Navigasi (Mobile: Full Width justify-center, Desktop: Auto) */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
};

export default Pagination;