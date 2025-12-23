export const TrendIndicator = ({ 
    percent, 
    trend, 
    inverse = false 
}: { 
    percent: number, 
    trend: 'up' | 'down', 
    inverse?: boolean // Jika true, 'naik' itu merah (buruk), 'turun' itu hijau (bagus)
}) => {
    // Tentukan logika warna
    // Default: Naik = Hijau, Turun = Merah
    // Inverse (misal hutang): Naik = Merah, Turun = Hijau
    let isGood = trend === 'up';
    if (inverse) isGood = trend === 'down';

    const colorClass = isGood ? 'text-green-600' : 'text-red-600';
    
    // Icon Panah (SVG)
    const ArrowIcon = () => (
        <svg 
            className={`w-4 h-4 mr-1 transform ${trend === 'down' ? 'rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
        >
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
    );

    return (
        <span className={`${colorClass} text-sm font-medium flex items-center mt-1`}>
            <ArrowIcon />
            {trend === 'up' ? '+' : '-'}{percent}% dari bulan lalu
        </span>
    );
};