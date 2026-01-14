import { forwardRef, type ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps {
    id: string;
    judul: string;
    placeholder?: string;
    value?: string | number;
    type?: string;
    name: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    readOnly?: boolean;
    step?: string | number;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
    {
        id,
        judul,
        placeholder,
        value,
        type = "text",
        name,
        onChange,
        className,
        readOnly = false,
        step
    },
    ref
) => {
    return (
        <div className={twMerge(`relative flex flex-col ${className}`)}>
            <label className="mb-1.5 md:mb-2 text-sm md:text-base font-semibold text-gray-700">{judul}</label>

            <div className="relative w-full">
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={readOnly}
                    step={step}
                    className={twMerge(
                        // Base styles: Responsive font size & padding
                        "text-[#6E7781] border-2 border-[#CDCDCD] rounded-lg w-full transition-colors duration-200",
                        "text-sm md:text-base", // Font responsive
                        "px-4 py-2 md:px-5 md:py-2.5", // Padding responsive (sedikit lebih kecil di mobile)
                        "focus:outline-none focus:border-blue-500",
                        readOnly && "bg-gray-100 cursor-not-allowed focus:border-[#CDCDCD] text-gray-500 select-none"
                    )}
                />
            </div>
        </div>
    )
})

export default Input;