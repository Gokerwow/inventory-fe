export default function Input() {
    return (
                                <div className="relative flex flex-col">
                            <label className="mb-2 font-semibold">Jabatan</label>

                            <div className="relative w-full">

                                <input
                                    id="namaPihakPertama"
                                    type="text"
                                    placeholder='Masukkan Jabatan'
                                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
    )
}