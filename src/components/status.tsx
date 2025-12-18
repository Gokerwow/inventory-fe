// 1. Definisikan tipe agar konsisten
type StatusVariant = 'pending' | 'success' | 'warning' | 'danger';

// 2. Sesuaikan keys di sini agar sama persis dengan variant
const STATUS_STYLES: Record<StatusVariant, string> = {
    success: "bg-green-600 text-white", // Hijau (Cocok untuk Paid/Confirm)
    warning: "bg-yellow-500 text-white", // Kuning (Cocok untuk Unpaid)
    pending: "bg-gray-400 text-white",   // Abu-abu (Cocok untuk Pending)
    danger: "bg-red-600 text-white",     // Merah (Opsional: untuk Cancelled/Failed)
};

interface StatusProps {
    text: string;
    variant: StatusVariant;
}

export default function Status({ text, variant }: StatusProps) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[variant]}`}>
            {text}
        </span>
    );
}