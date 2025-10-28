import { useState } from "react";

export default function DropdownInput({ options, placeholder }: { options: string[], placeholder?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="text-[#6E7781]/50 hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between"
            >
                {placeholder}
                <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div
                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full transition-all duration-300 ease-out transform
                                                ${open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                                                `}
            >
                <ul className="py-2 text-sm text-gray-700">
                    {options.map(nama => <li key={nama}><a href="#" className="block px-4 py-2 hover:bg-gray-100">{nama}</a></li>)}
                </ul>
            </div>
        </div>
    )
}