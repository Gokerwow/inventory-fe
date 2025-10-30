import Input from "../components/input"
import PencilIcon from '../assets/pencilIcon.svg?react'

export default function TambahAkunPage() {
    return (
        <div className="min-h-full bg-[#F3F7FA] rounded-lg  overflow-auto shadow-md flex flex-col">
            <h1 className="bg-[#057CFF] p-8 text-2xl text-white text-center font-semibold shadow-lg">TAMBAH AKUN BARU</h1>

            <div className="flex flex-col items-center flex-1">
                <div className="py-10">
                    <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                    </div>
                    <PencilIcon />
                </div>
                <div className="grid grid-cols-2 flex-1 w-full">
                    <div className="p-8 flex flex-col gap-4">
                        <Input
                            id="role"
                            judul="Role"
                            placeholder="Role"
                        />
                        <Input
                            id="username"
                            judul="Username"
                            placeholder="Username"
                        />
                    </div>
                    <div className="p-8 flex flex-col gap-4">
                        <Input
                            id="password"
                            judul="Password"
                            placeholder="Password"
                        />
                        <Input
                            id="email"
                            judul="Email"
                            placeholder="Email"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}