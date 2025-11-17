import UserIcon from '../assets/user-square.svg?react'
import ShopCartIcon from '../assets/shopCart.svg?react'
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

export default function TambahPenerimaan({ isEdit = false, isInspect = false }: { isEdit?: boolean, isInspect?: boolean }) {
    const requiredRoles = useMemo(() => [ROLES.PPK, ROLES.TEKNIS], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { id: paramId } = useParams();
    const { showToast } = useToast();
    const [isDelete, setIsDelete] = useState(false)

    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    console.log(isEdit)

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { barang, setBarang, formDataPenerimaan, setFormDataPenerimaan } = usePenerimaan()
    const [kategoriOptions, setKategoriOptions] = useState<Kategori[]>([]);

    const [pihak, setPihak] = useState<SelectPihak[]>([])

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        // ❌ HAPUS ATAU PINDAHKAN LOGIKA INI
        // if (location.state?.keepLocalData) {
        //     console.log('🛑 Skip fetch API karena baru menambah barang lokal');
        //     return;
        // }

        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // ✅ 1. SELALU AMBIL MASTER DATA (Kategori & Pihak)
                // Agar dropdown tetap terisi meskipun kembali dari halaman tambah barang
                const [kategoriData, pihakData] = await Promise.all([
                    getKategoriList(),
                    getPegawaiSelect()
                ]);

                setKategoriOptions(kategoriData);
                setPihak(pihakData);

                // ✅ 2. CEK KONDISI UNTUK FETCH DETAIL PENERIMAAN
                // Hanya fetch detail jika BUKAN dari 'keepLocalData' (bukan kembali dari form barang)
                if (!location.state?.keepLocalData && (isEdit || isInspect) && paramId) {
                    console.log('🔄 Fetching data penerimaan untuk edit...');
                    const id = Number(paramId);
                    const detailData = await getPenerimaanDetail(id);

                    if (detailData) {
                        console.log('📦 Detail barang dari API:', detailData.detail_barang);

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
                            is_layak: item.is_layak || null
                        })) || [];

                        setBarang(transformedBarang);
                    }
                } else if (location.state?.keepLocalData) {
                    console.log('🛑 Skip fetch DETAIL API karena keepLocalData aktif (mempertahankan data inputan user)');
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

    // ✅ Separate useEffect untuk debug barang
    useEffect(() => {
        console.log('📊 Barang updated:', barang);
    }, [barang]);

    if (!hasAccess(user?.role)) {
        return null;
    }

    // ✅ FIXED: Handler untuk navigasi ke form barang
    const handleAddClick = () => {
        console.log('➕ Navigasi ke form barang belanja');
        console.log('📊 Barang yang sudah ada:', barang.length);

        navigate(PATHS.PENERIMAAN.BARANG_BELANJA, {
            state: {
                isEdit: isEdit, // ✅ GUNAKAN isEdit LANGSUNG
                returnUrl: window.location.pathname
            }
        });
    }

    // ✅ TAMBAHAN: Handler untuk hapus barang
    const handleDeleteBarang = (stokId: number) => {
        // Cari barang yang akan dihapus
        const itemToDelete = barang.find(item => item.stok_id === stokId);

        // Jika barang punya ID (artinya dari database), simpan ke deletedIds
        if (itemToDelete && itemToDelete.id) {
            setDeletedIds(prev => [...prev, itemToDelete.id]);
            console.log(`🗑️ Menandai barang ID ${itemToDelete.id} untuk dihapus dari DB`);
        }

        // Hapus dari tampilan (state lokal)
        setBarang(prev => prev.filter(item => item.stok_id !== stokId));
        showToast('Barang berhasil dihapus', 'success');
    };

    // ✅ PERUBAHAN: Handler untuk status barang (Tim Teknis)
    const handleStatusChange = (id: number, status: boolean) => {
        setBarang(prevBarang =>
            prevBarang.map(item => {
                console.log(`✅ Barang ID ${item.stok_id} ditandai. Status baru: ${item.is_layak}`);
                return item.stok_id === id ? { ...item, is_layak: status } : item;
            })
        );
        showToast(`Barang ditandai ${status}`, 'success');
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

        // 1. Cek apakah kategori benar-benar berubah
        if (newCategoryId === oldCategoryId) {
            return; // Tidak ada perubahan, jangan lakukan apa-apa
        }

        // 2. Cek apakah keranjang (barang) sudah ada isinya
        if (barang.length > 0) {
            // 3. Jika ada isi, tampilkan konfirmasi
            const isConfirmed = window.confirm(
                "Mengganti kategori akan MENGHAPUS semua barang di keranjang belanja Anda. Lanjutkan?"
            );

            if (isConfirmed) {
                // 4. Jika user setuju:
                // - Hapus semua barang dari context
                setBarang([]);
                // - Update kategori di form
                setFormDataPenerimaan(prevState => ({
                    ...prevState,
                    category_id: newCategoryId,
                    category_name: option?.name ?? ''
                }));
                // - Beri notifikasi (menggunakan useToast Anda)
                showToast('Keranjang belanja telah dikosongkan.', 'success');
            }
        } else {
            // 6. Jika keranjang kosong, langsung update kategori seperti biasa
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
                    pegawai_id_kedua: 0, // dari dropdown pihak
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
                    pegawai_id_pertama: 0, // dari dropdown pihak
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

    // ✅ Handler pihak - update formDataPenerimaan
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
                    pegawai_id_kedua: 0, // dari dropdown pihak
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
                    pegawai_id_pertama: 0, // dari dropdown pihak
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

        // Validasi: Pastikan ada barang (berlaku untuk semua mode)
        if (barang.length === 0) {
            showToast("Tambahkan minimal 1 barang belanja!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        try {
            if (isInspect) {
                // --- ALUR 1: MODE INSPEKSI (TIM TEKNIS) ---

                // 1. Validasi: Pastikan semua barang sudah ditandai
                const allMarked = barang.every(item => item.is_layak !== null);
                if (!allMarked) {
                    showToast("Harap tandai 'Layak' atau 'Tidak Layak' untuk SEMUA barang.", "error");
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    return;
                }

                // 2. Dapatkan ID Penerimaan dari URL
                const penerimaanId = Number(paramId);
                if (!penerimaanId) {
                    throw new Error("ID Penerimaan tidak ditemukan di URL.");
                }

                // 3. Buat array berisi promise untuk setiap update
                const updatePromises = barang.map(item => {
                    // 'detail_id' adalah ID unik baris (misal: 115)
                    const detailId = item.id;
                    const status = item.is_layak;

                    // Panggil service baru
                    return updateBarangStatus(penerimaanId, detailId, status ?? null);
                });

                // 4. Jalankan semua promise update secara paralel
                await Promise.all(updatePromises);
                await confirmPenerimaan(penerimaanId)

                showToast("Status kelayakan barang berhasil disimpan!", "success");

            } else {
                // --- ALUR 2: MODE CREATE / EDIT (TIM PPK) ---

                // 1. Validasi: Pastikan form utama terisi
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

                // 2. ATAU: Filter data saat menyusun payload (jika Pihak Kedua opsional)
                const listPegawai = [
                    {
                        pegawai_id: formDataPenerimaan.pegawais[0].pegawai_id_pertama,
                        alamat_staker: formDataPenerimaan.pegawais[0].alamat_staker_pertama
                    },
                    {
                        pegawai_id: formDataPenerimaan.pegawais[1].pegawai_id_kedua,
                        alamat_staker: formDataPenerimaan.pegawais[1].alamat_staker_kedua
                    }
                ].filter(p => p.pegawai_id !== 0); // <--- Hapus pegawai dengan ID 0


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
                    pegawais: listPegawai // <--- Gunakan list yang sudah difilter
                };

                // 3. Panggil service create/update
                // (Kita asumsikan backend menangani 'isEdit' jika ID ada)
                if (isEdit) {
                    const penerimaanId = Number(paramId);
                    if (!penerimaanId) {
                        throw new Error("ID Penerimaan tidak ditemukan di URL.");
                    }
                    const result = await editPenerimaan(penerimaanId, dataFinal);
                    console.log("✅ Data penerimaan yang diupdate:", result);
                    showToast("Berhasil mengupdate data penerimaan!", "success");

                } else {
                    const result = await createPenerimaan(dataFinal);
                    console.log("✅ Data penerimaan yang dibuat", result);
                    showToast("Berhasil membuat data penerimaan!", "success");
                }
            }

            // --- SUKSES (Umum untuk kedua alur) ---
            setIsModalOpen(false);
            setIsSubmitting(false);
            navigate(PATHS.PENERIMAAN.INDEX);

        } catch (err) {
            // --- GAGAL (Umum untuk kedua alur) ---
            console.error(err);
            showToast("Terjadi kesalahan saat menyimpan data.", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
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
        if (isSubmitting) return; // Prevent double click
        setIsSubmitting(true);    // Aktifkan loading

        try {
            console.log(`MENGHAPUS PENERIMAAN DENGAN id ${id}`);
            const response = await deletePenerimaanDetail(id);
            console.log(`RESPONSE BACKEND`, response);
            showToast("Data berhasil dihapus", "success"); // Beri feedback user
            navigate(PATHS.PENERIMAAN.INDEX);
        } catch (error) {
            console.error(error);
            showToast("Gagal menghapus data", "error");
        } finally {
            setIsSubmitting(false); // Matikan loading
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

    return (
        <div className="bg-white p-8 rounded-xl">
            <div className="text-center flex flex-col gap-4 p-4">
                <h1 className="text-3xl text-[#057CFF] font-bold">
                    {isEdit ? "Edit Data Penerimaan" : "Form Data Penerimaan"}
                </h1>
                <h1 className="">Dokumen Resmi RSUD Balung</h1>
            </div>
            <form onSubmit={handleSubmit} className='border-t-3 border-[#CADCF2] py-4 flex flex-col gap-8'>
                {/* BAGIAN PIHAK */}
                <div className='grid grid-cols-2 gap-8'>
                    {/* PIHAK PERTAMA */}
                    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                        <div className='flex gap-2 items-center'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                        </div>
                        <DropdownInput
                            options={pihak}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            value={formDataPenerimaan.pegawais[0].pegawai_name_pertama}
                            onChange={handlePihakPertamaChange}
                            name='namaPihakPertama'
                            type='button'
                            disabled={isInspect}
                        />
                        <Input
                            id="jabatanPihakPertama"
                            placeholder="Masukkan Jabatan"
                            judul="Jabatan"
                            onChange={handleChange}
                            name='jabatanPihakPertama'
                            value={formDataPenerimaan.pegawais[0].jabatan_name_pertama}
                            readOnly={true}
                        />
                        <Input
                            id="NIPPihakPertama"
                            placeholder="Masukkan NIP"
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
                            judul="Alamat SatKer"
                            onChange={handleAlamatSatkerPertamaChange}
                            name='alamatSatkerPihakPertama'
                            value={formDataPenerimaan.pegawais[0].alamat_staker_pertama}
                            readOnly={isInspect}
                        />
                    </div>

                    {/* PIHAK KEDUA */}
                    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                        <div className='flex gap-2 items-center'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                        </div>
                        <DropdownInput
                            options={pihak}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            type='button'
                            value={formDataPenerimaan?.pegawais[1].pegawai_name_kedua}
                            onChange={handlePihakKeduaChange}
                            name='namaPihakKedua'
                            disabled={isInspect}
                        />
                        <Input
                            id="jabatanPihakKedua"
                            placeholder="Masukkan Jabatan"
                            judul="Jabatan"
                            onChange={handleChange}
                            name='jabatanPihakKedua'
                            value={formDataPenerimaan?.pegawais[1].jabatan_name_kedua}
                            readOnly={true}
                        />
                        <Input
                            id="NIPPihakKedua"
                            placeholder="Masukkan NIP"
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

                {/* NOMOR SURAT */}
                <div className=' shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4'>
                    <div className='flex gap-2'>
                        <UserIcon />
                        <h1 className='text-xl font-semibold'>Nomor Surat</h1>
                    </div>
                    <Input
                        id="no_surat"
                        placeholder="Masukkan Nomor Surat"
                        judul="Nomor Surat"
                        onChange={handleChange}
                        name='no_surat'
                        value={formDataPenerimaan.no_surat}
                        readOnly={isInspect}
                    />
                </div>

                {/* DESKRIPSI BARANG */}
                <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4'>
                    <div className='flex gap-2'>
                        <UserIcon />
                        <h1 className='text-xl font-semibold'>Deskripsi Barang</h1>
                    </div>
                    <div className="relative flex flex-col">
                        <label className="mb-2 font-semibold">Deskripsi</label>
                        <div className="relative w-full">
                            <textarea
                                id="deskripsi"
                                placeholder='Masukkan Deskripsi Anda'
                                className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full h-40 align-top focus:outline-none focus:border-blue-500 disabled:bg-gray-100 
                                            disabled:text-gray-400 
                                            disabled:cursor-not-allowed 
                                            disabled:hover:bg-gray-100"
                                onChange={handleChange}
                                name='deskripsi'
                                value={formDataPenerimaan.deskripsi}
                                disabled={isInspect}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* KATEGORI BARANG */}
                <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4'>
                    <DropdownInput<Kategori>
                        placeholder="Pilih Kategori"
                        options={kategoriOptions}  // Sekarang sudah Kategori[], bukan string[]
                        judul="Kategori Barang"
                        type="button"
                        onChange={handleKategoriChange}  // ← Hapus parameter 'kategoriBarang'
                        value={formDataPenerimaan.category_name}
                        name="category_name"
                        disabled={isInspect}
                    />
                </div>

                {/* BUAT DAFTAR BELANJA */}
                <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl'>
                    {!barang || barang.length === 0 ? (
                        <div className='flex flex-col py-20 gap-4 items-center cursor-pointer select-none'>
                            <div onClick={handleAddClick} className='active:scale-95 hover:scale-110 transition-all duration-200'>
                                <ShopCartIcon />
                            </div>
                            <span className='text-[#057CFF] font-bold text-2xl'>Buat Daftar Belanja</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center border-b border-gray-200 p-6">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    Data Barang Belanja ({barang.length} item)
                                </h2>
                                {user?.role === ROLES.PPK && <button
                                    onClick={handleAddClick}
                                    type="button"
                                    className="bg-green-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 rounded-lg text-white font-medium py-2 px-5 shadow-sm"
                                >
                                    Tambah Barang
                                </button>}
                            </div>

                            <div className="overflow-x-auto min-h-100">
                                <table className="min-w-full text-left table-fixed">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider">
                                                Nama Barang
                                            </th>
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider text-center">
                                                Satuan
                                            </th>
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider text-center">
                                                Jumlah
                                            </th>
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider text-center">
                                                Harga
                                            </th>
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider text-center">
                                                Total Harga
                                            </th>
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {barang.filter(item => item && item.stok_name).map((item, index) => (
                                            <tr
                                                key={item.stok_id || index}
                                                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 text-[#6E7781] font-medium">
                                                    {item.stok_name}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    {item.satuan_name}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.price ?? 0)}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.total_harga ?? 0)}
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    {user?.role === ROLES.TEKNIS ? (
                                                        // Jika TIM TEKNIS
                                                        <>
                                                            {item.is_layak !== null ? (
                                                                item.is_layak ?
                                                                    // Status Layak -> Tampilkan Tag Hijau
                                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                                        Layak
                                                                    </span>
                                                                    :
                                                                    // Status Tidak Layak -> Tampilkan Tag Merah
                                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                                        Tidak Layak
                                                                    </span>
                                                            ) : (
                                                                // Belum ada status -> Tampilkan Tombol
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(item.stok_id, true)}
                                                                        className="text-green-500 hover:text-green-700 hover:scale-110 active:scale-95 transition-all duration-200 font-medium px-3 py-1 rounded"
                                                                    >
                                                                        Layak
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(item.stok_id, false)}
                                                                        className="text-red-500 hover:text-red-700 hover:scale-110 active:scale-95 transition-all duration-200 font-medium px-3 py-1 rounded"
                                                                    >
                                                                        Tidak Layak
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        // Jika BUKAN Tim Teknis (misal Tim PPK) -> Tampilkan Hapus
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteBarang(item.stok_id)}
                                                            className="text-red-500 hover:text-red-700 hover:scale-110 active:scale-95 transition-all duration-200 font-medium px-3 py-1 rounded"
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
                        </>
                    )}
                </div>

                <div className='flex justify-end gap-4'>
                    {isEdit && user?.role === ROLES.PPK && paramId && !isNaN(Number(paramId)) && (
                        <WarnButton onClick={handleDeleteClick} text='Hapus' type="button" />)}
                    <ButtonConfirm
                        text={isSubmitting ? "Menyimpan..." : "Selesai"}
                        type='submit'
                        disabled={isSubmitting}
                    />
                </div>
            </form>

            {/* Modal Konfirmasi */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // onConfirm di sini mungkin tidak terpakai karena Anda menggunakan children di bawah, 
                // tapi untuk konsistensi kita sesuaikan juga
                onConfirm={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit}
                text={isDelete
                    ? "Apakah Anda yakin ingin MENGHAPUS data ini? Tindakan ini tidak dapat dibatalkan."
                    : "Apa anda yakin data yang dibuat sudah benar?"}
            >
                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        // Ubah teks tombol saat loading
                        text={isSubmitting ? (isDelete ? "Menghapus..." : "Menyimpan...") : "Iya"}
                        type="button"
                        // ⚠️ PERBAIKAN UTAMA DI SINI:
                        onClick={isDelete ? () => handleDeletePenerimaan(Number(paramId)) : handleConfirmSubmit}
                        disabled={isSubmitting}
                        // Opsional: Beri warna merah saat mode delete
                        className={isDelete ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                    />
                    <WarnButton
                        onClick={() => setIsModalOpen(false)}
                        text="Tidak"
                        disabled={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    )
}