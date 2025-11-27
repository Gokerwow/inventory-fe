// src/components/ReusableTable.tsx
import React, { useMemo } from 'react';
import Pagination from "./pagination";

// Update tipe ColumnDefinition untuk mendukung width (opsional)
export interface ColumnDefinition<T> {
    header: string;
    cell: (item: T) => React.ReactNode;
    key?: string;
    width?: string; // e.g., "1fr", "150px"
    align?: 'left' | 'center' | 'right';
}

interface ReusableTableProps<T> {
    columns: ColumnDefinition<T>[];
    currentItems: T[];
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
}

export default function ReusableTable<T extends { id?: number | string }>({
    columns,
    currentItems = [],
    startIndex = 0,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 7,
    onPageChange = () => { },
    totalPages = 1
}: ReusableTableProps<T>) {

    // Membuat template kolom Grid (misal: "2fr 1fr 1fr 100px")
    const gridTemplateColumns = useMemo(() => {
        return columns.map(col => col.width || '1fr').join(' ');
    }, [columns]);

    // Helper untuk alignment teks
    const getAlignClass = (align?: string) => {
        if (align === 'center') return 'justify-center text-center';
        if (align === 'right') return 'justify-end text-right';
        return 'justify-start text-left';
    };

    return (
        // 1. Container Utama: flex-col, h-full, dan bg-white agar pagination masuk kotak
        <div className="flex flex-col w-full h-full bg-white rounded-b-xl overflow-hidden">
            
            {/* 2. HEADER (Fixed/Diam) */}
            <div 
                className="grid gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                style={{ gridTemplateColumns }}
            >
                {columns.map((col) => (
                    <div key={col.key || col.header} className={`flex items-center ${getAlignClass(col.align)}`}>
                        {col.header}
                    </div>
                ))}
            </div>

            {/* 3. BODY (Scrollable Area) */}
            {/* flex-1: mengambil sisa ruang, overflow-y-auto: scroll jika konten panjang */}
            <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div
                            key={item.id || startIndex + index}
                            className="grid gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center border-b border-gray-100 last:border-0"
                            style={{ gridTemplateColumns }}
                        >
                            {columns.map((col) => (
                                <div 
                                    key={col.key || col.header}
                                    className={`text-sm text-gray-700 flex items-center ${getAlignClass(col.align)}`}
                                >
                                    {col.cell(item)}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                        <p>Tidak ada data ditemukan</p>
                    </div>
                )}
            </div>

            {/* 4. PAGINATION (Fixed di Bawah) */}
            {/* border-t memisahkan area ini dari tabel */}
            <div className="py-4 border-t border-gray-200 bg-white">
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}