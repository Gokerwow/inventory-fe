import { useState } from "react";

/**
 * DropdownInput - Komponen dropdown generic yang support berbagai tipe data
 * 
 * @template T - Tipe data untuk options (string, number, object, dll)
 * 
 * @example
 * // Untuk array string
 * <DropdownInput
 *   options={["Option 1", "Option 2"]}
 *   value={value}
 *   onChange={(selected) => setValue(selected)}
 * />
 * 
 * @example
 * // Untuk array object
 * <DropdownInput<TipeDataPihak>
 *   options={pihakOptions}
 *   value={value}
 *   onChange={(selected) => handleChange(selected)}
 * />
 */
export default function DropdownInput<T = string>({
    options,
    placeholder,
    judul,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    type,
    name
}: {
    /** Array options yang akan ditampilkan di dropdown */
    options: T[];
    
    /** Text placeholder saat belum ada yang dipilih */
    placeholder?: string;
    
    /** Label/judul untuk dropdown */
    judul?: string;
    
    /** Value yang sedang dipilih (string untuk display) */
    value?: string;
    
    /** Callback function saat option dipilih, mengembalikan data utuh (T) */
    onChange?: (selectedOption: T) => void;
    
    /** Function untuk mengambil label dari option (default: ambil 'nama' property atau toString) */
    getOptionLabel?: (option: T) => string;
    
    /** Function untuk mengambil unique key dari option (default: ambil 'id' property atau toString) */
    getOptionValue?: (option: T) => string | number;
    
    /** Type button untuk form */
    type?: 'button';
    
    /** Name attribute untuk form */
    name?: string;
}) {
    const [open, setOpen] = useState(false);

    // ========== DEFAULT FUNCTIONS ==========
    /**
     * Default function untuk mendapatkan label
     * Priority: string > number > object.nama > toString
     */
    const defaultGetLabel = (option: T): string => {
        // Jika string, return langsung
        if (typeof option === 'string') return option;
        
        // Jika number, convert ke string
        if (typeof option === 'number') return String(option);
        
        // Jika object dan punya property 'nama', ambil itu
        if (option && typeof option === 'object' && 'nama' in option) {
            return String((option as any).nama);
        }
        
        // Fallback: convert apapun ke string
        return String(option);
    };

    /**
     * Default function untuk mendapatkan unique value/key
     * Priority: string/number > object.id > toString
     */
    const defaultGetValue = (option: T): string | number => {
        // Jika sudah string atau number, return langsung
        if (typeof option === 'string' || typeof option === 'number') {
            return option;
        }
        
        // Jika object dan punya property 'id', ambil itu
        if (option && typeof option === 'object' && 'id' in option) {
            return (option as any).id;
        }
        
        // Fallback: convert ke string
        return String(option);
    };

    // Gunakan custom function jika ada, kalau tidak pakai default
    const getLabelFn = getOptionLabel || defaultGetLabel;
    const getValueFn = getOptionValue || defaultGetValue;
    // ========================================

    /**
     * Toggle dropdown open/close
     */
    const handleClick = () => {
        setOpen(!open);
    };

    /**
     * Handle saat user memilih option
     * @param option - Data option yang dipilih (bisa string, object, dll)
     */
    const handleSelect = (option: T) => {
        // Tutup dropdown
        setOpen(false);
        
        // Panggil onChange callback dengan data utuh
        if (onChange) {
            onChange(option);
        }
    };

    // Label yang ditampilkan di button (dari prop value atau kosong)
    const selectedLabel = value || "";

    return (
        <div className="relative flex flex-col">
            {/* Label/Judul */}
            {judul && (
                <label className="mb-2 font-semibold">{judul}</label>
            )}
            
            {/* Button Trigger Dropdown */}
            <button
                type={type}
                name={name}
                onClick={handleClick}
                className={`${
                    selectedLabel 
                        ? 'text-gray-700' 
                        : 'text-[#6E7781]/50'
                } hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between`}
            >
                {selectedLabel || placeholder}
                
                {/* Arrow Icon */}
                <svg
                    className={`w-4 h-4 ms-3 transition-transform duration-200 ${
                        open ? 'rotate-180' : 'rotate-0'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="m1 1 4 4 4-4" 
                    />
                </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div
                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full transition-all duration-300 ease-out transform ${
                    open 
                        ? "opacity-100 translate-y-0 visible" 
                        : "opacity-0 -translate-y-2 invisible"
                }`}
            >
                <ul className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    {options.map((option) => {
                        // Dapatkan label untuk ditampilkan
                        const label = getLabelFn(option);
                        
                        // Dapatkan value untuk key React
                        const val = getValueFn(option);

                        return (
                            <li key={val}>
                                <button
                                    onClick={() => handleSelect(option)}
                                    type={type}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                                        selectedLabel === label 
                                            ? 'bg-blue-50 text-blue-600 font-medium' 
                                            : ''
                                    }`}
                                >
                                    {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}