import { useNavigate } from 'react-router-dom';
// Pastikan Anda punya icon panah kiri, atau ganti dengan text "<"
import ArrowLeftIcon from '../assets/svgs/arrow-left.svg?react';

interface BackButtonProps {
    to?: string; // Opsional: jika ingin arahkan ke link spesifik
    className?: string; // Opsional: jika ingin tambah styling custom
}

const BackButton = ({ to, className = "" }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1); // Logika "Back" standard (seperti tombol back browser)
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`flex items-center gap-2 text-gray-500 hover:text-[#005DB9] transition-colors font-medium text-sm group ${className}`}
        >
            <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-[#005DB9] transition-colors shadow-sm">
                {/* Ganti ArrowLeftIcon dengan icon SVG Anda */}
                <ArrowLeftIcon className="w-4 h-4 text-gray-600 group-hover:text-[#005DB9]" />
            </div>
            <span>Kembali</span>
        </button>
    );
};

export default BackButton;