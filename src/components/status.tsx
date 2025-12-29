type StatusVariant = 'pending' | 'success' | 'warning' | 'danger' | 'neutral';

const STATUS_STYLES: Record<StatusVariant, string> = {
    success: "bg-green-100 text-green-700 border border-green-200", 
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    pending: "bg-gray-100 text-gray-600 border border-gray-200",
    danger:  "bg-red-100 text-red-700 border border-red-200",
    neutral: "bg-blue-100 text-blue-700 border border-blue-200",
};

const VARIANT_MAP: Record<string, StatusVariant> = {
    // Normal Group
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    neutral: 'neutral',

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
    'aktif': 'success',
    'sudah dibayar': 'success',
    
    // Warning group
    pending: 'warning',
    unsigned: 'warning',
    unpaid: 'warning',
    'belum ditandatangani': 'warning',
    'belum dibayar': 'warning',
    'non-aktif': 'warning',
    
    // Danger group
    failed: 'danger',
    cancelled: 'danger',
    inactive: 'danger',
    rejected: 'danger',
    
    // Pending group
    checked: 'pending',
    process: 'pending',
    waiting: 'pending'
};

interface StatusProps {
    value?: string | null;
    code?: string | null;
    label?: string | null;
    className?: string;
}

export default function Status({ value, code, label, className = '' }: StatusProps) {
    const logicSource = code || value || '';
    const displaySource = label || value || '-';

    const cleanValue = logicSource.toString().toLowerCase().trim();

    let variant: StatusVariant = 'neutral'; 

    if (VARIANT_MAP[cleanValue]) {
        variant = VARIANT_MAP[cleanValue];
    } 
    else {
        if (
            cleanValue.includes('logout') || 
            cleanValue.includes('keluar') ||
            cleanValue.includes('delete')
        ) {
            variant = 'danger';
        } 
        else if (
            cleanValue.includes('login') || 
            cleanValue.includes('masuk')
        ) {
            variant = 'success';
        }
        else {
            variant = 'neutral'; 
        }
    }

    let displayText = displaySource;
    
    if (!label && displaySource !== '-') {
        const str = displaySource.toString();
        
        if (str.length > 15 || str.includes(' ')) {
            displayText = str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        } else {
            displayText = str.replace(/_/g, ' ').toUpperCase();
        }
    }

    return (
        <span 
            className={`
                px-2.5 py-1 rounded-md text-xs font-semibold 
                inline-flex items-center justify-center text-center
                whitespace-normal break-words max-w-full leading-tight
                ${STATUS_STYLES[variant]} 
                ${className}
            `}
        >
            {displayText}
        </span>
    );
}