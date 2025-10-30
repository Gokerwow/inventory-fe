import CheckIcon from '../assets/checkIcon.svg?react'
// GANTI MENJADI INI:
// (Gunakan ikon dari lucide-react agar lebih aman, seperti yang kita bahas)
// import { Check } from 'lucide-react';

// Perhatikan: TIDAK perlu impor 'toast' atau 'Toast'
// TIDAK perlu interface Props

export const ToasterCustom = () => {
    return (
        // Ini hanyalah JSX murni
        <div className="flex items-center p-4 w-full ">
            {/* Ikon Checkmark */}
            <CheckIcon className=" text-white absolute -top-5" />

            {/* Teks */}
            <div className="w-full text-center">
                <p className="text-lg font-semibold">Anda berhasil</p>
                <p className="text-lg font-bold -mt-1">Login</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};