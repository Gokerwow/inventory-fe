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
            <CheckIcon className=" text-white absolute inset-0" />

            {/* Teks */}
            <div className="bg-amber-300 w-full text-center">
                <p className="text-lg font-semibold">Anda berhasil</p>
                <p className="text-lg font-bold -mt-1">Login</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};