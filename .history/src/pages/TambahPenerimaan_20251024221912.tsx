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
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white p-8">
            <div className="text-center flex flex-col gap-4">
                <h1 className="text-3xl text-[#057CFF] font-bold">Form Data Barang Belanja</h1>
                <h1 className="">Dokumen Resmi RSUD Balung</h1>
            </div>
            <div className=''>
                <div className=' py-4 grid grid-cols-2 gap-8'>
                    <div className=" flex flex-col gap-2 p-4 bg-white rounded-2xl shadow">
                        {/* PIHAK PERTAMA */}
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                        </div>
                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Nama Lengkap</label>
                            <button
                                onClick={() => setOpen(!open)}
                                className="text-[#6E7781] hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-between"
                            >
                                Dropdown button
                                <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            {open && (
                                <div className="absolute top-full mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 w-full">
                                    <ul className="py-2 text-sm text-gray-700">
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a></li>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Earnings</a></li>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Sign out</a></li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative flex flex-col">
                            <label htmlFor="jabatanPihakPertama" className="mb-2 font-semibold">Jabatan</label>
                            <div className="relative">
                                <input
                                    id="jabatanPihakPertama"
                                    name="jabatanPihakPertama"
                                    // value={formData.namaPihakPertama}
                                    // onChange={handleChange}
                                    placeholder='Masukkan Jabatan'
                                    className="border-2 border-[#CDCDCD] p-2 pr-10 rounded-xl text-[#6E7781] appearance-none w-full"
                                >
                                </input>
                                <svg
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#6E7781]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                    </div>
                    <div className="bg-amber-300 flex items-center gap-2 rounded p-4">
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}