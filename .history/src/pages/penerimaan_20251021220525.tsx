import { useState } from 'react';
import EyeIcon from '../assets/eye.svg?react';

export default function Penerimaan() {
    const [activeTab, setActiveTab] = useState('riwayat');

    const [data] = useState([
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Rahardan',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'Admin Gudang Umum',
            namaPegawai: 'Rendy',
            kategori: 'Komputer',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'Tim Teknis',
            namaPegawai: 'Almas',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Aldi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Sylivi',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Fohadza',
            kategori: 'Atk',
            status: 'Unduh'
        },
        {
            noSurat: '903 /3.2c/35.09.61I/PPL/BS/II/2025',
            role: 'PPK',
            namaPegawai: 'Nabila',
            kategori: 'Atk',
            status: 'Unduh'
        }
    ]);

    return (
        <div className="bg-[#F3F7FA] min-h-screen">
            {/* Header */}
            <div className="bg-[#1E40AF] text-white px-6 py-4">
                <h1 className="text-xl font-bold">Penerimaan</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="px-6">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('penerimaan')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'penerimaan'
                                ? 'border-[#1E40AF] text-[#1E40AF]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Penerimaan
                        </button>
                        <button
                            onClick={() => setActiveTab('riwayat')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'riwayat'
                                ? 'border-[#1E40AF] text-[#1E40AF]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Riwayat Penerimaan
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Riwayat Penerimaan</h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                        No Surat
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                        Nama Pegawai
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                            {item.noSurat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                            {item.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                            {item.namaPegawai}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                            {item.kategori}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                                <EyeIcon className="w-4 h-4" />
                                                {item.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Simplified seperti di gambar */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end">
                            <div className="text-sm text-gray-600">
                                1-7 dari 7
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};