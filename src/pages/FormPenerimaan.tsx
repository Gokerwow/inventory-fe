import ShopCartIcon from '../assets/svgs/shopping-cart.svg?react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Status from '../components/status';
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';
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
import { updateBarangStatus, updateDetailBarangTerbayar } from '../services/barangService';
import { useToast } from '../hooks/useToast';
import { usePenerimaan } from '../hooks/usePenerimaan';
import { ROLES, type APIBarangBaru, type Detail_Barang, type Kategori, type SelectPihak } from '../constant/roles';
import { getKategoriList } from '../services/kategoriService';
import { getPegawaiSelect } from '../services/pegawaiService';
import axios from 'axios';
import ModalTambahBarang from './FormDataBarangBelanja';
import ConfirmModal from '../components/confirmModal';
import Loader from '../components/loader';
import Button from '../components/button';
import BackButton from '../components/backButton';
import TrashIcon from '../assets/svgs/trashIcon.svg?react'

// Tipe Mode yang tersedia
export type FormMode = 'create' | 'edit' | 'inspect' | 'finance' | 'preview';

interface FormPenerimaanProps {
    mode: FormMode;
}

export default function TambahPenerimaan({ mode }: FormPenerimaanProps) {
    const requiredRoles = useMemo(() => [ROLES.PPK, ROLES.TEKNIS, ROLES.ADMIN_GUDANG], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { id: paramId } = useParams();
    const { showToast } = useToast();

    // --- LOGIC HELPER BERDASARKAN MODE ---
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';
    const isInspectMode = mode === 'inspect';
    const isFinanceMode = mode === 'finance'; // Dahulu isView (Keuangan)
    const isPreviewMode = mode === 'preview'; // Mode baru (Hanya Lihat)

    // Helper untuk menentukan apakah Form Read Only
    const isReadOnly = isInspectMode || isFinanceMode || isPreviewMode;
    const canEditInputs = isCreateMode || isEditMode;

    const [isDelete, setIsDelete] = useState(false)
    const [payingItemId, setPayingItemId] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [pendingCategory, setPendingCategory] = useState<Kategori | null>(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // Modal Confirm Submit
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isAddBarangModalOpen, setIsAddBarangModalOpen] = useState(false);

    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [itemToPay, setItemToPay] = useState<number | null>(null);
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

                // Logic Fetch: Jika BUKAN create, maka ambil data detail
                if (!location.state?.keepLocalData && !isCreateMode && paramId) {
                    console.log('🔄 Fetching data penerimaan...');
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

                        const transformedBarang = detailData.detail_barang?.map((item: any) => {
                            return {
                                id: item.id,
                                stok_id: item.stok_id,
                                stok_name: item.nama_stok,
                                satuan_name: item.nama_satuan,
                                quantity: item.quantity,
                                price: Number(item.harga),
                                total_harga: Number(item.total_harga),
                                is_layak: item.is_layak,
                                is_paid: item.is_paid,
                                is_updating: false
                            };
                        }) || [];

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
    }, [mode, paramId, user?.role, checkAccess, hasAccess, showToast, location.state?.keepLocalData]);

    useEffect(() => {
        console.log('📊 Barang updated:', barang);
    }, [barang]);

    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleAddClick = () => {
        if (formDataPenerimaan.category_id === 0) {
            showToast("Pilih kategori barang terlebih dahulu!", "error");
            return;
        }
        setIsAddBarangModalOpen(true);
    }

    const handleSaveNewItem = (newItem: any) => {
        setBarang((prevItems) => {
            // 1. Cek apakah barang sudah ada di list?
            // Jika barang lama (punya ID), cek by ID. Jika barang baru (ID 0), cek by Nama.
            const existingItemIndex = prevItems.findIndex((item) => {
                if (newItem.stok_id !== 0) {
                    return item.stok_id === newItem.stok_id;
                } else {
                    // Cek case-insensitive untuk barang baru manual
                    return item.stok_name.toLowerCase() === newItem.stok_name.toLowerCase();
                }
            });

            // 2. Jika barang sudah ada (Index ketemu)
            if (existingItemIndex !== -1) {
                // Copy array agar tidak memutasi state langsung
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];

                // Tambahkan Quantity
                const newQuantity = existingItem.quantity + newItem.quantity;

                // Hitung Total Harga Baru 
                // (Opsional: Anda bisa memilih harga mana yang dipakai, di sini kita pakai harga terbaru yang diinput)
                const newTotalHarga = newQuantity * newItem.price;

                // Update item yang ada
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                    price: newItem.price, // Update harga ke yang paling baru (opsional)
                    total_harga: newTotalHarga,
                };

                return updatedItems;
            }

            // 3. Jika barang belum ada, tambahkan sebagai baris baru
            return [...prevItems, newItem];
        });
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


    const handleSetStatus = async (detailId: number, isLayak: boolean) => {
        if (!paramId) return;

        setBarang(prev => prev.map(item =>
            item.id === detailId ? { ...item, is_updating: true } : item
        ));

        try {
            await updateBarangStatus(Number(paramId), detailId, isLayak);

            setBarang(prev => prev.map(item => {
                if (item.id === detailId) {
                    return {
                        ...item,
                        is_layak: isLayak,
                        is_updating: false
                    };
                }
                return item;
            }));

            if (isLayak) showToast("Barang ditandai LAYAK", "success");
            else showToast("Barang ditandai TIDAK LAYAK", "error");

        } catch (err) {
            console.error(err);
            setBarang(prev => prev.map(item =>
                item.id === detailId ? { ...item, is_updating: false } : item
            ));
            showToast("Gagal menyimpan status", "error");
        }
    };

    const handleSaveInspection = () => {
        showToast("Progres pemeriksaan tersimpan.", "success");
        navigate(PATHS.PENERIMAAN.INDEX);
    };

    const handlePayClick = (detailId: number) => {
        setItemToPay(detailId);
        setIsPayModalOpen(true);
    };

    const handleConfirmPay = async () => {
        if (!itemToPay || !paramId) return;

        setIsSubmitting(true);
        setPayingItemId(itemToPay);

        try {
            const penerimaanId = Number(paramId);
            await updateDetailBarangTerbayar(penerimaanId, itemToPay);

            setBarang(prev => prev.map(item =>
                item.id === itemToPay ? { ...item, is_paid: true } : item
            ));

            showToast("Item berhasil ditandai terbayar!", "success");
        } catch (error) {
            console.error(error);
            showToast("Gagal mengubah status pembayaran.", "error");
        } finally {
            setPayingItemId(null);
            setIsSubmitting(false);
            setIsPayModalOpen(false);
            setItemToPay(null);
        }
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

        // Jika kategori yang dipilih sama, tidak perlu lakukan apa-apa
        if (newCategoryId === oldCategoryId) return;

        if (barang.length > 0) {
            // 1. Simpan kategori yang INGIN dipilih ke state sementara
            setPendingCategory(option);
            // 2. Buka Modal Konfirmasi
            setIsResetModalOpen(true);
        } else {
            // 3. Jika keranjang kosong, langsung ganti kategori tanpa modal
            updateCategoryData(option);
        }
    };

    const handleConfirmReset = () => {
        // 1. Kosongkan keranjang
        setBarang([]);

        // 2. Update kategori menggunakan data yang disimpan di state sementara
        updateCategoryData(pendingCategory);

        // 3. Tampilkan notifikasi dan tutup modal
        showToast('Keranjang belanja telah dikosongkan karena pergantian kategori.', 'success');
        setIsResetModalOpen(false);
        setPendingCategory(null);
    };

    // Helper function agar tidak menulis ulang logika update state form
    const updateCategoryData = (option: Kategori | null) => {
        setFormDataPenerimaan(prevState => ({
            ...prevState,
            category_id: option?.id ?? 0,
            category_name: option?.name ?? ''
        }));
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

        // --- VALIDASI UMUM (Kecuali Preview) ---
        if (isPreviewMode) {
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        if (barang.length === 0) {
            showToast("Tambahkan minimal 1 barang belanja!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        try {
            // --- LOGIC PER MODE ---

            if (isInspectMode) {
                // --- MODE: INSPEKSI (TIM TEKNIS) ---
                const allMarked = barang.every(item => 'is_layak' in item && item.is_layak !== null);
                if (!allMarked) {
                    showToast("Harap tandai semua barang sebelum konfirmasi selesai.", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                await confirmPenerimaan(Number(paramId));
                showToast("Penerimaan berhasil dikonfirmasi!", "success");
                navigate(PATHS.PENERIMAAN.INDEX);

            } else if (isFinanceMode) {
                // --- MODE: KEUANGAN (VIEW/PAY) ---
                const allPaid = barang.every(item => (item as any).is_paid === true);

                if (allPaid) {
                    showToast("Semua barang telah terbayar! Status dokumen selesai.", "success");
                } else {
                    showToast("Data pembayaran berhasil disimpan.", "success");
                }

                setIsModalOpen(false);
                setIsSubmitting(false);
                navigate(PATHS.STOK_BARANG.INDEX);
                return;

            } else if (isCreateMode || isEditMode) {
                // --- MODE: CREATE / EDIT (TIM PPK) ---

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
                    detail_barangs: barang.map((item): Detail_Barang | APIBarangBaru => {
                        if ('name' in item || ('stok_id' in item && item.stok_id === 0)) {
                            return {
                                name: 'name' in item ? item.name : item.stok_name || '',
                                satuan_name: item.satuan_name || '',
                                minimum_stok: 'minimum_stok' in item ? item.minimum_stok : (item.minimum_stok || 0),
                                quantity: item.quantity,
                                harga: 'harga' in item ? item.harga : item.price,
                            };
                        } else {
                            return {
                                stok_id: item.stok_id,
                                quantity: item.quantity,
                                harga: item.price,
                            };
                        }
                    }),
                    pegawais: listPegawai
                };

                console.log('📤 Data final untuk submit:', dataFinal);

                if (isEditMode) {
                    const penerimaanId = Number(paramId);
                    if (!penerimaanId) throw new Error("ID Penerimaan tidak ditemukan.");

                    await editPenerimaan(penerimaanId, dataFinal);
                    showToast("Berhasil mengupdate data penerimaan!", "success");
                } else {
                    await createPenerimaan(dataFinal);
                    showToast("Berhasil membuat data penerimaan!", "success");
                }

                navigate(PATHS.PENERIMAAN.INDEX);
            }

            setIsModalOpen(false);
            setIsSubmitting(false);

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
                else if (status === 401) showToast("Sesi habis. Silakan login ulang.", "error");
                else if (status === 404) showToast("Data referensi tidak ditemukan (404).", "error");
                else if (status >= 500) showToast("Terjadi kesalahan server. Hubungi admin.", "error");
                else showToast(data.message || `Terjadi kesalahan (${status})`, "error");
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
            showToast("Data Penerimaan berhasil dihapus", "success");
            navigate(PATHS.PENERIMAAN.INDEX);
        } catch (error) {
            console.error(error);
            showToast("Gagal menghapus data", "error");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    }

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="bg-white p-8 rounded-xl flex justify-center items-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

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

    const totalSemua = barang
        .filter(item => 'stok_name' in item)
        .reduce((acc, item) => acc + ((item as Detail_Barang).total_harga ?? 0), 0);

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER HALAMAN (Biru) */}
            <div className="bg-[#005DB9] rounded-xl p-6 text-center text-white shadow-md relative">
                <BackButton className="absolute left-6 top-1/2 -translate-y-1/2" />
                <div className='text-center'>
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        {isEditMode ? "EDIT DATA PENERIMAAN" :
                            isFinanceMode ? "DETAIL PEMBAYARAN" :
                                isInspectMode ? "PEMERIKSAAN BARANG" :
                                    isPreviewMode ? "DETAIL PENERIMAAN" :
                                        "FORM DATA BARANG BELANJA"}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1 opacity-90">Dokumen Resmi RSD Balung</p>
                </div>
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
                                disabled={isReadOnly}
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
                                readOnly={isReadOnly}
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
                                disabled={isReadOnly}
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
                                readOnly={isReadOnly}
                            />
                        </div>
                    </div>
                </div>

                {/* ROW UNTUK NO SURAT & KATEGORI */}
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
                            readOnly={isReadOnly}
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
                            disabled={isReadOnly}
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
                            disabled={isReadOnly}
                        ></textarea>
                    </div>
                </div>

                {/* SECTION 5: DATA BARANG BELANJA (TABLE) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <SectionHeader number="5" title="Data Barang Belanja">
                        {/* Tombol Tambah Barang hanya untuk PPK & Mode Edit/Create */}
                        {user?.role === ROLES.PPK && canEditInputs && (
                            <Button
                                variant="primary"
                                onClick={handleAddClick}
                                className="flex items-center gap-2"
                                type='button'
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Barang
                            </Button>
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
                                        {barang
                                            .filter(item => 'stok_name' in item)
                                            .map((item, index) => {
                                                const detailItem = item as Detail_Barang;
                                                return (
                                                    <tr key={detailItem.stok_id || index} className="hover:bg-blue-50 transition-colors">
                                                        <td className="py-3 px-4 text-gray-700 font-medium">{detailItem.stok_name}</td>
                                                        <td className="py-3 px-4 text-gray-600 text-center">{detailItem.satuan_name}</td>
                                                        <td className="py-3 px-4 text-gray-600 text-center">{detailItem.quantity}</td>
                                                        <td className="py-3 px-4 text-gray-600 text-center">
                                                            Rp {new Intl.NumberFormat('id-ID').format(detailItem.price ?? 0)}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600 text-center font-medium">
                                                            Rp {new Intl.NumberFormat('id-ID').format(detailItem.total_harga ?? 0)}
                                                        </td>

                                                        <td className="py-3 px-4 text-center">
                                                            {isFinanceMode ? (
                                                                // --- MODE 1: FINANCE (Pembayaran) ---
                                                                detailItem.is_paid ? (
                                                                    <Status label="Lunas" value='success' />
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="primary"
                                                                        type='button'
                                                                        onClick={() => handlePayClick(detailItem.id as number)}
                                                                        isLoading={payingItemId === detailItem.id}
                                                                    >
                                                                        Bayar
                                                                    </Button>
                                                                )
                                                            ) : isInspectMode ? (
                                                                // --- MODE 2: INSPECT (Penerimaan) ---
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="success"
                                                                        type="button"
                                                                        onClick={() => handleSetStatus(detailItem.id, true)}
                                                                        isLoading={detailItem.is_updating}
                                                                        disabled={detailItem.is_layak === true}
                                                                        className={`font-bold transition-all ${detailItem.is_layak === true
                                                                            ? "bg-green-700! ring-4 ring-green-300 shadow-lg scale-110 disabled:text-white"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {detailItem.is_layak === true ? "✓ LAYAK" : "✓ Layak"}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="danger"
                                                                        type="button"
                                                                        onClick={() => handleSetStatus(detailItem.id, false)}
                                                                        isLoading={detailItem.is_updating}
                                                                        disabled={detailItem.is_layak === true}
                                                                        className={`font-bold transition-all ${detailItem.is_layak === false
                                                                            ? "bg-red-700! ring-4 ring-red-300 shadow-lg scale-110 disabled:text-white"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {detailItem.is_layak === false ? "✕ TIDAK" : "✕ Tidak"}
                                                                    </Button>
                                                                </div>
                                                            ) : isPreviewMode ? (
                                                                // --- MODE 3: PREVIEW (View Only) ---
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                // --- MODE 4: EDIT/CREATE (Default) ---
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteBarang(detailItem.stok_id)}
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
                                                                >
                                                                    <TrashIcon className='w-5 h-5' />
                                                                    Hapus
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                    {/* --- BAGIAN TOTAL (TFOOT) --- */}
                                    <tfoot className="bg-blue-50 border-t-2 border-blue-100 font-bold text-gray-700">
                                        <tr>
                                            <td colSpan={4} className="py-4 px-4">
                                                Total Semua
                                            </td>
                                            <td className="py-4 px-4 text-center text-blue-600">
                                                Rp {new Intl.NumberFormat('id-ID').format(totalSemua)}
                                            </td>
                                            <td className="py-4 px-4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        {/* FOOTER ACTIONS */}
                        <div className='flex justify-end gap-4 mt-4'>
                            {/* Tombol Hapus (Hanya Edit & PPK) */}
                            {isEditMode && user?.role === ROLES.PPK && paramId && (
                                <Button
                                    variant='danger'
                                    onClick={handleDeleteClick}
                                    type='button'
                                >
                                    Hapus Data
                                </Button>
                            )}

                            {/* Tombol Simpan Progress (Inspect) */}
                            {isInspectMode && (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleSaveInspection}
                                    isLoading={isSubmitting}
                                    className="shadow-lg font-bold min-w-[120px]"
                                >
                                    Simpan
                                </Button>
                            )}

                            {/* Tombol Utama (Selesai/Submit) - Hidden on Preview */}
                            {(() => {
                                // Hitung status lunas secara realtime
                                const isAllPaid = barang.length > 0 && barang.every((item: any) => item.is_paid);

                                // Kondisi untuk menyembunyikan tombol:
                                // 1. Jika mode Preview (Hidden)
                                // 2. ATAU Jika mode Finance DAN semua sudah lunas (Hidden)
                                const shouldHideButton = isPreviewMode || (isFinanceMode && isAllPaid);

                                if (!shouldHideButton) {
                                    return (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`bg-[#41C654] hover:bg-[#36a847] text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? (
                                                <>Memproses...</>
                                            ) : (
                                                isFinanceMode ? "Simpan" :
                                                    isInspectMode ? "Konfirmasi Selesai" :
                                                        isEditMode ? "Simpan Perubahan" :
                                                            "Selesai"
                                            )}
                                        </Button>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                </div>

            </form>

            {/* --- MODAL COMPONENTS --- */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit}
                isLoading={isSubmitting}
                text={isDelete ? "Apa anda yakin ingin menghapus data ini?" : isEditMode ? "Apa anda yakin ingin menyimpan perubahan ini?" : "Apa anda yakin untuk membuat penerimaan?"}
            />

            <ConfirmModal
                isOpen={isResetModalOpen}
                onClose={() => {
                    setIsResetModalOpen(false);
                    setPendingCategory(null); // Reset pending jika user batal
                }}
                onConfirm={handleConfirmReset}
                title="Ganti Kategori?"
                text="Mengganti kategori akan MENGHAPUS semua barang yang sudah ada di keranjang belanja Anda. Apakah Anda yakin ingin melanjutkan?"
                confirmText="Ya, Ganti & Hapus Barang"
                cancelText="Batal"
                isLoading={false} // Atau sesuaikan jika ada proses loading
            />

            <ConfirmModal
                isOpen={isPayModalOpen}
                onClose={() => {
                    setIsPayModalOpen(false);
                    setItemToPay(null);
                }}
                onConfirm={handleConfirmPay}
                isLoading={isSubmitting}
                text="Apakah Anda yakin ingin menandai item ini sebagai TERBAYAR? Status tidak dapat dikembalikan."
            />

            <ModalTambahBarang
                isOpen={isAddBarangModalOpen}
                onClose={() => setIsAddBarangModalOpen(false)}
                onSave={handleSaveNewItem}
                categoryId={formDataPenerimaan.category_id}
            />
        </div >
    );
}