import { MOCK_USERS } from '../Mock Data/data'
import PencilIcon from '../assets/pencil Icon.svg?react'


export default function AkunPage() {
    return (
        <div className='px-15 w-full bg-white'>
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

                    {MOCK_USERS.map((employee) => (
                        <div
                            key={employee.user_id}
                            className="col-span-full grid grid-cols-subgrid gap-4 items-center bg-white rounded-xl shadow-sm"
                        >
                            <div className="w-full h-full bg-[#EFF8FF] rounded-l px-6 py-4"></div>

                            <div className="flex justify-center py-4">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={employee.avatarUrl}
                                    alt={`Foto ${employee.username}`}
                                />
                            </div>

                            <div className="font-medium text-gray-900 py-4">{employee.role}</div>

                            <div className="text-gray-700 py-4">{employee.username}</div>

                            <div className="text-gray-700 py-4">{employee.email}</div>

                            <div className="text-gray-700 py-4">{employee.created_at}</div>

                            <div className="flex items-center justify-end gap-3 py-4 px-4">
                                <span className="px-3 py-1 w-30 text-center text-md rounded-xl bg-[#00B998] text-white">
                                    {employee.status}
                                </span>
                                <PencilIcon className="text-gray-400 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}