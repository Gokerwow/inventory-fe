import React, { useMemo } from 'react';

export interface ColumnDefinition<T> {
    header: string;
    cell: (item: T) => React.ReactNode;
    key?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

interface ReusableTableProps<T> {
    columns: ColumnDefinition<T>[];
    currentItems: T[];
}

export default function ReusableTable<T extends { id?: number | string }>({
    columns,
    currentItems = [],
}: ReusableTableProps<T>) {

    // PERBAIKAN 1: Menggunakan minmax(0, 1fr)
    // Ini memaksa kolom untuk mengecil (shrink) jika tidak muat, alih-alih memaksa melebar mengikuti konten.
    const gridTemplateColumns = useMemo(() => {
        return (columns || []).map(col => col.width || 'minmax(0, 1fr)').join(' ');
    }, [columns]);

    const getAlignClass = (align?: string) => {
        if (align === 'center') return 'justify-center text-center';
        if (align === 'right') return 'justify-end text-right';
        return 'justify-start text-left';
    };

    return (
        <div className="flex flex-col w-full h-full min-h-[300px] bg-white overflow-hidden shadow-sm border border-gray-200">

            {/* HEADER */}
            {/* PERBAIKAN 2: Kurangi gap jika perlu, misal gap-2 atau gap-4 tetap oke asal minmax diterapkan */}
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

            {/* BODY */}
            <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
                {currentItems && currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="grid gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center border-b border-gray-100 last:border-0"
                            style={{ gridTemplateColumns }}
                        >
                            {columns.map((col) => (
                                <div
                                    key={col.key || col.header}
                                    // PERBAIKAN 3: Tambahkan `min-w-0` dan `truncate` (opsional)
                                    // min-w-0 sangat penting di dalam grid/flex child agar text-overflow bekerja
                                    className={`text-sm text-gray-700 flex items-center min-w-0 ${getAlignClass(col.align)}`}
                                >
                                    {/* Bungkus konten cell agar bisa di-truncate jika panjang */}
                                    <div className="truncate w-full">
                                        {col.cell(item)}
                                    </div>
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
        </div>
    );
}