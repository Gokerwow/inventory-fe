import UserIcon from '../assets/user-square.svg?react'
import { useState } from "react";


const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];


export default function TambahPenerimaan() {
    const [openPihakPertama, setOpenPihakPertama] = useState(false);
    const [openPihakKedua, setOpenPihakKedua] = useState(false);

    return (
        <div className="bg-white p-8">
            <div className="text-center flex flex-col gap-4 p-4">
                <h1 className="text-3xl text-[#057CFF] font-bold">Form Data Barang Belanja</h1>
                <h1 className="">Dokumen Resmi RSUD Balung</h1>
            </div>
            <div className='border-t-3 border-[#CADCF2] py-4 '>
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
                            <button
                                onClick={() => setOpenPihakPertama(!openPihakPertama)}
                                className="text-[#6E7781] hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between"
                            >
                                Masukkan Nama
                                <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            <div
                                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full transition-all duration-300 ease-out transform
                                            ${openPihakPertama ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                                            `}
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    {namaOptions.map(nama => <li key={nama}><a href="#" className="block px-4 py-2 hover:bg-gray-100">{nama}</a></li>)}
                                </ul>
                            </div>
                        </div>

                        {/* JABATAN */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Jabatan</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan Jabatan
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* NIP */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">NIP</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan NIP
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/*ALAMAT SATKER */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Alamat Satker</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan Alamat Satker
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
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
                            <button
                                onClick={() => setOpenPihakKedua(!openPihakKedua)}
                                className="text-[#6E7781] hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between"
                            >
                                Masukkan Nama
                                <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            <div
                                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full transition-all duration-300 ease-out transform
                                            ${openPihakKedua ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                                            `}
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    {namaOptions.map(nama => <li key={nama}><a href="#" className="block px-4 py-2 hover:bg-gray-100">{nama}</a></li>)}
                                </ul>
                            </div>
                        </div>

                        {/* JABATAN */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Jabatan</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan Jabatan
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* NIP */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">NIP</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan NIP
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/*ALAMAT SATKER */}
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Alamat Satker</label>

                            <div className="relative w-full">
                                <label
                                    htmlFor="namaPihakPertama"
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                >
                                    Masukkan Alamat Satker
                                </label>

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex gap-2 bg'>
                        <UserIcon />
                        <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}