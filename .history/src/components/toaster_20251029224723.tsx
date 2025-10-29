// src/components/LoginToast.tsx

import { toast, type Toast } from 'react-hot-toast';
import Check from '../assets/checkIcon.svg?react'

// Komponen ini wajib menerima 't' (objek toast)
interface Props {
    t: Toast;
}

export const ToasterCustom = ({ t }: Props) => {
    return (
        <div
            // 't.visible' digunakan untuk animasi masuk/keluar
            className={`
        flex items-center w-full max-w-xs p-4 
        bg-[#00A991] text-white shadow-lg rounded-xl 
        `}
        >
            {/* Ikon Checkmark */}
            <div className="shrink-0 p-2 bg-black bg-opacity-20 rounded-full">
                <Check className="h-6 w-6 text-white" />
            </div>

            {/* Teks */}
            <div className="ml-3">
                <p className="text-base font-semibold">Anda berhasil</p>
                <p className="text-xl font-bold -mt-1">Login</p>
            </div>

            {/* Tombol Close (Opsional) */}
            <button
                // Gunakan t.id untuk menutup toast spesifik ini
                onClick={() => toast.dismiss(t.id)}
                className="ml-auto text-white/50 hover:text-white"
            >
                &times;
            </button>
        </div>
    );
}