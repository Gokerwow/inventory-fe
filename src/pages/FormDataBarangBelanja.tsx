import React, { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import CurrencyInput from "../components/currencyInput";
import { type TIPE_BARANG_STOK } from "../constant/roles";
import DropdownInput from "../components/dropdownInput";
import { getBarangBelanja } from "../services/barangService";
import Input from "../components/input";

// Icon X sederhana untuk tombol close
const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1L1 13M1 1L13 13" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface ModalTambahBarangProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    categoryId: number;
}

const ModalTambahBarang: React.FC<ModalTambahBarangProps> = ({ isOpen, onClose, onSave, categoryId }) => {
    const { showToast } = useToast();
    
    // State Form
    const [stokOptions, setStokOptions] = useState<TIPE_BARANG_STOK[]>([]);
    const [selectedBarang, setSelectedBarang] = useState<TIPE_BARANG_STOK | null>(null);
    const [jumlah, setJumlah] = useState<number | string>(""); // Allow empty string for clean input
    const [harga, setHarga] = useState<number | string>("");
    const [totalHarga, setTotalHarga] = useState<number>(0);

    // Fetch Data Barang saat Modal Dibuka
    useEffect(() => {
        if (isOpen && categoryId > 0) {
            const fetchBarang = async () => {
                try {
                    const data = await getBarangBelanja(categoryId);
                    setStokOptions(data);
                } catch (error) {
                    console.error("Gagal ambil barang:", error);
                    showToast("Gagal memuat daftar barang", "error");
                }
            };
            fetchBarang();
        }
    }, [isOpen, categoryId]);

    // Auto Calculate Total
    useEffect(() => {
        const qty = typeof jumlah === 'number' ? jumlah : 0;
        const prc = typeof harga === 'number' ? harga : 0;
        setTotalHarga(qty * prc);
    }, [jumlah, harga]);

    // Reset Form saat modal ditutup
    useEffect(() => {
        if (!isOpen) {
            setSelectedBarang(null);
            setJumlah("");
            setHarga("");
            setTotalHarga(0);
        }
    }, [isOpen]);

    const handleBarangChange = (option: TIPE_BARANG_STOK | null) => {
        setSelectedBarang(option);
    };

    const handleSave = () => {
        const qty = Number(jumlah);
        const prc = Number(harga);

        // Validasi
        if (!selectedBarang) {
            showToast("Pilih barang terlebih dahulu!", "error");
            return;
        }
        if (!qty || qty <= 0) {
            showToast("Jumlah harus diisi!", "error");
            return;
        }
        if (!prc || prc <= 0) {
            showToast("Harga harus diisi!", "error");
            return;
        }

        const newItem = {
            stok_id: selectedBarang.id,
            stok_name: selectedBarang.name,
            satuan_name: selectedBarang.satuan_name,
            quantity: qty,
            price: prc,
            total_harga: totalHarga,
            is_layak: null
        };

        onSave(newItem);
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed left-64 inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all scale-100">
                
                {/* --- HEADER (Biru Sesuai Desain) --- */}
                <div className="bg-[#005DB9] p-6 flex justify-between items-start">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">Tambah Data Barang Belanja</h2>
                        <p className="text-blue-100 text-sm mt-1">Isi detail barang yang akan ditambahkan ke daftar belanja</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* --- BODY FORM --- */}
                <div className="p-6 flex flex-col gap-5">
                    
                    {/* Baris 1: Nama Barang (Full Width) */}
                    <div>
                        <DropdownInput<TIPE_BARANG_STOK>
                            options={stokOptions}
                            placeholder={categoryId > 0 ? "Masukkan nama barang" : "Pilih Kategori Dulu"}
                            judul="Nama Barang"
                            value={selectedBarang?.name || ''}
                            onChange={handleBarangChange}
                            name="namaBarang"
                            type="button"
                            disabled={categoryId <= 0}
                        />
                    </div>

                    {/* Baris 2: Satuan & Jumlah */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            {/* Satuan kita buat ReadOnly tapi stylenya seperti dropdown/input agar rapi */}
                            <Input
                                id="satuan"
                                placeholder="Pilih Satuan"
                                judul="Satuan"
                                name="satuan"
                                value={selectedBarang?.satuan_name || ''}
                                readOnly
                                onChange={() => {}}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Jumlah</label>
                            <input 
                                type="number" 
                                placeholder="0"
                                className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-gray-700"
                                value={jumlah}
                                onChange={(e) => setJumlah(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Baris 3: Harga Satuan & Total Harga */}
                    <div className="grid grid-cols-2 gap-6">
                        <CurrencyInput
                            id="harga"
                            placeholder="Rp"
                            judul="Harga Satuan"
                            name="harga"
                            prefix="Rp"
                            value={harga.toString()}
                            onChange={(val) => setHarga(val ? parseInt(val.replace(/\D/g, '')) : "")}
                        />
                        <CurrencyInput
                            id="totalHarga"
                            placeholder="Rp"
                            judul="Total Harga"
                            name="totalHarga"
                            prefix="Rp"
                            value={totalHarga.toString()}
                            disabled
                        />
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="p-6 pt-2 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-[#41C654] hover:bg-[#36a847] text-white font-bold py-2.5 px-8 rounded-lg transition-all duration-200 active:scale-95 shadow-md"
                    >
                        Selesai
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalTambahBarang;