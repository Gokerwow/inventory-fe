import { MOCK_USERS } from '../Mock Data/data'
import PencilIcon from '../assets/pencilIcon2.svg?react'
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Impor locale Indonesia
import BurgerDot from '../assets/burgerDot.svg?react'

function FormatTanggal(props) {
    const { isoString } = props
    if (!isoString) return null;

    const date = new Date(isoString);
    const formatted = format(date, 'dd MMMM yyyy', { locale: id })

    return <>{formatted}</>
}

export default function AkunPage() {
    return (
        <div className="min-h-full p-8 bg-white rounded-lg shadow-md">
            <div className="relative mb-8">
                <div className="w-full text-center">

                    <h1 className="text-3xl font-semibold text-black border-b-4 border-black inline-flex">
                        Daftar Data Akun Pengguna
                    </h1>

                </div>

                <button className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                    <BurgerDot className='w-10 h-10' />
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center py-2">
                    <div className="col-span-1 text-sm font-medium text-gray-500"></div>
                    <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Username</div>
                    <div className="col-span-3 text-sm font-medium text-gray-500">Email</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal dibuat</div>
                    <div className="col-span-2 text-sm font-medium text-gray-500 text-center">Aksi</div>
                </div>

                {MOCK_USERS.map((user, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[30px_repeat(12,minmax(0,1fr))] gap-4 items-center bg-white rounded-xl shadow-md"
                    >
                        <div className={`col-span-1 h-full bg-[#EFF8FF] rounded-l-lg py-3`}></div>

                        {/* Foto Akun */}
                        <div className="col-span-1 py-3">
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>

                        {/* Role */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-800 font-medium">{user.role}</p>
                        </div>

                        {/* Username */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">{user.username}</p>
                        </div>

                        {/* Email */}
                        <div className="col-span-3 py-3">
                            <p className="text-gray-600">{user.email}</p>
                        </div>

                        {/* Tanggal dibuat */}
                        <div className="col-span-2 py-3">
                            <p className="text-gray-600">
                                <FormatTanggal
                                    isoString={user.created_at}
                                />
                            </p>
                        </div>

                        {/* Aksi */}
                        <div className="col-span-2 flex justify-center py-3">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-800 transition-colors">
                                <PencilIcon />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}