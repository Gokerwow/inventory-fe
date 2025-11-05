import React, { useEffect, useState } from "react";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import ButtonConfirm from "../components/buttonConfirm";
import Modal from "../components/modal";
import { PATHS } from "../Routes/path";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// --- TAMBAHAN ---
import { addBarangBelanja } from "../services/penerimaanService"; // <-- Impor service
import { useToast } from "../context/toastContext"; // <-- Impor useToast untuk error
// -----------------
import WarnButton from "../components/warnButton";

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
    // --- TAMBAHAN: State untuk loading saat submit ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    // ------------------------------------------------
    
    const navigate = useNavigate();
    const { showToast } = useToast(); // <-- Panggil hook toast

    const { checkAccess, hasAccess } = useAuthorization(['Tim PPK', 'Tim Teknis']);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // --- UBAHAN: Logika submit sekarang memanggil service ---
    const handleConfirmSubmit = async () => {
        if (isSubmitting) return; // Mencegah klik ganda
        
        setIsSubmitting(true); // Mulai loading
        
        try {
            // 1. Siapkan data untuk dikirim
            const barangData = {
                nama_barang: formData.namaBarang,
                kategori: formData.kategoriBarang,
                satuan: formData.satuan,
                jumlah: Number(formData.jumlah) || 0,
                harga: Number(formData.harga) || 0,
                total_harga: Number(formData.totalHarga) || 0
            };

            // 2. Panggil service (simulasi kirim ke backend)
            const barangBaru = await addBarangBelanja(barangData);

            // 3. Navigasi dengan data yang DIKEMBALIKAN service (logika lama Anda)
            navigate(PATHS.PENERIMAAN.TAMBAH, {
                state: {
                    data: barangBaru, // <-- Kirim data baru dari "backend"
                    toastMessage: 'Berhasil membuat data barang belanja!'
                }
            });
            handleCloseModal();

        } catch (err) {
            console.error("Gagal menambah barang:", err);
            // Tampilkan error jika gagal
            showToast('Gagal menyimpan data barang.', 'error');
        } finally {
            setIsSubmitting(false); // Selesai loading
        }
    };
    // ---------------------------------------------------------

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Cek validasi sederhana
        if (!formData.namaBarang || !formData.satuan || !formData.jumlah) {
            showToast("Nama Barang, Satuan, dan Jumlah wajib diisi!", "error");
            return;
        }
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
                            value={formData.namaBarang} // <-- Tambahkan value
                        />
                        <div className="grid grid-cols-2 gap-10">
                            <Input
                                id="satuan"
                                placeholder="Satuan"
                                judul="Satuan"
                                name="satuan"
                                onChange={handleChange}
                                value={formData.satuan} // <-- Tambahkan value
                            />
                            <Input
                                id="jumlah"
                                placeholder="Jumlah"
                                judul="Jumlah"
                                name="jumlah"
                                onChange={handleChange}
                                type="number"
                                value={formData.jumlah} // <-- Tambahkan value
                            />
                        </div>
                        <Input
                            id="totalHarga"
                            placeholder="Total Harga"
                            judul="Total Harga"
                            name="totalHarga"
                            type="number"
                            onChange={handleChange}
                            value={formData.totalHarga} // <-- Tambahkan value
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <DropdownInput
                            placeholder="Kategori Barang"
                            options={namaOptions} // <-- TODO: Ganti ini dengan kategori, bukan nama orang
                            judul="Kategori Barang"
                            type="button"
                            onChange={(value) => setFormData(p => ({...p, kategoriBarang: value}))} // <-- Update state
                            value={formData.kategoriBarang} // <-- Tambahkan value
                            name="kategoriBarang"
                        />
                        <Input
                            id="harga"
                            placeholder="Harga"
                            judul="Harga"
                            name="harga"
                            type="number"
                            onChange={handleChange}
                            value={formData.harga} // <-- Tambahkan value
                        />
                        {/* BUTTON SELESAI */}
                        <ButtonConfirm
                            text={isSubmitting ? "Menyimpan..." : "Selesai"} // <-- UBAHAN: Teks dinamis
                            className="self-end mt-auto"
                            type="submit"
                            onClick={handleSubmit} // <-- UBAHAN: pastikan ini submit form
                            disabled={isSubmitting} // <-- TAMBAHAN: Nonaktifkan saat submitting
                        />
                    </div>
                </form>
            </div>

            {/* MODAL / POPUP */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text="Apa anda yakin data yang di buat sudah benar?"
            >
                {/* --- TAMBAHAN: Buat tombol 'Iya' tidak bisa diklik saat loading --- */}
                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        text={isSubmitting ? "Menyimpan..." : "Iya"}
                        type="button" // <-- Pastikan tipe button
                        onClick={handleConfirmSubmit}
                        disabled={isSubmitting}
                    />
                    <WarnButton
                        onClick={handleCloseModal}
                        text="Tidak"
                        disabled={isSubmitting} // <-- Nonaktifkan juga
                    />
                </div>
            </Modal>
        </div>
    );
};

export default FormDataBarangBelanja;