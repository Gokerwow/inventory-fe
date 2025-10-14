import { useState } from 'react';
import EyeIcon from '../assets/eye.svg?react';

export default function Penerimaan() {
    const [activeTab, setActiveTab] = useState('penerimaan');

    const [data] = useState([
        {
            id: 1,
            namaPPK: 'Soleh',
            idBarang: '#001',
            kategori: 'ATK',
            namaItem: 'Spidol',
            tanggal: '9 Oktober 2025',
            status: 'Belum dikonfirmasi'
        },
        {
            id: 2,
            namaPPK: 'Samsul',
            idBarang: '#002',
            kategori: 'Kebersihan',
            namaItem: 'Sapu',
            tanggal: '10 Oktober 2025',
            status: 'Telah dikonfirmasi'
        },
        {
            id: 3,
            namaPPK: 'Ida',
            idBarang: '#003',
            kategori: 'ATK',
            namaItem: 'Kertas',
            tanggal: '11 Oktober 2025',
            status: 'Telah dikonfirmasi'
        },
        {
            id: 4,
            namaPPK: 'Ratna',
            idBarang: '#004',
            kategori: 'Komputer',
            namaItem: 'Tinta',
            tanggal: '11 Oktober 2025',
            status: 'Telah dikonfirmasi'
        },
        {
            id: 5,
            namaPPK: 'Joko',
            idBarang: '#005',
            kategori: 'ATK',
            namaItem: 'Bulpen',
            tanggal: '11 Oktober 2025',
            status: 'Telah dikonfirmasi'
        }
    ]);

    return (
        <div className="bg-[#F3F7FA]  relative z-10 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 text-white px-6 py-4 h-[60px]">

            </div>

            {/* Tabs */}
            <div className="bg-[#EDEDED]">
                <div className="px-6">
                    <div className="flex gap-8 justify-center items-center">
                        <button
                            onClick={() => setActiveTab('penerimaan')}
                            className={`py-4 font-bold border-b-4 transition-colors ${activeTab === 'penerimaan'
                                ? 'border-blue-900 text-[#152F54]'
                                : 'border-[#9C9C9C] text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Penerimaan
                        </button>
                        <button
                            onClick={() => setActiveTab('riwayat')}
                            className={`py-4 font-bold border-b-4 transition-colors ${activeTab === 'riwayat'
                                ? 'border-blue-900 text-[#152F54]'
                                : 'border-[#9C9C9C] text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Riwayat Penerimaan
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="pt-6 bg-[#F3F7FA]">
                <div className="w-full overflow-hidden">
                    <table className="w-full mx-auto bg-[#F3F7FA] table-fixed border-separate border-spacing-y-4">
                        <thead className="">
                            <tr>
                                <th className="w-2"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama PPK
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID Barang
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori Barang
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal dibuat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status konfirmasi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-100 bg-[#FFFFFF]">
                                    <td className='w-full h-full bg-[#EFF8FF]'>
                                        <div className="">&nbsp;</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.namaPPK}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.idBarang}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.kategori}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.namaItem}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.tanggal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
                                            <EyeIcon />
                                            <span>Lihat</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {item.status === 'Belum dikonfirmasi' ? (
                                            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                                Belum dikonfirmasi
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                                                Telah dikonfirmasi
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex justify-end text-sm text-gray-600">
                        1-5 dari 20
                    </div>
                </div>
            </div>
        </div>
    );
};