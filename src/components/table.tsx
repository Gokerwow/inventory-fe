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
    onRowClick?: (item: T) => void;
}

export default function ReusableTable<T extends { id?: number | string }>({
    columns,
    currentItems = [],
    onRowClick
}: ReusableTableProps<T>) {

    // Menggunakan minmax(0, 1fr) untuk grid kolom
    const gridTemplateColumns = useMemo(() => {
        return (columns || []).map(col => col.width || 'minmax(0, 1fr)').join(' ');
    }, [columns]);

    const getAlignClass = (align?: string) => {
        if (align === 'center') return 'justify-center text-center';
        if (align === 'right') return 'justify-end text-right';
        return 'justify-start text-left';
    };

    return (
        <div className="flex flex-col w-full h-full min-h-[380px] bg-white overflow-hidden shadow-sm rounded-lg">

            {/* HEADER - STICKY & FLEX-SHRINK-0 */}
            {/* PERBAIKAN: header dipisah dari kontainer scrollable */}
            <div
                className="grid gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-20 shrink-0"
                style={{ gridTemplateColumns }}
            >
                {columns.map((col) => (
                    <div key={col.key || col.header} className={`flex items-center ${getAlignClass(col.align)}`}>
                        {col.header}
                    </div>
                ))}
            </div>

            {/* BODY - WRAPPER UNTUK SCROLL */}
            {/* PERBAIKAN: container body yang bisa di-scroll */}
            <div className="flex-1 overflow-y-auto">
                {currentItems && currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div
                            key={item.id || index}
                            onClick={() => {
                                if (onRowClick) onRowClick(item);
                            }}
                            className={`grid gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center border-b border-gray-100 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''}`}
                            style={{ gridTemplateColumns }}
                        >
                            {columns.map((col) => (
                                <div
                                    key={col.key || col.header}
                                    className={`text-sm text-gray-700 flex items-center min-w-0 ${getAlignClass(col.align)}`}
                                >
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