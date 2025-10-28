import UserIcon from '../assets/user-square.svg?react'
import ShopCartIcon from '../assets/shopCart.svg?react'
import { NavLink } from 'react-router-dom';
import DropdownInput from '../components/dropdownInput';
import Input from '../components/input';


const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];


export default function TambahPenerimaan() {

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
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Nama Lengkap</label>

                            <DropdownInput options={namaOptions} placeholder='Masukkan Nama'/>
                        </div>

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
                            placeholder="Alamat Satker"
                            judul="Masukkan Alamat SatKer"
                        />
                    </div>

                    {/* PIHAK KEDUA */}
                    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                        </div>

                        {/* NAMA */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Nama Lengkap</label>
                            <DropdownInput options={namaOptions} placeholder='Masukkan Nama'/>
                        </div>

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
                <div className='shadow-[0_0_10px_rgba(0,0,0,0.1)] py-20 rounded-xl flex flex-col gap-4 items-center cursor-pointer select-none '>
                    <div className='active:scale-95 hover:scale-110 transition-all duration-200'>
                        <NavLink to='/penerimaan/tambah/barang-belanja'>
                            <ShopCartIcon />
                        </NavLink>
                    </div>
                    <span className='text-[#057CFF] font-bold text-2xl'>Buat Daftar Belanja</span>
                </div>

                {/* BUTTON SELESAI */}
                <button className='bg-[#00b998] px-10 py-2 rounded-md text-white self-end font-bold text-lg cursor-pointer active:scale-95 hover:bg-[#02ad8d] transition-all duration-200 hover:scale-110'>
                    Selesai
                </button>
            </div>
        </div>
    )
}