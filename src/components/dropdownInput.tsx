import { useState } from "react";

export default function DropdownInput<T = string>({
    options,
    placeholder,
    judul,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    type,
    name,
    disabled
}: {
    options: T[];
    placeholder?: string;
    judul?: string;
    value?: string;
    onChange?: (selectedOption: T) => void;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string | number;
    type?: 'button';
    name?: string;
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false);
    const defaultGetLabel = (option: T): string => {
        if (typeof option === 'string') return option;

        if (typeof option === 'number') return String(option);

        if (option && typeof option === 'object') {
            if ('name' in option) {
                return String((option as any).name);
            }
            if ('nama' in option) {
                return String((option as any).nama);
            }
        }

        return String(option);
    };

    const defaultGetValue = (option: T): string | number => {
        if (typeof option === 'string' || typeof option === 'number') {
            return option;
        }

        if (option && typeof option === 'object' && 'id' in option) {
            return (option as any).id;
        }

        return String(option);
    };

    const getLabelFn = getOptionLabel || defaultGetLabel;
    const getValueFn = getOptionValue || defaultGetValue;

    const handleClick = () => {
        setOpen(!open);
    };


    const handleSelect = (option: T) => {
        setOpen(false);

        if (onChange) {
            onChange(option);
        }
    };

    const selectedLabel = value || "";

    return (
        <div className="relative flex flex-col">
            {judul && (
                <label className="mb-2 font-semibold">{judul}</label>
            )}

            {/* Button Trigger Dropdown */}
            <button
                type={type}
                name={name}
                onClick={handleClick}
                disabled={disabled}
                className={`${selectedLabel
                    ? 'text-gray-700'
                    : 'text-[#6E7781]/50'
                    } hover:bg-gray-300/50 transition-all duration-200 rounded-lg border-2 border-[#CDCDCD] text-sm px-5 py-2.5 inline-flex items-center justify-between
                    disabled:bg-gray-100 
                    disabled:text-gray-400 
                    disabled:cursor-not-allowed 
                    disabled:hover:bg-gray-100
                    `}
            >
                {selectedLabel || placeholder}

                {/* Arrow Icon */}
                <svg
                    className={`w-4 h-4 ms-3 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'
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
                className={`absolute top-full left-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full transition-all duration-300 ease-out transform ${open
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
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${selectedLabel === label
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