// src/components/ReusableTable.tsx
import React from 'react';
import Pagination from "./pagination"; // Impor pagination Anda

// 1. Definisikan tipe untuk Kolom
// T adalah tipe data item (misalnya PenerimaanItem)
export interface ColumnDefinition<T> {
    header: string; // Teks untuk <th>
    // Fungsi yang memberi tahu cara merender <td>
    // Menerima satu item dan mengembalikan JSX
    cell: (item: T) => React.ReactNode;
    // Opsional: key unik jika 'cell' tidak punya (meski header biasanya cukup)
    key?: string;
}

// 2. Definisikan Props untuk tabel generik
interface ReusableTableProps<T> {
    columns: ColumnDefinition<T>[]; // Array konfigurasi kolom
    currentItems: T[];               // Data untuk ditampilkan (tipe generik)

    // Props pagination (sama seperti sebelumnya)
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
}

// 3. Buat Komponen Generik
// 'T extends { id?: number | string }' berarti kita mengharapkan
// item setidaknya punya 'id' opsional untuk key.
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
    return (
        <>
            {/* Table Container */}
            <div className="flex-1 overflow-x-auto mb-6">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            {/* Render headers dari props 'columns' */}
                            {columns.map((col) => (
                                <th
                                    key={col.key || col.header}
                                    className={`px-4 py-3 text-xs font-medium text-gray-600 tracking-wider  ${col.header === 'Aksi' || col.header === 'Status' ? 'text-center' : 'text-left'}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Render baris dari 'currentItems' */}
                        {currentItems.map((item, index) => (
                            <tr
                                key={item.id || startIndex + index}
                                className="hover:bg-gray-50 transition-colors duration-150 shadow-md"
                            >
                                {/* Render sel menggunakan fungsi 'cell' dari 'columns' */}
                                {columns.map((col) => (
                                    <td
                                        key={col.key || col.header}
                                        className={`px-4 py-4 whitespace-nowrap text-sm text-gray-800 ${col.header === 'Status' ? 'flex justify-center' : ''}`}
                                    >
                                        {col.cell(item)} {/* INI INTINYA */}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (tidak berubah) */}
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
                totalPages={totalPages}
            />
        </>
    );
}