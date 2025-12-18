// src/components/searchBar.tsx
import { type ChangeEvent } from 'react';

interface SearchBarProps {
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ 
    value, 
    onChange, 
    placeholder = "Cari...", 
    className = "" 
}: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value} // Use controlled input if 'value' is passed
                onChange={onChange}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 text-gray-700 outline-none rounded-lg transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
                placeholder={placeholder}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 512 512"
                >
                    <path
                        d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                        fill="none"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                        strokeWidth="32"
                    />
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="32"
                        d="M338.29 338.29L448 448"
                    />
                </svg>
            </div>
        </div>
    );
}