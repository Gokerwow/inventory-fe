import PfpExample from '../assets/Pfp Example.jpeg';

export interface MockUser {
    user_id: number;
    sso_user_id: number;
    username: string;
    avatarUrl: string,
    email: string;
    password: string; // Seharusnya hash, tapi kita ikuti data mock
    role: string;
    last_login: string; // atau 'Date' jika Anda mengonversinya
    synced_at: string;
    created_at: string;
    updated_at: string;
}

export type UserRoles = 'Super Admin' | 'Admin Gudang Umum' | 'Tim PPK' | 'Tim Teknis' | 'Penanggung Jawab' | 'Instalasi';

export const MOCK_USERS = [
    {
        user_id: 101,
        sso_user_id: 101,
        username: 'superAdmin',
        avatarUrl: PfpExample,
        email: 'admin@rsudbalung.com',
        password: '$2b$10$K.iayq.fC/jCTBGrKxXeL.WAK0nL5MPEPSHn/Fwa.EGay.jS6beHS', // Contoh password hash
        role: 'Super Admin',
        last_login: '2025-10-28T14:30:15.000Z',
        synced_at: '2025-10-28T14:30:15.000Z',
        created_at: '2024-01-10T09:00:00.000Z',
        updated_at: '2025-10-28T14:30:15.000Z',
    },
    {
        user_id: 102,
        sso_user_id: 102,
        username: 'adminGudangUmum',
        avatarUrl: PfpExample,
        email: 'gudang.umum@rsudbalung.com',
        password: '$2b$10$j8.V2lP9YfV/P.6uKxWeO.eF3sN4qD7cI/rT2gW0kL.hY1iE9uJ/i',
        role: 'Admin Gudang Umum',
        last_login: '2025-10-27T11:05:00.000Z',
        synced_at: '2025-10-27T11:05:10.000Z',
        created_at: '2024-02-15T10:30:00.000Z',
        updated_at: '2025-10-27T11:05:00.000Z',
    },
    {
        user_id: 103,
        sso_user_id: 103,
        username: 'timPPK',
        avatarUrl: PfpExample,
        email: 'ppk@rsudbalung.com',
        password: '$2b$10$aP.L/oG5rYw.eK8sQwXnL.qR7tG/vB9cI.jA3uD6wO.kY2iF8vM/o',
        role: 'Tim PPK',
        last_login: '2025-10-29T07:30:00.000Z',
        synced_at: '2025-10-29T07:30:05.000Z',
        created_at: '2024-03-01T11:00:00.000Z',
        updated_at: '2025-10-29T07:30:00.000Z',
    },
    {
        user_id: 104,
        sso_user_id: 104,
        username: 'timTeknis', // Diperbaiki dari 'Admin Gudang Umum'
        avatarUrl: PfpExample,
        email: 'teknis@rsudbalung.com',
        password: '$2b$10$bQ.M/pG9tZ.wF/rJ7vYxP.oU8uH/wD1dK.lB4eE7xP.mZ3jG9wN/q',
        role: 'Tim Teknis', // Diperbaiki dari 'adminGudangUmum'
        last_login: '2025-10-28T14:20:00.000Z',
        synced_at: '2025-10-28T14:20:05.000Z',
        created_at: '2024-03-05T12:00:00.000Z',
        updated_at: '2025-10-28T14:20:00.000Z',
    },
    { // Typo? Mungkin 'penanggungJawab'
        user_id: 105,
        sso_user_id: 105,
        username: 'penanggungJawab', // Diperbaiki
        avatarUrl: PfpExample,
        email: 'pj@rsudbalung.com',
        password: '$2b$10$cR.N/qH2uX.yG/tK8wZxQ.pT9vI/xG2eL.mC5fF8yQ.nZ4kH0xO/r',
        role: 'Penanggung Jawab', // Diperbaiki (sesuai key)
        last_login: '2025-10-26T09:00:00.000Z',
        synced_at: '2025-10-26T09:00:05.000Z',
        created_at: '2024-03-10T13:00:00.000Z',
        updated_at: '2025-10-26T09:00:00.000Z',
    },
    {
        user_id: 106,
        sso_user_id: 106,
        username: 'instalasiBalung', // Dibuat lebih spesifik
        avatarUrl: PfpExample,
        email: 'instalasi.farmasi@rsudbalung.com',
        password: '$2b$10$dS.O/rI5wZ.zH/uL9xAyR.qU0wJ/yH3fM.nC6gG9zR.oA5lI1yP/s',
        role: 'Instalasi', // Diperbaiki
        last_login: '2025-10-29T06:55:00.000Z',
        synced_at: '2025-10-29T06:55:05.000Z',
        created_at: '2024-03-12T14:00:00.000Z',
        updated_at: '2025-10-29T06:55:00.000Z',
    },
];

export const PenerimaanData = [
    {
        id: 1,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Rahardan',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: 'src/assets/dummyPDF.pdf'
    },
    {
        id: 2,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Rendy',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 3,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Almas',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 4,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Aldi',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 5,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Syini',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 6,
        noSurat: '904 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Fahadza',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 7,
        noSurat: '905 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Nabila',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 8,
        noSurat: '906 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Budi',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 9,
        noSurat: '907 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Sari',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 10,
        noSurat: '908 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Dewi',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 11,
        noSurat: '909 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Rizki',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 12,
        noSurat: '910 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Maya',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 13,
        noSurat: '911 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Ahmad',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    },
    {
        id: 14,
        noSurat: '912 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Lina',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/dummyPDF.pdf'
    }
];

export const logAktivitas = [
    {
        id: 1,
        role: 'AdminGudangUmum',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '10 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-10T02:20:00.000Z',
    },
    {
        id: 2,
        role: 'PenanggungJawab',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Login',
        // '11 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-11T02:20:00.000Z',
    },
    {
        id: 3,
        role: 'TimPPK',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '12 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-12T02:20:00.000Z',
    },
    {
        id: 4,
        role: 'Tim Teknis',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '13 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-13T02:20:00.000Z',
    },
    {
        id: 5,
        role: 'Tim Teknis',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-14T02:20:00.000Z',
    },
    // --- Data Tambahan (Variasi) ---
    {
        id: 6,
        role: 'AdminGudangUmum',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '08.15' -> (WIB/UTC+7)
        timestamp: '2025-10-14T01:15:00.000Z',
    },
    {
        id: 7,
        role: 'Instalasi',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '10.30' -> (WIB/UTC+7)
        timestamp: '2025-10-14T03:30:00.000Z',
    },
    {
        id: 8,
        role: 'Instalasi',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '14 Oktober 2025' + '16.45' -> (WIB/UTC+7)
        timestamp: '2025-10-14T09:45:00.000Z',
    },
    {
        id: 9,
        role: 'PenanggungJawab',
        avatarUrl: PfpExample,
        aktivitas: 'Melakukan Login',
        // '15 Oktober 2025' + '08.00' -> (WIB/UTC+7)
        timestamp: '2025-10-15T01:00:00.000Z',
    }
];

export interface SortOption {
    label: string;
    value: string;
    icon: string;
}

export const sortOptions: SortOption[] = [
    { label: 'A - Z', value: 'asc', icon: '↑' },
    { label: 'Z - A', value: 'desc', icon: '↓' }
];

export const employees = [
    {
        id: 1,
        name: 'Slamet Riyadi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
    {
        id: 2,
        name: 'Cahyo Budi',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
    {
        id: 3,
        name: 'Kevin Anggara',
        job: 'Tim PPK',
        phone: '081234567858',
        avatarUrl: PfpExample,
        status: 'Aktif',
    },
];

export const FAQ = [
    {
        text: 'Apa peran utama Tim Bagian Umum (PPK) di sistem SIMBA'
    },
    {
        text: 'Bagaimana cara menambahkana data belanja baru di sistem'
    },
    {
        text: 'Apa yang terjadi setelah data belanja dibuat'
    },
    {
        text: 'Bagaimana cara melihat status pengadaan yang sudah diajukan'
    },
    {
        text: 'Apa arti dari status "Diterima" dan "Ditolak" pada data belanja'
    },
]

export interface TIPE_BARANG_BELANJA {
    id: number,
    nama_barang: string,
    kategori: string,
    satuan: string,
    jumlah: number,
    harga: number,
    total_harga: number
}

export const BARANG_BELANJA : TIPE_BARANG_BELANJA[] = [
    {
        id: 1,
        nama_barang: 'Kertas HVS A4 70gr',
        kategori: 'ATK',
        satuan: 'rim',
        jumlah: 5,
        harga: 45000,
        total_harga: 225000
    },
    {
        id: 2,
        nama_barang: 'Pulpen Standard Hitam',
        kategori: 'ATK',
        satuan: 'pcs',
        jumlah: 50,
        harga: 2500,
        total_harga: 125000
    },
    {
        id: 3,
        nama_barang: 'Binder Clip Besar',
        kategori: 'ATK',
        satuan: 'kotak',
        jumlah: 10,
        harga: 15000,
        total_harga: 150000
    },
    {
        id: 4,
        nama_barang: 'Laptop Dell Latitude 5420',
        kategori: 'Elektronik',
        satuan: 'unit',
        jumlah: 3,
        harga: 12500000,
        total_harga: 37500000
    },
    {
        id: 5,
        nama_barang: 'Printer HP LaserJet Pro',
        kategori: 'Elektronik',
        satuan: 'unit',
        jumlah: 2,
        harga: 2850000,
        total_harga: 5700000
    },
];