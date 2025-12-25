import DashboardIcon from '../assets/svgs/DashboardIcon.svg?react';
import BarangIcon from '../assets/svgs/barangIcon.svg?react'
import PenerimaanIcon from '../assets/svgs/penerimaanIcon.svg?react';
import PengeluaranIcon from '../assets/svgs/pengeluaranIcon.svg?react';
import PegawaiIcon from '../assets/svgs/people.svg?react'
import MonitoringIcon from '../assets/svgs/monitoringIcon.svg?react'
import PemesananIcon from '../assets/svgs/shopping-cart.svg?react'
// import AkunIcon from '../assets/svgs/Akun Icon.svg?react'
import CetakIcon from '../assets/svgs/CetakIcon.svg?react'
import ListrikIcon from '../assets/svgs/ListrikIcon.svg?react'
import KomputerIcon from '../assets/svgs/KomputerIcon.svg?react'
import KertasIcon from '../assets/svgs/KertasIcon.svg?react'
import PaluIcon from '../assets/svgs/PaluIcon.svg?react'
import PembersihIcon from '../assets/svgs/PembersihIcon.svg?react'
import AtkIcon from '../assets/svgs/AtkIcon.svg?react'



export type Usernames = 'superadmin' | 'admingudangumum' | 'ppk' | 'teknis' | 'penanggungjawab' | 'instalasi';


export const ROLES = {
    SUPER_ADMIN: 'super-admin',
    ADMIN_GUDANG: 'admin-gudang-umum',
    PPK: 'tim-ppk',
    TEKNIS: 'tim-teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggung-jawab',
};

export const ROLE_DISPLAY_NAMES = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN_GUDANG]: 'Admin Gudang Umum',
    [ROLES.PPK]: 'Tim PPK',
    [ROLES.TEKNIS]: 'Tim Teknis',
    [ROLES.INSTALASI]: 'Instalasi',
    [ROLES.PENANGGUNG_JAWAB]: 'Penanggung Jawab'
};

export interface FAQItem {
    question: string;
    answer: string;
}

export interface RoleFAQ {
    role: string;
    faqs: FAQItem[];
}

export const FAQ_DATA: RoleFAQ[] = [
    {
        role: ROLES.ADMIN_GUDANG,
        faqs: [
            {
                question: 'Apa fungsi utama Admin Gudang Umum di sistem SIMBA?',
                answer: 'Admin Gudang Umum memiliki fungsi utama untuk mengelola operasional gudang, meliputi: Pengadaan barang, Penerimaan barang masuk, Pengeluaran barang, Pencatatan dan pemantauan stok barang yang tersedia di gudang.'
            },
            {
                question: 'Bagaimana cara melihat data penerimaan barang?',
                answer: 'Untuk melihat data penerimaan barang di sistem SIMBA, ikuti langkah berikut: 1) Klik menu Penerimaan pada sidebar, 2) Sistem akan menampilkan halaman penerimaan barang, 3) Pilih kategori penerimaan yang diinginkan, 4) Klik tombol Detail untuk melihat informasi penerimaan secara lengkap.'
            },
            {
                question: 'Apa itu BAST dan kapan harus dibuat?',
                answer: 'BAST (Berita Acara Serah Terima) adalah dokumen resmi yang berfungsi sebagai bukti sah bahwa barang, pekerjaan, atau jasa telah diserahkan secara resmi dari pihak pemberi kepada pihak penerima. BAST dibuat pada saat Tim PPK melakukan input penerimaan barang ke dalam sistem SIMBA.'
            },
            {
                question: 'Bagaimana langkah membuat BAST di sistem?',
                answer: 'Untuk membuat BAST, Tim PPK perlu melakukan langkah berikut: 1) Masuk ke dalam sistem SIMBA, 2) Klik menu Penerimaan pada sidebar, 3) Pilih opsi Tambah Penerimaan, 4) Isi formulir penerimaan barang sesuai data yang tersedia, 5) Simpan data, maka sistem akan secara otomatis menghasilkan dokumen BAST.'
            },
            {
                question: 'Di mana saya bisa melihat file BAST yang sudah dibuat?',
                answer: 'File BAST yang sudah dibuat dan dikonfirmasi dapat dilihat melalui halaman Riwayat Penerimaan dengan langkah berikut: 1) Klik menu Penerimaan pada sidebar, 2) Pilih submenu Riwayat Penerimaan, 3) Cari data penerimaan yang diinginkan, 4) Klik lihat untuk melihat atau mengunduh file BAST.'
            }
        ]
    },
    {
        role: ROLES.PENANGGUNG_JAWAB,
        faqs: [
            {
                question: 'Apa tugas utama Penanggung Jawab di sistem SIMBA?',
                answer: 'Penanggung Jawab memiliki tugas utama untuk mengelola dan mengawasi proses pemesanan barang dari instalasi, meliputi: Mengkonfirmasi pemesanan barang dari instalasi, Mengubah jumlah stok yang dipesan sesuai kebutuhan dan kewenangan yang dimiliki.'
            },
            {
                question: 'Bagaimana cara melihat daftar pemesanan barang yang perlu dikonfirmasi?',
                answer: 'Untuk melihat daftar pemesanan barang yang masuk dan perlu dikonfirmasi, lakukan langkah berikut: 1) Buka menu Pengeluaran pada sistem SIMBA, 2) Sistem akan menampilkan daftar Pemesanan dari berbagai instalasi, 3) Pilih salah satu Pemesanan yang ingin ditinjau, 4) Klik tombol Lihat untuk melihat detail Pengeluaran.'
            },
            {
                question: 'Apa yang dimaksud dengan status pada sistem?',
                answer: 'Status pada sistem SIMBA berfungsi sebagai penanda kondisi pemesanan barang, antara lain: Pending (Pemesanan masih menunggu konfirmasi Penanggung Jawab), Dikonfirmasi (Pemesanan telah disetujui), Ditolak (Pemesanan tidak disetujui oleh Penanggung Jawab).'
            },
            {
                question: 'Bagaimana cara mengkonfirmasi Pemesanan barang?',
                answer: 'Untuk mengkonfirmasi pemesanan barang, Penanggung Jawab dapat mengikuti langkah berikut: 1) Masuk ke menu Pengeluaran, 2) Klik Lihat salah satu pemesanan dari instalasi, 3) Klik tombol plus/minus untuk mengubah jumlah barang, 4) Setelah selesai meninjau, Klik Konfirmasi.'
            },
            {
                question: 'Apakah Penanggung Jawab bisa mengubah penerimaan barang?',
                answer: 'Ya, Penanggung Jawab memiliki hak untuk mengubah jumlah pemesanan barang. Hal ini dilakukan sesuai dengan hirarki dan kewenangan yang berlaku di sistem SIMBA, terutama untuk menyesuaikan ketersediaan stok dan kebutuhan instalasi.'
            }
        ]
    },
    {
        role: ROLES.PPK,
        faqs: [
            {
                question: 'Apa peran utama Tim Bagian Umum (PPK) di sistem SIMBA?',
                answer: 'Tim Bagian Umum (Pejabat Pembuat Komitmen) berperan sebagai pihak yang bertanggung jawab atas proses pengadaan barang, meliputi: Melakukan pembelian barang dari pihak ketiga, Membuat BAST (Berita Acara Serah Terima) atas barang yang diterima, Memastikan pengadaan barang sesuai dengan regulasi dan ketentuan yang berlaku, Menyediakan kebutuhan stok gudang agar operasional tetap berjalan.'
            },
            {
                question: 'Bagaimana cara menambahkan data belanja baru di sistem?',
                answer: 'Untuk menambahkan data belanja baru, Tim PPK perlu membuat BAST dengan langkah berikut: 1) Masuk ke menu Penerimaan pada sidebar, 2) Klik tombol Tambah Barang, 3) Isi formulir penerimaan barang sesuai data pembelian, 4) Tambahkan detail barang yang dibeli, 5) Klik Konfirmasi untuk menyimpan data belanja.'
            },
            {
                question: 'Apa yang terjadi setelah data belanja dibuat?',
                answer: 'Setelah data belanja dibuat, sistem akan menjalankan proses berikut: Data penerimaan akan diperiksa oleh tim teknis, Jika barang dinyatakan layak, maka barang akan otomatis masuk ke stok gudang, Jika barang tidak layak, maka akan dilakukan proses pengembalian (refund) oleh Tim PPK yang bersangkutan.'
            },
            {
                question: 'Bagaimana cara melihat status penerimaan yang sudah diajukan?',
                answer: 'Untuk melihat status penerimaan barang yang telah diajukan, lakukan langkah berikut: 1) Masuk ke menu Penerimaan, 2) Klik submenu Riwayat Penerimaan, 3) Sistem akan menampilkan daftar penerimaan beserta statusnya.'
            },
            {
                question: 'Apa arti dari status "Selesai", "Pending" dan "Dibatalkan" pada data belanja?',
                answer: 'Status pada sistem SIMBA berfungsi sebagai penanda kondisi penerimaan barang, antara lain: Pending (Pemesanan masih menunggu konfirmasi Penanggung Jawab), Dikonfirmasi (Pemesanan telah disetujui), Ditolak (Pemesanan tidak disetujui oleh Penanggung Jawab).'
            }
        ]
    },
    {
        role: ROLES.TEKNIS,
        faqs: [
            {
                question: 'Apa tugas utama Tim Teknis di sistem SIMBA?',
                answer: 'Tim Teknis memiliki tugas utama untuk melakukan pemeriksaan dan penilaian terhadap barang yang diterima dari hasil pengadaan oleh Tim PPK, meliputi: Mengecek kesesuaian barang yang diterima dengan data pemesanan, Menilai kelayakan barang (layak atau tidak layak).'
            },
            {
                question: 'Bagaimana cara melihat data penerimaan barang yang harus diperiksa?',
                answer: 'Untuk melihat data penerimaan barang yang perlu diperiksa oleh Tim Teknis, lakukan langkah berikut: 1) Masuk ke menu Penerimaan, 2) Sistem akan menampilkan daftar penerimaan dari Tim PPK, 3) Pilih salah satu data penerimaan yang ingin diperiksa, 4) Klik tombol Lihat, 5) Sistem akan menampilkan detail penerimaan sesuai data yang dipilih.'
            },
            {
                question: 'Bagaimana untuk barang tidak layak dilakukan?',
                answer: 'Untuk barang yang dinyatakan tidak layak, maka: Barang tidak akan dimasukkan ke stok gudang, Akan dilakukan proses pengembalian (refund) oleh Tim PPK yang bersangkutan sesuai ketentuan yang berlaku.'
            },
            {
                question: 'Bagaimana cara Tim Teknis mengubah status belanja?',
                answer: 'Untuk mengubah status penerimaan barang, Tim Teknis dapat mengikuti langkah berikut: 1) Masuk ke menu Penerimaan, 2) Klik Lihat pada salah satu data penerimaan dari Tim PPK, 3) Sistem akan menampilkan detail penerimaan barang, 4) Tentukan status barang menjadi Layak atau Tidak Layak, 5) Klik Simpan untuk menyimpan perubahan status.'
            },
            {
                question: 'Apa yang terjadi setelah status belanja diubah menjadi "Layak" dan "Tidak Layak?',
                answer: 'Penjelasan dari perubahan status penerimaan adalah sebagai berikut: Layak (Barang akan otomatis masuk ke stok gudang), Tidak Layak (Barang tidak masuk ke stok dan akan diproses refund oleh Tim PPK yang bersangkutan).'
            }
        ]
    },
    {
        role: ROLES.INSTALASI,
        faqs: [
            {
                question: 'Apa peran utama Instalasi dalam sistem SIMBA?',
                answer: 'Instalasi berperan sebagai pihak yang mengajukan pemesanan barang untuk memenuhi kebutuhan operasional masing-masing unit, dengan fungsi utama: Mengajukan permintaan atau pemesanan barang, Menentukan jumlah barang yang dibutuhkan.'
            },
            {
                question: 'Bagaimana cara Instalasi mengajukan pemesanan barang?',
                answer: 'Untuk mengajukan pemesanan barang, Instalasi dapat mengikuti langkah berikut: 1) Masuk ke menu Pemesanan, 2) Klik tombol Pesan Barang, 3) Pilih barang yang dibutuhkan, 4) Tambahkan atau kurangi jumlah barang sesuai kebutuhan, 5) Klik Selesai untuk mengirim pengajuan pemesanan.'
            },
            {
                question: 'Apa yang terjadi setelah pengajuan pemesanan selesai?',
                answer: 'Setelah pengajuan pemesanan dikirim: Status pemesanan akan menjadi menunggu konfirmasi, Pemesanan akan ditinjau oleh Penanggung Jawab dan Admin Gudang.'
            },
            {
                question: 'Bagaimana cara melihat status permintaan barang yang diajukan?',
                answer: 'Untuk melihat status pemesanan barang yang telah diajukan, lakukan langkah berikut: 1) Masuk ke menu Pemesanan, 2) Klik submenu Riwayat Pemesanan, 3) Sistem akan menampilkan daftar pemesanan.'
            },
            {
                question: 'Apakah Instalasi bisa mencetak laporan permintaan barang?',
                answer: 'Tidak. Instalasi tidak memiliki akses untuk mencetak laporan permintaan barang. Instalasi hanya dapat melihat riwayat pemesanan dan statusnya melalui sistem SIMBA.'
            }
        ]
    }
];

export const USERNAMES = {
    SUPER_ADMIN: 'superadmin',
    ADMIN_GUDANG: 'admingudangumum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggungjawab',
} as const;

export const CATEGORY_DATA = [
    {
        id: 1,
        name: 'ATK',
        Icon: AtkIcon,
        colorClass: 'bg-blue-100 text-blue-700',
        hoverClass: 'hover:bg-blue-200'
    },
    {
        id: 2,
        name: 'Cetak',
        Icon: CetakIcon,
        colorClass: 'bg-green-100 text-green-700',
        hoverClass: 'hover:bg-green-200'
    },
    {
        id: 3,
        name: 'Alat Listrik',
        Icon: ListrikIcon,
        colorClass: 'bg-yellow-100 text-yellow-700',
        hoverClass: 'hover:bg-yellow-200'
    },
    {
        id: 4,
        name: 'Bahan Komputer',
        Icon: KomputerIcon,
        colorClass: 'bg-purple-100 text-purple-700',
        hoverClass: 'hover:bg-purple-200'
    },
    {
        id: 5,
        name: 'Kertas dan Cover',
        Icon: KertasIcon,
        colorClass: 'bg-red-100 text-red-700',
        hoverClass: 'hover:bg-red-200'
    },
    {
        id: 6,
        name: 'Bahan Bangunan',
        Icon: PaluIcon,
        colorClass: 'bg-indigo-100 text-indigo-700',
        hoverClass: 'hover:bg-indigo-200'
    },
    {
        id: 7,
        name: 'Bahan Pembersih',
        Icon: PembersihIcon,
        colorClass: 'bg-teal-100 text-teal-700',
        hoverClass: 'hover:bg-teal-200'
    },
];

export interface Kategori {
    id: number;
    name: string;
    slug: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SelectPihak {
    id: number,
    name: string,
    jabatan_id: number,
    jabatan_name: string,
    nip: string
}

export interface SelectedPihak {
    id: number;
    name: string;
    jabatan: string;
}

export interface LogItem {
    foto: string,
    user: string,
    waktu: string,
    tanggal: string,
    activity: string
}

export interface Role {
    id: number,
    name: string,
    guard_name: string,
    created_at: string,
    updated_at: string,
}

export interface User {
    id: number,
    name: string,
    email: string,
    photo: string | null,
    role: string,
}

export interface PenerimaanItem {
    id: number;
    no_surat: string;       // Diubah dari noSurat
    role_user: string;      // Diubah dari role
    pegawai_name: string;   // Diubah dari namaPegawai
    category_name: string;  // Diubah dari kategori
    status: string;
    status_code: string
    // 'linkUnduh' tidak ada di API, jadi kita hapus
}

export interface RiwayatPenerimaanItem {
    id: number;
    no_surat: string;       // Diubah dari noSurat
    role_user: string;      // Diubah dari role
    pegawai_name: string;   // Diubah dari namaPegawai
    category_name: string;  // Diubah dari kategori
    status: string;
    status_code: string
    // 'linkUnduh' tidak ada di API, jadi kita hapus
}

// BUAT STOK / BARANG DI PENERIMAAN SELECT BARANG BELANJA
export interface TIPE_BARANG_STOK {
    id: number,
    name: string,
    satuan_id: string,
    satuan_name: string,
}

// BUAT DI HALAMAN STOK BARANG
export interface BARANG_STOK {
    id: number,
    name: string,
    category_name: string,
    stok_lama: number,
    total_stok: string,
    minimum_stok: string,
    satuan: string,
    price: number
}

// BUAT PENERIMAAN
export interface Detail_Barang {
    id: number,
    stok_id: number;
    quantity: number;
    price?: number;
    harga?: number;
    satuan_name?: string;
    stok_name?: string;
    total_harga?: number;
    is_layak?: boolean | null;
}

export interface Pegawais {
    pegawai_id: number;
    alamat_staker: string;
}

export interface FormDataPenerimaan {
    no_surat: string;
    category_id: number;
    category_name?: string;
    deskripsi: string;
    detail_barangs: Detail_Barang[],
    pegawais: [{
        pegawai_id_pertama: number; // dari dropdown pihak
        pegawai_name_pertama?: string,
        pegawai_NIP_pertama?: string,
        jabatan_name_pertama?: string,
        alamat_staker_pertama: string,
    },
        {
            pegawai_id_kedua: number; // dari dropdown pihak
            pegawai_name_kedua?: string;
            pegawai_NIP_kedua?: string;
            jabatan_name_kedua?: string;
            alamat_staker_kedua: string;
        }]
}

export interface PaginationResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export const menuItems = [
    // { path: '/akun', icon: AkunIcon, label: 'Akun', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Akun' },
    { path: '/notifikasi', icon: '', label: 'Notifikasi', role: [], tag: 'Notifikasi' },
    { path: '/profil', icon: '', label: 'Pegawai', role: [], tag: 'Profil' },
    { path: '/pegawai', icon: PegawaiIcon, label: 'Pegawai', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Pegawai' },
    { path: '/monitoring', icon: MonitoringIcon, label: 'Monitoring', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Monitoring' },
    { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard', role: [ROLES.ADMIN_GUDANG], tag: 'Dashboard' },
    { path: '/stok-barang', icon: BarangIcon, label: 'Stok Barang', role: [ROLES.ADMIN_GUDANG], tag: 'Manajemen Barang' },
    { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan', role: [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS], tag: 'Manajemen Penerimaan' },
    { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran', role: [ROLES.PENANGGUNG_JAWAB, ROLES.ADMIN_GUDANG], tag: 'Manajemen Pengeluaran' },
    { path: '/pemesanan', icon: PemesananIcon, label: 'Pemesanan', role: [ROLES.INSTALASI], tag: 'Manajemen Pemesanan' },
];

export interface DaftarPegawai {
    id: number,
    name: string,
    nip: string,
    phone: string,
    status: string,
    jabatan_id: number,
    created_at: string,
    updated_at: string,
    jabatan: string
}

export interface APIPegawaiBaru {
    name: string,
    nip: string,
    jabatan_id: number,
    phone: string,
    status: string | undefined
}

export interface APINotifikasi {
    id: number,
    sender: string,
    title: string,
    message: string,
    date: string,
    isRead: boolean,
    type: string,
    url: string
}

export interface APIJabatan {
    id: number,
    name: string,
}

export interface APIStokUpdate {
    id?: number,
    name: string,
    minimum_stok: number | string
}

export interface APIConfirmKelayakan {
    quantity_layak: number,
}

export interface BASTAPI {
    id: number,
    no_surat: string,
    role_user: string,
    category_name: string,
    pegawai_name: string,
    status: string,
    status_code?: string,
    bast?: {
        id: number,
        file_url?: string,
        signed_file_url?: string,
        download_endpoint: string
    }
}
export interface RIWAYATBASTFILEAPI {
    id: number,
    filename: string,
    signed_file: string,
    uploaded_at: string,
    penerimaan_no_surat: string
}

export interface APIBarangBaru {
    name: string,
    satuan_name: string,
    minimum_stok: number,
    quantity: number,
    harga: number,
}

interface MutationItem {
    tanggal: string;
    tipe: 'masuk' | 'keluar';
    no_surat: string;
    quantity: number;
    harga: string;
    total_harga: string;
}

export interface APIDetailBarang {
    id: number;
    name: string;
    category_name: string;
    satuan: string;
    minimum_stok: string;
    total_stok: string;
    mutasi: {
        current_page: number;
        data: MutationItem[];
    };
}

export interface APIDetailStokBAST {
    detail_penerimaan_id: number;
    bast_id: number;
    tanggal_bast: string;
    quantity_total: number;
    quantity_used: number;
    quantity_remaining: number;
    harga: string;
}

export interface APIDataPenerimaan {
    no_surat: string;
    category_id: number;
    deskripsi: string;
    detail_barangs: (Detail_Barang | APIBarangBaru)[];
    pegawais: Pegawais[]
}

export interface APIDetailPenerimaan {
    id: number;
    no_surat: string;
    deskripsi: string;
    status: string; // Bisa juga 'pending' | 'confirmed'
    category: {
        id: number;
        name: string;
    };
    detail_barang: {
        id: number;
        nama_stok: string;
        nama_category: string;
        nama_satuan: string;
        harga: number;
        quantity: number;
        total_harga: number;
        is_layak: boolean | null;
        is_paid: boolean;
    }[]; // <-- Ini adalah array dari objek barang
    detail_pegawai: {
        id: number;
        name: string;
        nip: string;
        jabatan_id: number;
        jabatan_name: string;
        alamat_satker: string;
    }[]; // <-- Ini adalah array dari objek pegawai
}

export interface APIPemesanan {
    id: number,
    user_name: string,
    ruangan: string,
    tanggal_pemesanan: string,
    status: string
}
export interface APIStokPemesanan {
    id: number,
    name: string,
    category_name: string,
    total_stok: number,
    satuan: string
}

export interface APIPemesananBaruItem {
    name?: string,
    stok_id: number,
    quantity: number
}

export interface APIPemesananBaru {
    ruangan: string,
    nama_pj_instalasi: string,
    items: APIPemesananBaruItem[]
}

// ✅ Interface yang diperbaiki - gunakan PaginationResponse yang sudah ada
export interface APIDetailPemesanan {
    id: number;
    tanggal_pemesanan: string;
    user_name: string;
    ruangan: string;
    status: string;
    detail_items: PaginationResponse<APIDetailItemPemesanan>; // ✅ Gunakan generic yang sudah ada
}

// Interface untuk item tetap sama
export interface APIDetailItemPemesanan {
    id: number;
    stok_id: number; // ✅ Ubah dari 19 ke number
    stok_name: string;
    satuan_name: string;
    quantity: number;
    quantity_pj: number | null;
    quantity_admin_gudang: number | null;
}

export interface APIPatchDetailsQuantityPJ {
    detail_id: number,
    quantity_pj: number
}
export interface APIPatchQuantityPJ {
    details: APIPatchDetailsQuantityPJ[]
};

// 1. Tipe untuk satu baris alokasi (Child)
// Ini merepresentasikan { "detail_penerimaan_id": 12, "quantity": 4 }
export interface AllocationTarget {
    detail_penerimaan_id: number;
    quantity: number;
}

// 2. Tipe untuk satu item pemesanan beserta alokasinya (Parent)
// Ini merepresentasikan objek di dalam array "detailPemesanan"
export interface ItemAllocationPayload {
    detail_id: number;
    quantity_admin: number;
    allocations: AllocationTarget[];
}

// 3. Tipe Payload Utama ke Backend
// Ini struktur JSON final yang dikirim
export interface APIAlokasiPengeluaranPayload {
    detailPemesanan: ItemAllocationPayload[];
}

export interface APIPengeluaranList {
    id: number,
    no_surat: string,
    instalasi: string,
    category_name: string,
    quantity: number,
    stok_name: string,
    harga: number,
    subtotal: number,
    tanggal_pengeluaran: string
}