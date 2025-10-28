import { useState } from "react";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import ButtonConfirm from "../components/buttonConfirm";
import ConfirmationModal from "../components/confirmationModal";

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

    const handleConfirmAction = () => {
        // Lakukan aksi yang diinginkan setelah konfirmasi "Iya"
        alert('Data dikonfirmasi!');
        handleCloseModal(); // Tutup modal setelah aksi
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Data barang:', formData);
        // Di sini Anda bisa menambahkan logika untuk menyimpan data
    };

    return (
        <div className="h-full relative">
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
            <div>
        <>
            <button onClick={() => setIsOpen(true)}>Open dialog</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                        <Description>This will permanently deactivate your account</Description>
                        <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button onClick={() => setIsOpen(false)}>Deactivate</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
            </div>
        </div>
    );
};

export default FormDataBarangBelanja;