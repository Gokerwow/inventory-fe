import { Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'

// Interface
export interface CustomSelectOption {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    options: CustomSelectOption[];
    value: string | number;
    onChange: (value: any) => void;
    placeholder?: string;
    className?: string;
    dropdownClassName?: string;
    // Props Baru untuk Kontrol State
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export default function CustomSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = "Pilih...", 
    className, 
    dropdownClassName,
    isOpen,    // Terima status buka/tutup dari parent
    onToggle,  // Terima fungsi toggle dari parent
    onClose    // Terima fungsi close dari parent
}: CustomSelectProps) {
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Logic: Click Outside untuk menutup dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        // Bind event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind saat cleanup
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div ref={containerRef} className={`${className || 'relative w-full sm:w-36'}`}>
            
            {/* TOMBOL TRIGGER (Manual Button) */}
            <button
                type="button"
                onClick={onToggle}
                className="relative w-full bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium shadow-sm cursor-pointer hover:bg-gray-100 transition-colors text-left truncate h-[38px]"
            >
                <span className="block truncate">
                    {selectedLabel}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </span>
            </button>
            
            {/* DROPDOWN LIST */}
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <ul className={`absolute z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-white py-1 text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none left-0 ${dropdownClassName || 'w-full'}`}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                                onChange(option.value);
                                onClose(); // Tutup setelah memilih
                            }}
                        >
                            <span className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'}`}>
                                {option.label}
                            </span>
                            {option.value === value && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </Transition>
        </div>
    )
}