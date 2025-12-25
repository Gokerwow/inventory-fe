import { useState, useMemo } from 'react';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import { NavigationTabs } from '../components/navTabs';
import Pagination from '../components/pagination';
import Button from '../components/button';
import ArchiveIcon from '../assets/svgs/archive.svg?react'
import ClipboardTick from '../assets/svgs/clipboard-tick.svg?react'
import ClipboardX from '../assets/svgs/clipboard-remove-svgrepo-com.svg?react'
import {
    CheckCircle,
    Trash2,
    Check,
    Circle,
} from 'lucide-react';

interface NotificationItem {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    sender: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 1,
        type: 'warning',
        sender: 'Sistem Inventaris',
        title: 'Stok Menipis',
        message: 'Stok "Kertas A4" tersisa kurang dari 5 rim. Segera lakukan restock.',
        date: '25 Des 2025, 10:30',
        isRead: false
    },
    {
        id: 2,
        type: 'success',
        sender: 'Bagian Logistik',
        title: 'Penerimaan Berhasil',
        message: 'Barang dari Vendor ABC telah diterima dan masuk ke gudang utama.',
        date: '24 Des 2025, 14:20',
        isRead: false
    },
    {
        id: 3,
        type: 'info',
        sender: 'IT Administrator',
        title: 'Jadwal Maintenance',
        message: 'Sistem akan maintenance pada tgl 30 Des pukul 23:00 WIB.',
        date: '23 Des 2025, 09:00',
        isRead: true
    },
    {
        id: 4,
        type: 'error',
        sender: 'Sistem Keamanan',
        title: 'Percobaan Login',
        message: 'Terdeteksi percobaan login mencurigakan dari IP tidak dikenal.',
        date: '22 Des 2025, 16:45',
        isRead: true
    },
    {
        id: 5,
        type: 'info',
        sender: 'HR Department',
        title: 'Selamat Datang',
        message: 'Selamat datang di dashboard sistem manajemen inventaris baru.',
        date: '20 Des 2025, 08:00',
        isRead: true
    },
    {
        id: 6,
        type: 'warning',
        sender: 'Sistem Inventaris',
        title: 'Stok Tinta Printer Habis',
        message: 'Stok "Tinta Epson 664 Black" telah mencapai 0. Harap segera order.',
        date: '19 Des 2025, 13:15',
        isRead: false
    },
    {
        id: 7,
        type: 'success',
        sender: 'Kepala Gudang',
        title: 'Permintaan Disetujui',
        message: 'Pengajuan permintaan barang "Laptop Inventaris" telah disetujui.',
        date: '19 Des 2025, 10:00',
        isRead: true
    },
    {
        id: 8,
        type: 'error',
        sender: 'Sistem Integrasi',
        title: 'Gagal Sinkronisasi',
        message: 'Gagal menyinkronkan data stok dengan server pusat. Mencoba ulang...',
        date: '18 Des 2025, 08:30',
        isRead: false
    },
    {
        id: 9,
        type: 'info',
        sender: 'Bagian Umum',
        title: 'Pemeriksaan Aset',
        message: 'Akan dilakukan pemeriksaan aset fisik (Opname) pada tanggal 2 Januari.',
        date: '17 Des 2025, 15:45',
        isRead: true
    },
    {
        id: 10,
        type: 'warning',
        sender: 'Sistem Inventaris',
        title: 'Barang Kadaluarsa',
        message: 'Batch #4421 (Pembersih Lantai) akan kadaluarsa dalam 30 hari.',
        date: '16 Des 2025, 09:20',
        isRead: false
    },
    {
        id: 11,
        type: 'success',
        sender: 'Vendor XYZ',
        title: 'Pengiriman Diproses',
        message: 'Pesanan PO-2025-0012 sedang dalam perjalanan menuju lokasi Anda.',
        date: '15 Des 2025, 11:10',
        isRead: true
    },
    {
        id: 12,
        type: 'info',
        sender: 'IT Administrator',
        title: 'Pembaruan Fitur',
        message: 'Fitur "Export Excel" pada modul Laporan telah diperbarui.',
        date: '14 Des 2025, 08:00',
        isRead: true
    },
    {
        id: 13,
        type: 'warning',
        sender: 'Keuangan',
        title: 'Batas Anggaran',
        message: 'Pengeluaran divisi IT telah mencapai 90% dari anggaran bulanan.',
        date: '13 Des 2025, 14:50',
        isRead: false
    },
    {
        id: 14,
        type: 'error',
        sender: 'Sistem Inventaris',
        title: 'Stok Minus Terdeteksi',
        message: 'Terjadi anomali data: Stok "Mouse Wireless" bernilai -2.',
        date: '12 Des 2025, 16:30',
        isRead: false
    },
    {
        id: 15,
        type: 'success',
        sender: 'Tim Audit',
        title: 'Audit Selesai',
        message: 'Proses audit inventaris Q4 telah selesai tanpa temuan mayor.',
        date: '11 Des 2025, 10:15',
        isRead: true
    },
    {
        id: 16,
        type: 'info',
        sender: 'HR Department',
        title: 'Cuti Bersama',
        message: 'Pengingat: Kantor libur pada tanggal 26 Desember untuk Cuti Bersama.',
        date: '10 Des 2025, 09:00',
        isRead: true
    },
    {
        id: 17,
        type: 'warning',
        sender: 'Sistem Inventaris',
        title: 'Peminjaman Terlambat',
        message: 'Aset "Proyektor EPSON" belum dikembalikan oleh Divisi Marketing > 2 hari.',
        date: '09 Des 2025, 13:45',
        isRead: false
    },
    {
        id: 18,
        type: 'success',
        sender: 'Bagian Logistik',
        title: 'Retur Selesai',
        message: 'Barang rusak (Kursi Kantor) telah berhasil diretur ke supplier.',
        date: '08 Des 2025, 11:30',
        isRead: true
    },
    {
        id: 19,
        type: 'error',
        sender: 'Database',
        title: 'Error Koneksi',
        message: 'Terputus dari database replikasi selama 5 menit. Data aman.',
        date: '07 Des 2025, 03:00',
        isRead: true
    },
    {
        id: 20,
        type: 'info',
        sender: 'Sistem Inventaris',
        title: 'Backup Bulanan',
        message: 'Backup data otomatis bulan November berhasil dilakukan.',
        date: '01 Des 2025, 00:00',
        isRead: true
    },
];

const notificationTabs = [
    { id: 'all', label: 'Semua Notifikasi', icon: <ArchiveIcon className="-ml-0.5 mr-2 h-5 w-5"/> },
    { id: 'unread', label: 'Belum Dibaca', icon: <ClipboardX className="-ml-0.5 mr-2 h-5 w-5"/> },
    { id: 'read', label: 'Sudah Dibaca', icon: <ClipboardTick className="-ml-0.5 mr-2 h-5 w-5"/> },
];

export default function NotifikasiPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const filteredData = useMemo(() => {
        let data = MOCK_NOTIFICATIONS;

        if (activeTab === 'unread') {
            data = data.filter(item => !item.isRead);
        } else if (activeTab === 'read') {
            data = data.filter(item => item.isRead);
        }
        return data;
    }, [activeTab]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);


    const handleMarkAsRead = (id: number) => {
        alert(`Menandai notifikasi #${id} sebagai dibaca (Logic API disini)`);
        // Disini panggil API mark-as-read
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus notifikasi ini?')) {
            alert(`Menghapus notifikasi #${id} (Logic API disini)`);
        }
    };

    const columns: ColumnDefinition<NotificationItem>[] = useMemo(() => [
        {
            header: 'STATUS',
            key: 'isRead',
            width: '150px',
            cell: (item) => (
                <div className="flex items-center gap-2">
                    {/* Indikator Dot: Biru jika belum dibaca, Abu jika sudah */}
                    <Circle
                        size={10}
                        className={!item.isRead ? "text-blue-600 fill-blue-600" : "text-gray-300 fill-gray-300"}
                    />
                    <span className={`text-sm font-medium ${!item.isRead ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.isRead ? 'Sudah Dibaca' : 'Belum Dibaca'}
                    </span>
                </div>
            )
        },
        {
            header: 'PENGIRIM',
            key: 'sender',
            width: '180px',
            cell: (item) => (
                <span className="text-sm font-semibold text-gray-900">
                    {item.sender}
                </span>
            )
        },
        {
            header: 'PESAN',
            key: 'message',
            cell: (item) => (
                <div className="flex flex-col py-1">
                    <span className={`text-sm ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {item.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 truncate max-w-lg">
                        {item.message}
                    </span>
                </div>
            )
        },
        {
            header: 'WAKTU',
            key: 'date',
            width: '150px',
            cell: (item) => (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {item.date}
                </span>
            )
        },
        {
            header: 'AKSI',
            key: 'actions',
            width: '200px',
            align: 'center',
            cell: (item) => (
                <div className="flex gap-2 justify-center">
                    {!item.isRead && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center gap-2 "
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item.id); }}
                            title="Tandai Dibaca"
                        >
                            <CheckCircle size={18} />
                            Tandai
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors flex items-center gap-2"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        title="Hapus"
                    >
                        <Trash2 size={18} />
                        Hapus
                    </Button>
                </div>
            )
        }
    ], []);

    return (
        <div className="w-full flex flex-col gap-5 h-full"> {/* Hapus min-h-screen agar mengikuti parent layout */}

            <NavigationTabs
                tabs={notificationTabs}
                activeTab={activeTab}
                onTabClick={(tabId) => {
                    setActiveTab(tabId);
                    setCurrentPage(1);
                }}
            />

            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100 bg-white z-10">
                    <h2 className="text-xl font-bold text-[#002B5B]">
                        Daftar Notifikasi
                    </h2>
                    <div className='flex gap-2'>
                        <Button
                            variant='primary'
                            className='flex items-center justify-center gap-2'
                        >
                            <Check size={15} />
                            Tandai Semua Dibaca
                        </Button>
                        <Button
                            variant='danger'
                            className='flex items-center justify-center gap-2'
                        >
                            <Trash2 size={15} />
                            Hapus Semua
                        </Button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    <ReusableTable
                        columns={columns}
                        currentItems={currentItems}
                        onRowClick={(item) => !item.isRead && handleMarkAsRead(item.id)}
                    />
                </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
            </div>
        </div>
    );
}