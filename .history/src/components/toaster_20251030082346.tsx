import CheckIcon from '../assets/checkIcon.svg?react'
// GANTI MENJADI INI:
// (Gunakan ikon dari lucide-react agar lebih aman, seperti yang kita bahas)
// import { Check } from 'lucide-react';

// Perhatikan: TIDAK perlu impor 'toast' atau 'Toast'
// TIDAK perlu interface Props

export const ToasterCustom = () => {
    return (
        // Ini hanyalah JSX murni
        <div className="flex items-center p-4 w-full bg-amber-500 relative">
            {/* Ikon Checkmark */}
            <CheckIcon className="h-6 w-6 text-white absolute" />

            {/* Teks */}
            <div className="bg-amber-300 w-full text-center">
                <p className="text-md font-semibold">Anda berhasil</p>
                <p className="text-md font-bold -mt-1">Login</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};