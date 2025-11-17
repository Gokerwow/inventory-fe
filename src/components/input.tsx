
import { type ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Input({ id, judul, placeholder, value, type, name, onChange, className, readOnly = false }: { id: string, judul: string, placeholder: string, value?: string, type?: string, name: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, className?: string, readOnly?: boolean }) {
    return (
        <div className={twMerge(`relative flex flex-col ${className}`)}>
            <label className="mb-2 font-semibold">{judul}</label>

            <div className="relative w-full">
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={readOnly}
                    className={twMerge(
                        "text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full transition-colors duration-200",
                        "focus:outline-none focus:border-blue-500", // Style normal
                        readOnly && "bg-gray-100 cursor-not-allowed focus:border-[#CDCDCD] text-gray-500 select-none" // Style ReadOnly (Override)
                    )}
                />
            </div>
        </div>
    )
}