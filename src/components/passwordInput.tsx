
import { useState, type ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Input({ id, judul, placeholder, value, type, name, onChange, className }: { id: string, judul: string, placeholder: string, value?: string, type?: string, name: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, className?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className={twMerge(`relative flex flex-col ${className}`)}>
            <label className="mb-2 font-semibold">{judul}</label>

            <div className="relative w-full">
                <input
                    id={id}
                    name={name}
                    type={!showPassword ? 'password' : (type || 'text')}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    
                    className="text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none focus:border-blue-500"
                />
                <button
                    type="button" // Pastikan tipenya 'button' agar tidak men-submit form
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? (
                        <AiFillEyeInvisible size={20} /> // Ikon mata tertutup
                    ) : (
                        <AiFillEye size={20} /> // Ikon mata terbuka
                    )}
                </button>
            </div>
        </div>
    )
}