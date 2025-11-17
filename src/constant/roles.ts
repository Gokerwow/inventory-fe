export type Usernames = 'superadmin' | 'admingudangumum' | 'ppk' | 'teknis' | 'penanggungjawab' | 'instalasi';

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN_GUDANG: 'admin gudang umum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggung jawab',
};
export const USERNAMES = {
    SUPER_ADMIN: 'superadmin',
    ADMIN_GUDANG: 'admingudangumum',
    PPK: 'ppk',
    TEKNIS: 'teknis',
    INSTALASI: 'instalasi',
    PENANGGUNG_JAWAB: 'penanggungjawab',
} as const;

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

// BUAT STOK / BARANG
export interface TIPE_BARANG_STOK {
    id: number,
    name: string,
    satuan_id: string,
    satuan_name: string,
}

// BUAT PENERIMAAN
export interface Detail_Barang {
    id: number,
    stok_id: number;
    quantity: number;
    price: number;
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

export interface APIDataPenerimaan {
    no_surat: string;
    category_id: number;
    deskripsi: string;
    detail_barangs: Detail_Barang[],
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

export interface BASTAPI {
    id: number,
    no_surat: string,
    role_user: string,
    category_name: string,
    pegawai_name: string,
    status: string,
    bast: {
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