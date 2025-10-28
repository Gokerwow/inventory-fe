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
        <div className="shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-6 text-[#057CFF]">Form Data Barang Belanja</h1>
        </div>
    );
};

export default FormDataBarangBelanja;