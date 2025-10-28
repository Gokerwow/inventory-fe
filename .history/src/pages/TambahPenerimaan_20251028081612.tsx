import UserIcon from '../assets/user-square.svg?react'
import ShopCartIcon from '../assets/shopCart.svg?react'
import { NavLink } from 'react-router-dom';
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';
import ButtonConfirm from '../components/buttonConfirm';
import { useState } from 'react';


const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];

const shoppingData = [
    {
        id: 1,
        nama: 'Kertas HVS A4',
        kategori: 'ATK',
        satuan: '1000',
        jumlah: '2 Rim',
        harga: '45.000',
        total: '90.000',
    },
    {
        id: 2,
        nama: 'Pulpen Pilot G2',
        kategori: 'ATK',
        satuan: '12',
        jumlah: '1 Lusin',
        harga: '120.000',
        total: '120.000',
    },
    {
        id: 3,
        nama: 'Buku Tulis Sinar Dunia',
        kategori: 'ATK',
        satuan: '10',
        jumlah: '1 Pack',
        harga: '35.000',
        total: '35.000',
    },
];


export default function TambahPenerimaan() {

    const [formData, setFormData] = useState({
        pihakPertama: {
            nama: '',
            jabatan: '',
            nip: '',
            alamatSatker: '',
        },
        pihakKedua: {
            nama: '',
            jabatan: '',
            nip: '',
            alamatSatker: '',
        },
        nomorSurat: '',
        deskripsi: '',
        barangBelanja: shoppingData
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));

        const handlePihakChange = (pihak, field, value) => {
            setFormData(prevData => ({
                ...prevData,
                [pihak]: {
                    ...prevData[pihak],
                    [field]: value
                }
            }));
        };

        const handlePihakDropdownChange = (pihak, field, value) => {
            setFormData(prevData => ({
                ...prevData,
                [pihak]: {
                    ...prevData[pihak],
                    [field]: value
                }
            }));
        };

        return (
            <div className="bg-white p-8 rounded-xl">
                <div className="text-center flex flex-col gap-4 p-4">
                    <h1 className="text-3xl text-[#057CFF] font-bold">Form Data Barang Belanja</h1>
                    <h1 className="">Dokumen Resmi RSUD Balung</h1>
                </div>
                <div className='border-t-3 border-[#CADCF2] py-4 flex flex-col gap-8'>
                    {/* BAGIAN PIHAK */}
                    <div className='grid grid-cols-2 gap-8'>
                        {/* PIHAK PERTAMA */}
                        <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                            <div className='flex gap-2'>
                                <UserIcon />
                                <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                            </div>

                            {/* NAMA */}
                            <DropdownInput options={namaOptions} placeholder='Masukkan Nama' judul='Nama Lengkap' />

                            {/* JABATAN */}
                            <Input
                                id="jabatanPihakPertama"
                                placeholder="Masukkan Jabatan"
                                judul="Jabatan"
                            />

                            {/* NIP */}
                            <Input
                                id="NIP"
                                placeholder="Masukkan NIP"
                                judul="NIP"
                            />

                            {/*ALAMAT SATKER */}
                            <Input
                                id="alamatSatkerPihakPertama"
                                placeholder="Masukkan Alamat Satker"
                                judul="Alamat SatKer"
                            />
                        </div>

                        {/* PIHAK KEDUA */}
                        <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                            <div className='flex gap-2'>
                                <UserIcon />
                                <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                            </div>

                            {/* NAMA */}
                            <DropdownInput options={namaOptions} placeholder='Masukkan Nama' judul='Nama Lengkap' />

                            {/* JABATAN */}
                            <Input
                                id="jabatanPihakPertama"
                                placeholder="Masukkan Jabatan"
                                judul="Jabatan"
                            />

                            {/* NIP */}
                            <Input
                                id="NIP"
                                placeholder="Masukkan NIP"
                                judul="NIP"
                            />

                            {/*ALAMAT SATKER */}
                            <Input
                                id="alamatSatkerPihakPertama"
                                placeholder="Masukkan Alamat Satker"
                                judul="Alamat Satker"
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
                        />
                    </div>

                    {/* DESKRIPSI BARANG */}
                    <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 rounded-xl flex flex-col gap-4'>
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Deskripsi Barang</h1>
                        </div>
                        {/*ALAMAT SATKER */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Deskripsi</label>

                            <div className="relative w-full">
                                <textarea
                                    id="namaPihakPertama"
                                    placeholder='Masukkan Deskripsi Anda'
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full h-40 align-top focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* BUAT DAFTAR BELANJA */}
                    <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl'>
                        {/* <div className='flex flex-col py-20 gap-4 items-center cursor-pointer select-none'>
                        <div className='active:scale-95 hover:scale-110 transition-all duration-200'>
                            <NavLink to='/penerimaan/tambah/barang-belanja'>
                                <ShopCartIcon />
                            </NavLink>
                        </div>
                        <span className='text-[#057CFF] font-bold text-2xl'>Buat Daftar Belanja</span>
                    </div> */}

                        {/* Bagian Header dan Tombol */}
                        <div className="flex justify-between items-center border-b border-gray-200 p-6">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Data Barang Belanja
                            </h2>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors duration-200">
                                Tambah Barang
                            </button>
                        </div>

                        {/* Tabel */}
                        <div className="overflow-x-auto min-h-100">
                            <table className="min-w-full text-left table-fixed">
                                {/* Kepala Tabel */}
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
                                    </tr>
                                </thead>

                                {/* Isi Tabel */}
                                <tbody>
                                    {shoppingData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6 text-gray-700 font-medium">
                                                {item.nama}
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
                                                {item.total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* BUTTON SELESAI */}
                    <ButtonConfirm
                        text='Selesai'
                    />
                </div>
            </div>
        )
    }