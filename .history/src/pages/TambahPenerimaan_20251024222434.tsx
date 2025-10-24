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
                                className="text-[#6E7781] hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between"
                            >
                                Dropdown button
                                <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            <div
                                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full transition-all duration-300 ease-out transform
                                            ${open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                                            `}
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a></li>
                                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Earnings</a></li>
                                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Sign out</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Nama Lengkap</label>
                            <input
                                className="text-[#6E7781] hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between"
                            >
                            </input>
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