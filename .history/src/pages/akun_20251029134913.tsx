import { MOCK_USERS } from '../Mock Data/data'
import PencilIcon from '../assets/pencil Icon.svg?react'


export default function AkunPage() {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">Daftar Data Akun Pengguna</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Foto Akun</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Username</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tanggal dibuat</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_USERS.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                    {/* Placeholder for profile photo */}
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">Foto</span>
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.created_at}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        <PencilIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}