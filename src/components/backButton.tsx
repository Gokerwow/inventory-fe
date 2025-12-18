import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '../assets/svgs/arrow-left.svg?react';

interface BackButtonProps {
    to?: string;
    className?: string;
    variant?: 'default' | 'minimal' | 'outlined' | 'solid';
}

const BackButton = ({ to, className = "", variant = 'default' }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    const variants = {
        // Desain Modern dengan Shadow
        default: `
            flex items-center gap-3 px-4 py-2.5 
            bg-white hover:bg-gray-50 
            border border-gray-200 hover:border-primary 
            rounded-lg shadow-sm hover:shadow-md
            text-gray-700 hover:text-primary
            transition-all duration-200 ease-in-out
            group
        `,
        
        // Desain Minimal Clean
        minimal: `
            flex items-center gap-2 px-3 py-2
            text-gray-600 hover:text-primary
            hover:bg-blue-50/50 rounded-lg
            transition-all duration-200
            group
        `,
        
        // Desain Outlined Bold
        outlined: `
            flex items-center gap-3 px-5 py-2.5
            bg-white hover:bg-primary
            border-2 border-primary
            rounded-lg
            text-primary hover:text-white
            font-medium
            transition-all duration-200
            group
        `,
        
        // Desain Solid Elegant
        solid: `
            flex items-center gap-3 px-5 py-2.5
            bg-gradient-to-r from-primary to-blue-600
            hover:from-blue-600 hover:to-primary
            rounded-lg shadow-md hover:shadow-lg
            text-white
            font-medium
            transition-all duration-300
            group
        `
    };

    const iconStyles = {
        default: "w-4 h-4 text-gray-500 group-hover:text-primary transition-all group-hover:-translate-x-1",
        minimal: "w-4 h-4 text-gray-500 group-hover:text-primary transition-all group-hover:-translate-x-0.5",
        outlined: "w-4 h-4 text-primary group-hover:text-white transition-all group-hover:-translate-x-1",
        solid: "w-4 h-4 text-white transition-all group-hover:-translate-x-1"
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`${variants[variant]} cursor-pointer ${className}`}
        >
            <ArrowLeftIcon className={`${iconStyles[variant]} duration-200`} />
            <span className="text-sm font-medium">Kembali</span>
        </button>
    );
};

export default BackButton;