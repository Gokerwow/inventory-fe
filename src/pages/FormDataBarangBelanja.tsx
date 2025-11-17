import React, { useEffect, useState } from "react";
import Input from "../components/input";
import ButtonConfirm from "../components/buttonConfirm";
import Modal from "../components/modal";
import { useAuthorization } from "../hooks/useAuthorization";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getBarangBelanja } from "../services/barangService";
import { useToast } from "../hooks/useToast";
import WarnButton from "../components/warnButton";
import CurrencyInput from "../components/currencyInput";
import { usePenerimaan } from "../hooks/usePenerimaan";
import { ROLES, type TIPE_BARANG_STOK } from "../constant/roles";
import DropdownInput from "../components/dropdownInput";

const FormDataBarangBelanja = () => {
    const [formData, setFormData] = useState({
        stok_id: 0,
        quantity: 0,
        price: 0,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stok, setStok] = useState<TIPE_BARANG_STOK[]>([]);
    const [selectedBarang, setSelectedBarang] = useState<TIPE_BARANG_STOK | null>(null);

    // ✅ State terpisah untuk input harga
    const [jumlah, setJumlah] = useState<number>(0);
    const [harga, setHarga] = useState<number>(0);
    const [totalHarga, setTotalHarga] = useState<number>(0);

    const navigate = useNavigate();
    const location = useLocation();
    const { isEdit, returnUrl } = location.state || {};

    const { showToast } = useToast();
    const { checkAccess, hasAccess } = useAuthorization([ROLES.PPK, ROLES.TEKNIS]);
    const { user } = useAuth();
    const { setBarang, formDataPenerimaan } = usePenerimaan();

    console.log(isEdit)
    // ✅ useEffect untuk auto-calculate total harga
    useEffect(() => {
        const calculatedTotal = jumlah * harga;
        setTotalHarga(calculatedTotal);
        console.log(`📊 Auto calculate: ${jumlah} × ${harga} = ${calculatedTotal}`);
    }, [jumlah, harga]);

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchBarangBelanja = async () => {
            try {
                const stokData = await getBarangBelanja(formDataPenerimaan.category_id);
                setStok(stokData);
            } catch (error) {
                console.error("Gagal mengambil data barang belanja:", error);
                showToast('Gagal mengambil data barang belanja.', 'error');
            }
        };

        fetchBarangBelanja();
    }, [user?.role, formDataPenerimaan.category_id]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // ✅ Handler untuk dropdown barang
    const handleBarangChange = (option: TIPE_BARANG_STOK | null) => {
        setSelectedBarang(option);
        if (option) {
            setFormData(prev => ({
                ...prev,
                stok_id: option.id,
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // ✅ Handler untuk jumlah
    const handleJumlahChange = (value: string) => {
        const numValue = parseInt(value.replace(/\D/g, '')) || 0;
        setJumlah(numValue);
        setFormData(prev => ({
            ...prev,
            quantity: numValue
        }));
    };

    // ✅ Handler untuk harga
    const handleHargaChange = (value: string) => {
        const numValue = parseInt(value.replace(/\D/g, '')) || 0;
        setHarga(numValue);
        setFormData(prev => ({
            ...prev,
            price: numValue
        }));
    };

    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // ✅ Langsung ambil dari state
            const barangData = {
                stok_id: selectedBarang?.id ?? 0,
                quantity: jumlah,
                price: harga,
                total_harga: totalHarga,
                stok_name: selectedBarang?.name ?? '',
                satuan_name: selectedBarang?.satuan_name ?? '',
                is_layak: null
            };

            console.log('✅ Barang yang akan ditambahkan:', barangData);

            setBarang(prev => [...prev, barangData]);
            showToast('Barang berhasil ditambahkan!', 'success');
            navigate(returnUrl, { state: { isEdit, keepLocalData: true } });
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

        // ✅ Validasi
        if (!selectedBarang) {
            showToast("Pilih barang terlebih dahulu!", "error");
            return;
        }

        if (jumlah <= 0) {
            showToast("Jumlah harus lebih dari 0!", "error");
            return;
        }

        if (harga <= 0) {
            showToast("Harga harus lebih dari 0!", "error");
            return;
        }

        console.log('Data barang siap submit:', {
            stok_id: formData.stok_id,
            quantity: jumlah,
            price: harga,
            stok_name: selectedBarang?.name,
            satuan_name: selectedBarang?.satuan_name
        });

        handleOpenModal();
    };

    if (!hasAccess(user?.role)) {
        return null;
    }

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
                        <DropdownInput<TIPE_BARANG_STOK>
                            options={stok}
                            placeholder='Pilih Barang'
                            judul='Nama Barang'
                            value={selectedBarang?.name || ''}
                            onChange={handleBarangChange}
                            name='namaBarang'
                            type='button'
                        />

                        {/* Satuan & Jumlah */}
                        <div className="grid grid-cols-2 gap-10">
                            <Input
                                id="satuan"
                                placeholder="Unit, Box, Pack"
                                judul="Satuan"
                                name="satuan"
                                onChange={handleChange}
                                value={selectedBarang?.satuan_name || ''}
                                readOnly
                            />

                            {/* ✅ Jumlah tanpa prefix Rp */}
                            <CurrencyInput
                                id="jumlah"
                                placeholder="0"
                                judul="Jumlah"
                                name="jumlah"
                                prefix=""
                                onChange={handleJumlahChange}
                                value={jumlah.toString()}
                            />
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="flex flex-col gap-4">
                        {/* ✅ Harga dengan prefix Rp */}
                        <CurrencyInput
                            id="harga"
                            placeholder="0"
                            judul="Harga Satuan"
                            name="harga"
                            prefix="Rp"
                            onChange={handleHargaChange}
                            value={harga.toString()}
                        />

                        {/* ✅ Total Harga (Auto-calculated & Disabled) */}
                        <CurrencyInput
                            id="totalHarga"
                            placeholder="0"
                            judul="Total Harga"
                            name="totalHarga"
                            prefix="Rp"
                            value={totalHarga.toString()}
                            disabled
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