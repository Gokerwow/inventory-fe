// GANTI MENJADI INI:
// (Gunakan ikon dari lucide-react agar lebih aman, seperti yang kita bahas)
// import { Check } from 'lucide-react';

// Perhatikan: TIDAK perlu impor 'toast' atau 'Toast'
// TIDAK perlu interface Props

export const ToasterCustom = () => {
    return (
        // Ini hanyalah JSX murni
        <div className="flex items-center">
            {/* Ikon Checkmark */}
            <div className="shrink-0 p-2 bg-black bg-opacity-20 rounded-full">
                {/* <Check className="h-6 w-6 text-white" /> */}
            </div>

            {/* Teks */}
            <div className="ml-3">
                <p className="text-base font-semibold">Anda berhasil</p>
                <p className="text-xl font-bold -mt-1">Login</p>
            </div>

            {/* HAPUS TOMBOL CLOSE. ToastContainer akan menampilkannya. */}
        </div>
    );
};