import CheckIcon from '../assets/checkIcon.svg?react'
// GANTI MENJADI INI:
// (Gunakan ikon dari lucide-react agar lebih aman, seperti yang kita bahas)
// import { Check } from 'lucide-react';

// Perhatikan: TIDAK perlu impor 'toast' atau 'Toast'
// TIDAK perlu interface Props

export const ToasterCustom = ({ message } : { message: string }) => {
    return (
        // Ini hanyalah JSX murni
        <div className="flex items-center w-full ">
            {/* Ikon Checkmark */}
            <CheckIcon className=" text-white absolute -top-5" />

            {/* Teks */}
            <div className="w-full text-center">
                <p className="text-lg font-semibold">{message}</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};