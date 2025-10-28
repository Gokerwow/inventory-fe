import { useState } from "react";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import ButtonConfirm from "../components/buttonConfirm";
import Modal from "../components/modal";
import simbaLogo from '../assets/Light Logo new 1.png'

const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];


const FormDataBarangBelanja = () => {
    const [formData, setFormData] = useState({
        namaBarang: '',
        satuan: '',
        jumlah: '',
        totalHarga: '',
        kategoriBarang: '',
        harga: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
        <div className="h-full">
            <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 h-full rounded-xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold mb-6 text-[#057CFF] text-center">FORM DATA BARANG BELANJA</h1>
                <form className="border-t-2 border-[#CADCF2] grid grid-cols-2 p-8 gap-8" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Input
                            id="namaBarang"
                            placeholder="Nama Barang"
                            judul="Nama Barang"
                        />
                        <div className="grid grid-cols-2 gap-10">
                            <Input
                                id="satuan"
                                placeholder="Satuan"
                                judul="Satuan"
                            />
                            <Input
                                id="jumlah"
                                placeholder="Jumlah"
                                judul="Jumlah"
                            />
                        </div>
                        <Input
                            id="totalHarga"
                            placeholder="Total Harga"
                            judul="Total Harga"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <DropdownInput
                            placeholder="Kategori Barang"
                            options={namaOptions}
                            judul="Kategori Barang"
                        />
                        <Input
                            id="harga"
                            placeholder="Harga"
                            judul="Harga"
                        />
                        {/* BUTTON SELESAI */}
                        <ButtonConfirm
                            text='Selesai'
                            className="self-end mt-auto"
                            onClick={handleOpenModal}
                        />
                    </div>
                </form>
            </div>

            {/* MODAL / POPUP */}
            <Modal isOpen={ isModalOpen } onClose={ handleCloseModal }>
                <img src={simbaLogo} alt="" />
                <h1 className="text-2xl text-center">Apa anda yakin data yang di buat sudah benar?</h1>

                <div className="flex gap-4 justify-end">
                    <button onClick={handleCloseModal} className="text-white bg-green-500">
                        Cancel
                    </button>
                    <button onClick={handleCloseModal} className="text-red-600 font-bold">
                        Deactivate
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default FormDataBarangBelanja;