export function FormPegawaiPage({ isEdit = false }: { isEdit?: boolean }) {
    return (
        <div className={`w-full h-full flex flex-col gap-5 ${isEdit ? 'bg-white rounded-lg' : ''}`}>
            <div className={`text-center ${isEdit ? 'mt-8' : ''}`}>
                <h1 className={`font-bold text-2xl`}>{!isEdit ? 'Tambah Pegawai Baru' : 'Form Manajemen Pegawai'}</h1>
                <p className="mt-2">{!isEdit ? 'Isi form berikut untuk menambahkan akun pegawai baru ke dalam sistem' : 'Edit Identitas Pegawai'}</p>
            </div>
            <div className="w-full rounded-xl shadow-lg overflow-hidden flex-1">
                {!isEdit &&
                    <div className="bg-blue-600 p-6 md:p-8 flex justify-between items-start text-white">
                        <div className="flex gap-4 items-center">
                            <div className="bg-white p-2 rounded-lg shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Form Data Pegawai</h1>
                                <p className="text-blue-100 text-sm mt-1">Lengkapi semua informasi di bawah ini</p>
                            </div>
                        </div>
                        <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-md shadow-sm whitespace-nowrap">
                            Wajib Diisi
                        </span>
                    </div>
                }

                <div className="px-6">

                    <div className="bg-indigo-50 border-l-4 border-blue-600 p-4 rounded-r-md flex gap-4 items-start mb-8">
                        <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Informasi Penting</h3>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                Pastikan semua data yang dimasukkan sudah benar dan valid. Data yang sudah disimpan akan masuk ke sistem.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Informasi Pribadi</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div className="flex flex-col justify-end">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    <span className="text-red-500 mr-1">*</span>Nama Lengkap
                                </label>
                                <input type="text"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    placeholder="Masukkan Nama Lengkap" />
                                <p className="mt-2 text-sm text-gray-500">Contoh: Rizky Pratama</p>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    <span className="text-red-500 mr-1">*</span>Jabatan
                                </label>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-8">
                                        <option selected disabled>Pilih Jabatan Pegawai</option>
                                        <option>Staff IT</option>
                                        <option>HRD</option>
                                        <option>Manager</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    <span className="text-red-500 mr-1">*</span>NIP
                                </label>
                                <input type="text"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    placeholder="Masukkan Nomor Induk Pegawai" />
                                <p className="mt-2 text-sm text-gray-500">Contoh: 197361736176903</p>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    <span className="text-red-500 mr-1">*</span>No. Telepon
                                </label>
                                <input type="tel"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    placeholder="Masukkan no telepon aktif" />
                                <p className="mt-2 text-sm text-gray-500">Contoh: 08123456789</p>
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 border-t pt-6 border-gray-100">
                        <p className="text-sm text-gray-500">
                            <span className="text-red-500 font-bold">*</span> Menandakan field wajib diisi
                        </p>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm px-8 py-3 transition-colors w-full md:w-auto">
                            Selesai
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}