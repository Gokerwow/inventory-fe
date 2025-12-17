import DashboardIcon from '../assets/DashboardIcon.svg?react';
import ChartIcon from '../assets/Chart.svg?react';
import PenerimaanIcon from '../assets/Penerimaan.svg?react';
import PengeluaranIcon from '../assets/Pengeluaran.svg?react';
import PegawaiIcon from '../assets/hashtag.svg?react'
import AkunIcon from '../assets/Akun Icon.svg?react'
import CetakIcon from '../assets/CetakIcon.svg?react'
import ListrikIcon from '../assets/ListrikIcon.svg?react'
import KomputerIcon from '../assets/KomputerIcon.svg?react'
import KertasIcon from '../assets/KertasIcon.svg?react'
import PaluIcon from '../assets/PaluIcon.svg?react'
import PembersihIcon from '../assets/PembersihIcon.svg?react'
import AtkIcon from '../assets/AtkIcon.svg?react'



export type Usernames = 'superadmin' | 'admingudangumum' | 'ppk' | 'teknis' | 'penanggungjawab' | 'instalasi';

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN_GUDANG: 'admin gudang umum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggungjawab',
};
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
    role: string,
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
    id: number;
    sso_user_id: number;
    name: string;
    photo: string,
    email: string;
    password: string; // Seharusnya hash, tapi kita ikuti data mock
    role: string;
    created_at: string;
    updated_at: string;
}

export interface PenerimaanItem {
    id: number;
    no_surat: string;       // Diubah dari noSurat
    role_user: string;      // Diubah dari role
    pegawai_name: string;   // Diubah dari namaPegawai
    category_name: string;  // Diubah dari kategori
    status: string;
    // 'linkUnduh' tidak ada di API, jadi kita hapus
}

export interface RiwayatPenerimaanItem {
    id: number;
    no_surat: string;       // Diubah dari noSurat
    role_user: string;      // Diubah dari role
    pegawai_name: string;   // Diubah dari namaPegawai
    category_name: string;  // Diubah dari kategori
    status: string;
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
    { path: '/akun', icon: AkunIcon, label: 'Akun', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Akun' },
    { path: '/pegawai', icon: PegawaiIcon, label: 'Pegawai', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Pegawai' },
    { path: '/monitoring', icon: PenerimaanIcon, label: 'Monitoring', role: [ROLES.SUPER_ADMIN], tag: 'Manajemen Monitoring' },
    { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard', role: [ROLES.ADMIN_GUDANG], tag: 'Dashboard' },
    { path: '/stok-barang', icon: ChartIcon, label: 'Stok Barang', role: [ROLES.ADMIN_GUDANG], tag: 'Manajemen Barang' },
    { path: '/penerimaan', icon: PenerimaanIcon, label: 'Penerimaan', role: [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS], tag: 'Manajemen Penerimaan' },
    { path: '/pengeluaran', icon: PengeluaranIcon, label: 'Pengeluaran', role: [ROLES.PENANGGUNG_JAWAB, ROLES.ADMIN_GUDANG], tag: 'Manajemen Pengeluaran' },
    { path: '/pemesanan', icon: PengeluaranIcon, label: 'Pemesanan', role: [ROLES.INSTALASI], tag: 'Manajemen Pemesanan' },
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
    jabatan: {
        id: number,
        name: string
    }
}

export interface APIPegawaiBaru {
    name: string,
    nip: string,
    jabatan_id: number,
    phone: string,
    status: string | undefined
}

export interface APIJabatan {
    id: number,
    name: string,
}

export interface APIStokUpdate {
    id?: number,
    name: string,
    minimum_stok: number
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

export interface APIDetailBarang {
    id: number,
    name: string,
    category_name: string,
    satuan: string,
    minimum_stok: string,
    riwayat_penerimaan: [
        {
            penerimaan_id: number,
            no_surat: string,
            quantity: number,
            harga: string,
            total_harga: string,
            status: string,
            created_at: string
        }
    ]
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