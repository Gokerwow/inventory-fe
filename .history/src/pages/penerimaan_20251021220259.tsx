import { useState } from 'react';
import EyeIcon from '../assets/eye.svg?react';

export default function Penerimaan() {
    const [activeTab, setActiveTab] = useState('penerimaan');

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
        <div className="bg-[#F3F7FA] min-h-screen relative z-10 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 text-white px-6 py-4 h-[60px]">
                {/* Header content jika ada */}
            </div>

            {/* Tabs */}
            <div className="bg-[#EDEDED]">
                <div className="px-6">
                    <div className="flex gap-8 justify-center items-center">
                        <button
                            onClick={() => setActiveTab('penerimaan')}
                            className={`py-4 font-bold border-b-4 transition-colors cursor-pointer ${activeTab === 'penerimaan'
                                ? 'border-blue-900 text-[#152F54]'
                                : 'border-[#9C9C9C] text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Penerimaan
                        </button>
                        <button
                            onClick={() => setActiveTab('riwayat')}
                            className={`py-4 font-bold border-b-4 transition-colors cursor-pointer ${activeTab === 'riwayat'
                                ? 'border-blue-900 text-[#152F54]'
                                : 'border-[#9C9C9C] text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Riwayat Penerimaan
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="pt-6 bg-[#F3F7FA] px-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        No Surat
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Nama Pegawai
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.noSurat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.namaPegawai}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.kategori}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                                <EyeIcon className="w-4 h-4" />
                                                {item.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Menampilkan 1-7 dari 7 data
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                    Sebelumnya
                                </button>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                                    1
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};