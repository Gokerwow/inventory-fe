export interface MockUser {
    user_id: number;
    sso_user_id: number;
    username: string;
    email: string;
    password: string; // Seharusnya hash, tapi kita ikuti data mock
    role: string;
    last_login: string; // atau 'Date' jika Anda mengonversinya
    synced_at: string;
    created_at: string;
    updated_at: string;
}

export type UserRoles = 'superAdmin' | 'adminGudangUmum' | 'timPPK' | 'timTeknis' | 'penaggungJawab' | 'instalasi';

export const MOCK_USERS: Record<UserRoles, MockUser> = {
    superAdmin: {
        user_id: 101,
        sso_user_id: 101,
        username: 'Admin Ganteng',
        email: 'admin@rsudbalung.com',
        password: '$2b$10$K.iayq.fC/jCTBGrKxXeL.WAK0nL5MPEPSHn/Fwa.EGay.jS6beHS', // Contoh password hash
        role: 'superAdmin',
        last_login: '2025-10-28T14:30:15.000Z',
        synced_at: '2025-10-28T14:30:15.000Z',
        created_at: '2024-01-10T09:00:00.000Z',
        updated_at: '2025-10-28T14:30:15.000Z',
    },
    adminGudangUmum: {
        user_id: 102,
        sso_user_id: 102,
        username: 'Admin Gudang Umum',
        email: 'gudang.umum@rsudbalung.com',
        password: '$2b$10$j8.V2lP9YfV/P.6uKxWeO.eF3sN4qD7cI/rT2gW0kL.hY1iE9uJ/i',
        role: 'adminGudangUmum',
        last_login: '2025-10-27T11:05:00.000Z',
        synced_at: '2025-10-27T11:05:10.000Z',
        created_at: '2024-02-15T10:30:00.000Z',
        updated_at: '2025-10-27T11:05:00.000Z',
    },
    timPPK: {
        user_id: 103,
        sso_user_id: 103,
        username: 'Tim PPK',
        email: 'ppk@rsudbalung.com',
        password: '$2b$10$aP.L/oG5rYw.eK8sQwXnL.qR7tG/vB9cI.jA3uD6wO.kY2iF8vM/o',
        role: 'timPPK',
        last_login: '2025-10-29T07:30:00.000Z',
        synced_at: '2025-10-29T07:30:05.000Z',
        created_at: '2024-03-01T11:00:00.000Z',
        updated_at: '2025-10-29T07:30:00.000Z',
    },
    timTeknis: {
        user_id: 104,
        sso_user_id: 104,
        username: 'Tim Teknis', // Diperbaiki dari 'Admin Gudang Umum'
        email: 'teknis@rsudbalung.com',
        password: '$2b$10$bQ.M/pG9tZ.wF/rJ7vYxP.oU8uH/wD1dK.lB4eE7xP.mZ3jG9wN/q',
        role: 'timTeknis', // Diperbaiki dari 'adminGudangUmum'
        last_login: '2025-10-28T14:20:00.000Z',
        synced_at: '2025-10-28T14:20:05.000Z',
        created_at: '2024-03-05T12:00:00.000Z',
        updated_at: '2025-10-28T14:20:00.000Z',
    },
    c: { // Typo? Mungkin 'penanggungJawab'
        user_id: 105,
        sso_user_id: 105,
        username: 'Penanggung Jawab', // Diperbaiki
        email: 'pj@rsudbalung.com',
        password: '$2b$10$cR.N/qH2uX.yG/tK8wZxQ.pT9vI/xG2eL.mC5fF8yQ.nZ4kH0xO/r',
        role: 'penaggungJawab', // Diperbaiki (sesuai key)
        last_login: '2025-10-26T09:00:00.000Z',
        synced_at: '2025-10-26T09:00:05.000Z',
        created_at: '2024-03-10T13:00:00.000Z',
        updated_at: '2025-10-26T09:00:00.000Z',
    },
    instalasi: {
        user_id: 106,
        sso_user_id: 106,
        username: 'Instalasi Farmasi', // Dibuat lebih spesifik
        email: 'instalasi.farmasi@rsudbalung.com',
        password: '$2b$10$dS.O/rI5wZ.zH/uL9xAyR.qU0wJ/yH3fM.nC6gG9zR.oA5lI1yP/s',
        role: 'instalasi', // Diperbaiki
        last_login: '2025-10-29T06:55:00.000Z',
        synced_at: '2025-10-29T06:55:05.000Z',
        created_at: '2024-03-12T14:00:00.000Z',
        updated_at: '2025-10-29T06:55:00.000Z',
    },
};

export const PenerimaanData = {

}