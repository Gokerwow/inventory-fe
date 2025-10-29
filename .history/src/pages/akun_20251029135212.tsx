import { MOCK_USERS } from '../Mock Data/data'
import PencilIcon from '../assets/pencil Icon.svg?react'


export default function AkunPage() {
    return (
<div className="bg-slate-100 min-h-screen p-8">
      {/* --- Bagian Judul dan Tombol Aksi --- */}
      <div className="relative mb-8">
        <h1 className="text-3xl font-semibold text-center text-blue-800">
          Daftar Data Akun Pengguna
        </h1>
        {/* Garis bawah judul */}
        <div className="w-56 h-1 bg-blue-800 mx-auto mt-2 rounded"></div>
        
        {/* Tombol titik tiga di pojok kanan atas */}
        <button className="absolute top-0 right-0 p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors">
          <MoreVertical size={24} className="text-gray-700" />
        </button>
      </div>

      {/* --- Container untuk List Akun --- */}
      <div className="space-y-3">
        {/* --- Header Tabel --- */}
        {/* Menggunakan grid-cols-12 untuk layout yang fleksibel */}
        <div className="grid grid-cols-12 gap-4 items-center px-6 py-2">
          <div className="col-span-1 text-sm font-medium text-gray-500">Foto Akun</div>
          <div className="col-span-2 text-sm font-medium text-gray-500">Role</div>
          <div className="col-span-2 text-sm font-medium text-gray-500">Username</div>
          <div className="col-span-3 text-sm font-medium text-gray-500">Email</div>
          <div className="col-span-2 text-sm font-medium text-gray-500">Tanggal dibuat</div>
          <div className="col-span-2 text-sm font-medium text-gray-500 text-center">Aksi</div>
        </div>

        {/* --- Baris Data (Hasil Mapping) --- */}
        {users.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center bg-white rounded-xl shadow-sm py-3 px-6"
          >
            {/* Foto Akun */}
            <div className="col-span-1">
              <Avatar seed={user.username} />
            </div>
            
            {/* Role */}
            <div className="col-span-2">
              <p className="text-gray-800 font-medium">{user.role}</p>
            </div>
            
            {/* Username */}
            <div className="col-span-2">
              <p className="text-gray-600">{user.username}</p>
            </div>
            
            {/* Email */}
            <div className="col-span-3">
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            {/* Tanggal dibuat */}
            <div className="col-span-2">
              <p className="text-gray-600">{user.createdDate}</p>
            </div>
            
            {/* Aksi */}
            <div className="col-span-2 flex justify-center">
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                <Edit size={18} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}