import Input from "../components/input"

export default function TambahAkunPage() {
    return (
        <div className="min-h-full bg-[#F3F7FA] rounded-lg  overflow-auto shadow-md flex flex-col">
            <h1 className="bg-[#057CFF] p-8 text-2xl text-white text-center font-semibold">TAMBAH AKUN BARU</h1>

            <div className="flex flex-col items-center py-10 bg-amber-500 flex-1">
                <div className="bg-gray-600 rounded-full w-[279px] h-[279px]">

                </div>
                <div className="grid grid-cols-2 bg-amber-950 flex-1">
                    <div className="bg-amber-500">
                        <Input />
                        <Input />
                    </div>
                    <div className="bg-amber-800">
                        <Input />
                        <Input />
                    </div>
                </div>
            </div>
        </div>
    )
}