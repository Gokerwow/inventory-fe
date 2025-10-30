import PfpExample from '../assets/Pfp Example.jpeg';
import PencilIcon from '../assets/pencil Icon.svg?react'
import { employees, FAQ } from '../Mock Data/data';
import { useAuth } from '../hooks/useAuth';
import ButtonConfirm from '../components/buttonConfirm';

function Profil() {
    const { user } = useAuth()

    return (
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl flex flex-col gap-4 w-full pb-15">
            <div className='flex w-ful'>
                <h1 className="text-3xl font-bold p-8 px-15 shadow-lg">Profil</h1>
                <ButtonConfirm
                text='edit'
                className='bg-[#F4AF0C]'
                />
            </div>

            <div className="bg-white rounded-lg p-8">
                <div className='flex gap-8'>
                    <div className='p-8'>
                        <div className='bg-white rounded-full w-70 h-70 flex items-center justify-center overflow-hidden shadow-2xl'>
                            <img src={PfpExample} alt="Profile Picture" className='w-full' />
                        </div>
                    </div>
                    <div className='text-xl p-8 gap-8'>
                        <h1 className='font-bold text-2xl'>Biodata Diri</h1>
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
            { user && user.role === 'superAdmin' && 
            <>
            <div className='px-15 w-full'>
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Daftar Pegawai</h1>

                <div className="w-full">
                    <div className="grid grid-cols-[30px_80px_1fr_1fr_1fr_auto] gap-x-4 gap-y-3">
                        <div className="col-span-full grid grid-cols-subgrid gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider items-center">
                            <span></span>
                            <span>Foto Akun</span>
                            <span>Daftar pegawai</span>
                            <span>Jabatan</span>
                            <span>No telepon</span>
                            <span className="text-center">Aktivitas</span>
                        </div>

                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm"
                            >
                                <div className="w-full h-full bg-[#EFF8FF] rounded-l px-6 py-4"></div>

                                <div className="flex justify-center py-4">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={employee.avatarUrl}
                                        alt={`Foto ${employee.name}`}
                                    />
                                </div>

                                <div className="font-medium text-gray-900 py-4">{employee.name}</div>

                                <div className="text-gray-700 py-4">{employee.job}</div>

                                <div className="text-gray-700 py-4">{employee.phone}</div>

                                <div className="flex items-center justify-end gap-3 py-4 px-4">
                                    <span className="px-3 py-1 w-30 text-center text-md rounded-xl bg-[#00B998] text-white">
                                        {employee.status}
                                    </span>
                                    <PencilIcon className="text-gray-400 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='px-15 w-full'>
                <h1 className="text-2xl font-bold mb-6 text-gray-900 mt-5">Frequently Asked Questions</h1>

                <div className="w-full">
                    <div className="grid grid-cols-[30px_1fr] gap-x-4 gap-y-3">
                        {FAQ.map((FAQ) => (
                            <div
                                key={FAQ.text}
                                className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm"
                            >
                                <div className="w-full h-full bg-[#EFF8FF] rounded-l px-6 py-4"></div>

                                <div className="p-4">
                                    <p>{FAQ.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
            }
            
        </div>
    );
}

export default Profil;