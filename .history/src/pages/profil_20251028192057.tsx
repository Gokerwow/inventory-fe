import PfpExample from '../assets/Pfp Example.jpeg';
import PencilIcon from '../assets/pencil Icon.svg?react'

const employees = [
    {
        id: 1,
        name: 'Slamet Riyadi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
    {
        id: 2,
        name: 'Cahyo Budi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
    {
        id: 3,
        name: 'Kevin Anggara',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
];

function Profil() {
    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl flex flex-col gap-4 w-full pb-15">
            <h1 className="text-3xl font-bold p-8 px-15 shadow-lg">Profil</h1>
            <div className="bg-white rounded-lg p-8">
                <div className='flex gap-8'>
                    <div className='p-8'>
                        <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-2xl'>
                            <img src={PfpExample} alt="Profile Picture" className='w-full' />
                        </div>
                    </div>
                    <div className='text-2xl p-8 gap-8'>
                        <h1 className='font-bold'>Biodata Diri</h1>
                        <table className='border-separate border-spacing-y-8'>
                            <tr>
                                <td width="100">Username</td>
                                <td className='pl-8'>: TimPPK</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td className='pl-8'>: Tim PPK</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td className='pl-8'>: ppkbalung@gmail.com</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div className='px-15 w-full'>
                // Latar belakang abu-abu untuk membuat kartu putih menonjol
                <div className="bg-gray-50 p-8 min-h-screen">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Daftar Pegawai</h2>

                        {/* --- Header Tabel --- */}
                        <div className="flex items-center py-3 px-4 text-sm font-semibold text-gray-500 border-b border-gray-200">
                            {/* Kolom 1: Foto & Nama */}
                            <div className="flex-1 min-w-0">
                                {/* Tata letak header ini meniru spasi pada gambar Anda */}
                                <span className="mr-20">Foto Akun</span>
                                <span>Daftar pegawai</span>
                            </div>
                            {/* Kolom 2: Jabatan */}
                            <div className="w-40 px-2">Jabatan</div>
                            {/* Kolom 3: No telepon */}
                            <div className="w-48 px-2">No telepon</div>
                            {/* Kolom 4: Aktivitas */}
                            <div className="w-48 px-2">Aktivitas</div>
                        </div>

                        {/* --- Isi Tabel (List) --- */}
                        <div className="space-y-4 mt-4">
                            {employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    // 'relative' untuk 'absolute' highlight bar
                                    className="relative flex items-center bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Highlight Bar Biru di kiri */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-100 rounded-l-lg"></div>

                                    {/* Kolom 1: Avatar + Nama */}
                                    <div className="flex-1 min-w-0 flex items-center py-4 pl-8 pr-4"> {/* pl-8 untuk memberi ruang bagi highlight bar */}
                                        <img
                                            src={employee.avatarUrl}
                                            alt={employee.name}
                                            className="w-12 h-12 rounded-full object-cover mr-6"
                                        />
                                        <p className="font-semibold text-gray-800 truncate">{employee.name}</p>
                                    </div>

                                    {/* Kolom 2: Jabatan */}
                                    <div className="w-40 px-2">
                                        <p className="text-gray-600">{employee.job}</p>
                                    </div>

                                    {/* Kolom 3: No telepon */}
                                    <div className="w-48 px-2">
                                        <p className="text-gray-600">{employee.phone}</p>
                                    </div>

                                    {/* Kolom 4: Aktivitas */}
                                    <div className="w-48 px-2 flex items-center justify-between">
                                        {/* Badge Status */}
                                        <span className="inline-block px-4 py-1.5 text-sm font-medium text-teal-800 bg-teal-100 rounded-full">
                                            {employee.status}
                                        </span>
                                        {/* Tombol Edit */}
                                        <PencilIcon />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;