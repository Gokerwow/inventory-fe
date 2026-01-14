import { useEffect, useState, useCallback } from "react";
import {
    getDaftarNotifikasi,
    markReadNotifikasi,
    markAllNotifikasi,
    deleteNotifikasi,
    deleteAllNotifikasi
} from "../services/notifikasiService";
import type { APINotifikasi } from "../constant/roles";
import { useToast } from "../hooks/useToast";
import type { ColumnDefinition } from "../components/table";
import { NavigationTabs } from "../components/navTabs";
import ReusableTable from "../components/table";
import Pagination from "../components/pagination";
import Loader from "../components/loader";
import Button from "../components/button";
import { Check, Trash2, Circle, CheckCircle } from "lucide-react";
import ArchiveIcon from '../assets/svgs/archive.svg?react';
import ClipboardTick from '../assets/svgs/clipboard-tick.svg?react';
import ClipboardX from '../assets/svgs/clipboard-remove-svgrepo-com.svg?react';
import ConfirmModal from "../components/confirmModal";

const notificationTabs = [
    { id: 'all', label: 'Semua Notifikasi', icon: <ArchiveIcon className="-ml-0.5 mr-2 h-5 w-5" /> },
    { id: 'unread', label: 'Belum Dibaca', icon: <ClipboardX className="-ml-0.5 mr-2 h-5 w-5" /> },
    { id: 'read', label: 'Sudah Dibaca', icon: <ClipboardTick className="-ml-0.5 mr-2 h-5 w-5" /> },
];

export default function NotifikasiPage() {
    // ... (State logic tetap sama seperti sebelumnya) ...
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<APINotifikasi[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [modalAction, setModalAction] = useState<'delete_single' | 'delete_all' | 'mark_all_read' | null>(null);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const statusParam = activeTab === 'all' ? undefined : activeTab;
            const response = await getDaftarNotifikasi(currentPage, itemsPerPage, statusParam);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = response as any;

            setCurrentItems(result.list.data);
            setTotalItems(result.list.total || 0);
            setTotalPages(result.list.last_page || 1);
            setItemsPerPage(result.list.per_page || 10);
            setUnreadCount(result.unread_count || 0);
        } catch (err) {
            console.error("❌ Error fetching notifications:", err);
            setError("Gagal memuat data notifikasi.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMarkAsRead = async (item: APINotifikasi) => {
        if (isSubmitting) return;
        try {
            if (!item.isRead) {
                setCurrentItems(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
                await markReadNotifikasi(item.id);
            }
            if (item.url) window.location.href = item.url;
        } catch (err) {
            console.error("Gagal menandai baca:", err);
            fetchData();
        }
    };

    const handleMarkAllReadClick = () => {
        setModalAction('mark_all_read');
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedDeleteId(id);
        setModalAction('delete_single');
        setIsModalOpen(true);
    };

    const handleDeleteAllClick = () => {
        setModalAction('delete_all');
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        setIsSubmitting(true);
        try {
            if (modalAction === 'mark_all_read') {
                await markAllNotifikasi();
                showToast("Semua notifikasi ditandai sebagai dibaca", "success");
            }
            else if (modalAction === 'delete_all') {
                await deleteAllNotifikasi();
                showToast("Semua notifikasi berhasil dikosongkan", "success");
            }
            else if (modalAction === 'delete_single' && selectedDeleteId) {
                await deleteNotifikasi(selectedDeleteId);
                showToast("Notifikasi berhasil dihapus", "success");
            }

            await fetchData();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Gagal melakukan aksi:", err);
            showToast("Terjadi kesalahan", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getModalText = () => {
        switch (modalAction) {
            case 'mark_all_read':
                return "Apakah Anda yakin ingin menandai SEMUA notifikasi sebagai sudah dibaca?";
            case 'delete_all':
                return "Apakah Anda yakin ingin menghapus SEMUA notifikasi? Tindakan ini tidak dapat dibatalkan.";
            case 'delete_single':
                return "Apakah Anda yakin ingin menghapus notifikasi ini?";
            default:
                return "";
        }
    };

    const notifColumns: ColumnDefinition<APINotifikasi>[] = [
        {
            header: 'Status',
            width: '140px',
            // Sembunyikan label kolom di mobile agar layout card lebih bersih
            hideHeaderOnMobile: true,
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Circle
                        size={8}
                        className={!item.isRead ? "text-blue-600 fill-blue-600" : "text-gray-300 fill-gray-300"}
                    />
                    <span className={`text-xs md:text-sm font-medium ${!item.isRead ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.isRead ? 'Sudah Dibaca' : 'Belum Dibaca'}
                    </span>
                </div>
            )
        },
        {
            header: 'Pengirim',
            width: '160px',
            cell: (item) => (
                <div className="flex flex-col md:block">
                    <span className="text-xs text-gray-400 md:hidden uppercase font-bold mb-1">Pengirim</span>
                    <span className="text-sm font-semibold text-gray-900 truncate block" title={item.sender}>
                        {item.sender}
                    </span>
                </div>
            )
        },
        {
            header: 'Pesan',
            cell: (item) => (
                <div className="flex flex-col py-1 min-w-0 w-full">
                    <span className={`text-sm truncate ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {item.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 truncate w-full block">
                        {item.message}
                    </span>
                </div>
            )
        },
        {
            header: 'Waktu',
            width: '140px',
            cell: (item) => (
                <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap block">
                    {item.date}
                </span>
            )
        },
        {
            header: 'Aksi',
            align: 'center',
            width: '120px',
            cell: (item) => (
                <div className="flex gap-2 justify-end md:justify-center w-full">
                    {!item.isRead && (
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item); }}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full"
                            title="Tandai Dibaca"
                        >
                            <CheckCircle size={18} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item.id);
                        }}
                        title="Hapus Notifikasi"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs
                tabs={notificationTabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />

            {/* Container Utama */}
            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">

                {/* Responsive Header: Stack di Mobile, Row di Desktop */}
                <div className="p-4 md:p-6 flex md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">

                    {/* Judul & Count */}
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap">
                        {/* Tambahkan whitespace-nowrap di atas */}

                        <span className="truncate">Daftar Notifikasi</span>
                        {/* Opsional: Bungkus teks utama dengan span & truncate agar jika layar SANGAT kecil, teksnya yang terpotong (...) bukan layoutnya yang rusak */}

                        {unreadCount > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold shrink-0">
                                {/* Tambahkan shrink-0 di sini */}
                                {unreadCount} Baru
                            </span>
                        )}
                    </h2>

                    {/* Tombol Aksi - Responsive Text */}
                    <div className='flex gap-2 self-end md:self-auto'>
                        <Button
                            onClick={handleMarkAllReadClick}
                            variant='primary'
                            disabled={unreadCount === 0 || isLoading || isSubmitting}
                            className='flex items-center justify-center gap-2 px-3 py-2 text-sm'
                            title="Tandai Semua Dibaca"
                        >
                            <Check size={16} />
                            <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                        </Button>
                        <Button
                            onClick={handleDeleteAllClick}
                            variant='danger'
                            disabled={currentItems.length === 0 || isLoading || isSubmitting}
                            className='flex items-center justify-center gap-2 px-3 py-2 text-sm'
                            title="Hapus Semua"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Hapus Semua</span>
                        </Button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-hidden relative flex">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <div className="flex-1 flex justify-center items-center py-10">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                            <span className='font-medium text-gray-500'>TIDAK ADA NOTIFIKASI</span>
                        </div>
                    ) : (
                        <>
                            <ReusableTable
                                columns={notifColumns}
                                currentItems={currentItems}
                                onRowClick={(item) => handleMarkAsRead(item)}
                            />
                        </>
                    )}
                </div>

                {/* Pagination (Jika ada data) */}
                {currentItems.length > 0 && (
                    <div className="border-t border-gray-100">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => setCurrentPage(page)}
                            totalPages={totalPages}
                        />
                    </div>
                )}

            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                onConfirm={handleConfirmAction}
                isLoading={isSubmitting}
                text={getModalText()}
            />
        </div>
    );
}