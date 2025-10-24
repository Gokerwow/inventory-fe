import UserIcon from '../assets/user-square.svg?react'

export default function TambahPenerimaan() {
    return (
        <div className="bg-white p-8">
            <div className="text-center flex flex-col gap-4">
                <h1 className="text-3xl text-[#057CFF] font-bold">Form Data Barang Belanja</h1>
                <h1 className="">Dokumen Resmi RSUD Balung</h1>
            </div>
            <div className='bg-amber-900'>
                <div className='bg-amber-700 py-4 grid grid-cols-2 gap-8'>
                    <div className="bg-amber-300 flex items-center gap-2 rounded p-4">
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                        </div>
                    </div>
                    <div className="bg-amber-300 flex items-center gap-2 rounded p-4">
                        <UserIcon />
                        <h1 className='text-xl font-semibold'>Pihak Kedua</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}