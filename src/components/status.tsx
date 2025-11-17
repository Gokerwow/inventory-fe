import { twMerge } from 'tailwind-merge';

export default function Status({ text, color, className } : { text: string, color: string, className?: string }) {
    return (
        <span className={twMerge(`inline-flex w-fit items-center justify-center px-3 py-1 rounded-lg text-sm font-medium text-white ${color} ${className}`)}>
            {text}
        </span>
    )
}