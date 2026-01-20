// src/pages/NotFound.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    // Mengubah judul dokumen saat komponen di-mount
    useEffect(() => {
        document.title = "404 - Halaman Tidak Ditemukan";
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 transition-all duration-500">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.01]">
                <div className="h-2 w-full bg-indigo-500"></div>

                <div className="p-10 text-center">
                    <div className="mx-auto w-24 h-24 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-8 shadow-inner animate-pulse">
                        <FileQuestion size={48} strokeWidth={1.5} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        404
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-gray-500 mb-10 leading-relaxed text-sm md:text-base">
                        Ups! Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke alamat lain.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => navigate('/')}
                            variant='primary'
                            className="w-full py-3 justify-center shadow-lg shadow-indigo-200"
                        >
                            Kembali ke Home
                        </Button>

                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-400 hover:text-indigo-600 transition-colors duration-200 font-medium"
                        >
                            ← Kembali ke Halaman Sebelumnya
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;