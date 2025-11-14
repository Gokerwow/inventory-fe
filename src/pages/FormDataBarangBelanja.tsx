import React, { useEffect, useState } from "react";
import Input from "../components/input";
import DropdownInput from "../components/dropdownInput";
import ButtonConfirm from "../components/buttonConfirm";
import Modal from "../components/modal";
import { PATHS } from "../Routes/path";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { addBarangBelanja } from "../services/penerimaanService";
import { useToast } from "../hooks/useToast"; 
import WarnButton from "../components/warnButton";
import CurrencyInput from "../components/currencyInput";
import { usePenerimaan } from "../hooks/usePenerimaan";
import { ROLES } from "../constant/roles";

// TODO: Ganti dengan data kategori yang sebenarnya
const kategoriOptions = [
    "Alat Medis",
    "Obat-obatan",
    "Peralatan Kesehatan",
    "Consumable Medical",
    "Alat Tulis Kantor"
];

const FormDataBarangBelanja = () => {
    const [formData, setFormData] = useState({
        namaBarang: '',
        satuan: '',
        jumlah: '',
        totalHarga: '',
        kategoriBarang: '',
        harga: '',
        statusPemeriksaan: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const { checkAccess, hasAccess } = useAuthorization([ROLES.PPK, ROLES.TEKNIS]);
    const { user } = useAuth();

    const { setBarang } = usePenerimaan();

    useEffect(() => {
        checkAccess(user?.role);
    }, [user, checkAccess]);

    // Early return jika tidak memiliki akses
    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Handle untuk input biasa
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle untuk CurrencyInput
    const handleCurrencyChange = (name: string, value: string) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            };

            // Auto calculate total harga
            if (name === 'harga' || name === 'jumlah') {
                const harga = name === 'harga' ? parseInt(value) || 0 : parseInt(prev.harga) || 0;
                const jumlah = name === 'jumlah' ? parseInt(value) || 0 : parseInt(prev.jumlah) || 0;
                updated.totalHarga = (harga * jumlah).toString();
            }

            return updated;
        });
    };

    // Di handleConfirmSubmit, pastikan navigasi mengirim data dengan flag yang jelas
    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const barangData = {
                nama_barang: formData.namaBarang,
                kategori: formData.kategoriBarang,
                satuan: formData.satuan,
                jumlah: Number(formData.jumlah) || 0,
                harga: Number(formData.harga) || 0,
                total_harga: Number(formData.totalHarga) || 0
            };

            const newBarang = await addBarangBelanja(barangData);

            setBarang(prev => [...prev, newBarang]);

            // ✅ PENTING: Kirim dengan flag 'newBarang' agar mudah diidentifikasi
            navigate(PATHS.PENERIMAAN.TAMBAH);

            handleCloseModal();

        } catch (err) {
            console.error("Gagal menambah barang:", err);
            showToast('Gagal menyimpan data barang.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasi
        if (!formData.namaBarang || !formData.satuan || !formData.jumlah || !formData.harga) {
            showToast("Semua field wajib diisi!", "error");
            return;
        }

        console.log('Data barang:', formData);
        handleOpenModal();
    };

    return (
        <div className="h-full">
            <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 h-full rounded-xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold mb-6 text-[#057CFF] text-center">
                    FORM DATA BARANG BELANJA
                </h1>

                <form onSubmit={handleSubmit} className="border-t-2 border-[#CADCF2] grid grid-cols-2 p-8 gap-8">
                    {/* KOLOM KIRI */}
                    <div className="flex flex-col gap-4">
                        {/* Nama Barang */}
                        <Input
                            id="namaBarang"
                            placeholder="Masukkan nama barang"
                            judul="Nama Barang"
                            name="namaBarang"
                            onChange={handleChange}
                            value={formData.namaBarang}
                        />

                        {/* Satuan & Jumlah */}
                        <div className="grid grid-cols-2 gap-10">
                            <Input
                                id="satuan"
                                placeholder="Unit, Box, Pack"
                                judul="Satuan"
                                name="satuan"
                                onChange={handleChange}
                                value={formData.satuan}
                            />

                            {/* ✅ FIX: Jumlah pakai CurrencyInput tanpa prefix */}
                            <CurrencyInput
                                id="jumlah"
                                placeholder="0"
                                judul="Jumlah"
                                name="jumlah"
                                prefix=""  // ← Tanpa prefix
                                onChange={(value) => handleCurrencyChange('jumlah', value)}  // ← FIX
                                value={formData.jumlah}
                            />
                        </div>

                        {/* ✅ FIX: Total Harga disabled (auto calculate) */}
                        <CurrencyInput
                            id="totalHarga"
                            placeholder="0"
                            judul="Total Harga"
                            name="totalHarga"
                            prefix="Rp"
                            onChange={(value) => handleCurrencyChange('totalHarga', value)}
                            value={formData.totalHarga}
                            disabled  // ← FIX: Disabled karena auto calculate
                        />
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="flex flex-col gap-4">
                        {/* ✅ FIX: Dropdown dengan kategori yang benar */}
                        <DropdownInput
                            placeholder="Pilih Kategori"
                            options={kategoriOptions}  // ← FIX: Kategori bukan nama
                            judul="Kategori Barang"
                            type="button"
                            onChange={(value) => {  // ← FIX: Handle string value
                                setFormData(p => ({ ...p, kategoriBarang: value }));
                            }}
                            value={formData.kategoriBarang}
                            name="kategoriBarang"
                        />

                        {/* ✅ FIX: Harga pakai CurrencyInput */}
                        <CurrencyInput
                            id="harga"
                            placeholder="0"
                            judul="Harga Satuan"
                            name="harga"
                            prefix="Rp"
                            onChange={(value) => handleCurrencyChange('harga', value)}  // ← FIX
                            value={formData.harga}
                        />

                        {/* Button Selesai */}
                        <ButtonConfirm
                            text={isSubmitting ? "Menyimpan..." : "Selesai"}
                            className="self-end mt-auto"
                            type="submit"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>

            {/* MODAL / POPUP */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text="Apa anda yakin data yang dibuat sudah benar?"
            >
                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        text={isSubmitting ? "Menyimpan..." : "Iya"}
                        type="button"
                        onClick={handleConfirmSubmit}
                        disabled={isSubmitting}
                    />
                    <WarnButton
                        onClick={handleCloseModal}
                        text="Tidak"
                        disabled={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default FormDataBarangBelanja;