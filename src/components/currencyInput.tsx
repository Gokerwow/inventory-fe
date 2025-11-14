// src/components/CurrencyInput.tsx
export default function CurrencyInput({
    id,
    placeholder,
    judul,
    value,
    onChange,
    name,
    disabled,
    prefix = "Rp"
}: {
    id?: string;
    placeholder?: string;
    judul?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    name?: string;
    disabled?: boolean;
    prefix?: string;
}) {
    const formatCurrency = (value: string | number): string => {
        if (!value) return '';
        const numericValue = value.toString().replace(/\D/g, '');
        if (!numericValue) return '';
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const valueWithoutPrefix = inputValue.replace(prefix, '').trim();
        const numericValue = valueWithoutPrefix.replace(/\D/g, '');
        
        if (onChange) {
            onChange(numericValue);
        }
    };

    const displayValue = value ? formatCurrency(value) : '';

    return (    
        <div className="relative flex flex-col">
            {judul && (
                <label htmlFor={id} className="mb-2 font-semibold">
                    {judul}
                </label>
            )}
            
            <div className="relative">
                {prefix && (
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                        {prefix}
                    </span>
                )}
                
                <input
                    type="text"
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`
                        ${prefix ? 'pl-14' : 'pl-5'} 
                        pr-5 py-2.5 w-full
                        text-gray-700 border-2 border-[#CDCDCD] rounded-lg text-sm
                        focus:outline-none focus:border-blue-500
                        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                        transition-colors
                    `}
                />
            </div>
        </div>
    );
}