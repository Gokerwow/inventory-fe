// src/constants/paths.js
export const PATHS = {
    UNAUTHORIZED: '/unauthorized',
    ROLE_PICK: '/role-pick',
    DASHBOARD: '/dashboard',
    STOK_BARANG: '/stok-barang',
    PENERIMAAN: {
        INDEX: '/penerimaan',
        TAMBAH: '/penerimaan/tambah',
        BARANG_BELANJA: '/penerimaan/tambah/barang-belanja',
        EDIT: 'edit/:id',
        UNDUH: 'unduhBAST/:id',
        LIHAT: 'lihat-penerimaan/:id'
    },
    PENGELUARAN: '/pengeluaran',
    PROFIL: {
        INDEX: '/profil',
        EDIT: '/profil/edit'
    },
    AKUN: {
        INDEX: '/akun',
        TAMBAH: '/akun/tambah'
    },
    PEGAWAI: '/pegawai',
    MONITORING: '/monitoring'
}