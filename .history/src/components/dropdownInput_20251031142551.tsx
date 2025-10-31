import { useState } from "react";

export default function DropdownInput({ 
    options, 
    placeholder, 
    judul,
    value,
    onChange,
    type
}: { 
    options: string[], 
    placeholder?: string, 
    judul?: string,
    value?: string,
    onChange?: (value: string) => void,
    type?: 'button'
}) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");

    const handleClick = () => {
        setOpen(!open);
    }

    const handleSelect = (option: string) => {
        setSelectedValue(option);
        setOpen(false);
        
        // Panggil onChange jika ada (untuk controlled component)
        if (onChange) {
            onChange(option);
        }
    }

    return (
        <div className="relative flex flex-col">
            <label className="mb-2 font-semibold">{judul}</label>
            <button
                onClick={handleClick}
                className={`${selectedValue ? 'text-gray-700' : 'text-[#6E7781]/50'} hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between`}
            >
                {selectedValue || placeholder}
                <svg 
                    className={`w-4 h-4 ms-3 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 10 6"
                >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div
                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full transition-all duration-300 ease-out transform
                    ${open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
                `}
            >
                <ul className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    {options.map(nama => (
                        <li key={nama}>
                            <button
                                onClick={() => handleSelect(nama)}
                                type={type}
                                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedValue === nama ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                            >
                                {nama}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}