// src/components/ToasterCustom.tsx
// (Nama file biarkan ToasterCustom.tsx, tapi nama komponen di bawah ini saya ubah)
// Pastikan impor di Layout.tsx juga diubah jika Anda mengubah nama ekspor

import { toast, type Toast } from 'react-hot-toast';

// Komponen ini wajib menerima 't' (objek toast)
interface Props {
    t: Toast;
}

export const ToasterCustom = ({ t }: Props) => {
    return (
        <div
            // 1. KELAS ANIMASI DIHAPUS TOTAL
            // 2. Saya ganti warna kustom Anda dengan 'bg-green-500' (bawaan Tailwind)
            //    untuk memastikan tidak ada masalah 'JIT' (Just-in-Time)
            className={`
        flex items-center w-full max-w-xs p-4 
        bg-green-500 text-white shadow-lg rounded-xl 
      `}
        >
            {/* 3. Ikon masih dikomen, kita biarkan dulu */}
            {/* <div className="shrink-0 p-2 bg-black bg-opacity-20 rounded-full">
        <Check className="h-6 w-6 text-white" />
      </div> */}

            {/* Teks */}
            <div className="ml-3">
                <p className="text-base font-semibold">Anda berhasil</p>
                <p className="text-xl font-bold -mt-1">Login (Kustom)</p>
            </div>

            {/* Tombol Close (Opsional) */}
            <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-auto text-white/50 hover:text-white"
            >
                &times;
            </button>
        </div>
    );
};