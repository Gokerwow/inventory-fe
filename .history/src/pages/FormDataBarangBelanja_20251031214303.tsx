import { useEffect, useState } from "react";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import ButtonConfirm from "../components/buttonConfirm";
import Modal from "../components/modal";
import simbaLogo from '../assets/Light Logo new 1.png'
import WarnButton from "../components/warnButton";
import { PATHS } from "../Routes/path";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];

const FormDataBarangBelanja = (barang) => {
    const [formData, setFormData] = useState({
        namaBarang: '',
        satuan: '',
        jumlah: '',
        totalHarga: '',
        kategoriBarang: '',
        harga: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()

    const { checkAccess, hasAccess } = useAuthorization('Tim PPK');
    const { user } = useAuth()

    useEffect(() => {
        checkAccess(user?.role);
    }, [user, checkAccess]);

    // Early return jika tidak memiliki akses
    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirmSubmit = () => {
        // ← Logic submit dipindahkan ke sini
        console.log('Data barang:', formData);

        // Navigate dengan data
        navigate(PATHS.PENERIMAAN.TAMBAH, {
            state: {
                data: {
                    id: Date.now(),
                    nama_barang: formData.namaBarang,
                    kategori: formData.kategoriBarang,
                    satuan: formData.satuan,
                    jumlah: formData.jumlah,
                    harga: formData.harga,
                    total_harga: formData.totalHarga
                }
            }
        });
        handleCloseModal();
    };


    const handleSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();
        console.log('Data barang:', formData);
        handleOpenModal()
    };

    return (
        <div className="h-full">
            <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 h-full rounded-xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold mb-6 text-[#057CFF] text-center">FORM DATA BARANG BELANJA</h1>
                <form onSubmit={handleSubmit} className="border-t-2 border-[#CADCF2] grid grid-cols-2 p-8 gap-8">
                    <div className="flex flex-col gap-4">
                        <Input
                            id="namaBarang"
                            placeholder="Nama Barang"
                            judul="Nama Barang"
                            name="namaBarang"
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-10">
                            <Input
                                id="satuan"
                                placeholder="Satuan"
                                judul="Satuan"
                                name="satuan"
                                onChange={handleChange}
                                type="number"
                            />
                            <Input
                                id="jumlah"
                                placeholder="Jumlah"
                                judul="Jumlah"
                                name="jumlah"
                                onChange={handleChange}
                                type="number"
                            />
                        </div>
                        <Input
                            id="totalHarga"
                            placeholder="Total Harga"
                            judul="Total Harga"
                            name="totalHarga"
                            type="number"
                            onChange={handleChange}

                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <DropdownInput
                            placeholder="Kategori Barang"
                            options={namaOptions}
                            judul="Kategori Barang"
                            type="button"
                        />
                        <Input
                            id="harga"
                            placeholder="Harga"
                            judul="Harga"
                            name="harga"
                            type="number"
                            onChange={handleChange}
                        />
                        {/* BUTTON SELESAI */}
                        <ButtonConfirm
                            text='Selesai'
                            className="self-end mt-auto"
                            onClick={handleOpenModal}
                            type="submit"
                        />
                    </div>
                </form>
            </div>

            {/* MODAL / POPUP */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <img src={simbaLogo} alt="" />
                <h1 className="text-2xl text-center select-none">Apa anda yakin data yang di buat sudah benar?</h1>

                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        text="Iya"
                        // to={PATHS.PENERIMAAN.TAMBAH}
                        type="submit"
                        onClick={handleConfirmSubmit}
                    />
                    <WarnButton
                        onClick={handleCloseModal}
                        text="Tidak"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default FormDataBarangBelanja;