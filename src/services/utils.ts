import { format, formatDistanceToNow, isValid, parseISO, parse } from 'date-fns';
import { id } from 'date-fns/locale'; // Import locale Indonesia

/**
 * Mensimulasikan panggilan API dengan jeda waktu.
 * @param data Data yang ingin dikembalikan (data dummy).
 * @param delay Waktu tunda dalam milidetik (ms).
 */
export const simulateApiCall = <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
};

// --- Helper Functions untuk Tanggal & Waktu ---

/**
 * Memformat tanggal menjadi format standar Indonesia (Contoh: 26 Desember 2025)
 * @param date Tanggal dalam bentuk string ISO atau objek Date
 * @param dateFormat Format kustom (opsional), default: 'dd MMMM yyyy'
 */
export const formatDate = (date: string | Date | null | undefined, dateFormat: string = 'dd MMMM yyyy'): string => {
    if (!date) return '-';
    
    let dateObj: Date;

    if (typeof date === 'string') {
        // 1. Coba parse sebagai ISO (YYYY-MM-DD) - Default Backend modern
        dateObj = parseISO(date);

        // 2. Jika Invalid, coba parse sebagai format Indonesia (DD-MM-YYYY) - Kasus Anda saat ini
        if (!isValid(dateObj)) {
            // 'dd-MM-yyyy' sesuai dengan "16-12-2025"
            dateObj = parse(date, 'dd-MM-yyyy', new Date());
        }
    } else {
        dateObj = date;
    }
    
    // Jika masih invalid setelah kedua percobaan
    if (!isValid(dateObj)) return '-';

    return format(dateObj, dateFormat, { locale: id });
};

/**
 * Memformat hanya waktu (Contoh: 14:30 WIB)
 */
export const formatTime = (date: string | Date | null | undefined): string => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    
    return format(dateObj, 'HH:mm', { locale: id }) + ' WIB';
};

/**
 * Memformat tanggal dan waktu (Contoh: 26 Desember 2025, 14:30 WIB)
 * @param date Tanggal dalam bentuk string ISO atau objek Date
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '-';

    return format(dateObj, 'dd MMMM yyyy, HH:mm', { locale: id }) + ' WIB';
};

/**
 * Menampilkan waktu relatif dari sekarang (Contoh: 2 jam yang lalu, baru saja)
 * @param date Tanggal dalam bentuk string ISO atau objek Date
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) return '-';

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
};