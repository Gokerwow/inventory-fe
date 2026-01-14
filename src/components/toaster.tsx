import { Check, X, AlertCircle, AlertTriangle } from 'lucide-react'; // Tambahkan AlertTriangle

interface ToasterCustomProps {
    message: string;
    type?: 'success' | 'error' | 'warning'; // Tambahkan tipe warning
}

export const ToasterCustom = ({ message, type = 'success' }: ToasterCustomProps) => {
    
    // Konfigurasi style berdasarkan tipe
    const toastStyles = {
        success: {
            accentLine: 'bg-green-500',
            iconBg: 'bg-green-50',
            icon: <Check className="w-5 h-5 text-green-600" strokeWidth={3} />,
            title: 'Sukses',
            titleColor: 'text-gray-400',
            showClose: false
        },
        error: {
            accentLine: 'bg-red-500',
            iconBg: 'bg-red-50',
            icon: <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />,
            title: 'Gagal',
            titleColor: 'text-red-400',
            showClose: true
        },
        warning: {
            accentLine: 'bg-amber-500',
            iconBg: 'bg-amber-50',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={2.5} />,
            title: 'Peringatan',
            titleColor: 'text-amber-400',
            showClose: true
        }
    };

    const style = toastStyles[type];

    return (
        <div className="relative w-full select-none pointer-events-none">
            
            {/* Kartu Utama */}
            <div className="pointer-events-auto flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-r-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] overflow-hidden">
                
                {/* 1. GARIS AKSEN */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentLine}`} />

                {/* 2. BACKGROUND IKON */}
                <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${style.iconBg}`}>
                    {/* 3. IKON */}
                    {style.icon}
                </div>

                {/* Bagian Teks */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    {/* Judul Kecil */}
                    <h4 className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${style.titleColor}`}>
                        {style.title}
                    </h4>
                    {/* Pesan */}
                    <p className="text-sm font-semibold text-gray-800 leading-snug wrap-break-word">
                        {message}
                    </p>
                </div>
                
                {/* Tombol Close (Muncul di Error & Warning) */}
                {style.showClose && (
                    <div className="text-gray-300">
                        <X className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
};