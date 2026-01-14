// src/components/toaster.tsx
import { Check, X, AlertCircle } from 'lucide-react';

interface ToasterCustomProps {
    message: string;
    type?: 'success' | 'error'; // Tambahkan prop type
}

export const ToasterCustom = ({ message, type = 'success' }: ToasterCustomProps) => {
    // Tentukan warna dan ikon berdasarkan tipe
    const isError = type === 'error';

    return (
        <div className="relative w-full select-none pointer-events-none">
            
            {/* Kartu Utama */}
            <div className="pointer-events-auto flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-r-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] overflow-hidden">
                
                {/* 1. GARIS AKSEN (Berubah Warna) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isError ? 'bg-red-500' : 'bg-green-500'}`} />

                {/* 2. BACKGROUND IKON (Berubah Warna) */}
                <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${isError ? 'bg-red-50' : 'bg-green-50'}`}>
                    {/* 3. IKON (Berubah Sesuai Tipe) */}
                    {isError ? (
                        <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                    ) : (
                        <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                    )}
                </div>

                {/* Bagian Teks */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    {/* Judul Kecil */}
                    <h4 className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isError ? 'text-red-400' : 'text-gray-400'}`}>
                        {isError ? 'Gagal' : 'Sukses'}
                    </h4>
                    {/* Pesan */}
                    <p className="text-sm font-semibold text-gray-800 leading-snug wrap-break-word">
                        {message}
                    </p>
                </div>
                
                {/* Tombol Close (Opsional, visual saja) */}
                {isError && (
                    <div className="text-gray-300">
                        <X className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
};