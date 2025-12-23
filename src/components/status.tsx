import React from 'react';

type StatusVariant = 'pending' | 'success' | 'warning' | 'danger' | 'neutral';

const STATUS_STYLES: Record<StatusVariant, string> = {
    success: "bg-green-100 text-green-700 border border-green-200", 
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    pending: "bg-blue-100 text-blue-700 border border-blue-200",
    danger:  "bg-red-100 text-red-700 border border-red-200",
    neutral: "bg-gray-100 text-gray-600 border border-gray-200", 
};

// Mapping status dari BE ke Variant UI (Untuk Exact Match)
const VARIANT_MAP: Record<string, StatusVariant> = {
    // Normal Group
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    neutral: 'neutral',
    pending: 'pending',

    // Success group
    paid: 'success',
    settlement: 'success',
    active: 'success',
    'telah ditandatangani': 'success',
    confirmed: 'success',
    signed: 'success',
    'approved_admin_gudang': 'success',
    'approved_pj': 'success',
    'lunas': 'success',

    // Warning group
    checked: 'warning',
    unsigned: 'warning',
    unpaid: 'warning',
    'belum ditandatangani': 'warning',
    'belum dibayar': 'warning',

    // Danger group
    failed: 'danger',
    cancelled: 'danger',
    inactive: 'danger',
    rejected: 'danger',

    // Pending group
    process: 'pending',
    waiting: 'pending'
};

interface StatusProps {
    value?: string | null;  // Opsional: untuk backward compatibility
    code?: string | null;   // PRIORITAS UNTUK WARNA (status_code)
    label?: string | null;  // PRIORITAS UNTUK TEKS (status readable)
    className?: string;     // TAMBAHAN: Untuk custom style (width, margin, dll)
}

export default function Status({ value, code, label, className = '' }: StatusProps) {
    // 1. Tentukan sumber data
    const logicSource = code || value || '';
    const displaySource = label || value || '-';

    // 2. Normalisasi string
    const cleanValue = logicSource.toString().toLowerCase().trim();

    // 3. Tentukan Variant Warna
    let variant: StatusVariant = 'neutral';

    // A. Cek Exact Match dulu (Pencarian cepat di MAP)
    if (VARIANT_MAP[cleanValue]) {
        variant = VARIANT_MAP[cleanValue];
    } 
    // B. Jika tidak ketemu, gunakan Fuzzy Match (Untuk Log Activity)
    else {
        // Logika Prioritas: Danger > Warning > Success > Neutral
        
        if (
            cleanValue.includes('logout') || 
            cleanValue.includes('keluar') || 
            cleanValue.includes('hapus') || 
            cleanValue.includes('delete') ||
            cleanValue.includes('tolak') ||
            cleanValue.includes('gagal')
        ) {
            variant = 'danger';
        } 
        else if (
            cleanValue.includes('update') || 
            cleanValue.includes('edit') || 
            cleanValue.includes('ubah') ||
            cleanValue.includes('koreksi') ||
            cleanValue.includes('ganti')
        ) {
            variant = 'warning';
        }
        else if (
            cleanValue.includes('membuat') || 
            cleanValue.includes('create') || 
            cleanValue.includes('tambah') || 
            cleanValue.includes('upload') || // mengupload
            cleanValue.includes('login') ||
            cleanValue.includes('masuk') ||
            cleanValue.includes('simpan') ||
            cleanValue.includes('success')
        ) {
            variant = 'success';
        }
        else if (
            cleanValue.includes('lihat') || 
            cleanValue.includes('view') ||
            cleanValue.includes('unduh') ||
            cleanValue.includes('download')
        ) {
            variant = 'pending'; // Biru untuk aktivitas pasif
        }
    }

    // 4. Format Teks
    // Jika label disediakan, pakai label. Jika tidak, format value-nya.
    let displayText = displaySource;
    
    if (!label && displaySource !== '-') {
        // Jika teksnya panjang (log activity), gunakan Title Case (Huruf Depan Besar)
        // Jika teksnya pendek (status kode), gunakan UPPERCASE
        const str = displaySource.toString();
        
        if (str.length > 15 || str.includes(' ')) {
            // Format Sentence Case: "membuat penerimaan" -> "Membuat Penerimaan"
            displayText = str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        } else {
            // Format Code: "pending" -> "PENDING"
            displayText = str.replace(/_/g, ' ').toUpperCase();
        }
    }

    return (
        <span 
            className={`px-2 py-1 rounded-md text-xs font-semibold inline-block truncate ${STATUS_STYLES[variant]} ${className}`}
        >
            {displayText}
        </span>
    );
}