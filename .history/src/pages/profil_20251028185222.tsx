import PfpExample from '../assets/Pfp Example.jpeg';
import PencilIcon from '../assets/pencil Icon.svg?react'

const employees = [
    {
        id: 1,
        name: 'Slamet Riyadi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: 'https://ui-avatars.com/api/?name=Slamet+Riyadi&background=e0f2fe&color=0284c7',
        status: 'Aktif',
    },
    {
        id: 2,
        name: 'Cahyo Budi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: 'https://ui-avatars.com/api/?name=Cahyo+Budi&background=e0f2fe&color=0284c7',
        status: 'Aktif',
    },
    {
        id: 3,
        name: 'Kevin Anggara',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: 'https://ui-avatars.com/api/?name=Kevin+Anggara&background=e0f2fe&color=0284c7',
        status: 'Aktif',
    },
];

function Profil() {
    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] h-full rounded-xl flex flex-col gap-4 w-full">
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
                <div className="p-8 bg-gray-50 min-h-screen">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Daftar Pegawai</h1>

                    <div className="w-full">
                        {/* --- Header Tabel --- */}
                        <div className="grid grid-cols-[80px_2fr_2fr_2fr_1fr_auto] gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span>Foto Akun</span>
                            <span>Daftar pegawai</span>
                            <span>Jabatan</span>
                            <span>No telepon</span>
                            <span className='col-span-2'>Aktivitas</span>
                        </div>

                        {/* --- Badan Tabel (Daftar) --- */}
                        <div className="space-y-3">
                            {employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="grid grid-cols-[80px_2fr_2fr_2fr_1fr_auto] gap-4 items-center bg-white p-4 rounded-xl shadow-sm"
                                >
                                    {/* Foto Akun */}
                                    <div>
                                        <img
                                            className="h-12 w-12 rounded-full object-cover"
                                            src={employee.avatarUrl} // Gunakan placeholder jika URL avatar tidak ada
                                            alt={`Foto ${employee.name}`}
                                        />
                                    </div>

                                    {/* Daftar pegawai */}
                                    <div className="font-medium text-gray-900">{employee.name}</div>

                                    {/* Jabatan */}
                                    <div className="text-gray-700">{employee.job}</div>

                                    {/* No telepon */}
                                    <div className="text-gray-700">{employee.phone}</div>

                                    {/* Status */}
                                    <div>
                                        <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-500 text-white">
                                            {employee.status}
                                        </span>
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div>
                                        <button className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200">
                                            <PencilIcon />
                                        </button>
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