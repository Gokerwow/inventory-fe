import PfpExample from '../assets/svgs/Pfp Example.jpeg';

export type Usernames = 'superadmin' | 'admingudangumum' | 'ppk' | 'teknis' | 'penanggungjawab' | 'instalasi';

export const MOCK_USERS = [
    {
        user_id: 101,
        sso_user_id: 101,
        nama_pengguna: 'superadmin',
        photo: PfpExample,
        email: 'admin@rsudbalung.com',
        password: '$2b$10$K.iayq.fC/jCTBGrKxXeL.WAK0nL5MPEPSHn/Fwa.EGay.jS6beHS', // Contoh password hash
        role: 'super_admin',
        last_login: '2025-10-28T14:30:15.000Z',
        synced_at: '2025-10-28T14:30:15.000Z',
        created_at: '2024-01-10T09:00:00.000Z',
        updated_at: '2025-10-28T14:30:15.000Z',
    },
    {
        user_id: 102,
        sso_user_id: 102,
        nama_pengguna: 'admingudangumum',
        photo: PfpExample,
        email: 'gudang.umum@rsudbalung.com',
        password: '$2b$10$j8.V2lP9YfV/P.6uKxWeO.eF3sN4qD7cI/rT2gW0kL.hY1iE9uJ/i',
        role: 'admin gudang umum',
        last_login: '2025-10-27T11:05:00.000Z',
        synced_at: '2025-10-27T11:05:10.000Z',
        created_at: '2024-02-15T10:30:00.000Z',
        updated_at: '2025-10-27T11:05:00.000Z',
    },
    {
        user_id: 103,
        sso_user_id: 103,
        nama_pengguna: 'ppk',
        photo: PfpExample,
        email: 'ppk@rsudbalung.com',
        password: '$2b$10$aP.L/oG5rYw.eK8sQwXnL.qR7tG/vB9cI.jA3uD6wO.kY2iF8vM/o',
        role: 'ppk',
        last_login: '2025-10-29T07:30:00.000Z',
        synced_at: '2025-10-29T07:30:05.000Z',
        created_at: '2024-03-01T11:00:00.000Z',
        updated_at: '2025-10-29T07:30:00.000Z',
    },
    {
        user_id: 104,
        sso_user_id: 104,
        nama_pengguna: 'teknis', // Diperbaiki dari 'Admin Gudang Umum'
        photo: PfpExample,
        email: 'teknis@rsudbalung.com',
        password: '$2b$10$bQ.M/pG9tZ.wF/rJ7vYxP.oU8uH/wD1dK.lB4eE7xP.mZ3jG9wN/q',
        role: 'teknis', // Diperbaiki dari 'adminGudangUmum'
        last_login: '2025-10-28T14:20:00.000Z',
        synced_at: '2025-10-28T14:20:05.000Z',
        created_at: '2024-03-05T12:00:00.000Z',
        updated_at: '2025-10-28T14:20:00.000Z',
    },
    { // Typo? Mungkin 'penanggungJawab'
        user_id: 105,
        sso_user_id: 105,
        nama_pengguna: 'penanggungjawab', // Diperbaiki
        photo: PfpExample,
        email: 'pj@rsudbalung.com',
        password: '$2b$10$cR.N/qH2uX.yG/tK8wZxQ.pT9vI/xG2eL.mC5fF8yQ.nZ4kH0xO/r',
        role: 'penanggungjawab', // Diperbaiki (sesuai key)
        last_login: '2025-10-26T09:00:00.000Z',
        synced_at: '2025-10-26T09:00:05.000Z',
        created_at: '2024-03-10T13:00:00.000Z',
        updated_at: '2025-10-26T09:00:00.000Z',
    },
    {
        user_id: 106,
        sso_user_id: 106,
        nama_pengguna: 'instalasi', // Dibuat lebih spesifik
        photo: PfpExample,
        email: 'instalasi.farmasi@rsudbalung.com',
        password: '$2b$10$dS.O/rI5wZ.zH/uL9xAyR.qU0wJ/yH3fM.nC6gG9zR.oA5lI1yP/s',
        role: 'instalasi', // Diperbaiki
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
    },
    {
        id: 2,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Rendy',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 3,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Almas',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 4,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Aldi',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 5,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Syini',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 6,
        noSurat: '904 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Fahadza',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 7,
        noSurat: '905 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Nabila',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 8,
        noSurat: '906 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Budi',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 9,
        noSurat: '907 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Sari',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 10,
        noSurat: '908 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Dewi',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 11,
        noSurat: '909 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Rizki',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 12,
        noSurat: '910 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Maya',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/svgs/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 13,
        noSurat: '911 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Ahmad',
        kategori: 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 14,
        noSurat: '912 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Lina',
        kategori: 'Komputer',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '../assets/svgs/dummyPDF.pdf',
        tipe: ''
    }
];

export const RiwayatPenerimaanData = [
    {
        id: 1,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Rahardan',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 2,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Rendy',
        kategori: 'Komputer',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 3,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Almas',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 4,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Aldi',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 5,
        noSurat: '903 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Syini',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 6,
        noSurat: '904 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Fahadza',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 7,
        noSurat: '905 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Nabila',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 8,
        noSurat: '906 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Budi',
        kategori: 'Komputer',
        status: 'BeluTelahm Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 9,
        noSurat: '907 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Tim Teknis',
        namaPegawai: 'Sari',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 10,
        noSurat: '908 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Dewi',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF2.pdf',
        tipe: ''
    },
    {
        id: 11,
        noSurat: '909 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Rizki',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 12,
        noSurat: '910 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Maya',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '../assets/svgs/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 13,
        noSurat: '911 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'PPK',
        namaPegawai: 'Ahmad',
        kategori: 'ATK',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf',
        tipe: ''
    },
    {
        id: 14,
        noSurat: '912 /3.2c/35.09.61/PPI_085/II/2025',
        role: 'Admin Gudang Umum',
        namaPegawai: 'Lina',
        kategori: 'Komputer',
        status: 'Telah Dikonfirmasi',
        linkUnduh: '../assets/svgs/dummyPDF.pdf',
        tipe: ''
    }
];

export const logAktivitas = [
    {
        id: 1,
        role: 'AdminGudangUmum',
        photo: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '10 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-10T02:20:00.000Z',
    },
    {
        id: 2,
        role: 'PenanggungJawab',
        photo: PfpExample,
        aktivitas: 'Melakukan Login',
        // '11 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-11T02:20:00.000Z',
    },
    {
        id: 3,
        role: 'TimPPK',
        photo: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '12 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-12T02:20:00.000Z',
    },
    {
        id: 4,
        role: 'Tim Teknis',
        photo: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '13 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-13T02:20:00.000Z',
    },
    {
        id: 5,
        role: 'Tim Teknis',
        photo: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '09.20' -> (WIB/UTC+7)
        timestamp: '2025-10-14T02:20:00.000Z',
    },
    // --- Data Tambahan (Variasi) ---
    {
        id: 6,
        role: 'AdminGudangUmum',
        photo: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '08.15' -> (WIB/UTC+7)
        timestamp: '2025-10-14T01:15:00.000Z',
    },
    {
        id: 7,
        role: 'Instalasi',
        photo: PfpExample,
        aktivitas: 'Melakukan Login',
        // '14 Oktober 2025' + '10.30' -> (WIB/UTC+7)
        timestamp: '2025-10-14T03:30:00.000Z',
    },
    {
        id: 8,
        role: 'Instalasi',
        photo: PfpExample,
        aktivitas: 'Melakukan Logout',
        // '14 Oktober 2025' + '16.45' -> (WIB/UTC+7)
        timestamp: '2025-10-14T09:45:00.000Z',
    },
    {
        id: 9,
        role: 'PenanggungJawab',
        photo: PfpExample,
        aktivitas: 'Melakukan Login',
        // '15 Oktober 2025' + '08.00' -> (WIB/UTC+7)
        timestamp: '2025-10-15T01:00:00.000Z',
    }
];

export const dataPihak = [
    { id: 1, nama: "Ritay Protama", nip: "198503032010011001", jabatan: "Pejabat Pembuat Komitmen" },
    { id: 2, nama: "Aveli Saputra", nip: "199004152015022003", jabatan: "Staf Administrasi" },
    { id: 3, nama: "Nadia Fitrani", nip: "198811202014012005", jabatan: "Bendahara" },
    { id: 4, nama: "Sababila Nuratni", nip: "199207072018031002", jabatan: "Tim Teknis" },
    { id: 5, nama: "Devil Katitka", nip: "199501012020012001", jabatan: "Penyedia Barang/Jasa" }
];

export interface TipeDataPihak {
    id: number;
    nama: string;
    nip: string,
    jabatan: string
}

export interface SortOption {
    label: string;
    value: string;
    icon: string;
}

export const sortOptions: SortOption[] = [
    { label: 'A - Z', value: 'asc', icon: '↑' },
    { label: 'Z - A', value: 'desc', icon: '↓' }
];

export interface EmployeeType {
    id: number;
    name: string;
    job: string;
    phone: string;
    photo: string;
    status: string;
}

export const employees = [
    {
        id: 1,
        name: 'Slamet Riyadi',
        job: 'Tim PPK',
        phone: '081234567858',
        photo: PfpExample,
        status: 'Aktif',
    },
    {
        id: 2,
        name: 'Cahyo Budi',
        job: 'Tim PPK',
        phone: '081234567858',
        photo: PfpExample,
        status: 'Aktif',
    },
    {
        id: 3,
        name: 'Kevin Anggara',
        job: 'Tim PPK',
        phone: '081234567858',
        photo: PfpExample,
        status: 'Aktif',
    },
];

export const FAQ = [
    {
        question: 'Apa peran utama Tim Bagian Umum (PPK) di sistem SIMBA',
        answer: "Admin Gudang bertugas mengelola data penerimaan barang, membuat dan mengunggah BAST (Berita Acara Serah Terima), serta memantau riwayat penerimaan agar proses distribusi barang berjalan tertib dan terdokumentasi."
    },
    {
        question: 'Bagaimana cara menambahkana data belanja baru di sistem',
        answer: "Masuk ke menu Dashboard → Penerimaan, lalu sistem akan menampilkan daftar penerimaan lengkap dengan kolom nama PPK, kategori barang, nama item, tanggal dibuat, dan status konfirmasi."
    },
    {
        question: 'Apa yang terjadi setelah data belanja dibuat',
        answer: "Admin Gudang bertugas mengelola data penerimaan barang, membuat dan mengunggah BAST (Berita Acara Serah Terima), serta memantau riwayat penerimaan agar proses distribusi barang berjalan tertib dan terdokumentasi."
    },
    {
        question: 'Bagaimana cara melihat status pengadaan yang sudah diajukan',
        answer: "Admin Gudang bertugas mengelola data penerimaan barang, membuat dan mengunggah BAST (Berita Acara Serah Terima), serta memantau riwayat penerimaan agar proses distribusi barang berjalan tertib dan terdokumentasi."
    },
    {
        question: 'Apa arti dari status "Diterima" dan "Ditolak" pada data belanja',
        answer: "Admin Gudang bertugas mengelola data penerimaan barang, membuat dan mengunggah BAST (Berita Acara Serah Terima), serta memantau riwayat penerimaan agar proses distribusi barang berjalan tertib dan terdokumentasi."
    },
]

export const BARANG_BELANJA: TIPE_BARANG_BELANJA[] = [
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

interface RiwayatUpload {
    id: string;
    fileName: string;
    uploadDate: string;
    fileSize: string;
}

export const riwayatUpload: RiwayatUpload[] = [
    {
        id: '1',
        fileName: 'BAST_Tim_PPK_Q1_2025.pdf',
        uploadDate: '15 October 2025',
        fileSize: '2.4 MB'
    },
    {
        id: '2',
        fileName: 'BAST_Pengadaan_Barang_IT.pdf',
        uploadDate: '14 October 2025',
        fileSize: '1.8 MB'
    },
    {
        id: '3',
        fileName: 'BAST_Perlengkapan_Kantor.pdf',
        uploadDate: '13 October 2025',
        fileSize: '3.2 MB'
    },
    {
        id: '4',
        fileName: 'BAST_Peralatan_Medis.pdf',
        uploadDate: '12 October 2025',
        fileSize: '4.1 MB'
    },
    {
        id: '5',
        fileName: 'BAST_Renovasi_Gedung_A.pdf',
        uploadDate: '11 October 2025',
        fileSize: '5.6 MB'
    },
    {
        id: '6',
        fileName: 'BAST_Kendaraan_Dinas.pdf',
        uploadDate: '10 October 2025',
        fileSize: '1.2 MB'
    },
    {
        id: '7',
        fileName: 'BAST_Pembelian_Laptop.pdf',
        uploadDate: '09 October 2025',
        fileSize: '890 KB'
    },
    {
        id: '8',
        fileName: 'BAST_Furniture_Office.pdf',
        uploadDate: '08 October 2025',
        fileSize: '2.1 MB'
    }
];