import UserIcon from '../assets/user-square.svg?react'

const namaOptions = [
    "Ritay Protama",
    "Aveli Saputra",
    "Nadia Fitrani",
    "Sababila Nuratni",
    "Devil Katitka"
];


export default function TambahPenerimaan() {
    return (
        <div className="bg-white p-8">
            <div className="text-center flex flex-col gap-4">
                <h1 className="text-3xl text-[#057CFF] font-bold">Form Data Barang Belanja</h1>
                <h1 className="">Dokumen Resmi RSUD Balung</h1>
            </div>
            <div className=''>
                <div className=' py-4 grid grid-cols-2 gap-8'>
                    <div className=" flex flex-col gap-2 p-4 bg-white rounded-2xl shadow">
                        <div className='flex gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-semibold'>Pihak Pertama</h1>
                        </div>
                        <div className="relative flex flex-col">
                            <label htmlFor="namaPihakPertama" className="mb-2">Nama Lengkap</label>
                            <select
                                id="namaPihakPertama"
                                name="namaPihakPertama"
                                // value={formData.namaPihakPertama}
                                // onChange={handleChange}
                                className="border-2 border-[#CDCDCD] p-2 pr-8 rounded-xl text-[#6E7781] appearance-none w-full"
                            >
                                <option value="">Pilih Nama</option>
                                {namaOptions.map((nama, index) => (
                                    <option key={index} value={nama}>
                                        {nama}
                                    </option>
                                ))}
                                                            <svg
                                className="absolute right-3 pointer-events-none text-[#6E7781]"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            </select>

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