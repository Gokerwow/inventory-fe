import { useState, useEffect, useRef } from "react";

interface DropdownInputProps<T> {
    options: T[];
    placeholder?: string;
    judul?: string;
    value?: string; // Nilai teks yang sedang dipilih/diketik
    onChange?: (selectedOption: T | string) => void; // Bisa return Object (lama) atau String (baru)
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string | number;
    name?: string;
    disabled?: boolean;
    isCreatable?: boolean; // Prop baru untuk mengaktifkan mode tambah
}

export default function DropdownInput<T = any>({
    options,
    placeholder,
    judul,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    name,
    disabled,
    isCreatable = false
}: DropdownInputProps<T>) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value || "");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Update search term jika value dari parent berubah
    useEffect(() => {
        setSearchTerm(value || "");
    }, [value]);

    // Handle Click Outside untuk menutup dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                // Jika user mengetik tapi tidak memilih, kembalikan ke value terakhir yang valid
                // Atau biarkan (tergantung UX). Di sini kita biarkan tertutup saja.
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // --- Helpers ---
    const defaultGetLabel = (option: T): string => {
        if (typeof option === 'string') return option;
        if (typeof option === 'number') return String(option);
        if (option && typeof option === 'object') {
            if ('name' in option) return String((option as any).name);
            if ('nama' in option) return String((option as any).nama);
        }
        return String(option);
    };

    const getLabelFn = getOptionLabel || defaultGetLabel;

    // --- Filtering Logic ---
    const filteredOptions = options.filter((option) =>
        getLabelFn(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cek apakah input user sama persis dengan salah satu opsi (case insensitive)
    const exactMatch = filteredOptions.some(
        (option) => getLabelFn(option).toLowerCase() === searchTerm.toLowerCase()
    );

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setOpen(true);
    };

    const handleSelectOption = (option: T) => {
        setSearchTerm(getLabelFn(option));
        setOpen(false);
        if (onChange) onChange(option);
    };

    const handleCreateNew = () => {
        setOpen(false);
        if (onChange) onChange(searchTerm); // Return string nama baru
    };

    const handleInputClick = () => {
        if (!disabled) setOpen(true);
    };

    return (
        <div className="relative flex flex-col" ref={wrapperRef}>
            {judul && (
                <label className="mb-2 font-semibold text-gray-700">{judul}</label>
            )}

            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`w-full rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 pr-10 outline-none transition-all duration-200
                        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 focus:border-blue-500'}
                    `}
                />
                
                {/* Arrow Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full left-0 mt-1 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-xl w-full max-h-60 overflow-y-auto border border-gray-100 transition-all duration-200 ease-out origin-top ${
                    open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                }`}
            >
                <ul className="py-1 text-sm text-gray-700">
                    {/* Render Options */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectOption(option)}
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    {getLabelFn(option)}
                                </button>
                            </li>
                        ))
                    ) : (
                        !isCreatable && (
                            <li className="px-4 py-2 text-gray-500 italic">Tidak ditemukan</li>
                        )
                    )}

                    {/* Render "Create New" Option */}
                    {isCreatable && searchTerm && !exactMatch && (
                        <li>
                            <button
                                type="button"
                                onClick={handleCreateNew}
                                className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 font-semibold hover:bg-green-100 border-t border-green-100"
                            >
                                + Tambah "{searchTerm}"
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}