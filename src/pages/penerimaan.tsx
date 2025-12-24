import { useEffect, useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import PenerimaanTable from '../components/PenerimaanTable';
import { useNavigate } from 'react-router-dom';
import { deletePenerimaanDetail, getPenerimaanList, getRiwayatCheckedPenerimaanList, getRiwayatPenerimaanList } from '../services/penerimaanService';
import { PATHS } from '../Routes/path';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import type { PenerimaanItem, RiwayatPenerimaanItem } from '../constant/roles';
import { ROLES, type BASTAPI } from '../constant/roles';
import { getBASTList, getRiwayatBASTList } from '../services/bastService';
import Pagination from '../components/pagination';
import PenerimaanIcon from '../assets/svgs/arrow-down.svg?react';
import RiwayatPenerimaanIcon from '../assets/svgs/refresh.svg?react';
import { NavigationTabs } from '../components/navTabs';
import Loader from '../components/loader';
import ConfirmModal from '../components/confirmModal';
import Button from '../components/button';

const penerimaanTabs = [
    {
        id: 'penerimaan', label: 'Penerimaan', icon: <PenerimaanIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
    {
        id: 'riwayat', label: 'Riwayat Penerimaan', icon: <RiwayatPenerimaanIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

const PenerimaanPage = () => {
    // ... State data lainnya
    const [penerimaanItems, setPenerimaanItems] = useState<PenerimaanItem[]>([]);
    const [riwayatItems, setRiwayatItems] = useState<RiwayatPenerimaanItem[]>([]);
    const [bastItems, setBastItems] = useState<BASTAPI[]>([]);
    const [riwayatBastItems, setRiwayatBastItems] = useState<BASTAPI[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [activeTab, setActiveTab] = useState('penerimaan');

    // === STATE BARU UNTUK DELETE & REFRESH ===
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0); // Untuk trigger ulang useEffect
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS],
        []
    );

    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();

    // 1. Fungsi yang akan dikirim ke Table
    const handleDeleteRequest = (id: number) => {
        setSelectedDeleteId(id);
        setIsModalOpen(true);
    };

    // 2. Fungsi Eksekusi Hapus (Dipanggil Modal)
    const handleConfirmSubmit = async () => {
        if (!selectedDeleteId) return;

        setIsSubmitting(true);
        try {
            await deletePenerimaanDetail(selectedDeleteId);
            // Refresh data setelah hapus berhasil
            setRefreshKey(prev => prev + 1);
            setIsModalOpen(false);
            setSelectedDeleteId(null);
        } catch (err) {
            console.error("Gagal menghapus:", err);
            // Opsional: Tampilkan toast error disini
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Logika fetch sama seperti sebelumnya...
                if (activeTab === 'penerimaan') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        const response = await getBASTList(currentPage);
                        setBastItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    } else {
                        const response = await getPenerimaanList(currentPage, undefined, user?.role);
                        setPenerimaanItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    }
                } else if (activeTab === 'riwayat') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        const response = await getRiwayatBASTList(currentPage);
                        setRiwayatBastItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    }
                    else if (user?.role === ROLES.TEKNIS) {
                        const response = await getRiwayatCheckedPenerimaanList(currentPage);
                        setRiwayatItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    } else {
                        const response = await getRiwayatPenerimaanList(currentPage);
                        setRiwayatItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    }
                }
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setError("Gagal memuat data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Tambahkan refreshKey ke dependency array agar fetchData jalan ulang saat refreshKey berubah
    }, [user, checkAccess, hasAccess, activeTab, currentPage, refreshKey]);

    // ... handler pagination & tab click lainnya ...
    const handleClick = (tab: string) => { setActiveTab(tab); setCurrentPage(1); };
    const handlePageChange = (page: number) => { setCurrentPage(page); };

    const dataToShow = user?.role === ROLES.ADMIN_GUDANG ? (activeTab === 'penerimaan' ? bastItems : riwayatBastItems) : (activeTab === 'penerimaan' ? penerimaanItems : riwayatItems);

    // Transform data to match DataItem type expected by PenerimaanTable
    const transformedData = Array.isArray(dataToShow) ? dataToShow.map((item: any) => ({
        id: item.id,
        no_surat: item.noSurat || item.no_surat,
        role_user: item.role || item.role_user,
        pegawai_name: item.namaPegawai || item.pegawai_name,
        category_name: item.kategori || item.category_name,
        status: item.status,
        status_code: item.status_code,
        // PERBAIKAN DI SINI: Gunakan ?. (optional chaining)
        bast: {
            file_url: item.bast?.file_url ?? null,
            signed_file_url: item.bast?.signed_file_url ?? null,
            download_endpoint: item.bast?.download_endpoint ?? null,
        },
        tipe: item.tipe,
    })) : [];

    return (
        <div className="flex flex-col h-full w-full gap-5">
            <NavigationTabs tabs={penerimaanTabs} activeTab={activeTab} onTabClick={handleClick} />

            <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 pb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {activeTab === 'penerimaan' ? 'Daftar Penerimaan' : 'Riwayat Penerimaan'}
                    </h2>
                    {user?.role === ROLES.PPK && activeTab === 'penerimaan' && (
                        <Button
                            variant="primary"
                            onClick={() => navigate(PATHS.PENERIMAAN.TAMBAH)} // 2. Navigate on click
                            className="flex items-center gap-2 shadow-sm"     // 3. Layout adjustments
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tambah Barang Belanja</span>
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div className="flex-1 flex justify-center items-center py-10"><p className="text-red-500">{error}</p></div>
                ) : transformedData.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center py-20 bg-gray-50 mx-6 mb-6 rounded-lg border border-dashed border-gray-300'>
                        <span className='font-medium text-gray-500'>DATA KOSONG</span>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-auto">
                            <PenerimaanTable
                                data={transformedData}
                                variant={activeTab === 'penerimaan' ? 'active' : 'history'}
                                // 3. Pass fungsi ke props table
                                onDelete={handleDeleteRequest}
                            />
                        </div>
                        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                isLoading={isSubmitting}
                text={"Apakah Anda yakin ingin menghapus data ini?"}
            />
        </div>
    );
};

export default PenerimaanPage;