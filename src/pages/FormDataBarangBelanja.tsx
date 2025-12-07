import React, { useEffect, useState, useRef } from "react";
import { useToast } from "../hooks/useToast";
import CurrencyInput from "../components/currencyInput";
import { type TIPE_BARANG_STOK } from "../constant/roles";
import DropdownInput from "../components/dropdownInput"; // Gunakan yang baru
import { getBarangBelanja } from "../services/barangService";
import Input from "../components/input";
import Modal from "../components/modal";

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
    
    // selectedBarangObj menyimpan object utuh jika barang lama, atau partial object jika barang baru
    const [selectedBarangObj, setSelectedBarangObj] = useState<Partial<TIPE_BARANG_STOK> | null>(null);
    const [isNewItem, setIsNewItem] = useState(false);
    
    const [jumlah, setJumlah] = useState<number | string>(""); 
    const [harga, setHarga] = useState<number | string>("");
    const [totalHarga, setTotalHarga] = useState<number>(0);
    const [manualSatuan, setManualSatuan] = useState("");

    // Ref untuk auto-focus ke satuan saat buat barang baru
    const satuanInputRef = useRef<HTMLInputElement>(null);

    // Fetch Data
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

    // Calculate Total
    useEffect(() => {
        const qty = typeof jumlah === 'number' ? jumlah : 0;
        const prc = typeof harga === 'number' ? harga : 0;
        setTotalHarga(qty * prc);
    }, [jumlah, harga]);

    // Reset Form
    useEffect(() => {
        if (!isOpen) {
            setSelectedBarangObj(null);
            setIsNewItem(false);
            setManualSatuan("");
            setJumlah("");
            setHarga("");
            setTotalHarga(0);
        }
    }, [isOpen]);

    // --- HANDLER UTAMA DROPDOWN ---
    const handleDropdownChange = (val: TIPE_BARANG_STOK | string) => {
        if (typeof val === 'string') {
            // User membuat barang BARU (Creatable)
            setIsNewItem(true);
            setSelectedBarangObj({ name: val, id: 0 }); // ID 0/null menandakan baru
            setManualSatuan(""); // Reset satuan agar user mengisi
            
            // Auto focus ke input satuan untuk UX yang lebih cepat
            setTimeout(() => {
                if (satuanInputRef.current) {
                    satuanInputRef.current.focus();
                }
            }, 100);

        } else {
            // User memilih barang LAMA (Object)
            setIsNewItem(false);
            setSelectedBarangObj(val);
            setManualSatuan(""); // Tidak pakai manual satuan
        }
    };

    const handleSave = () => {
        const qty = Number(jumlah);
        const prc = Number(harga);
        const currentSatuan = isNewItem ? manualSatuan : selectedBarangObj?.satuan_name;

        // Validasi
        if (!selectedBarangObj?.name) {
            showToast("Nama barang harus diisi!", "error");
            return;
        }
        if (!currentSatuan) {
            showToast("Satuan harus diisi!", "error");
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
            stok_id: isNewItem ? 0 : selectedBarangObj.id, // 0 jika baru
            stok_name: selectedBarangObj.name,
            satuan_name: currentSatuan,
            quantity: qty,
            price: prc,
            total_harga: totalHarga,
            is_layak: null
        };

        onSave(newItem);
        onClose(); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-2xl"
            isForm={true}
        >
            <div className="flex flex-col gap-6">
                
                {/* HEADER */}
                <div className="bg-[#005DB9] p-6 flex justify-between items-start">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">Tambah Data Barang Belanja</h2>
                        <p className="text-blue-100 text-sm mt-1">Cari barang atau ketik nama baru untuk menambahkan</p>
                    </div>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex flex-col gap-5 p-6">
                    
                    {/* Baris 1: Creatable Dropdown */}
                    <div>
                        <DropdownInput<TIPE_BARANG_STOK>
                            options={stokOptions}
                            isCreatable={true} // AKTIFKAN MODE CREATABLE
                            placeholder={categoryId > 0 ? "Cari atau tambah barang baru..." : "Pilih Kategori Dulu"}
                            judul="Nama Barang"
                            // Value diambil dari state object
                            value={selectedBarangObj?.name || ''} 
                            onChange={handleDropdownChange}
                            name="namaBarang"
                            disabled={categoryId <= 0}
                        />
                        {isNewItem && (
                            <p className="text-xs text-green-600 mt-1 ml-1 animate-pulse">
                                * Membuat barang baru: "{selectedBarangObj?.name}"
                            </p>
                        )}
                    </div>

                    {/* Baris 2: Satuan & Jumlah */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            {/* Input Satuan (Manual jika baru, Readonly jika lama) */}
                            <Input
                                // Ref dipasang di sini tapi perlu memastikan komponen Input support ref forwarding
                                // Jika komponen Input Anda belum support ref, bungkus div luarnya atau tambahkan ref di Input component
                                // Untuk amannya saya pakai autoFocus prop HTML standard jika Input support props passing
                                id="satuan"
                                placeholder={isNewItem ? "Masukkan Satuan" : "Satuan Otomatis"}
                                judul="Satuan"
                                name="satuan"
                                value={isNewItem ? manualSatuan : (selectedBarangObj?.satuan_name || '')}
                                readOnly={!isNewItem}
                                onChange={(e) => isNewItem ? setManualSatuan(e.target.value) : {}}
                                // Trik sederhana untuk ref jika Input component anda meneruskan props
                                {...({ ref: satuanInputRef } as any)} 
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

                    {/* Baris 3: Harga */}
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

                    {/* FOOTER */}
                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-[#41C654] hover:bg-[#36a847] text-white font-bold py-2.5 px-8 rounded-lg transition-all duration-200 active:scale-95 shadow-md"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalTambahBarang;