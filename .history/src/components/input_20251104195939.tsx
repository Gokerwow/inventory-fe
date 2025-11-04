
import { type ChangeEvent } from 'react';

export default function Input({ id, judul, placeholder, value, type, name, onChange, className }: { id: string, judul: string, placeholder: string, value?: string, type?: string, name: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, className?: string }) {
    return (
        <div className="relative flex flex-col">
            <label className="mb-2 font-semibold">{judul}</label>

            <div className={`relative w-full ${className}`}>
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
    )
}