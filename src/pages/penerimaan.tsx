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
import { useToast } from '../hooks/useToast';
import SearchBar from '../components/searchBar';

const penerimaanTabs = [
    {
        id: 'penerimaan', label: 'Penerimaan', icon: <PenerimaanIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
    {
        id: 'riwayat', label: 'Riwayat Penerimaan', icon: <RiwayatPenerimaanIcon className="-ml-0.5 mr-2 h-5 w-5" />
    },
];

const PenerimaanPage = () => {
    // ... State (biarkan sama)
    const [penerimaanItems, setPenerimaanItems] = useState<PenerimaanItem[]>([]);
    const [riwayatItems, setRiwayatItems] = useState<RiwayatPenerimaanItem[]>([]);
    const [bastItems, setBastItems] = useState<BASTAPI[]>([]);
    const [riwayatBastItems, setRiwayatBastItems] = useState<BASTAPI[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [activeTab, setActiveTab] = useState('penerimaan');
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { showToast } = useToast();
    const navigate = useNavigate();

    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PPK, ROLES.TEKNIS],
        []
    );

    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();

    const handleDeleteRequest = (id: number) => {
        setSelectedDeleteId(id);
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        if (!selectedDeleteId) return;
        setIsSubmitting(true);
        try {
            await deletePenerimaanDetail(selectedDeleteId);
            setRefreshKey(prev => prev + 1);
            setIsModalOpen(false);
            setSelectedDeleteId(null);
            showToast("Data Penerimaan berhasil dihapus", "success");
        } catch (err) {
            console.error("Gagal menghapus:", err);
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
                if (activeTab === 'penerimaan') {
                    if (user?.role === ROLES.ADMIN_GUDANG) {
                        const response = await getBASTList(currentPage);
                        setBastItems(response.data || []);
                        setTotalItems(response.total || 0);
                        setItemsPerPage(response.per_page || 10);
                        setTotalPages(response.last_page || 1);
                    } else {
                        const response = await getPenerimaanList(currentPage, undefined, user?.role, debouncedSearch);
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
    }, [user, checkAccess, hasAccess, activeTab, currentPage, refreshKey, debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const handleClick = (tab: string) => { setActiveTab(tab); setCurrentPage(1); };
    const handlePageChange = (page: number) => { setCurrentPage(page); };

    const dataToShow = user?.role === ROLES.ADMIN_GUDANG ? (activeTab === 'penerimaan' ? bastItems : riwayatBastItems) : (activeTab === 'penerimaan' ? penerimaanItems : riwayatItems);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedData = Array.isArray(dataToShow) ? dataToShow.map((item: any) => ({
        id: item.id,
        no_surat: item.noSurat || item.no_surat,
        role_user: item.role || item.role_user,
        pegawai_name: item.namaPegawai || item.pegawai_name,
        category_name: item.kategori || item.category_name,
        status: item.status,
        status_code: item.status_code,
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
                <div className="p-4 md:p-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-lg md:text-xl font-bold">
                        {activeTab === 'penerimaan' ? 'Daftar Penerimaan' : 'Riwayat Penerimaan'}
                    </h2>
                    <div className='flex flex-1 justify-between gap-2 w-full md:w-auto'>
                        <div className="md:w-72">
                            <SearchBar placeholder='Cari Penerimaan...' onChange={(e) => setSearch(e.target.value)} value={search} />
                        </div>
                        {user?.role === ROLES.PPK && activeTab === 'penerimaan' && (
                            <Button
                                variant="primary"
                                onClick={() => navigate(PATHS.PENERIMAAN.TAMBAH)}
                                className="flex items-center gap-2 shadow-sm w-full md:w-auto justify-center"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tambah Barang Belanja</span>
                            </Button>
                        )}
                    </div>
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
                        <div className="flex-1 overflow-hidden relative">
                            <PenerimaanTable
                                data={transformedData}
                                variant={activeTab === 'penerimaan' ? 'active' : 'history'}
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