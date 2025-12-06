import ShopCartIcon from '../assets/shopping-cart.svg?react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';
import ButtonConfirm from '../components/buttonConfirm';
import WarnButton from '../components/warnButton';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import React, { useEffect, useState, useMemo } from 'react';
import { PATHS } from '../Routes/path';
import {
    getPenerimaanDetail,
    createPenerimaan,
    confirmPenerimaan,
    editPenerimaan,
    deletePenerimaanDetail,
} from '../services/penerimaanService';
import { updateBarangStatus } from '../services/barangService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/modal';
import { usePenerimaan } from '../hooks/usePenerimaan';
import { ROLES, type Kategori, type SelectPihak } from '../constant/roles';
import { getKategoriList } from '../services/kategoriService';
import { getPegawaiSelect } from '../services/pegawaiService';
import axios from 'axios';
import ModalTambahBarang from './FormDataBarangBelanja';

// Interface tambahan untuk menghandle item yang dipilih di modal
interface SelectedItemState {
    stok_id: number;
    max_qty: number;
}

export default function TambahPenerimaan({ isEdit = false, isInspect = false }: { isEdit?: boolean, isInspect?: boolean }) {
    const requiredRoles = useMemo(() => [ROLES.PPK, ROLES.TEKNIS], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { id: paramId } = useParams();
    const { showToast } = useToast();
    const [isDelete, setIsDelete] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal Confirm Submit
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isAddBarangModalOpen, setIsAddBarangModalOpen] = useState(false);

    // ✅ STATE BARU: Modal Kuantitas Layak
    const [isQtyModalOpen, setIsQtyModalOpen] = useState(false);
    const [qtyInput, setQtyInput] = useState<number | string>(0);
    const [selectedItem, setSelectedItem] = useState<SelectedItemState | null>(null);

    const [error, setError] = useState<string | null>(null);

    const { barang, setBarang, formDataPenerimaan, setFormDataPenerimaan } = usePenerimaan()
    const [kategoriOptions, setKategoriOptions] = useState<Kategori[]>([]);

    const [pihak, setPihak] = useState<SelectPihak[]>([])

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [kategoriData, pihakData] = await Promise.all([
                    getKategoriList(),
                    getPegawaiSelect()
                ]);

                setKategoriOptions(kategoriData);
                setPihak(pihakData);

                if (!location.state?.keepLocalData && (isEdit || isInspect) && paramId) {
                    console.log('🔄 Fetching data penerimaan untuk edit...');
                    const id = Number(paramId);
                    const detailData = await getPenerimaanDetail(id);

                    if (detailData) {
                        setFormDataPenerimaan({
                            no_surat: detailData.no_surat,
                            category_id: detailData.category.id,
                            category_name: detailData.category.name,
                            deskripsi: detailData.deskripsi,
                            detail_barangs: [],
                            pegawais: [{
                                pegawai_id_pertama: detailData.detail_pegawai[0].id,
                                pegawai_name_pertama: detailData.detail_pegawai[0].name,
                                pegawai_NIP_pertama: detailData.detail_pegawai[0].nip,
                                jabatan_name_pertama: detailData.detail_pegawai[0].jabatan_name,
                                alamat_staker_pertama: detailData.detail_pegawai[0].alamat_satker
                            }, {
                                pegawai_id_kedua: detailData.detail_pegawai[1].id,
                                pegawai_name_kedua: detailData.detail_pegawai[1].name,
                                pegawai_NIP_kedua: detailData.detail_pegawai[1].nip,
                                jabatan_name_kedua: detailData.detail_pegawai[1].jabatan_name,
                                alamat_staker_kedua: detailData.detail_pegawai[1].alamat_satker
                            }]
                        });

                        const transformedBarang = detailData.detail_barang?.map(item => ({
                            id: item.id,
                            stok_id: item.stok_id,
                            stok_name: item.nama_stok,
                            satuan_name: item.nama_satuan,
                            quantity: item.quantity,
                            price: item.harga,
                            total_harga: item.total_harga,
                            is_layak: item.is_layak || null,
                            // Pastikan backend mengirim quantity_layak jika ada, atau default ke 0
                            quantity_layak: (item as any).quantity_layak || (item.is_layak ? item.quantity : 0)
                        })) || [];

                        setBarang(transformedBarang);
                    }
                }
            } catch (err) {
                console.error('❌ Error:', err);
                setError("Gagal memuat data.");
                showToast("Gagal memuat data.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, isInspect, paramId, user?.role, checkAccess, hasAccess, showToast, location.state?.keepLocalData]);

    useEffect(() => {
        console.log('📊 Barang updated:', barang);
    }, [barang]);

    if (!hasAccess(user?.role)) {
        return null;
    }

    // ✅ HANDLER UNTUK MEMBUKA MODAL TAMBAH BARANG
    const handleAddClick = () => {
        // Cek dulu apakah kategori sudah dipilih
        if (formDataPenerimaan.category_id === 0) {
            showToast("Pilih kategori barang terlebih dahulu!", "error");
            return;
        }
        setIsAddBarangModalOpen(true);
    }

    // ✅ HANDLER UNTUK MENYIMPAN BARANG DARI MODAL KE STATE
    const handleSaveNewItem = (newItem: any) => {
        setBarang(prev => [...prev, newItem]);
        showToast('Barang berhasil ditambahkan ke daftar!', 'success');
    };

    const handleDeleteBarang = (stokId: number) => {
        const itemToDelete = barang.find(item => item.stok_id === stokId);
        if (itemToDelete && itemToDelete.id) {
            setDeletedIds(prev => [...prev, itemToDelete.id]);
        }
        setBarang(prev => prev.filter(item => item.stok_id !== stokId));
        showToast('Barang berhasil dihapus', 'success');
    };

    // ✅ HANDLER UNTUK TOMBOL "TIDAK LAYAK" (Langsung set false)
    const handleStatusTidakLayak = (id: number) => {
        setBarang(prevBarang =>
            prevBarang.map(item => {
                return item.stok_id === id ? { ...item, is_layak: false, quantity_layak: 0 } : item;
            })
        );
        showToast(`Barang ditandai Tidak Layak`, 'success');
    };

    // ✅ HANDLER MEMBUKA MODAL "LAYAK"
    const handleOpenLayakModal = (item: any) => {
        setSelectedItem({
            stok_id: item.stok_id,
            max_qty: item.quantity
        });
        setQtyInput(item.quantity); // Default isi dengan jumlah total
        setIsQtyModalOpen(true);
    };

    // ✅ Update fungsi handleSaveLayakQty
    const handleSaveLayakQty = () => {
        if (!selectedItem) return;

        // KONVERSI: Jika kosong "", anggap 0. Jika ada isi, jadikan number.
        const finalQty = qtyInput === '' ? 0 : Number(qtyInput);

        if (finalQty <= 0) {
            showToast("Jumlah barang layak harus lebih dari 0", "error");
            return;
        }

        if (finalQty > selectedItem.max_qty) {
            showToast(`Jumlah melebihi total barang (${selectedItem.max_qty})`, "error");
            return;
        }

        setBarang(prevBarang =>
            prevBarang.map(item => {
                if (item.stok_id === selectedItem.stok_id) {
                    return {
                        ...item,
                        is_layak: true,
                        quantity_layak: finalQty // Gunakan finalQty
                    };
                }
                return item;
            })
        );

        setIsQtyModalOpen(false);
        setSelectedItem(null);
        showToast(`Barang ditandai Layak (${finalQty} item)`, 'success');
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDataPenerimaan(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleKategoriChange = (option: Kategori | null) => {
        const newCategoryId = option?.id ?? 0;
        const oldCategoryId = formDataPenerimaan.category_id;

        if (newCategoryId === oldCategoryId) return;

        // Cek jika ada barang di keranjang
        if (barang.length > 0) {
            const isConfirmed = window.confirm(
                "Mengganti kategori akan MENGHAPUS semua barang di keranjang belanja Anda. Lanjutkan?"
            );

            if (isConfirmed) {
                setBarang([]);
                setFormDataPenerimaan(prevState => ({
                    ...prevState,
                    category_id: newCategoryId,
                    category_name: option?.name ?? ''
                }));
                showToast('Keranjang belanja telah dikosongkan.', 'success');
            }
        } else {
            setFormDataPenerimaan(prevState => ({
                ...prevState,
                category_id: newCategoryId,
                category_name: option?.name ?? ''
            }));
        }
    };

    const handleAlamatSatkerPertamaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        setFormDataPenerimaan((prev) => ({
            ...prev,
            pegawais: [
                {
                    ...prev.pegawais[0],
                    alamat_staker_pertama: value
                },
                prev.pegawais?.[1] ?? {
                    pegawai_id_kedua: 0,
                    pegawai_name_kedua: '',
                    pegawai_NIP_kedua: '',
                    jabatan_name_kedua: '',
                    alamat_staker_kedua: ''
                }
            ]
        }))
    }

    const handleAlamatSatkerKeduaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        setFormDataPenerimaan((prev) => ({
            ...prev,
            pegawais: [
                prev.pegawais?.[0] ?? {
                    pegawai_id_pertama: 0,
                    pegawai_name_pertama: '',
                    pegawai_NIP_pertama: '',
                    jabatan_name_pertama: '',
                    alamat_staker_pertama: ''
                },
                {
                    ...prev.pegawais[1],
                    alamat_staker_kedua: value
                }
            ]
        }));
    }

    const handlePihakPertamaChange = (pihak: SelectPihak | null) => {
        setFormDataPenerimaan((prev) => ({
            ...prev,
            pegawais: [
                {
                    pegawai_id_pertama: pihak?.id ?? 0,
                    pegawai_name_pertama: pihak?.name ?? '',
                    pegawai_NIP_pertama: pihak?.nip ?? '',
                    jabatan_name_pertama: pihak?.jabatan_name ?? '',
                    alamat_staker_pertama: ''
                },
                prev.pegawais?.[1] ?? {
                    pegawai_id_kedua: 0,
                    pegawai_name_kedua: '',
                    pegawai_NIP_kedua: '',
                    jabatan_name_kedua: '',
                    alamat_staker_kedua: ''
                }
            ]
        }));
    };

    const handlePihakKeduaChange = (pihak: SelectPihak | null) => {
        setFormDataPenerimaan((prev) => ({
            ...prev,
            pegawais: [
                prev.pegawais?.[0] ?? {
                    pegawai_id_pertama: 0,
                    pegawai_name_pertama: '',
                    pegawai_NIP_pertama: '',
                    jabatan_name_pertama: '',
                    alamat_staker_pertama: ''
                },
                {
                    pegawai_id_kedua: pihak?.id ?? 0,
                    pegawai_name_kedua: pihak?.name ?? '',
                    pegawai_NIP_kedua: pihak?.nip ?? '',
                    jabatan_name_kedua: pihak?.jabatan_name ?? '',
                    alamat_staker_kedua: ''
                }
            ]
        }));
    };


    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (barang.length === 0) {
            showToast("Tambahkan minimal 1 barang belanja!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        try {
            if (isInspect) {
                // --- ALUR 1: MODE INSPEKSI (TIM TEKNIS) ---

                const allMarked = barang.every(item => item.is_layak !== null);
                if (!allMarked) {
                    showToast("Harap tandai 'Layak' atau 'Tidak Layak' untuk SEMUA barang.", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                const penerimaanId = Number(paramId);
                if (!penerimaanId) {
                    throw new Error("ID Penerimaan tidak ditemukan di URL.");
                }

                for (const item of barang) {
                    const detailId = item.id;

                    // Logika quantity
                    const qtyToSend = item.is_layak
                        ? ((item as any).quantity_layak ?? item.quantity)
                        : 0;

                    // Kita await di sini agar prosesnya nunggu satu selesai baru lanjut yg lain
                    await updateBarangStatus(penerimaanId, detailId, qtyToSend);
                }

                await new Promise(resolve => setTimeout(resolve, 500));
                await confirmPenerimaan(penerimaanId)

                showToast("Status kelayakan barang berhasil disimpan!", "success");

            } else {
                // --- ALUR 2: MODE CREATE / EDIT (TIM PPK) ---

                if (!formDataPenerimaan.no_surat || formDataPenerimaan.pegawais[0].pegawai_id_pertama === 0) {
                    showToast("Nomor Surat dan Pihak Pertama wajib diisi!", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                if (formDataPenerimaan.pegawais[1].pegawai_id_kedua === 0) {
                    showToast("Pihak Kedua wajib diisi!", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                const listPegawai = [
                    {
                        pegawai_id: formDataPenerimaan.pegawais[0].pegawai_id_pertama,
                        alamat_staker: formDataPenerimaan.pegawais[0].alamat_staker_pertama
                    },
                    {
                        pegawai_id: formDataPenerimaan.pegawais[1].pegawai_id_kedua,
                        alamat_staker: formDataPenerimaan.pegawais[1].alamat_staker_kedua
                    }
                ].filter(p => p.pegawai_id !== 0);


                const dataFinal = {
                    no_surat: formDataPenerimaan.no_surat,
                    category_id: formDataPenerimaan.category_id,
                    deskripsi: formDataPenerimaan.deskripsi,
                    deleted_barang_ids: deletedIds,
                    detail_barangs: barang.map(item => ({
                        ...(item.id && { id: item.id }),
                        stok_id: item.stok_id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    pegawais: listPegawai
                };

                if (isEdit) {
                    const penerimaanId = Number(paramId);
                    if (!penerimaanId) {
                        throw new Error("ID Penerimaan tidak ditemukan di URL.");
                    }
                    await editPenerimaan(penerimaanId, dataFinal);
                    showToast("Berhasil mengupdate data penerimaan!", "success");

                } else {
                    await createPenerimaan(dataFinal);
                    showToast("Berhasil membuat data penerimaan!", "success");
                }
            }

            setIsModalOpen(false);
            setIsSubmitting(false);
            navigate(PATHS.PENERIMAAN.INDEX);

        } catch (err) {
            console.error("❌ Error submit:", err);
            setIsSubmitting(false);
            setIsModalOpen(false);

            if (axios.isAxiosError(err) && err.response) {
                const status = err.response.status;
                const data = err.response.data;

                if (status === 422) {
                    if (data.errors) {
                        const newErrors: Record<string, string> = {};
                        Object.keys(data.errors).forEach((key) => {
                            newErrors[key] = data.errors[key][0];
                        });
                        setFormErrors(newErrors);
                        const firstError = Object.values(data.errors)[0] as string[];
                        showToast(`Gagal: ${firstError[0]}`, "error");
                    } else {
                        showToast(data.message || "Data tidak valid.", "error");
                    }
                }
                else if (status === 401) {
                    showToast("Sesi habis. Silakan login ulang.", "error");
                }
                else if (status === 404) {
                    showToast("Data referensi tidak ditemukan (404).", "error");
                }
                else if (status >= 500) {
                    showToast("Terjadi kesalahan server. Hubungi admin.", "error");
                }
                else {
                    showToast(data.message || `Terjadi kesalahan (${status})`, "error");
                }
            } else {
                showToast((err as Error).message || "Terjadi kesalahan sistem.", "error");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsModalOpen(true);
        setIsDelete(false)
    }

    const handleDeleteClick = () => {
        setIsDelete(true)
        setIsModalOpen(true);
    };

    const handleDeletePenerimaan = async (id: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await deletePenerimaanDetail(id);
            showToast("Data berhasil dihapus", "success");
            navigate(PATHS.PENERIMAAN.INDEX);
        } catch (error) {
            console.error(error);
            showToast("Gagal menghapus data", "error");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-xl flex justify-center items-center h-96">
                <p>Memuat data form...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-xl flex justify-center items-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // --- KOMPONEN KECIL UNTUK HEADER SECTION (Nomor Biru + Judul) ---
    const SectionHeader = ({ number, title, children }: { number: string, title: string, children?: React.ReactNode }) => (
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#005DB9] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {number}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    );

    // --- RENDER UTAMA ---
    return (
        <div className="flex flex-col gap-6">

            {/* HEADER HALAMAN (Biru) */}
            <div className="bg-[#005DB9] rounded-xl p-6 text-center text-white shadow-md">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                    {isEdit ? "EDIT DATA PENERIMAAN" : "FORM DATA BARANG BELANJA"}
                </h1>
                <p className="text-blue-100 text-sm mt-1 opacity-90">Dokumen Resmi RSUD Balung</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* SECTION 1: INFORMASI PIHAK TERKAIT */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <SectionHeader number="1" title="Informasi Pihak Terkait" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kiri: Pihak Pertama */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-700 mb-2 border-b w-fit pb-1">Pihak Pertama</h3>
                            <DropdownInput
                                options={pihak}
                                placeholder='Pilih Nama'
                                judul='Nama Lengkap'
                                value={formDataPenerimaan.pegawais[0].pegawai_name_pertama}
                                onChange={handlePihakPertamaChange}
                                name='namaPihakPertama'
                                type='button'
                                disabled={isInspect}
                            />
                            <Input
                                id="jabatanPihakPertama"
                                placeholder="Jabatan otomatis terisi"
                                judul="Jabatan"
                                onChange={handleChange}
                                name='jabatanPihakPertama'
                                value={formDataPenerimaan.pegawais[0].jabatan_name_pertama}
                                readOnly={true}
                            />
                            <Input
                                id="NIPPihakPertama"
                                placeholder="NIP otomatis terisi"
                                judul="NIP"
                                type='number'
                                onChange={handleChange}
                                name='NIPPihakPertama'
                                value={formDataPenerimaan.pegawais[0].pegawai_NIP_pertama}
                                readOnly={true}
                            />
                            <Input
                                id="alamatSatkerPihakPertama"
                                placeholder="Masukkan Alamat Satker"
                                judul="Alamat Satker"
                                onChange={handleAlamatSatkerPertamaChange}
                                name='alamatSatkerPihakPertama'
                                value={formDataPenerimaan.pegawais[0].alamat_staker_pertama}
                                readOnly={isInspect}
                            />
                        </div>

                        {/* Kanan: Pihak Kedua */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-700 mb-2 border-b w-fit pb-1">Pihak Kedua</h3>
                            <DropdownInput
                                options={pihak}
                                placeholder='Pilih Nama'
                                judul='Nama Lengkap'
                                type='button'
                                value={formDataPenerimaan?.pegawais[1].pegawai_name_kedua}
                                onChange={handlePihakKeduaChange}
                                name='namaPihakKedua'
                                disabled={isInspect}
                            />
                            <Input
                                id="jabatanPihakKedua"
                                placeholder="Jabatan otomatis terisi"
                                judul="Jabatan"
                                onChange={handleChange}
                                name='jabatanPihakKedua'
                                value={formDataPenerimaan?.pegawais[1].jabatan_name_kedua}
                                readOnly={true}
                            />
                            <Input
                                id="NIPPihakKedua"
                                placeholder="NIP otomatis terisi"
                                judul="NIP"
                                type='number'
                                onChange={handleChange}
                                name='NIPPihakKedua'
                                value={formDataPenerimaan?.pegawais[1].pegawai_NIP_kedua}
                                readOnly={true}
                            />
                            <Input
                                id="alamatSatkerPihakKedua"
                                placeholder="Masukkan Alamat Satker"
                                judul="Alamat Satker"
                                onChange={handleAlamatSatkerKeduaChange}
                                name='alamatSatkerPihakKedua'
                                value={formDataPenerimaan?.pegawais[1].alamat_staker_kedua}
                                readOnly={isInspect}
                            />
                        </div>
                    </div>
                </div>

                {/* ROW UNTUK NO SURAT & KATEGORI (Agar rapi bersandingan) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SECTION 2: NOMOR SURAT */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <SectionHeader number="2" title="Nomor Surat" />
                        <Input
                            id="no_surat"
                            placeholder="Contoh: 903 /3.2c/35.08.01/PNJBs/II/2025"
                            judul="Nomor Surat"
                            onChange={handleChange}
                            name='no_surat'
                            value={formDataPenerimaan.no_surat}
                            readOnly={isInspect}
                        />
                        {formErrors.no_surat && (
                            <span className="text-red-500 text-xs mt-1 block">{formErrors.no_surat}</span>
                        )}
                    </div>

                    {/* SECTION 3: KATEGORI BARANG */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <SectionHeader number="3" title="Kategori Barang" />
                        <DropdownInput<Kategori>
                            placeholder="Pilih Kategori Barang"
                            options={kategoriOptions}
                            judul="Pilih Kategori Barang"
                            type="button"
                            onChange={handleKategoriChange}
                            value={formDataPenerimaan.category_name}
                            name="category_name"
                            disabled={isInspect}
                        />
                    </div>
                </div>

                {/* SECTION 4: DESKRIPSI */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <SectionHeader number="4" title="Deskripsi Barang" />
                    <div className="relative w-full">
                        <textarea
                            id="deskripsi"
                            placeholder='Tuliskan deskripsi atau catatan tambahan...'
                            className="text-[#6E7781] border border-gray-300 rounded-lg text-sm px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={handleChange}
                            name='deskripsi'
                            value={formDataPenerimaan.deskripsi}
                            disabled={isInspect}
                        ></textarea>
                    </div>
                </div>

                {/* SECTION 5: DATA BARANG BELANJA (TABLE) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <SectionHeader number="5" title="Data Barang Belanja">
                        {/* Tombol Tambah Barang ada di Header Kanan */}
                        {user?.role === ROLES.PPK && !isInspect && (
                            <button
                                onClick={handleAddClick}
                                type="button"
                                className="bg-[#007bff] hover:bg-[#0069d9] cursor-pointer text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                            >
                                <span className="text-lg leading-none">+</span> Tambah Barang
                            </button>
                        )}
                    </SectionHeader>

                    {/* Tabel Content */}
                    <div className="mt-4">
                        {!barang || barang.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                <ShopCartIcon className="w-16 h-16 text-gray-300 mb-3 opacity-50" />
                                <p className="text-gray-500 font-medium">Belum ada barang belanja</p>
                                <p className="text-gray-400 text-xs mt-1">Klik "Tambah Barang" untuk menambahkan barang</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full text-left table-fixed">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nama Barang</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center w-24">Satuan</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center w-24">Jumlah</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center">Harga</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center">Total Harga</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center w-32">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {barang.filter(item => item && item.stok_name).map((item, index) => (
                                            <tr key={item.stok_id || index} className="hover:bg-blue-50 transition-colors">
                                                <td className="py-3 px-4 text-gray-700 font-medium">{item.stok_name}</td>
                                                <td className="py-3 px-4 text-gray-600 text-center">{item.satuan_name}</td>
                                                <td className="py-3 px-4 text-gray-600 text-center">{item.quantity}</td>
                                                <td className="py-3 px-4 text-gray-600 text-center">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.price ?? 0)}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 text-center font-medium">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.total_harga ?? 0)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {user?.role === ROLES.TEKNIS ? (
                                                        <div className="flex justify-center gap-2">
                                                            {item.is_layak !== null ? (
                                                                item.is_layak ? (
                                                                    <div onClick={() => handleOpenLayakModal(item)} className="cursor-pointer group flex flex-col items-center">
                                                                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-bold border border-green-200">Layak ✎</span>
                                                                        <span className="text-[10px] text-green-600 mt-0.5">{(item as any).quantity_layak} unit</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-bold border border-red-200">Tidak Layak</span>
                                                                )
                                                            ) : (
                                                                <>
                                                                    <button type="button" onClick={() => handleOpenLayakModal(item)} className="text-green-600 hover:text-green-800 text-xs font-bold border border-green-600 px-2 py-1 rounded hover:bg-green-50 transition-colors">Layak</button>
                                                                    <button type="button" onClick={() => handleStatusTidakLayak(item.stok_id)} className="text-red-600 hover:text-red-800 text-xs font-bold border border-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors">Tidak</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteBarang(item.stok_id)}
                                                            className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-all"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* FOOTER ACTIONS */}
                        <div className='flex justify-end gap-4 mt-4'>
                            {isEdit && user?.role === ROLES.PPK && paramId && !isNaN(Number(paramId)) && (
                                <WarnButton onClick={handleDeleteClick} text='Hapus Data' type="button" />
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-[#41C654] hover:bg-[#36a847] text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>Menyimpan...</>
                                ) : (
                                    "Selesai"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </form>

            {/* --- MODAL COMPONENTS (Biarkan tetap di bawah) --- */}

            {/* Modal Konfirmasi Submit/Delete */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit} text={isDelete ? "Yakin ingin menghapus data ini?" : "Pastikan data sudah benar sebelum menyimpan."}>
                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        text={isSubmitting ? "Memproses..." : "Ya, Lanjutkan"}
                        type="button"
                        onClick={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit}
                        disabled={isSubmitting}
                        className={isDelete ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                    />
                    <WarnButton onClick={() => setIsModalOpen(false)} text="Batal" disabled={isSubmitting} />
                </div>
            </Modal>

            {/* Modal Input Kuantitas Layak */}
            <Modal isOpen={isQtyModalOpen} onClose={() => setIsQtyModalOpen(false)} onConfirm={handleSaveLayakQty} text="Konfirmasi Barang Layak">
                <div className="flex flex-col gap-4 w-full">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
                        Total stok tersedia: <span className="font-bold">{selectedItem?.max_qty} unit</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Masukkan Jumlah Layak</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value === '' ? '' : Number(e.target.value))}
                            min={1}
                            max={selectedItem?.max_qty}
                            placeholder="Contoh: 10"
                        />
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <ButtonConfirm text="Simpan Status" type="button" onClick={handleSaveLayakQty} />
                        <WarnButton onClick={() => setIsQtyModalOpen(false)} text="Batal" />
                    </div>
                </div>
            </Modal>

            {/* Modal Form Tambah Barang (Popup) */}
            <ModalTambahBarang
                isOpen={isAddBarangModalOpen}
                onClose={() => setIsAddBarangModalOpen(false)}
                onSave={handleSaveNewItem}
                categoryId={formDataPenerimaan.category_id}
            />
        </div>
    );
}