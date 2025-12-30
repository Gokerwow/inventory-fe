import React, { useMemo } from 'react';

export interface ColumnDefinition<T> {
    header: string;
    cell: (item: T) => React.ReactNode;
    key?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    hideHeaderOnMobile?: boolean; 
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

    const gridTemplateColumns = useMemo(() => {
        return (columns || []).map(col => col.width || 'minmax(0, 1fr)').join(' ');
    }, [columns]);

    const getAlignClass = (align?: string) => {
        if (align === 'center') return 'justify-center text-center';
        if (align === 'right') return 'justify-end text-right';
        return 'justify-start text-left';
    };

    return (
        <div className="flex flex-col w-full h-full min-h-[380px] bg-gray-50 md:bg-white overflow-hidden md:shadow-sm md:rounded-lg relative">
            
            {/* === MOBILE VIEW: CARD LIST === */}
            <div className="md:hidden flex-1 overflow-y-auto p-4 pb-15 sm:pb-4 space-y-4">
                {currentItems && currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div 
                            key={item.id || index}
                            onClick={() => onRowClick && onRowClick(item)}
                            className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 ${onRowClick ? 'active:scale-95 transition-transform cursor-pointer' : ''}`}
                        >
                            {columns.map((col, colIndex) => (
                                <div key={col.key || colIndex} className="flex justify-between items-center gap-4 text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                    {/* Label Kolom (Kiri) */}
                                    {!col.hideHeaderOnMobile && (
                                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wide shrink-0 mt-0.5 w-1/3 text-left">
                                            {col.header}
                                        </span>
                                    )}
                                    
                                    {/* Isi Data (Kanan) - SEKARANG RATA KIRI */}
                                    <div className={`font-semibold text-gray-800 flex-1 min-w-0 break-words text-left ${!col.hideHeaderOnMobile ? '' : 'w-full text-center'}`}>
                                        {col.cell(item)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                        <p>Tidak ada data ditemukan</p>
                    </div>
                )}
            </div>

            {/* === DESKTOP VIEW: TABLE GRID === */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <div
                        className="grid gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-20"
                        style={{ gridTemplateColumns }}
                    >
                        {columns.map((col) => (
                            <div key={col.key || col.header} className={`flex items-center ${getAlignClass(col.align)}`}>
                                {col.header}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div
                                key={item.id || index}
                                onClick={() => onRowClick && onRowClick(item)}
                                className={`grid gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center border-b border-gray-100 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}`}
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
        </div>
    );
}