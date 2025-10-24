import React, { useState } from 'react';

const FormTambahBarangBelanja = () => {
  const [formData, setFormData] = useState({
    // Pihak Pertama
    namaPihakPertama: '',
    alamatSatkerPertama: '',
    
    // Pihak Kedua
    namaPihakKedua: '',
    jabatan: '',
    nip: '',
    alamatSatkerKedua: '',
    
    // Data Barang
    namaBarang: '',
    jumlah: '',
    satuan: '',
    hargaSatuan: '',
    totalHarga: ''
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
    // Logika untuk submit form
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">FORM DATA BARANG BELANJA</h1>
          <p className="text-sm mt-1">Dokumen Resmî RSUD Balung</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Pihak Pertama */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Pihak Pertama</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="ritay" 
                    name="namaPihakPertama" 
                    value="Ritay Protama"
                    checked={formData.namaPihakPertama === "Ritay Protama"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="ritay">Ritay Protama</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="aveli" 
                    name="namaPihakPertama" 
                    value="Aveli Saputra"
                    checked={formData.namaPihakPertama === "Aveli Saputra"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="aveli">Aveli Saputra</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="nadia" 
                    name="namaPihakPertama" 
                    value="Nadia Fitrani"
                    checked={formData.namaPihakPertama === "Nadia Fitrani"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="nadia">Nadia Fitrani</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="sababila" 
                    name="namaPihakPertama" 
                    value="Sababila Nuratni"
                    checked={formData.namaPihakPertama === "Sababila Nuratni"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="sababila">Sababila Nuratni</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="devil" 
                    name="namaPihakPertama" 
                    value="Devil Katitka"
                    checked={formData.namaPihakPertama === "Devil Katitka"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="devil">Devil Katitka</label>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Alamat Satker</label>
              <input 
                type="text" 
                name="alamatSatkerPertama"
                value={formData.alamatSatkerPertama}
                onChange={handleChange}
                placeholder="Masukkan Alamat Satker"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Pihak Kedua */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Pihak Kedua</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                name="namaPihakKedua"
                value={formData.namaPihakKedua}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Jabatan</label>
                <input 
                  type="text" 
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  placeholder="Masukkan Jabatan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">NIP</label>
                <input 
                  type="text" 
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  placeholder="Masukkan NIP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Alamat Satker</label>
              <input 
                type="text" 
                name="alamatSatkerKedua"
                value={formData.alamatSatkerKedua}
                onChange={handleChange}
                placeholder="Masukkan Alamat Satker"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Data Barang */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Data Barang</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nama Barang</label>
                <input 
                  type="text" 
                  name="namaBarang"
                  value={formData.namaBarang}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Barang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Jumlah</label>
                  <input 
                    type="number" 
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    placeholder="Jumlah"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Satuan</label>
                  <input 
                    type="text" 
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleChange}
                    placeholder="Satuan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Harga Satuan</label>
                <input 
                  type="number" 
                  name="hargaSatuan"
                  value={formData.hargaSatuan}
                  onChange={handleChange}
                  placeholder="Masukkan Harga Satuan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Total Harga</label>
                <input 
                  type="number" 
                  name="totalHarga"
                  value={formData.totalHarga}
                  onChange={handleChange}
                  placeholder="Total Harga"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTambahBarangBelanja;