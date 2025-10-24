import UnduhIcon from '../assets/UnduhICON.svg?react';
import { NavLink } from 'react-router-dom';
import Pagination from "./pagination";

// Definisikan interface untuk data
interface PenerimaanItem {
    id: number;
    noSurat: string;
    role: string;
    namaPegawai: string;
    kategori: string;
    status: string;
    linkUnduh: string;
}

interface PenerimaanTableProps {
    currentItems: PenerimaanItem[];
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function PenerimaanTable({ 
    currentItems = [], 
    startIndex = 0, 
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 7,
    onPageChange = () => {}
}: PenerimaanTableProps) {
    return (
        <>
            {/* Penerimaan Table Container  */}
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
                                AKSI
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr
                                key={item.id || startIndex + index}
                                className="hover:bg-gray-50 transition-colors duration-150 shadow-md"
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
                                <td className='px-4 py-4 whitespace-nowrap text-sm cursor-pointer hover:text-blue-600 hover:translate-y-1 transition-all duration-200'>
                                    <NavLink to={`/penerimaan/unduh/${item.id}`}>
                                        <div className='flex items-center gap-1'>
                                            <UnduhIcon />
                                            <span>Unduh</span>
                                        </div>
                                    </NavLink>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#FFB14C] text-white ${item.status === 'Telah Dikonfirmasi' ? 'bg-green-600' : 'bg-[#FFB14C]'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        </>
    );
}