// src/constants/paths.js
export const PATHS = {
    UNAUTHORIZED: '/unauthorized',
    ROLE_PICK: '/role-pick',
    DASHBOARD: '/dashboard',
    STOK_BARANG: {
        INDEX: '/stok-barang',
        LIHAT: '/stok-barang/lihat/:id',},
    PENERIMAAN: {
        INDEX: '/penerimaan',
        TAMBAH: '/penerimaan/tambah',
        BARANG_BELANJA: '/penerimaan/tambah/barang-belanja',
        EDIT: '/penerimaan/edit/:id',
        LIHAT: '/penerimaan/lihat/:id',
        UNDUH: '/penerimaan/unduhBAST/:id',
        UNGGAH: '/penerimaan/unggah/:id',
        INSPECT: '/penerimaan/inspect/:id',
        PREVIEW: '/penerimaan/detail/:id/',
    },
    PENGELUARAN: {
        INDEX : '/pengeluaran',
        LIHAT : '/pengeluaran/lihat/:id',
        EDIT : '/pengeluaran/edit/:id',
    },
    PROFIL: {
        INDEX: '/profil',
        EDIT: '/profil/edit'
    },
    AKUN: {
        INDEX: '/akun',
        TAMBAH: '/akun/tambah'
    },
    PEGAWAI: {
        INDEX: '/pegawai',
        TAMBAH: '/pegawai/tambah',
        EDIT: '/pegawai/edit/:id'
    },
    MONITORING: '/monitoring',
    PEMESANAN: '/pemesanan',
    NOTIFICATION: '/notifikasi'
}