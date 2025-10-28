import { useState } from "react";
import Input from "../components/input";

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
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6 text-[#057CFF] text-center">FORM DATA BARANG BELANJA</h1>
            <form className="border-t-2 border-[#CADCF2] grid grid-cols-2 p-8" onSubmit={handleSubmit}>
                <div>
                    <Input 
                        id="namaBarang"
                        placeholder="Nama Barang"
                        judul="Nama Barang"
                    />
                    <Input 
                        id="namaBarang"
                        placeholder="Nama Barang"
                        judul="Nama Barang"
                    />
                    <Input 
                        id="namaBarang"
                        placeholder="Nama Barang"
                        judul="Nama Barang"
                    />
                </div>
                <div>

                </div>
            </form>
        </div>
    );
};

export default FormDataBarangBelanja;