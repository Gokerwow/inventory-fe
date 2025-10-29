import { twMerge } from 'tailwind-merge';

export default function Status({ text, color, className } : { text: string, color: string, className?: string }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white ${color} ${className}`}>
            {text}
        </span>
    )
}