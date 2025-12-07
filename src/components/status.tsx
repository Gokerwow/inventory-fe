import { twMerge } from 'tailwind-merge';

export default function Status({ text, color, className, onClick } : { text: string, color: string, className?: string, onClick?: () => void }) {
    return (
        <span onClick={onClick} className={twMerge(`inline-flex w-fit items-center justify-center px-3 py-1 rounded-lg text-sm font-medium text-white ${color} ${className}`)}>
            {text}
        </span>
    )
}