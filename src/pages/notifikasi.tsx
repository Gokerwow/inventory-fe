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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<APINotifikasi[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const { showToast } = useToast();

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State untuk membedakan jenis aksi modal
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
            const result = response as any;

            setCurrentItems(result.list.data);
            setTotalItems(result.list.total || 0);
            setTotalPages(result.list.last_page || 1);
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
                // Update UI secara optimis (responsif)
                setCurrentItems(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
                await markReadNotifikasi(item.id);
            }
            if (item.url) window.location.href = item.url;
        } catch (err) {
            console.error("Gagal menandai baca:", err);
            fetchData(); // rollback jika gagal
        }
    };

    // --- HANDLERS UNTUK MEMBUKA MODAL ---

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

    // --- LOGIKA UTAMA KONFIRMASI MODAL ---
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
            // Reset state modal
            setSelectedDeleteId(null);
            setModalAction(null);
        }
    };

    // Helper untuk teks modal dinamis
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
            width: '150px',
            cell: (item) => (
                <div className="flex items-center gap-2">
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
            header: 'Pengirim',
            width: '180px',
            cell: (item) => (
                <span className="text-sm font-semibold text-gray-900 truncate" title={item.sender}>
                    {item.sender}
                </span>
            )
        },
        {
            header: 'Pesan',
            cell: (item) => (
                <div className="flex flex-col py-1 min-w-0">
                    <span className={`text-sm truncate ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {item.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 truncate max-w-md">
                        {item.message}
                    </span>
                </div>
            )
        },
        {
            header: 'Waktu',
            width: '150px',
            cell: (item) => (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {item.date}
                </span>
            )
        },
        {
            header: 'Aksi',
            align: 'center',
            width: '180px',
            cell: (item) => (
                <div className="flex gap-2 justify-center">
                    {!item.isRead && (
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item); }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Tandai Dibaca"
                        >
                            <CheckCircle size={18} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 p-1"
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

            <div className="bg-white flex-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-xl font-semibold">
                        Daftar Notifikasi {unreadCount > 0 && <span className="text-blue-600 text-sm ml-2">({unreadCount} Baru)</span>}
                    </h2>
                    <div className='flex gap-2'>
                        <Button
                            onClick={handleMarkAllReadClick}
                            variant='primary'
                            disabled={unreadCount === 0 || isLoading || isSubmitting}
                            className='flex items-center justify-center gap-2'
                        >
                            <Check size={15} />
                            Tandai Semua Dibaca
                        </Button>
                        <Button
                            onClick={handleDeleteAllClick}
                            variant='danger'
                            disabled={currentItems.length === 0 || isLoading || isSubmitting}
                            className='flex items-center justify-center gap-2'
                        >
                            <Trash2 size={15} />
                            Hapus Semua
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div className="flex-1 flex justify-center items-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : currentItems.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                        <span className='font-medium text-gray-500'>DATA KOSONG</span>
                    </div>
                ) : (
                    <>
                        <ReusableTable
                            columns={notifColumns}
                            currentItems={currentItems}
                            onRowClick={(item) => handleMarkAsRead(item)}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => setCurrentPage(page)}
                            totalPages={totalPages}
                        />
                    </>
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