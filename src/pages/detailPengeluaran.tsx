import { useEffect, useMemo, useState } from "react";
import { ROLES, type APIDetailItemPemesanan, type APIDetailPemesanan, type APIDetailStokBAST, type APIPatchQuantityPJ } from "../constant/roles";
import { getDetailPemesanan } from "../services/pemesananService";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import SearchBar from "../components/searchBar";
import { useAuth } from "../hooks/useAuth";
import ReusableTable, { type ColumnDefinition } from "../components/table";
import Input from "../components/input";
import BackButton from "../components/backButton";
import Button from "../components/button";
import ConfirmModal from "../components/confirmModal";
import { alokasiPengeluaran, confirmPemesanan } from "../services/pengeluaranService";
import { PATHS } from "../Routes/path";
import { useToast } from "../hooks/useToast";
import Pagination from "../components/pagination";
import { useAuthorization } from "../hooks/useAuthorization";
import { X, Info, CheckCircle, AlertCircle, Clock, Edit } from 'lucide-react';
import Modal from "../components/modal";
import { getStokByAvailableBAST } from "../services/barangService";

export function DetailPengeluaranPage() {
    const [metaStok, setMetaStok] = useState<{
        total_stok: number;
        minimum_stok: number;
        available_for_allocation: number;
    } | null>(null);
    const [pemesananItem, setPemesananItem] = useState<APIDetailPemesanan | null>(null);
    const detailItems = pemesananItem?.detail_items?.data ?? [];
    const [selectedItem, setSelectedItem] = useState<APIDetailStokBAST[]>([]);

    // State untuk Checkbox & Input dalam Tabel    
    const [checkedBastIds, setCheckedBastIds] = useState<number[]>([]);
    const [rowQuantities, setRowQuantities] = useState<Record<number, number | string>>({});

    // State untuk Global "Jumlah di ACC"
    const [accAmount, setAccAmount] = useState<number | string>('');

    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isModalInputOpen, setIsModalInputOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allAllocations, setAllAllocations] = useState<Record<number, Record<number, number>>>({});
    const [activeDetailId, setActiveDetailId] = useState<number | null>(null);

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // --- STATE BARU: Pagination Khusus Modal ---
    const [modalCurrentPage, setModalCurrentPage] = useState(1);
    const [modalTotalItems, setModalTotalItems] = useState(0);
    const [modalItemsPerPage, setModalItemsPerPage] = useState(10);
    const [modalTotalPages, setModalTotalPages] = useState(1);
    const [activeStokId, setActiveStokId] = useState<number | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const { id: paramId } = useParams();
    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PENANGGUNG_JAWAB],
        []
    );
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true);
            if (paramId) {
                try {
                    const detailPemesanan = await getDetailPemesanan(
                        parseInt(paramId),
                        currentPage,
                        itemsPerPage,
                        debouncedSearch
                    );
                    setPemesananItem(detailPemesanan.data as APIDetailPemesanan);
                    setTotalItems(detailPemesanan.data?.detail_items?.total || 0);
                    setItemsPerPage(detailPemesanan.data?.detail_items?.per_page || 10);
                    setTotalPages(detailPemesanan.data?.detail_items?.last_page || 1);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Gagal mengambil data", error);
                }
            }
        };
        fetchData();
    }, [user?.role, paramId, currentPage, itemsPerPage, debouncedSearch]); // Added dependency

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    // --- FUNGSI BARU: Fetch Data Modal ---
    const fetchModalData = async (stokId: number, page: number) => {
        setIsModalLoading(true);
        try {
            const response = await getStokByAvailableBAST(stokId, page, modalItemsPerPage);

            const rootData = response.data;
            const batchesData = rootData.batches;
            const metaData = rootData.meta;

            setSelectedItem(batchesData.data);
            setMetaStok(metaData);

            setModalCurrentPage(batchesData.current_page);
            setModalTotalItems(batchesData.total);
            setModalItemsPerPage(batchesData.per_page);
            setModalTotalPages(batchesData.last_page);

        } catch (error) {
            console.error("Error fetching modal data", error);
            showToast("Gagal memuat data BAST", "error");
        } finally {
            setIsModalLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleModalPageChange = (page: number) => {
        if (activeStokId) {
            fetchModalData(activeStokId, page);
        }
    };

    // Fungsi untuk mengubah jumlah item (Untuk PJ)
    const handleUpdateQuantity = (itemId: number, delta: number) => {
        if (!pemesananItem) return;

        const updatedDetails = detailItems.map(item => {
            if (item.id === itemId) {
                const currentPjValue = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                const newQuantityPj = Math.max(0, currentPjValue + delta);
                return { ...item, quantity_pj: newQuantityPj };
            }
            return item;
        });

        setPemesananItem({
            ...pemesananItem,
            detail_items: {
                ...pemesananItem.detail_items,
                data: updatedDetails
            }
        });
    };

    // Fungsi untuk handle klik pilih (Admin Gudang)
    const handlePilihClick = async (detailId: number, stokId: number) => {
        setActiveDetailId(detailId);
        setActiveStokId(stokId);
        setModalCurrentPage(1);

        const selectedDetail = detailItems.find(item => item.id === detailId);
        const quantityToSet = selectedDetail
            ? (selectedDetail.quantity_pj !== null ? selectedDetail.quantity_pj : selectedDetail.quantity)
            : 0;

        setAccAmount(quantityToSet);

        const savedAllocations = allAllocations[detailId] || {};
        setRowQuantities(savedAllocations);
        const savedIds = Object.keys(savedAllocations).map(Number);
        setCheckedBastIds(savedIds);

        await fetchModalData(stokId, 1);
        setIsModalInputOpen(true);
    };

    const handleSaveModal = () => {
        if (activeDetailId === null) return;

        const cleanAllocations = Object.entries(rowQuantities).reduce((acc, [key, val]) => {
            const numVal = typeof val === 'number' ? val : parseInt(val as string) || 0;
            if (numVal > 0 && checkedBastIds.includes(parseInt(key))) {
                acc[parseInt(key)] = numVal;
            }
            return acc;
        }, {} as Record<number, number>);

        setAllAllocations(prev => ({
            ...prev,
            [activeDetailId]: cleanAllocations
        }));

        setIsModalInputOpen(false);
        setCheckedBastIds([]);
        setRowQuantities({});
        setActiveDetailId(null);
        showToast('Alokasi barang disimpan sementara');
    };


    const handleToggleCheckbox = (id: number) => {
        setCheckedBastIds(prev => {
            if (prev.includes(id)) {
                const newQuantities = { ...rowQuantities };
                delete newQuantities[id];
                setRowQuantities(newQuantities);
                return prev.filter(itemId => itemId !== id);
            } else {
                setRowQuantities(prevQty => ({
                    ...prevQty,
                    [id]: accAmount
                }));
                return [...prev, id];
            }
        });
    };

    const handleRowQuantityChange = (id: number, value: string) => {
        const newValue = value === '' ? '' : parseInt(value);
        setRowQuantities(prev => ({
            ...prev,
            [id]: newValue
        }));
    };


    const handleConfirmClick = () => {
        setIsOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (user?.role === ROLES.ADMIN_GUDANG) {
                const unallocatedItems = detailItems.filter(item => {
                    const isModified = item.id in allAllocations;
                    const totalAllocated = Number(
                        isModified
                            ? Object.values(allAllocations[item.id]).reduce((sum, qty) => sum + qty, 0)
                            : (item.quantity_admin_gudang ?? 0)
                    );
                    return totalAllocated === 0;
                });

                if (unallocatedItems.length > 0) {
                    showToast(`Terdapat ${unallocatedItems.length} item yang belum diatur alokasinya (jumlah 0).`, 'error');
                    setIsSubmitting(false);
                    setIsOpen(false);
                    return;
                }

                const itemsToSend = detailItems.filter(item => item.id in allAllocations);

                if (itemsToSend.length === 0) {
                    showToast('Data valid. Tidak ada perubahan baru yang perlu disimpan.', 'success');
                    navigate(generatePath(PATHS.PENGELUARAN.INDEX));
                    return;
                }

                const payload = {
                    detailPemesanan: itemsToSend.map(item => {
                        const allocationsMap = allAllocations[item.id] || {};
                        const totalAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);

                        const allocationsArray = Object.entries(allocationsMap).map(([penerimaanId, qty]) => ({
                            detail_penerimaan_id: parseInt(penerimaanId),
                            quantity: qty
                        }));

                        return {
                            detail_id: item.id,
                            quantity_admin: totalAllocated,
                            allocations: allocationsArray
                        };
                    })
                };

                await alokasiPengeluaran(parseInt(paramId!), payload);
                showToast('Berhasil mengalokasi pengeluaran', 'success');
                navigate(generatePath(PATHS.PENGELUARAN.INDEX));

            } else {
                const payload: APIPatchQuantityPJ = {
                    details: detailItems.map(item => ({
                        detail_id: item.id,
                        quantity_pj: item.quantity_pj !== null ? item.quantity_pj : item.quantity
                    }))
                };

                await confirmPemesanan(parseInt(paramId!), payload);
                showToast('Berhasil mengkonfirmasi pengeluaran', 'success');
                navigate(generatePath(PATHS.PENGELUARAN.INDEX));
            }

        } catch (error: any) {
            console.error("Error submit:", error);
            const errorMsg = error.response?.data?.message || 'Gagal mengkonfirmasi pengeluaran';
            showToast(errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
            setIsOpen(false);
        }
    };

    const filteredItems = useMemo(() => {
        return detailItems.filter((item) =>
            item.stok_name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [detailItems, debouncedSearch]);

    const isSaveDisabled = useMemo(() => {
        if (activeDetailId === null) return true;
        const savedData = allAllocations[activeDetailId] || {};
        const currentData: Record<number, number> = {};
        checkedBastIds.forEach(id => {
            const val = rowQuantities[id];
            const numVal = typeof val === 'number' ? val : parseInt(val as string) || 0;
            if (numVal > 0) {
                currentData[id] = numVal;
            }
        });

        const totalCurrent = Object.values(currentData).reduce((sum, qty) => sum + qty, 0);
        const targetAmount = typeof accAmount === 'number' ? accAmount : parseInt(accAmount as string) || 0;

        if (targetAmount > 0 && totalCurrent !== targetAmount) return false;

        const savedKeys = Object.keys(savedData).sort();
        const currentKeys = Object.keys(currentData).sort();

        if (savedKeys.length !== currentKeys.length) return false;

        for (const key of savedKeys) {
            if (currentData[parseInt(key)] !== savedData[parseInt(key)]) return false;
        }

        return true;
    }, [allAllocations, activeDetailId, rowQuantities, checkedBastIds, accAmount]);

    const isConfirmDisabled = useMemo(() => {
        if (user?.role !== ROLES.ADMIN_GUDANG) return false;
        const hasAllocations = Object.keys(allAllocations).length > 0;
        if (!hasAllocations) return true;
        const allItemsHaveAllocations = filteredItems.every(item => {
            const allocationsMap = allAllocations[item.id] || {};
            const totalAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
            return totalAllocated > 0;
        });
        return !allItemsHaveAllocations;
    }, [user?.role, allAllocations, filteredItems]);


    const pengeluaranColumns: ColumnDefinition<APIDetailItemPemesanan>[] = useMemo(() => [
        {
            header: 'NAMA BARANG',
            key: 'namabarang',
            cell: (item) => <span className="text-gray-900 font-medium">{item.stok_name}</span>
        },
        {
            header: 'PERMINTAAN INSTALASI',
            key: 'permintaanInstalasi',
            cell: (item) => <span className="text-gray-900 font-bold">{item.quantity} {item.satuan_name}</span>
        },
        {
            header: 'PERSETUJUAN PENANGGUNG JAWAB',
            key: 'persetujuanPJ',
            cell: (item) => <span className="text-gray-900 font-bold">{item.quantity_pj} {item.satuan_name}</span>
        },
        {
            header: 'STATUS ALOKASI',
            key: 'status_alokasi',
            cell: (item) => {
                const allocationsMap = allAllocations[item.id] || {};
                const currentAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);

                let targetQty: number;
                if (currentAllocated > 0) {
                    targetQty = currentAllocated;
                } else {
                    targetQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                }

                let statusColor = "bg-gray-100 text-gray-500 border-gray-200";
                let statusText = "Belum Diatur";
                let Icon = Clock;

                if (currentAllocated === targetQty && targetQty > 0) {
                    statusColor = "bg-green-50 text-green-700 border-green-200";
                    statusText = "Selesai";
                    Icon = CheckCircle;
                } else if (currentAllocated > 0 && currentAllocated < targetQty) {
                    statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
                    statusText = "Sebagian";
                    Icon = AlertCircle;
                } else if (currentAllocated > targetQty) {
                    statusColor = "bg-red-50 text-red-700 border-red-200";
                    statusText = "Kelebihan";
                    Icon = AlertCircle;
                }

                return (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit ${statusColor}`}>
                        <Icon size={14} />
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-bold uppercase">{statusText}</span>
                            <span className="text-[10px] opacity-80 mt-0.5">
                                {currentAllocated} / {targetQty} Terpenuhi
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'SATUAN',
            key: 'satuan',
            cell: (item) => <span className="text-gray-500 text-sm">{item.satuan_name}</span>
        },
        {
            header: user?.role === ROLES.ADMIN_GUDANG ? 'AKSI' : 'JML DISETUJUI (PJ)',
            key: 'aksi',
            cell: (item) => {
                if (user?.role === ROLES.ADMIN_GUDANG) {
                    const allocationsMap = allAllocations[item.id] || {};
                    const currentAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
                    const isComplete = currentAllocated > 0;

                    return (
                        <button
                            type="button"
                            onClick={() => handlePilihClick(item.id, item.stok_id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border shadow-sm ${isComplete
                                ? "bg-white border-green-200 text-green-600 hover:bg-green-50"
                                : "bg-blue-600 border-transparent text-white hover:bg-blue-700 shadow-blue-200"
                                }`}
                        >
                            <Edit size={16} />
                            <span className="text-sm font-semibold">{isComplete ? "Ubah" : "Atur"}</span>
                        </button>
                    );
                }

                const displayValue = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                        </button>
                        <span className="text-gray-900 font-bold min-w-[24px] text-center text-lg">{displayValue}</span>
                        <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors border border-green-100"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                    </div>
                );
            }
        },
    ], [pemesananItem, user?.role, allAllocations]);

    const modalColumns: ColumnDefinition<APIDetailStokBAST>[] = useMemo(() => [
        {
            header: '',
            key: 'select',
            width: '50px',
            cell: (item) => (
                <div className="flex justify-center items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={checkedBastIds.includes(item.detail_penerimaan_id)}
                        // ✅ PENTING: stopPropagation di sini juga agar klik checkbox tidak dianggap klik baris (double toggle)
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleToggleCheckbox(item.detail_penerimaan_id)}
                    />
                </div>
            )
        },
        {
            header: 'NO SURAT / BAST ID',
            key: 'bast_id',
            cell: (item) => <span className="text-gray-900 font-medium">BAST #{item.bast_id}</span>
        },
        {
            header: 'TANGGAL',
            key: 'tanggal_bast',
            align: 'center',
            cell: (item) => <span className="text-gray-700 text-center">{item.tanggal_bast}</span>
        },
        {
            header: 'SISA STOK',
            key: 'quantity_remaining',
            align: 'center',
            cell: (item) => <span className="text-gray-900 font-bold text-center block">{item.quantity_remaining}</span>
        },
        {
            header: 'JUMLAH AMBIL',
            key: 'ambil',
            align: 'center',
            cell: (item) => {
                if (checkedBastIds.includes(item.detail_penerimaan_id)) {
                    return (
                        <div className="flex justify-center">
                            <input
                                type="number"
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                value={rowQuantities[item.detail_penerimaan_id] ?? ''}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleRowQuantityChange(item.detail_penerimaan_id, e.target.value)}
                                min={1}
                                max={item.quantity_remaining}
                            />
                        </div>
                    );
                }
                return <span className="text-gray-400 text-center block">-</span>;
            }
        },
    ], [selectedItem, checkedBastIds, rowQuantities]);

    const selectedDetail = useMemo(() =>
        detailItems.find(item => item.id === activeDetailId),
        [detailItems, activeDetailId]
    );

    const quantityRequested = selectedDetail
        ? (accAmount ?? selectedDetail.quantity_pj ?? selectedDetail.quantity)
        : 0;

    const totalAmbil = Object.values(rowQuantities).reduce((a, b) => {
        const val = typeof b === 'number' ? b : 0;
        return (a as number) + val;
    }, 0);

    const targetAmount = typeof accAmount === 'number' ? accAmount : 0;

    if (isLoading) return <Loader />;

    return (
        <div className={`w-full flex flex-col gap-5 ${user?.role === ROLES.ADMIN_GUDANG ? 'h-fit' : 'min-h-full'}`}>

            {/* === HEADER HALAMAN === */}
            <div className="bg-[#005DB9] rounded-xl p-6 text-white shadow-md relative flex flex-col items-center justify-center min-h-[120px]">
                <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2">
                    <BackButton />
                </div>
                <div className="text-center">
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                        DETAIL PENGELUARAN
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1 opacity-90">
                        Detail Pengeluaran Barang
                    </p>
                </div>
            </div>

            {/* === MAIN CONTENT === */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 ${user.role === ROLES.ADMIN_GUDANG ? 'h-full' : 'h-fit'}`}>

                {/* Header Table & Search */}
                <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <h2 className="text-lg md:text-xl font-bold text-[#002B5B] whitespace-nowrap">
                        Status Pemesanan
                    </h2>
                    <div className="w-full md:w-72">
                        <SearchBar
                            placeholder='Cari Barang...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </div>

                {/* Container Data: Table (Desktop) vs Card (Mobile) */}
                <div className="flex-1 overflow-hidden min-h-[300px] flex flex-col relative">

                    {/* === TAMPILAN DESKTOP (TABLE) === */}
                    <div className="hidden md:block flex-1 overflow-x-auto">
                        <ReusableTable
                            columns={pengeluaranColumns}
                            currentItems={filteredItems}
                        />
                    </div>

                    {/* === TAMPILAN MOBILE (CARD LIST) === */}
                    <div className="md:hidden flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <span className="text-sm">Data tidak ditemukan</span>
                            </div>
                        ) : (
                            filteredItems.map((item, index) => {
                                // Logic Status Warna untuk Mobile
                                const allocationsMap = allAllocations[item.id] || {};
                                const currentAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
                                let targetQty = currentAllocated > 0 ? currentAllocated : (item.quantity_pj ?? item.quantity);

                                let statusColor = "bg-gray-100 text-gray-500 border-gray-200";
                                let statusText = "Belum Diatur";
                                if (currentAllocated === targetQty && targetQty > 0) { statusColor = "bg-green-50 text-green-700 border-green-200"; statusText = "Selesai"; }
                                else if (currentAllocated > 0) { statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200"; statusText = "Sebagian"; }

                                return (
                                    <div key={index} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{item.stok_name}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase whitespace-nowrap ${statusColor}`}>
                                                {statusText}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-start gap-2 text-xs text-gray-600 border-t border-gray-100 pt-2 mt-1">

                                            {/* --- KELOMPOK KIRI (Vertikal) --- */}
                                            <div className="flex flex-col gap-2">
                                                {/* Item 1: Permintaan */}
                                                <div>
                                                    <span className="block font-bold text-gray-400 uppercase text-[10px]">Permintaan Instalasi</span>
                                                    <span className="text-sm font-semibold text-gray-900">{item.quantity} {item.satuan_name}</span>
                                                </div>

                                                {/* Item 2: Persetujuan */}
                                                <div>
                                                    <span className="block font-bold text-gray-400 uppercase text-[10px]">Persetujuan PJ</span>
                                                    <span className="text-sm font-semibold text-gray-900">{item.quantity_pj} {item.satuan_name}</span>
                                                </div>
                                            </div>

                                            {/* --- KELOMPOK KANAN (Terpenuhi) --- */}
                                            <div className="text-right">
                                                <span className="block font-bold text-gray-400 uppercase text-[10px]">Terpenuhi</span>
                                                <span className="text-sm font-semibold text-blue-600">{currentAllocated} {item.satuan_name}</span>
                                            </div>

                                        </div>

                                        {/* Action Buttons Mobile */}
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            {user.role === ROLES.ADMIN_GUDANG ? (
                                                <button
                                                    onClick={() => handlePilihClick(item.id, item.stok_id)}
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
                                                >
                                                    <Edit size={14} /> Atur Alokasi
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                    <span className="text-xs font-bold text-gray-500">Jml Disetujui:</span>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleUpdateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border rounded text-red-500"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14" /></svg></button>
                                                        <span className="font-bold text-gray-800 w-6 text-center">{item.quantity_pj ?? item.quantity}</span>
                                                        <button onClick={() => handleUpdateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white border rounded text-green-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-100 bg-white z-10">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>

                {/* Footer Action (Admin Gudang Only) */}
                {user.role === ROLES.ADMIN_GUDANG && (
                    <div className="flex justify-end p-4 md:p-6 border-t border-gray-100 bg-gray-50">
                        <Button
                            variant="success"
                            className="w-full md:w-auto shadow-sm"
                            onClick={handleConfirmClick}
                            disabled={isConfirmDisabled}
                        >
                            Konfirmasi Alokasi
                        </Button>
                    </div>
                )}
            </div>

            {/* === CARD INFORMASI (Khusus Penanggung Jawab) === */}
            {user.role === ROLES.PENANGGUNG_JAWAB && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 shrink-0">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <h2 className="text-base font-bold text-[#002B5B]">Info Pesanan</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input id="nama_pemesan" name="nama_pemesan" judul="Nama Pemesan" value={pemesananItem?.user_name || ''} readOnly={true} />
                        <Input id="ruangan" name="ruangan" judul="Ruangan" value={pemesananItem?.ruangan || ''} readOnly={true} />
                        <Input id="tanggal" name="tanggal" judul="Tanggal Pesan" value={pemesananItem?.tanggal_pemesanan || ''} readOnly={true} />
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <Button variant="success" className="w-full shadow-sm text-sm py-2.5" onClick={handleConfirmClick}>Konfirmasi Penerimaan</Button>
                    </div>
                </div>
            )}

            {/* === MODAL COMPONENTS === */}
            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirmSubmit}
                isLoading={isSubmitting}
                text={"Apakah Anda yakin untuk mengkonfirmasi pemesanan ini?"}
            />

            <Modal
                isOpen={isModalInputOpen}
                onClose={() => setIsModalInputOpen(false)}
                isForm={true}
                maxWidth="max-w-4xl"
            >
                <div className="w-full bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-auto overflow-hidden">

                    {/* Header Modal */}
                    <div className="bg-[#057CFF] px-4 py-3 md:px-6 md:py-4 flex justify-between items-center shrink-0">
                        <h2 className="text-lg md:text-xl font-bold text-white truncate mr-4">Kelola Detail Barang</h2>
                        <button onClick={() => setIsModalInputOpen(false)} className="text-[#057CFF] bg-white rounded-md p-1 hover:bg-gray-100 transition-colors shrink-0"><X size={20} /></button>
                    </div>

                    {/* Body Modal */}
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6 text-gray-800 overflow-y-auto flex-1">

                        {/* Info Alert Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-3">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                <div className="flex flex-col gap-1 w-full">
                                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                        Atur kuantitas barang <span className="font-bold">{selectedDetail?.stok_name ?? '-'}</span> sebanyak <span className="font-bold">{targetAmount > 0 ? targetAmount : quantityRequested} unit</span>.
                                    </p>
                                    {metaStok && (
                                        <div className="grid grid-cols-2 md:flex md:gap-4 mt-2 pt-2 border-t border-blue-100 md:border-0 md:pt-0 w-full">
                                            <div className="flex flex-col"><span className="text-[10px] uppercase text-gray-500 font-bold">Total Stok</span><span className="text-sm font-bold text-blue-700">{metaStok.total_stok} Unit</span></div>
                                            <div className="hidden md:block border-l border-gray-300 h-8 mx-2"></div>
                                            <div className="flex flex-col"><span className="text-[10px] uppercase text-gray-500 font-bold">Min. Stok</span><span className="text-sm font-bold text-orange-600">{metaStok.minimum_stok} Unit</span></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Input Section Global */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="font-bold text-gray-700 text-sm">Set Jumlah (Bulk):</label>
                            <input
                                type="number"
                                value={accAmount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const newValue = val === '' ? '' : parseInt(val);
                                    setAccAmount(newValue);
                                    if (checkedBastIds.length > 0) {
                                        setRowQuantities(prev => {
                                            const updated = { ...prev };
                                            checkedBastIds.forEach(id => { updated[id] = newValue; });
                                            return updated;
                                        });
                                    }
                                }}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="0"
                            />
                        </div>

                        {/* === DATA AREA (Desktop Table vs Mobile Cards) === */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden relative min-h-[300px] flex flex-col">
                            {isModalLoading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20"><Loader /></div>}

                            {/* 1. TAMPILAN DESKTOP (TABLE) - Hidden di Mobile */}
                            <div className="hidden md:block flex-1 overflow-x-auto">
                                <div className="min-w-[600px]">
                                    <ReusableTable columns={modalColumns} currentItems={selectedItem} onRowClick={(item) => handleToggleCheckbox(item.detail_penerimaan_id)} />
                                </div>
                            </div>

                            {/* 2. TAMPILAN MOBILE (CARD LIST) - Hidden di Desktop */}
                            <div className="md:hidden flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3">
                                {selectedItem.map((item) => {
                                    const isChecked = checkedBastIds.includes(item.detail_penerimaan_id);
                                    return (
                                        <div
                                            key={item.detail_penerimaan_id}
                                            onClick={() => handleToggleCheckbox(item.detail_penerimaan_id)}
                                            className={`border rounded-xl p-4 shadow-sm transition-all cursor-pointer ${isChecked ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            {/* Header Card */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleToggleCheckbox(item.detail_penerimaan_id)}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">BAST #{item.bast_id}</span>
                                                    <span className="text-[10px] text-gray-500">{item.tanggal_bast}</span>
                                                </div>
                                                <div className="ml-auto text-right">
                                                    <span className="block text-[10px] uppercase text-gray-400 font-bold">Sisa Stok</span>
                                                    <span className="text-sm font-bold text-gray-800">{item.quantity_remaining}</span>
                                                </div>
                                            </div>

                                            {/* Input Area (Hanya muncul jika dicentang) */}
                                            {isChecked && (
                                                <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <span className="text-sm font-semibold text-blue-700">Jumlah Ambil:</span>
                                                    <input
                                                        type="number"
                                                        className="w-24 border border-blue-300 rounded px-3 py-1.5 text-center font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                        value={rowQuantities[item.detail_penerimaan_id] ?? ''}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleRowQuantityChange(item.detail_penerimaan_id, e.target.value)}
                                                        min={1}
                                                        max={item.quantity_remaining}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Pagination Sticky */}
                            <div className="border-t border-gray-100 bg-white z-10 p-2">
                                <Pagination currentPage={modalCurrentPage} totalItems={modalTotalItems} itemsPerPage={modalItemsPerPage} onPageChange={handleModalPageChange} totalPages={modalTotalPages} />
                            </div>
                        </div>

                        {/* Summary & Status */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">Total Terpilih:</span>
                                <span className="font-bold text-gray-900 text-lg">{Object.values(rowQuantities).reduce((a, b) => a + b, 0)} Unit</span>
                            </div>
                            {targetAmount > 0 && (
                                <div className={`border rounded-lg p-3 md:p-4 flex items-start gap-3 transition-all ${totalAmbil === targetAmount ? 'bg-[#E6F4EA] border-green-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className={`rounded-full p-0.5 shrink-0 mt-0.5 ${totalAmbil === targetAmount ? 'bg-[#00A86B]' : 'bg-red-500'}`}>{totalAmbil === targetAmount ? <CheckCircle size={14} className="text-white" /> : <X size={14} className="text-white" />}</div>
                                    <div className="flex flex-col text-sm">
                                        {totalAmbil === targetAmount ? <span className="font-bold text-[#00A86B]">Jumlah Sesuai. Siap Disimpan.</span> : <><span className="font-bold text-red-600">Jumlah Belum Sesuai!</span><span className="text-gray-600 text-xs mt-0.5">{totalAmbil < targetAmount ? `Kurang ${targetAmount - totalAmbil} unit.` : `Lebih ${totalAmbil - targetAmount} unit.`}</span></>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                        <Button variant="success" onClick={handleSaveModal} disabled={isSaveDisabled} className="w-full sm:w-auto shadow-sm">{isSaveDisabled ? "Tidak Ada Perubahan" : "Simpan Alokasi"}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}