export default function DropdownInput() {
    return (
                                    <div
                                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full transition-all duration-300 ease-out transform
                                            ${openPihakPertama ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                                            `}
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    {namaOptions.map(nama => <li key={nama}><a href="#" className="block px-4 py-2 hover:bg-gray-100">{nama}</a></li>)}
                                </ul>
                            </div>
    )
}