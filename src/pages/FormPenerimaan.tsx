import UserIcon from '../assets/user-square.svg?react'
import ShopCartIcon from '../assets/shopCart.svg?react'
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom'; // <-- TAMBAHAN: useLocation, useParams
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';
import ButtonConfirm from '../components/buttonConfirm';
import WarnButton from '../components/warnButton';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
// --- UBAHAN: Tambah useEffect, useState, useMemo ---
import React, { useEffect, useState, useMemo } from 'react';
import { PATHS } from '../Routes/path';
import { type TIPE_BARANG_BELANJA } from '../Mock Data/data';
// --- TAMBAHAN: Impor service, toast, dan modal ---
import {
    getPenerimaanDetail,
    getBarangBelanjaByPenerimaanId,
    createPenerimaan,
    // updatePenerimaan // (Kita akan buat ini di service jika diperlukan)
} from '../services/penerimaanService';
import { useToast } from '../context/toastContext';
import Modal from '../components/modal';
// --------------------------------------------------

const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];

// --- TAMBAHAN: Tipe data untuk form ---
interface FormData {
    id: number,
    noSurat: string,
    namaPihakPertama: string,
    jabatanPihakPertama: string,
    NIPPihakPertama: string,
    alamatSatkerPihakPertama: string,
    namaPihakKedua: string,
    jabatanPihakKedua: string,
    NIPPihakKedua: string,
    alamatSatkerPihakKedua: string,
    deskripsiBarang: string,
    // barang akan dikelola di state terpisah
}
// ------------------------------------

export default function TambahPenerimaan({ isEdit = false }: { isEdit?: boolean }) {

    // --- UBAHAN: Stabilkan role ---
    const requiredRoles = useMemo(() => ['Tim PPK', 'Tim Teknis'], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    // -------------------------------

    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { id: paramId } = useParams(); // <-- TAMBAHAN: Ambil 'id' dari URL untuk mode edit
    const { showToast } = useToast(); // <-- TAMBAHAN

    // --- TAMBAHAN: State untuk loading & submit ---
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // --------------------------------------------

    const [barang, setBarang] = useState<TIPE_BARANG_BELANJA[]>([])

    // --- UBAHAN: State form ---
    const [formDataPenerimaan, setFormDataPenerimaan] = useState<FormData>({
        id: 0,
        noSurat: '',
        namaPihakPertama: '',
        jabatanPihakPertama: '',
        NIPPihakPertama: '',
        alamatSatkerPihakPertama: '',
        namaPihakKedua: '',
        jabatanPihakKedua: '',
        NIPPihakKedua: '',
        alamatSatkerPihakKedua: '',
        deskripsiBarang: '',
    });
    // ----------------------------

    const { data: dataFromLocation } = location.state || {} // Ganti nama agar tidak bentrok

    // --- UBAHAN: useEffect untuk mengambil data barang baru (dari form sebelah) ---
    useEffect(() => {
        if (dataFromLocation && dataFromLocation.nama_barang) {
            // Cek duplikasi
            setBarang(prev => {
                const isExist = prev.some(item => item.id === dataFromLocation.id);
                if (isExist) return prev;
                return [...prev, dataFromLocation];
            });

            // Clear state setelah data diambil
            navigate(location.pathname, {
                replace: true,
                state: null // Hapus state dari lokasi
            });
        }
    }, [dataFromLocation, location.pathname, navigate]);
    // -------------------------------------------------------------------------

    // --- TAMBAHAN: useEffect untuk mengambil data (mode edit) ---
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        if (isEdit && paramId) {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const id = Number(paramId);
                    // Ambil data detail form dan data barang secara bersamaan
                    const [detailData, barangData] = await Promise.all([
                        getPenerimaanDetail(id),
                        getBarangBelanjaByPenerimaanId(id)
                    ]);

                    if (detailData) {
                        // Isi data form
                        setFormDataPenerimaan({
                            id: detailData.id,
                            noSurat: detailData.noSurat,
                            namaPihakPertama: detailData.namaPegawai, // Sesuaikan field-nya
                            // ... isi field lainnya dari detailData
                            jabatanPihakPertama: 'Jabatan Dummy', // Ganti dengan data asli nanti
                            NIPPihakPertama: '123456', // Ganti dengan data asli nanti
                            alamatSatkerPihakPertama: 'Alamat Dummy', // Ganti dengan data asli nanti
                            namaPihakKedua: 'Pihak Kedua Dummy', // Ganti dengan data asli nanti
                            jabatanPihakKedua: 'Jabatan Dummy', // Ganti dengan data asli nanti
                            NIPPihakKedua: '654321', // Ganti dengan data asli nanti
                            alamatSatkerPihakKedua: 'Alamat Dummy', // Ganti dengan data asli nanti
                            deskripsiBarang: 'Deskripsi Dummy', // Ganti dengan data asli nanti
                        });
                    }
                    setBarang(barangData); // Isi daftar barang
                } catch (err) {
                    console.error(err);
                    setError("Gagal memuat data penerimaan.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isEdit, paramId, user, checkAccess, hasAccess]); // <-- Dependensi
    // -----------------------------------------------------------

    // Early return jika tidak memiliki akses
    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleAddClick = () => { // Hapus parameter 'barang'
        navigate(PATHS.PENERIMAAN.BARANG_BELANJA) // Langsung navigasi
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDataPenerimaan(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // --- UBAHAN: Logika submit form ---
    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Validasi
        if (!formDataPenerimaan.noSurat || !formDataPenerimaan.namaPihakPertama) {
            showToast("Nomor Surat dan Nama Pihak Pertama wajib diisi!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        try {
            const dataFinal = {
                ...formDataPenerimaan,
                barang: barang // Sertakan daftar barang
            };

            if (isEdit) {
                // await updatePenerimaan(dataFinal); // Panggil service update
                showToast("Berhasil mengupdate data penerimaan!", "success");
            } else {
                await createPenerimaan(dataFinal); // Panggil service create
                showToast("Berhasil membuat data penerimaan!", "success");
            }

            setIsModalOpen(false);
            navigate(PATHS.PENERIMAAN.INDEX); // Kembali ke daftar

        } catch (err) {
            console.error(err);
            showToast("Terjadi kesalahan saat menyimpan data.", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data Penerimaan Siap Submit:', { ...formDataPenerimaan, barang });
        setIsModalOpen(true); // Buka modal konfirmasi
    }
    // ------------------------------------

    // --- TAMBAHAN: Tampilkan UI Loading ---
    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-xl flex justify-center items-center h-96">
                <p>Memuat data form...</p>
            </div>
        );
    }

    // --- TAMBAHAN: Tampilkan UI Error ---
    if (error) {
        return (
            <div className="bg-white p-8 rounded-xl flex justify-center items-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    // ------------------------------------

    return (
        <div className="bg-white p-8 rounded-xl">
            <div className="text-center flex flex-col gap-4 p-4">
                {/* --- UBAHAN: Judul dinamis --- */}
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
                        {/* ... (UI Pihak Pertama) ... */}
                        {/* --- UBAHAN: Bind 'value' dan 'onChange' --- */}
                        <DropdownInput
                            options={namaOptions}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            value={formDataPenerimaan.namaPihakPertama}
                            onChange={(value) => setFormDataPenerimaan(prev => ({ ...prev, namaPihakPertama: value }))}
                            name='namaPihakPertama'
                            type='button'
                        />
                        <Input
                            id="jabatanPihakPertama"
                            placeholder="Masukkan Jabatan"
                            judul="Jabatan"
                            onChange={handleChange}
                            name='jabatanPihakPertama'
                            value={formDataPenerimaan.jabatanPihakPertama}
                        />
                        <Input
                            id="NIPPihakPertama"
                            placeholder="Masukkan NIP"
                            judul="NIP"
                            type='number'
                            onChange={handleChange}
                            name='NIPPihakPertama'
                            value={formDataPenerimaan.NIPPihakPertama}
                        />
                        <Input
                            id="alamatSatkerPihakPertama"
                            placeholder="Masukkan Alamat Satker"
                            judul="Alamat SatKer"
                            onChange={handleChange}
                            name='alamatSatkerPihakPertama'
                            value={formDataPenerimaan.alamatSatkerPihakPertama}
                        />
                    </div>

                    {/* PIHAK KEDUA */}
                    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                        {/* ... (UI Pihak Kedua) ... */}
                        {/* --- UBAHAN: Bind 'value' dan 'onChange' --- */}
                        <DropdownInput
                            options={namaOptions}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            type='button'
                            value={formDataPenerimaan.namaPihakKedua}
                            onChange={(value) => setFormDataPenerimaan(prev => ({ ...prev, namaPihakKedua: value }))}
                            name='namaPihakKedua'
                        />
                        <Input
                            id="jabatanPihakKedua"
                            placeholder="Masukkan Jabatan"
                            judul="Jabatan"
                            onChange={handleChange}
                            name='jabatanPihakKedua'
                            value={formDataPenerimaan.jabatanPihakKedua}
                        />
                        <Input
                            id="NIPPihakKedua"
                            placeholder="Masukkan NIP"
                            judul="NIP"
                            type='number'
                            onChange={handleChange}
                            name='NIPPihakKedua'
                            value={formDataPenerimaan.NIPPihakKedua}
                        />
                        <Input
                            id="alamatSatkerPihakKedua"
                            placeholder="Masukkan Alamat Satker"
                            judul="Alamat Satker"
                            onChange={handleChange}
                            name='alamatSatkerPihakKedua'
                            value={formDataPenerimaan.alamatSatkerPihakKedua}
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
                        id="nomorSurat"
                        placeholder="Masukkan Nomor Surat"
                        judul="Nomor Surat"
                        onChange={handleChange}
                        name='noSurat'
                        value={formDataPenerimaan.noSurat}
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
                                id="deskripsiBarang" // <-- 'id' harus unik
                                placeholder='Masukkan Deskripsi Anda'
                                className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full h-40 align-top focus:outline-none focus:border-blue-500"
                                onChange={handleChange}
                                name='deskripsiBarang'
                                value={formDataPenerimaan.deskripsiBarang}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* BUAT DAFTAR BELANJA */}
                <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl'>
                    {/* --- UBAHAN: Logika tampilan daftar barang --- */}
                    {!barang || barang.length === 0 ?
                        (
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
                                        Data Barang Belanja
                                    </h2>
                                    <button onClick={handleAddClick} type="button" className="bg-green-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 rounded-lg text-white font-medium py-2 px-5 shadow-sm">
                                        Tambah Barang
                                    </button>
                                </div>

                                <div className="overflow-x-auto min-h-100">
                                    <table className="min-w-full text-left table-fixed">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                                    Nama Barang
                                                </th>
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider ">
                                                    Kategori
                                                </th>
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
                                                    Satuan
                                                </th>
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
                                                    Jumlah
                                                </th>
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
                                                    Harga
                                                </th>
                                                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
                                                    Total Harga
                                                </th>
                                                {user?.role === 'Tim Teknis' &&
                                                    <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center col-span-2">
                                                        Aksi
                                                    </th>
                                                }
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {barang.filter(item => item && item.nama_barang).map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                                                >
                                                    <td className="py-4 px-6 text-gray-700 font-medium">
                                                        {item.nama_barang}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-700 ">
                                                        {item.kategori}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-700 text-center">
                                                        {item.satuan}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-700 text-center">
                                                        {item.jumlah}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-700 text-center">
                                                        {item.harga}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-700 text-center">
                                                        {item.total_harga}
                                                    </td>
                                                    {user?.role === 'Tim Teknis' &&
                                                        <td className="flex justify-center items-center py-4 px-6 gap-3 text-white font-semibold">
                                                            <div className="px-4 py-3 text-center bg-green-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 rounded-lg">
                                                                Layak
                                                            </div>
                                                            <div className="px-4 py-3 text-center bg-red-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 rounded-lg">
                                                                Tidak
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                </div>

                <div className='flex justify-end gap-4'>
                    {isEdit && <WarnButton text='Hapus' />}
                    <ButtonConfirm
                        text={isSubmitting ? "Menyimpan..." : "Selesai"}
                        type='submit'
                        disabled={isSubmitting} // <-- TAMBAHAN
                    />
                </div>
            </form>

            {/* --- TAMBAHAN: Modal Konfirmasi --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                text="Apa anda yakin data yang di buat sudah benar?"
            >
                <div className="flex gap-4 justify-endz`">
                    <ButtonConfirm
                        text={isSubmitting ? "Menyimpan..." : "Iya"}
                        type="button"
                        onClick={handleConfirmSubmit}
                        disabled={isSubmitting}
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