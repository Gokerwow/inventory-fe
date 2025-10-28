import { useState } from "react";

const FormDataBarangBelanja = () => {
    const [formData, setFormData] = useState({
        namaBarang: '',
        satuan: '',
        jumlah: '',
        totalHarga: '',
        kategoriBarang: '',
        harga: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Data barang:', formData);
        // Di sini Anda bisa menambahkan logika untuk menyimpan data
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">FORM DATA BARANG BELANJA</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama Barang */}
                        <div>
                            <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Barang
                            </label>
                            <input
                                type="text"
                                id="namaBarang"
                                name="namaBarang"
                                value={formData.namaBarang}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan nama barang"
                            />
                        </div>

                        {/* Satuan dan Jumlah */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 mb-1">
                                    Satuan
                                </label>
                                <input
                                    type="text"
                                    id="satuan"
                                    name="satuan"
                                    value={formData.satuan}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Satuan"
                                />
                            </div>
                            <div>
                                <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah
                                </label>
                                <input
                                    type="number"
                                    id="jumlah"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Jumlah"
                                />
                            </div>
                        </div>

                        {/* Total Harga */}
                        <div>
                            <label htmlFor="totalHarga" className="block text-sm font-medium text-gray-700 mb-1">
                                Total Harga
                            </label>
                            <input
                                type="number"
                                id="totalHarga"
                                name="totalHarga"
                                value={formData.totalHarga}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Total Harga"
                            />
                        </div>

                        {/* Kategori Barang */}
                        <div>
                            <label htmlFor="kategoriBarang" className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori Barang
                            </label>
                            <select
                                id="kategoriBarang"
                                name="kategoriBarang"
                                value={formData.kategoriBarang}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Pilih kategori</option>
                                <option value="makanan">Makanan</option>
                                <option value="minuman">Minuman</option>
                                <option value="perlengkapan-rumah">Perlengkapan Rumah</option>
                                <option value="elektronik">Elektronik</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Harga */}
                        <div>
                            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
                                Harga
                            </label>
                            <input
                                type="number"
                                id="harga"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Harga per satuan"
                            />
                        </div>

                        {/* Tombol Selesai */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Selesai
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormDataBarangBelanja;