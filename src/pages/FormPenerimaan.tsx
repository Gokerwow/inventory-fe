import UserIcon from '../assets/user-square.svg?react'
import ShopCartIcon from '../assets/shopCart.svg?react'
import { useNavigate, useParams } from 'react-router-dom';
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';
import ButtonConfirm from '../components/buttonConfirm';
import WarnButton from '../components/warnButton';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import React, { useEffect, useState, useMemo } from 'react';
import { PATHS } from '../Routes/path';
import { dataPihak, type TipeDataPihak } from '../Mock Data/data';
import {
    getPenerimaanDetail,
    getBarangBelanjaByPenerimaanId,
    createPenerimaan,
} from '../services/penerimaanService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/modal';
import { usePenerimaan } from '../hooks/usePenerimaan';
import { ROLES } from '../constant/roles';

export default function TambahPenerimaan({ isEdit = false }: { isEdit?: boolean }) {
    const requiredRoles = useMemo(() => [ROLES.PPK, ROLES.TEKNIS], []);
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth() // ✅ Ambil data user
    const navigate = useNavigate()
    const { id: paramId } = useParams();
    const { showToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { barang, setBarang, formDataPenerimaan, setFormDataPenerimaan } = usePenerimaan()

    useEffect(() => {
        // Fungsi ini akan berjalan SETIAP KALI state 'barang' 
        // selesai diperbarui oleh React.

        console.log("✅ State 'barang' telah diperbarui:", barang);

    }, [barang]);

    // useEffect untuk mode edit
    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        if (isEdit && paramId) {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const id = Number(paramId);
                    const [detailData, barangData] = await Promise.all([
                        getPenerimaanDetail(id),
                        getBarangBelanjaByPenerimaanId(id)
                    ]);

                    if (detailData) {
                        setFormDataPenerimaan({
                            id: detailData.id,
                            noSurat: detailData.noSurat,
                            namaPihakPertama: detailData.namaPegawai,
                            jabatanPihakPertama: 'Jabatan Dummy',
                            NIPPihakPertama: '123456',
                            alamatSatkerPihakPertama: 'Alamat Dummy',
                            namaPihakKedua: 'Pihak Kedua Dummy',
                            jabatanPihakKedua: 'Jabatan Dummy',
                            NIPPihakKedua: '654321',
                            alamatSatkerPihakKedua: 'Alamat Dummy',
                            deskripsiBarang: 'Deskripsi Dummy',
                        });
                    }
                    setBarang(barangData);
                } catch (err) {
                    console.error(err);
                    setError("Gagal memuat data penerimaan.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isEdit, paramId, user, checkAccess, hasAccess, setFormDataPenerimaan, setBarang]);

    if (!hasAccess(user?.role)) {
        return null;
    }

    // ✅ FIXED: Handler untuk navigasi ke form barang
    const handleAddClick = () => {
        console.log('➕ Navigasi ke form barang belanja');
        console.log('📊 Barang yang sudah ada:', barang.length);

        navigate(PATHS.PENERIMAAN.BARANG_BELANJA);
    }

    // ✅ TAMBAHAN: Handler untuk hapus barang
    const handleDeleteBarang = (id: number) => {
        setBarang(prev => prev.filter(item => item.id !== id));
        showToast('Barang berhasil dihapus', 'success');
    };

    // ✅ PERUBAHAN: Handler untuk status barang (Tim Teknis)
    const handleStatusChange = (id: number, status: 'Layak' | 'Tidak Layak') => {
        setBarang(prevBarang =>
            prevBarang.map(item => {
                console.log(`✅ Barang ID ${item.id} ditandai. Status baru: ${item.statusPemeriksaan}`);
                return item.id === id ? { ...item, statusPemeriksaan: status } : item;
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

    const handlePihakPertamaChange = (pihak: TipeDataPihak | null) => {
        setFormDataPenerimaan(prev => ({
            ...prev,
            namaPihakPertama: pihak ? pihak.nama : '',
            jabatanPihakPertama: pihak ? pihak.jabatan : '',
            NIPPihakPertama: pihak ? pihak.nip : '',
        }));
    };

    const handlePihakKeduaChange = (pihak: TipeDataPihak | null) => {
        setFormDataPenerimaan(prev => ({
            ...prev,
            namaPihakKedua: pihak ? pihak.nama : '',
            jabatanPihakKedua: pihak ? pihak.jabatan : '',
            NIPPihakKedua: pihak ? pihak.nip : '',
        }));
    };

    const handleConfirmSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!formDataPenerimaan.noSurat || !formDataPenerimaan.namaPihakPertama) {
            showToast("Nomor Surat dan Nama Pihak Pertama wajib diisi!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        // ✅ VALIDASI: Pastikan ada barang
        if (barang.length === 0) {
            showToast("Tambahkan minimal 1 barang belanja!", "error");
            setIsSubmitting(false);
            setIsModalOpen(false);
            return;
        }

        try {
            const dataFinal = {
                ...formDataPenerimaan,
                barang: barang // State 'barang' sudah berisi 'status_pemeriksaan' jika diisi
            };

            if (isEdit) {
                showToast("Berhasil mengupdate data penerimaan!", "success");
            } else {
                await createPenerimaan(dataFinal);
                showToast("Berhasil membuat data penerimaan!", "success");
            }

            setIsModalOpen(false);
            navigate(PATHS.PENERIMAAN.INDEX);

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
        setIsModalOpen(true);
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
                            options={dataPihak}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            value={formDataPenerimaan.namaPihakPertama}
                            onChange={handlePihakPertamaChange}
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
                            readOnly={true}
                        />
                        <Input
                            id="NIPPihakPertama"
                            placeholder="Masukkan NIP"
                            judul="NIP"
                            type='number'
                            onChange={handleChange}
                            name='NIPPihakPertama'
                            value={formDataPenerimaan.NIPPihakPertama}
                            readOnly={true}
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
                        <div className='flex gap-2 items-center'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                        </div>
                        <DropdownInput
                            options={dataPihak}
                            placeholder='Masukkan Nama'
                            judul='Nama Lengkap'
                            type='button'
                            value={formDataPenerimaan.namaPihakKedua}
                            onChange={handlePihakKeduaChange}
                            name='namaPihakKedua'
                        />
                        <Input
                            id="jabatanPihakKedua"
                            placeholder="Masukkan Jabatan"
                            judul="Jabatan"
                            onChange={handleChange}
                            name='jabatanPihakKedua'
                            value={formDataPenerimaan.jabatanPihakKedua}
                            readOnly={true}
                        />
                        <Input
                            id="NIPPihakKedua"
                            placeholder="Masukkan NIP"
                            judul="NIP"
                            type='number'
                            onChange={handleChange}
                            name='NIPPihakKedua'
                            value={formDataPenerimaan.NIPPihakKedua}
                            readOnly={true}
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
                                id="deskripsiBarang"
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
                                            <th className="py-3 px-6 text-sm font-semibold text-[#9C9C9C] tracking-wider ">
                                                Kategori
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
                                        {barang.filter(item => item && item.nama_barang).map((item, index) => (
                                            <tr
                                                key={item.id || index}
                                                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 text-[#6E7781] font-medium">
                                                    {item.nama_barang}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781]">
                                                    {item.kategori}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    {item.satuan}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    {item.jumlah}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.harga)}
                                                </td>
                                                <td className="py-4 px-6 text-[#6E7781] text-center">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.total_harga)}
                                                </td>

                                                {/* ✅ PERUBAHAN: Tombol Aksi berdasarkan role */}
                                                <td className="py-4 px-6 text-center">
                                                    {user?.role === ROLES.TEKNIS ? (
                                                        // Jika TIM TEKNIS
                                                        <>
                                                            {item.statusPemeriksaan === 'Layak' ? (
                                                                // Status Layak -> Tampilkan Tag Hijau
                                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                                    Layak
                                                                </span>
                                                            ) : item.statusPemeriksaan === 'Tidak Layak' ? (
                                                                // Status Tidak Layak -> Tampilkan Tag Merah
                                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                                    Tidak Layak
                                                                </span>
                                                            ) : (
                                                                // Belum ada status -> Tampilkan Tombol
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(item.id, 'Layak')}
                                                                        className="text-green-500 hover:text-green-700 hover:scale-110 active:scale-95 transition-all duration-200 font-medium px-3 py-1 rounded"
                                                                    >
                                                                        Layak
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(item.id, 'Tidak Layak')}
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
                                                            onClick={() => handleDeleteBarang(item.id)}
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
                    {isEdit && user?.role === ROLES.PPK && <WarnButton text='Hapus' />}
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
                        onClick={() => setIsModalOpen(false)}
                        text="Tidak"
                        disabled={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    )
}