import { useState } from 'react';

export default function FormDataBelanja() {
    const [formData, setFormData] = useState({
        // Pihak Pertama
        pihakPertamaNama: '',
        pihakPertamaAlamat: '',
        pihakPertamaNIP: '',
        pihakPertamaJabatan: '',
        
        // Nomor Surat
        nomorSurat: '',
        
        // Deskripsi Barang
        deskripsiBarang: '',
        
        // Pihak Kedua
        pihakKeduaNama: '',
        pihakKeduaAlamat: '',
        pihakKeduaNIP: '',
        pihakKeduaJabatan: '',
        
        // Deskripsi
        deskripsi: '',
        
        // Daftar Belanja
        daftarBelanja: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Handle form submission here
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 rounded-lg">
                {/* Header */}
                <div className="bg-blue-600 text-white py-6 px-8">
                    <h1 className="text-2xl font-bold text-center">FORM DATA BARANG BELANJA</h1>
                    <p className="text-center text-blue-100 mt-2">Doklarının Resmi R&Dı Bulunçı</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Pihak Pertama */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Pihak Pertama
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap:
                                </label>
                                <input
                                    type="text"
                                    name="pihakPertamaNama"
                                    value={formData.pihakPertamaNama}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat:
                                </label>
                                <input
                                    type="text"
                                    name="pihakPertamaAlamat"
                                    value={formData.pihakPertamaAlamat}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan alamat"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIP:
                                </label>
                                <input
                                    type="text"
                                    name="pihakPertamaNIP"
                                    value={formData.pihakPertamaNIP}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan NIP"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jabatan:
                                </label>
                                <input
                                    type="text"
                                    name="pihakPertamaJabatan"
                                    value={formData.pihakPertamaJabatan}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan jabatan"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nomor Surat */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Nomor Surat
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Surat:
                            </label>
                            <input
                                type="text"
                                name="nomorSurat"
                                value={formData.nomorSurat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan nomor surat"
                            />
                        </div>
                    </div>

                    {/* Deskripsi Barang */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Deskripsi Barang
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi:
                            </label>
                            <textarea
                                name="deskripsiBarang"
                                value={formData.deskripsiBarang}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan deskripsi barang"
                            />
                        </div>
                    </div>

                    {/* Pihak Kedua */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Pihak Kedua
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap:
                                </label>
                                <input
                                    type="text"
                                    name="pihakKeduaNama"
                                    value={formData.pihakKeduaNama}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat:
                                </label>
                                <input
                                    type="text"
                                    name="pihakKeduaAlamat"
                                    value={formData.pihakKeduaAlamat}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan alamat"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIP:
                                </label>
                                <input
                                    type="text"
                                    name="pihakKeduaNIP"
                                    value={formData.pihakKeduaNIP}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan NIP"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jabatan:
                                </label>
                                <input
                                    type="text"
                                    name="pihakKeduaJabatan"
                                    value={formData.pihakKeduaJabatan}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan jabatan"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Deskripsi
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi:
                            </label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan deskripsi tambahan"
                            />
                        </div>
                    </div>

                    {/* Buat Daftar Belanja */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                            Buat Daftar Belanja
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Barang:
                            </label>
                            <select
                                name="daftarBelanja"
                                value={formData.daftarBelanja}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih barang...</option>
                                <option value="barang1">Barang 1</option>
                                <option value="barang2">Barang 2</option>
                                <option value="barang3">Barang 3</option>
                                <option value="barang4">Barang 4</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                        >
                            Simpan Form Data Belanja
                        </button>
                    </div>
                </form>
            </div>
    );
}