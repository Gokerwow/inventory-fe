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
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Daftar Pegawai</h1>

                <div className="w-full">
{/* ▼ HAPUS definisi kolom dari header dan row.
  Definisikan kolom SATU KALI di grid induk ini.
  Ganti 'space-y-3' dengan 'gap-y-3'
*/}
<div className="grid grid-cols-[30px_80px_1fr_1fr_1fr_auto] gap-x-4 gap-y-3">

    {/* HEADER
      ▼ Tambahkan 'col-span-full' dan 'grid-cols-subgrid'
    */}
    <div className="col-span-full grid grid-cols-subgrid gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider items-center">
        {/* 'col-span-full' (atau col-span-6) membuat div ini membentang penuh.
          'grid-cols-subgrid' membuatnya menggunakan kolom dari induk.
          Isinya tidak perlu diubah.
        */}
        <span></span>
        <span>Foto Akun</span>
        <span className='bg-amber-500'>Daftar pegawai</span>
        <span className='bg-amber-400'>Jabatan</span>
        <span>No telepon</span>
        <span className="text-center">Aktivitas</span>
    </div>

    {/* BARIS DATA 
      ▼ Hapus 'space-y-3' dari sini karena sudah ditangani 'gap-y-3' di induk.
    */}
    {employees.map((employee) => (
        <div
            key={employee.id}
            // ▼ Tambahkan 'col-span-full' dan 'grid-cols-subgrid'
            className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm px-6 py-4"
        >
            {/* Isinya tetap sama, mereka akan pas secara otomatis */}
            <div className="w-2 h-full bg-[#EFF8FF] rounded-l"></div>
            
            <div className="flex justify-center bg-amber-500">
                <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={employee.avatarUrl}
                    alt={`Foto ${employee.name}`}
                />
            </div>
            
            <div className="font-medium text-gray-900 bg-amber-500">{employee.name}</div>
            
            <div className="text-gray-700 bg-amber-700">{employee.job}</div>
            
            <div className="text-gray-700">{employee.phone}</div>
            
            <div className="flex items-center justify-end gap-3">
                <span className="px-3 py-1 w-30 text-center text-md rounded-xl bg-[#00B998] text-white">
                    {employee.status}
                </span>
                <PencilIcon className="text-gray-400 cursor-pointer" />
            </div>
        </div>
    ))}
</div>
                </div>
            </div>
        </div>
    );
}

export default Profil;