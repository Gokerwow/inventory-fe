export type Usernames = 'superadmin' | 'admingudangumum' | 'ppk' | 'teknis' | 'penanggungjawab' | 'instalasi';

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN_GUDANG: 'admin gudang umum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggung jawab', 
    // ^ Saya tambahkan 'penanggung jawab' dari routes/web.php
};
export const USERNAMES = {
    SUPER_ADMIN: 'superadmin',
    ADMIN_GUDANG: 'admingudangumum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggungjawab', 
    // ^ Saya tambahkan 'penanggung jawab' dari routes/web.php
} as const;