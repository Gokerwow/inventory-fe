import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { PATHS } from "../Routes/path";


export default function PegawaiPage() {
    const [isAktif, setIsAktif] = useState(false)

    const navigate = useNavigate();
    const handleTambahClick = () => {
        navigate(PATHS.PEGAWAI.TAMBAH)
    }
    const handleEditClick = () => {
        navigate(PATHS.PEGAWAI.EDIT)
    }
    return (
        <div className="min-h-full flex flex-col">

            <div className="w-full mb-6 flex justify-between items-center gap-4">
                <div className="flex gap-4 w-full">
                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                            <option>Semua Jabatan</option>
                            <option>Tim PPK</option>
                            <option>Tim Teknis</option>
                            <option>Admin Gudang</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none w-full sm:w-48 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm cursor-pointer">
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Non-Aktif</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                </div>

                <button onClick={handleTambahClick} className="w-70 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white rounded-lg flex-1 flex flex-col justify-between">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
                    <h1 className="text-2xl font-bold text-[#00275C] p-4">Daftar Pegawai</h1>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.Telepon</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">Ahmad Rahardan Slebew</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">19828633374384738</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Tim PPK</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">082784782748</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => setIsAktif(!isAktif)} className={`relative inline-flex items-center h-6 rounded-full w-11 ${isAktif ? 'bg-blue-600' : 'bg-gray-500'} transition-all duration-200 focus:outline-none`}>
                                        <span className="sr-only">Enable notifications</span>
                                        <span className={`${isAktif ? ' translate-x-6' : ' translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}></span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button onClick={handleEditClick} className="flex items-center hover:text-blue-600 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 p-4 flex items-center justify-between mt-2 rounded-lg">
                    <div className="text-sm text-gray-600">
                        Menampilkan <span className="font-medium text-gray-900">1</span> sampai <span className="font-medium text-gray-900">10</span> dari <span className="font-medium text-gray-900">34</span> hasil
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            Sebelumnya
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 flex items-center">
                            Selanjutnya
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}