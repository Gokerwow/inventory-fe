import CheckIcon from '../assets/checkIcon.svg?react'
// GANTI MENJADI INI:
// (Gunakan ikon dari lucide-react agar lebih aman, seperti yang kita bahas)
// import { Check } from 'lucide-react';

// Perhatikan: TIDAK perlu impor 'toast' atau 'Toast'
// TIDAK perlu interface Props

export const ToasterCustom = () => {
    return (
        // Ini hanyalah JSX murni
        <div className="flex items-center p-4 w-full bg-amber-500">
            {/* Ikon Checkmark */}
            <CheckIcon className="h-6 w-6 text-white" />

            {/* Teks */}
            <div className="ml-3 bg-amber-300">
                <p className="text-base font-semibold">Anda berhasil</p>
                <p className="text-xl font-bold -mt-1">Login</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};