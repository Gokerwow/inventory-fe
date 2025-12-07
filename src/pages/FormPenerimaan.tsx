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
import { updateBarangStatus, updateDetailBarangTerbayar } from '../services/barangService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/modal';
import { usePenerimaan } from '../hooks/usePenerimaan';
import { ROLES, type APIBarangBaru, type Detail_Barang, type Kategori, type SelectPihak } from '../constant/roles';
import { getKategoriList } from '../services/kategoriService';
import { getPegawaiSelect } from '../services/pegawaiService';
import axios from 'axios';
import ModalTambahBarang from './FormDataBarangBelanja';
import ConfirmModal from '../components/confirmModal';

// Interface tambahan untuk menghandle item yang dipilih di modal
interface SelectedItemState {
    id: number;       // Tambahkan ini (ID Detail Barang)
    stok_id: number;
    max_qty: number;
}

export default function TambahPenerimaan({ isEdit = false, isInspect = false, isView = false }: { isEdit?: boolean, isInspect?: boolean, isView?: boolean }) {
    const requiredRoles = useMemo(() => [ROLES.PPK, ROLES.TEKNIS, ROLES.ADMIN_GUDANG], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { id: paramId } = useParams();
    const { showToast } = useToast();
    const [isDelete, setIsDelete] = useState(false)
    const [payingItemId, setPayingItemId] = useState<number | null>(null);
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

                if (!location.state?.keepLocalData && (isEdit || isInspect || isView) && paramId) {
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

                        const transformedBarang = detailData.detail_barang?.map(item => {
                            // Logika menentukan status Layak/Tidak Layak dari data Backend
                            // Backend kirim: quantity_layak, quantity_tidak_layak, is_checked

                            let isLayakStatus = null;

                            // Jika sudah diperiksa (is_checked / quantity_layak ada isinya)
                            if (item.quantity_layak > 0) {
                                isLayakStatus = true;
                            } else if (item.quantity_tidak_layak > 0) {
                                isLayakStatus = false;
                            } else if (item.is_checked) {
                                // Fallback jika checked tapi qty 0 (mungkin dianggap tidak layak)
                                isLayakStatus = false;
                            }

                            return {
                                id: item.id,
                                stok_id: item.stok_id,
                                stok_name: item.nama_stok,
                                satuan_name: item.nama_satuan,
                                quantity: item.quantity,
                                price: Number(item.harga), // Pastikan jadi number
                                total_harga: Number(item.total_harga),

                                // State Frontend
                                is_layak: isLayakStatus,
                                is_paid: item.is_paid,
                                quantity_layak: item.quantity_layak // Ambil langsung dari backend
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
    }, [isEdit, isInspect, isView, paramId, user?.role, checkAccess, hasAccess, showToast, location.state?.keepLocalData]);

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
    // Ubah parameter agar menerima objek item utuh, bukan cuma ID
    const handleStatusTidakLayak = async (item: any) => {
        if (!paramId) return;

        // Optional: Loading indicator kecil bisa ditambahkan jika perlu
        try {
            // Panggil API: Quantity 0 artinya Tidak Layak
            await updateBarangStatus(Number(paramId), item.id, 0);

            // Jika API sukses, baru update UI Lokal
            setBarang(prevBarang =>
                prevBarang.map(b => {
                    return b.stok_id === item.stok_id
                        ? { ...b, is_layak: false, quantity_layak: 0 }
                        : b;
                })
            );
            showToast(`Barang ditandai Tidak Layak`, 'success');
        } catch (err) {
            console.error(err);
            showToast("Gagal update status barang", "error");
        }
    };

    // ✅ HANDLER MEMBUKA MODAL "LAYAK"
    const handleOpenLayakModal = (item: any) => {
        setSelectedItem({
            id: item.id, // Simpan ID detail barang
            stok_id: item.stok_id,
            max_qty: item.quantity
        });
        setQtyInput(item.quantity);
        setIsQtyModalOpen(true);
    };

    // Ganti fungsi handleSaveLayakQty yang lama dengan ini
    const handleSaveLayakQty = async () => {
        if (!selectedItem || !paramId) return;

        // Konversi input ke number
        const finalQty = qtyInput === '' ? 0 : Number(qtyInput);

        // Validasi Max
        if (finalQty > selectedItem.max_qty) {
            showToast(`Jumlah melebihi total barang (${selectedItem.max_qty})`, "error");
            return;
        }

        // Validasi Min (Boleh 0, karena 0 = Tidak Layak)
        if (finalQty < 0) {
            showToast("Jumlah tidak boleh minus", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            // LOGIKA BARU: 
            // Jika quantity 0, anggap statusnya "Tidak Layak" (false di backend?)
            // Atau tergantung API Anda. Biasanya API menerima status boolean + qty.

            // Asumsi logic UI:
            // Jika 0 -> anggap Tidak Layak
            // Jika > 0 -> anggap Layak

            // Panggil API (Logic quantity 0 = Tidak Layak sudah umum di backend penerimaan)
            await updateBarangStatus(Number(paramId), selectedItem.id, finalQty);

            // Update UI Lokal
            setBarang(prevBarang =>
                prevBarang.map(item => {
                    if (item.stok_id === selectedItem.stok_id) {
                        return {
                            ...item,
                            // Jika 0, is_layak jadi false (Merah). Jika > 0, true (Hijau)
                            is_layak: finalQty > 0,
                            quantity_layak: finalQty
                        };
                    }
                    return item;
                })
            );

            setIsQtyModalOpen(false);
            setSelectedItem(null);

            if (finalQty === 0) {
                showToast("Status diubah menjadi Tidak Layak", "success");
            } else {
                showToast(`Barang ditandai Layak (${finalQty} item)`, 'success');
            }

        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response) {
                showToast(err.response.data.message || "Gagal menyimpan status", "error");
            } else {
                showToast("Gagal menyimpan status kelayakan", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveInspection = () => {
        // Tidak perlu validasi form lengkap, karena hanya menyimpan progres cek barang
        // Data barang sudah tersimpan atomic via Modal
        showToast("Progres pemeriksaan tersimpan.", "success");
        navigate(PATHS.PENERIMAAN.INDEX);
    };

    // ✅ NEW: Handler Pembayaran Langsung (Tanpa Modal Konfirmasi Global)
    const handleDirectPay = async (detailId: number) => {
        // Mencegah double click saat sedang loading
        if (payingItemId === detailId) return;

        // Konfirmasi browser sederhana (Opsional, tapi disarankan)
        const isConfirmed = window.confirm("Apakah Anda yakin ingin menandai item ini sebagai TERBAYAR?");
        if (!isConfirmed) return;

        const penerimaanId = Number(paramId);
        setPayingItemId(detailId); // Set loading state untuk item ini

        try {
            await updateDetailBarangTerbayar(penerimaanId, detailId);

            // Update state lokal biar langsung berubah jadi hijau
            setBarang(prev => prev.map(item =>
                item.id === detailId ? { ...item, is_paid: true } : item
            ));

            showToast("Item berhasil ditandai terbayar!", "success");
        } catch (error) {
            console.error(error);
            showToast("Gagal mengubah status pembayaran.", "error");
        } finally {
            setPayingItemId(null); // Matikan loading state
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
                // --- MODE INSPEKSI (TIM TEKNIS) ---
                const allMarked = barang.every(item => 'is_layak' in item && item.is_layak !== null);
                if (!allMarked) {
                    showToast("Harap tandai semua barang sebelum konfirmasi selesai.", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                await confirmPenerimaan(Number(paramId));
                showToast("Penerimaan berhasil dikonfirmasi!", "success");


            } else if (isView) {
                // --- ALUR: MODE VIEW (KEUANGAN) ---

                // Cek apakah SEMUA barang sudah berstatus terbayar
                // .every() akan return true hanya jika semua item memenuhi kondisi
                const allPaid = barang.every(item => (item as any).is_paid === true);

                if (allPaid) {
                    // Skenario: Semua barang LUNAS
                    // Jika Anda perlu memanggil API untuk mengubah status Dokumen Penerimaan jadi 'Lunas', lakukan disini.
                    // await updateStatusDokumenLunas(Number(paramId)); 

                    showToast("Semua barang telah terbayar! Status dokumen selesai.", "success");
                } else {
                    // Skenario: Masih ada yang belum dibayar
                    showToast("Data pembayaran berhasil disimpan.", "success");
                }
            }

            else {
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
                    detail_barangs: barang.map((item): Detail_Barang | APIBarangBaru => {
                        // Cek apakah barang BARU (stok_id === 0 atau tidak ada stok_id)
                        if ('name' in item || ('stok_id' in item && item.stok_id === 0)) {
                            // Item adalah APIBarangBaru
                            return {
                                name: 'name' in item ? item.name : item.stok_name || '',
                                satuan_name: item.satuan_name || '',
                                minimum_stok: 'minimum_stok' in item ? item.minimum_stok : (item.minimum_stok || 0),
                                quantity: item.quantity,
                                harga: 'harga' in item ? item.harga : item.price,
                            };
                        } else {
                            // Item adalah barang existing (stok_id !== 0)
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
            navigate(isView ? PATHS.STOK_BARANG : PATHS.PENERIMAAN.INDEX);

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
                    {isEdit ? "EDIT DATA PENERIMAAN" :
                        isView ? "DETAIL DATA PENERIMAAN" :
                            "FORM DATA BARANG BELANJA"}
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
                                disabled={isInspect || isView}
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
                                readOnly={isInspect || isView}
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
                                disabled={isInspect || isView}
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
                                readOnly={isInspect || isView}
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
                            readOnly={isInspect || isView}
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
                            disabled={isInspect || isView}
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
                            disabled={isInspect || isView}
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
                                        {barang
                                            .filter(item => 'stok_name' in item)
                                            .map((item, index) => {
                                                const detailItem = item as Detail_Barang;
                                                // Ambil quantity layak, jika undefined/null anggap 0
                                                const qtyLayak = (detailItem as any).quantity_layak ?? 0;

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

                                                        {/* ✅ LOGIKA KOLOM AKSI */}
                                                        <td className="py-3 px-4 text-center">
                                                            {isView ? (
                                                                // MODE VIEW (Pembayaran)
                                                                (detailItem as any).is_paid ? (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                                        ✓ Lunas
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDirectPay(detailItem.id as number)}
                                                                        disabled={payingItemId === detailItem.id}
                                                                        className={`text-white font-medium rounded-lg text-xs px-3 py-1.5 focus:outline-none transition-all ${payingItemId === detailItem.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'}`}
                                                                    >
                                                                        {payingItemId === detailItem.id ? 'Proses...' : 'Bayar'}
                                                                    </button>
                                                                )
                                                            ) : isInspect ? (
                                                                // MODE INSPECT (Penerimaan)
                                                                <div className="flex justify-center gap-2">
                                                                    {detailItem.is_layak !== null ? (
                                                                        // JIKA SUDAH ADA STATUS (Entah Layak/Tidak)
                                                                        <div
                                                                            onClick={() => handleOpenLayakModal(detailItem)}
                                                                            className="cursor-pointer group flex flex-col items-center hover:opacity-80 transition-opacity"
                                                                            title="Klik untuk mengubah jumlah"
                                                                        >
                                                                            {detailItem.is_layak ? (
                                                                                // STATUS HIJAU (LAYAK)
                                                                                <>
                                                                                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-bold border border-green-200 whitespace-nowrap flex items-center gap-1">
                                                                                        Layak: {qtyLayak} <span className="text-[10px]">✎</span>
                                                                                    </span>
                                                                                    {qtyLayak < detailItem.quantity && (
                                                                                        <span className="text-[10px] text-red-500 font-medium">
                                                                                            (Pending: {detailItem.quantity - qtyLayak})
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                // STATUS MERAH (TIDAK LAYAK) - SEKARANG BISA DIKLIK JUGA
                                                                                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-bold border border-red-200 flex items-center gap-1">
                                                                                    Tidak Layak <span className="text-[10px]">✎</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        // JIKA BELUM ADA STATUS (TOMBOL AWAL)
                                                                        <>
                                                                            <button type="button" onClick={() => handleOpenLayakModal(detailItem)} className="text-green-600 border border-green-600 px-2 py-1 rounded hover:bg-green-50 text-xs">Layak</button>
                                                                            <button type="button" onClick={() => handleStatusTidakLayak(detailItem)} className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50 text-xs">Tidak</button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                // MODE EDIT/CREATE
                                                                <button type="button" onClick={() => handleDeleteBarang(detailItem.stok_id)} className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-all">Hapus</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* FOOTER ACTIONS */}
                        <div className='flex justify-end gap-4 mt-4'>
                            {/* Tombol Hapus (Hanya Edit & PPK) */}
                            {isEdit && user?.role === ROLES.PPK && paramId && (
                                <WarnButton onClick={handleDeleteClick} text='Hapus Data' type="button" />
                            )}

                            {/* ✅ TOMBOL "SIMPAN" (Draft) -> HANYA MUNCUL DI MODE INSPECT */}
                            {isInspect && (
                                <button
                                    type="button"
                                    onClick={handleSaveInspection}
                                    disabled={isSubmitting}
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    Simpan
                                </button>
                            )}

                            {/* ✅ TOMBOL UTAMA (Hijau) */}
                            <button
                                type="submit" // Trigger handleConfirmSubmit via form submit
                                disabled={isSubmitting}
                                className={`bg-[#41C654] hover:bg-[#36a847] text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>Memproses...</>
                                ) : (
                                    isView ? "Kembali" : (isInspect ? "Konfirmasi Selesai" : (isEdit ? "Simpan Perubahan" : "Selesai"))
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </form>

            {/* --- MODAL COMPONENTS (Biarkan tetap di bawah) --- */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit}
                isLoading={isSubmitting}
                text={isDelete ? "Apa anda yakin ingin menghapus data ini?" : "Apa anda yakin ingin mengubah data belanja?"}
            />

            {/* Modal Input Kuantitas Layak */}
            <Modal
                isOpen={isQtyModalOpen}
                onClose={() => setIsQtyModalOpen(false)}
                title="Update Kelayakan Barang"
                maxWidth="max-w-md"
            >
                <div className="flex flex-col gap-4 w-full p-6">
                    {/* Info Box */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm flex justify-between items-center">
                        <span>Total stok tersedia:</span>
                        <span className="font-bold text-lg">{selectedItem?.max_qty} unit</span>
                    </div>

                    {/* Shortcut Buttons (OPTIMALISASI BARU) */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setQtyInput(selectedItem?.max_qty || 0)}
                            className="flex-1 bg-green-50 text-green-700 border border-green-200 py-1 px-2 rounded text-xs font-semibold hover:bg-green-100 transition-colors"
                        >
                            Set Semua Layak ({selectedItem?.max_qty})
                        </button>
                        <button
                            type="button"
                            onClick={() => setQtyInput(0)}
                            className="flex-1 bg-red-50 text-red-700 border border-red-200 py-1 px-2 rounded text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                            Set Tidak Layak (0)
                        </button>
                    </div>

                    {/* Input Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Jumlah Layak Diterima</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-bold text-lg text-center"
                                value={qtyInput}
                                onChange={(e) => setQtyInput(e.target.value === '' ? '' : Number(e.target.value))}
                                min={0}
                                max={selectedItem?.max_qty}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveLayakQty();
                                }}
                                autoFocus // Agar user bisa langsung ketik saat modal muncul
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Unit</span>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Isi <b>0</b> untuk menandai barang sebagai <b>Tidak Layak</b>.
                        </p>
                    </div>

                    <div className="flex gap-3 items-center justify-end mt-4 border-t pt-4">
                        <WarnButton
                            onClick={() => setIsQtyModalOpen(false)}
                            text="Batal"
                        />
                        <ButtonConfirm
                            text="Simpan Perubahan"
                            type="button"
                            onClick={handleSaveLayakQty}
                        />
                    </div>
                </div>
            </Modal>

            {/* Modal Form Tambah Barang (Popup) */}
            <ModalTambahBarang
                isOpen={isAddBarangModalOpen}
                onClose={() => setIsAddBarangModalOpen(false)
                }
                onSave={handleSaveNewItem}
                categoryId={formDataPenerimaan.category_id}
            />
        </div >
    );
}