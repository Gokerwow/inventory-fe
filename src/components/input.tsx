
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
                    readOnly={readOnly}
                    className={`text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue- ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    )
}