import Input from "../components/input"
import PencilIcon from '../assets/pencil Icon.svg?react'
import ButtonConfirm from "../components/buttonConfirm"

export default function TambahAkunPage() {
    return (
        <div className="min-h-full bg-[#F3F7FA]  shadow-md flex flex-col">
            <h1 className="bg-[#057CFF] p-8 text-2xl rounded-t-lg text-white text-center font-semibold shadow-lg">TAMBAH AKUN BARU</h1>

            <div className="flex flex-col items-center flex-1">
                <div className="py-10">
                    <div className="relative">
                        <div className="bg-gray-600 rounded-full w-[279px] h-[279px] shadow-lg">
                        </div>
                        <PencilIcon className="w-20 h-20 absolute right-0 top-2/3"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 flex-1 w-full p-8 gap-4">
                    <div className="flex flex-col gap-4">
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
                    <div className="flex flex-col gap-4">
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
            <ButtonConfirm 
            text="Selesai"
            />
        </div>
    )
}