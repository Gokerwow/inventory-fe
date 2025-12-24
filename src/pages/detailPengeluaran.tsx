import { useEffect, useMemo, useState } from "react"
import { ROLES, type APIDetailItemPemesanan, type APIDetailPemesanan, type APIDetailStokBAST, type APIPatchQuantityPJ } from "../constant/roles"
import { getDetailPemesanan } from "../services/pemesananService"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import Loader from "../components/loader"
import SearchBar from "../components/searchBar"
import { useAuth } from "../hooks/useAuth"
import ReusableTable, { type ColumnDefinition } from "../components/table"
import Input from "../components/input"
import BackButton from "../components/backButton"
import Button from "../components/button"
import ConfirmModal from "../components/confirmModal"
import { alokasiPengeluaran, confirmPemesanan } from "../services/pengeluaranService"
import { PATHS } from "../Routes/path"
import { useToast } from "../hooks/useToast"
import Pagination from "../components/pagination"
import { useAuthorization } from "../hooks/useAuthorization"
import { X, Info, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Modal from "../components/modal"
import { getStokByAvailableBAST } from "../services/barangService"

export function DetailPengeluaranPage() {
    const [pemesananItem, setPemesananItem] = useState<APIDetailPemesanan | null>(null)
    const detailItems = pemesananItem?.detail_items?.data ?? [];
    const [selectedItem, setSelectedItem] = useState<APIDetailStokBAST[]>([])
    // State untuk Checkbox & Input dalam Tabel    
    const [checkedBastIds, setCheckedBastIds] = useState<number[]>([]);
    const [rowQuantities, setRowQuantities] = useState<Record<number, number | string>>({});

    // State untuk Global "Jumlah di ACC"
    const [accAmount, setAccAmount] = useState<number | string>('');

    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isModalInputOpen, setIsModalInputOpen] = useState(false)
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
    const [activeStokId, setActiveStokId] = useState<number | null>(null); // Menyimpan ID Stok yang sedang dibuka
    const [isModalLoading, setIsModalLoading] = useState(false); // Loading khusus modal

    const { id: paramId } = useParams()
    const requiredRoles = useMemo(() =>
        [ROLES.ADMIN_GUDANG, ROLES.PENANGGUNG_JAWAB],
        []
    );
    const { checkAccess, hasAccess } = useAuthorization(requiredRoles);
    const { user } = useAuth();
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true)
            if (paramId) {
                try {
                    const detailPemesanan = await getDetailPemesanan(
                        parseInt(paramId),
                        currentPage,
                        itemsPerPage,
                        debouncedSearch
                    )
                    setPemesananItem(detailPemesanan.data as APIDetailPemesanan)
                    setTotalItems(detailPemesanan.data?.detail_items?.total || 0)
                    setItemsPerPage(detailPemesanan.data?.detail_items?.per_page || 10);
                    setTotalPages(detailPemesanan.data?.detail_items?.last_page || 1);
                    setIsLoading(false)
                } catch (error) {
                    console.error("Gagal mengambil data", error)
                }
            }
        }
        fetchData()
    }, [user?.role, paramId])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => {
            clearTimeout(handler);
        };
    }, [search])

    // --- FUNGSI BARU: Fetch Data Modal ---
    const fetchModalData = async (stokId: number, page: number) => {
        setIsModalLoading(true);
        try {
            const response = await getStokByAvailableBAST(stokId, page, modalItemsPerPage);

            // SESUAIKAN DENGAN STRUKTUR JSON BARU:
            // response       = { data: { current_page: 1, data: [...] } }
            // paginationData = response.data
            const paginationData = response.data;

            setSelectedItem(paginationData.data); // Array data item

            // Set State Pagination
            setModalCurrentPage(paginationData.current_page);
            setModalTotalItems(paginationData.total);
            setModalItemsPerPage(paginationData.per_page);
            setModalTotalPages(paginationData.last_page);

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

    // Fungsi untuk mengubah jumlah item
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
        setModalCurrentPage(1); // Reset ke halaman 1

        // Ambil data simpanan (checkbox & quantity)
        const selectedDetail = detailItems.find(item => item.id === detailId);
        const quantityToSet = selectedDetail
            ? (selectedDetail.quantity_pj !== null ? selectedDetail.quantity_pj : selectedDetail.quantity)
            : 0;

        setAccAmount(quantityToSet);

        const savedAllocations = allAllocations[detailId] || {};
        setRowQuantities(savedAllocations);
        const savedIds = Object.keys(savedAllocations).map(Number);
        setCheckedBastIds(savedIds);

        // Fetch Data Halaman 1
        await fetchModalData(stokId, 1);

        setIsModalInputOpen(true);
    };

    const handleSaveModal = () => {
        if (activeDetailId === null) return;

        // Bersihkan data: Hapus entry yang quantity-nya 0 atau kosong
        const cleanAllocations = Object.entries(rowQuantities).reduce((acc, [key, val]) => {
            const numVal = typeof val === 'number' ? val : parseInt(val as string) || 0;
            if (numVal > 0 && checkedBastIds.includes(parseInt(key))) {
                acc[parseInt(key)] = numVal;
            }
            return acc;
        }, {} as Record<number, number>);

        // Simpan ke state global
        setAllAllocations(prev => ({
            ...prev,
            [activeDetailId]: cleanAllocations
        }));

        // Tutup modal & Reset state lokal
        setIsModalInputOpen(false);
        setCheckedBastIds([]);
        setRowQuantities({});
        setActiveDetailId(null);
        showToast('Alokasi barang disimpan sementara');
    };


    // 1. Handle Checkbox Individu
    const handleToggleCheckbox = (id: number) => {
        setCheckedBastIds(prev => {
            if (prev.includes(id)) {
                // Jika uncheck -> Hapus ID dan hapus data quantity
                const newQuantities = { ...rowQuantities };
                delete newQuantities[id];
                setRowQuantities(newQuantities);
                return prev.filter(itemId => itemId !== id);
            } else {
                // Jika check -> Masukkan ID dan set default value = accAmount
                setRowQuantities(prevQty => ({
                    ...prevQty,
                    [id]: accAmount // Default value dari input atas
                }));
                return [...prev, id];
            }
        });
    };

    // 2. Handle Perubahan Input dalam Tabel
    const handleRowQuantityChange = (id: number, value: string) => {
        // Jika value kosong, set string kosong. Jika tidak, parse ke integer.
        const newValue = value === '' ? '' : parseInt(value);

        setRowQuantities(prev => ({
            ...prev,
            [id]: newValue
        }));
    };


    const handleConfirmClick = () => {
        setIsOpen(true)
    }

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true)
        try {
            if (user.role === ROLES.ADMIN_GUDANG) {
                // 1. VALIDASI: Cek apakah semua item sudah dialokasikan sesuai jumlahnya
                const incompleteItems = filteredItems.filter(item => {
                    const allocationsMap = allAllocations[item.id] || {};
                    const totalAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
                    // Pastikan total alokasi sama dengan quantity yang diminta (atau quantity_pj jika ada)
                    const requiredQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                    return totalAllocated !== requiredQty;
                });

                if (incompleteItems.length > 0) {
                    showToast(`Terdapat ${incompleteItems.length} item yang alokasinya belum sesuai. Mohon lengkapi data.`, 'error');
                    setIsSubmitting(false);
                    setIsOpen(false); // Tutup confirm modal
                    return;
                }

                // 2. BENTUK PAYLOAD
                const payload = {
                    detailPemesanan: filteredItems.map(item => {
                        const allocationsMap = allAllocations[item.id] || {};

                        // HITUNG TOTAL ALOKASI REAL
                        const totalAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);

                        const allocationsArray = Object.entries(allocationsMap).map(([penerimaanId, qty]) => ({
                            detail_penerimaan_id: parseInt(penerimaanId),
                            quantity: qty
                        }));

                        return {
                            detail_id: item.id,
                            // PERBAIKAN DI SINI:
                            // Gunakan totalAllocated, bukan item.quantity
                            quantity_admin: totalAllocated,
                            allocations: allocationsArray
                        };
                    })
                };

                console.log("Payload to send:", JSON.stringify(payload, null, 2));

                const response = await alokasiPengeluaran(parseInt(paramId!), payload)
                showToast('Berhasil mengalokasi pengeluaran', 'success')
                navigate(generatePath(PATHS.PENGELUARAN.INDEX))

            } else {
                const payload: APIPatchQuantityPJ = {
                    details: filteredItems.map(item => ({
                        detail_id: item.id,
                        quantity_pj: item.quantity_pj !== null ? item.quantity_pj : item.quantity
                    }))
                }

                const response = await confirmPemesanan(parseInt(paramId!), payload)
                console.log(response)
                showToast('Berhasil mengkonfirmasi pengeluaran', 'success')
                navigate(generatePath(PATHS.PENGELUARAN.INDEX))
            }

        } catch (error) {
            showToast('Error dalam mengkonfirmasi pengeluaran')
            console.error(error)
        } finally {
            setIsSubmitting(false)
            setIsOpen(false);
        }
    }

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

        const savedKeys = Object.keys(savedData).sort();
        const currentKeys = Object.keys(currentData).sort();

        if (savedKeys.length !== currentKeys.length) return false; // Jika jumlah item beda, berarti ada perubahan

        for (const key of savedKeys) {
            if (currentData[parseInt(key)] !== savedData[parseInt(key)]) {
                return false;
            }
        }

        return true; 
    }, [allAllocations, activeDetailId, rowQuantities, checkedBastIds]);

    const isConfirmDisabled = useMemo(() => {
        if (user.role !== ROLES.ADMIN_GUDANG) return false;

        const hasAllocations = Object.keys(allAllocations).length > 0;

        if (!hasAllocations) return true;

        const allComplete = filteredItems.every(item => {
            const allocationsMap = allAllocations[item.id] || {};
            const totalAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
            const requiredQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
            return totalAllocated === requiredQty;
        });

        return !allComplete;
    }, [user.role, allAllocations, filteredItems]);


    const pengeluaranColumns: ColumnDefinition<APIDetailItemPemesanan>[] = useMemo(() => [
        {
            header: 'NAMA BARANG',
            key: 'namabarang',
            cell: (item) => <span className="text-gray-900 font-medium">{item.stok_name}</span>
        },
        {
            header: 'JUMLAH PERMINTAAN', // Diubah sedikit header-nya agar jelas
            key: 'jumlahStok',
            cell: (item) => {
                // Tentukan jumlah yang diminta (prioritas quantity_pj jika ada)
                const requiredQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                return <span className="text-gray-900 font-bold">{requiredQty} Unit</span>
            }
        },
        // --- KOLOM BARU UNTUK STATUS ALOKASI ---
        {
            header: 'STATUS ALOKASI',
            key: 'status_alokasi',
            cell: (item) => {
                // 1. Hitung jumlah yang sudah dialokasikan di state
                const allocationsMap = allAllocations[item.id] || {};
                const currentAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);

                // 2. Tentukan target
                const targetQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;

                // 3. Tentukan Status Visual
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
                // --- LOGIKA UTAMA: TAMPILAN UNTUK ADMIN GUDANG ---
                if (user?.role === ROLES.ADMIN_GUDANG) {
                    // Cek status untuk styling tombol
                    const allocationsMap = allAllocations[item.id] || {};
                    const currentAllocated = Object.values(allocationsMap).reduce((sum, qty) => sum + qty, 0);
                    const targetQty = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                    const isComplete = currentAllocated === targetQty && targetQty > 0;

                    return (
                        <button
                            type="button"
                            onClick={() => handlePilihClick(item.id, item.stok_id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border shadow-sm ${isComplete
                                ? "bg-white border-green-200 text-green-600 hover:bg-green-50"
                                : "bg-blue-600 border-transparent text-white hover:bg-blue-700 shadow-blue-200"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" y1="21" x2="4" y2="14" />
                                <line x1="4" y1="10" x2="4" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12" y2="3" />
                                <line x1="20" y1="21" x2="20" y2="16" />
                                <line x1="20" y1="12" x2="20" y2="3" />
                                <line x1="1" y1="14" x2="7" y2="14" />
                                <line x1="9" y1="8" x2="15" y2="8" />
                                <line x1="17" y1="16" x2="23" y2="16" />
                            </svg>

                            <span className="text-sm font-semibold">
                                {isComplete ? "Ubah" : "Atur"}
                            </span>
                        </button>
                    );
                }

                // ... (Kode untuk Role Penanggung Jawab tetap sama)
                const displayValue = item.quantity_pj !== null ? item.quantity_pj : item.quantity;
                return (
                    // ... kode counter +/- Penanggung Jawab ...
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                        </button>

                        <span className="text-gray-900 font-bold min-w-[24px] text-center text-lg">
                            {displayValue}
                        </span>

                        <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors border border-green-100"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                    </div>
                )
            }
        },
    ], [pemesananItem, user?.role, allAllocations]); // Pastikan allAllocations masuk dependency array

    // 3. Update Modal Columns
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
            // Kolom Baru: Input Quantity
            header: 'JUMLAH AMBIL',
            key: 'ambil',
            align: 'center',
            cell: (item) => {
                // Hanya muncul jika dicentang
                if (checkedBastIds.includes(item.detail_penerimaan_id)) {
                    return (
                        <div className="flex justify-center">
                            <input
                                type="number"
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                value={rowQuantities[item.detail_penerimaan_id] ?? ''}
                                onChange={(e) => handleRowQuantityChange(item.detail_penerimaan_id, e.target.value)}
                                min={1}
                                max={item.quantity_remaining} // Validasi opsional
                            />
                        </div>
                    );
                }
                return <span className="text-gray-400 text-center block">-</span>;
            }
        },
    ], [selectedItem, checkedBastIds, rowQuantities]); // Dependency updated

    // Hitung total saat ini dari state rowQuantities
    const totalAmbil = Object.values(rowQuantities).reduce((a, b) => {
        const val = typeof b === 'number' ? b : 0;
        return (a as number) + val;
    }, 0);

    // Pastikan accAmount dibaca sebagai angka (karena bisa string kosong)
    const targetAmount = typeof accAmount === 'number' ? accAmount : 0;
    if (isLoading) {
        return <Loader />
    }

    return (
        <div className={`w-full flex flex-col gap-5 ${user?.role === ROLES.ADMIN_GUDANG ? 'h-fit' : 'min-h-full'}`}>

            <div className="bg-[#005DB9] rounded-xl p-6 text-white shadow-md relative">
                {/* Back Button - Position Absolute di Kiri */}
                <BackButton
                    className="absolute left-6 top-1/2 -translate-y-1/2"
                />

                {/* Konten Tengah */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        DETAIL PENGELUARAN
                    </h1>
                    <p className="text-blue-100 text-sm mt-1 opacity-90">
                        Dokumen Resmi RSUD Balung
                    </p>
                </div>
            </div>

            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 ${user.role === ROLES.ADMIN_GUDANG ? 'h-full' : 'h-fit'}`}>

                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                    <h2 className="text-xl font-bold text-[#002B5B] whitespace-nowrap">
                        Status Pemesanan
                    </h2>
                    <div className="w-full sm:w-auto">
                        <SearchBar
                            placeholder='Cari Barang...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </div>

                {/* Container Table */}
                <ReusableTable
                    columns={pengeluaranColumns}
                    currentItems={filteredItems}
                />

                {/* FOOTER: Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />
                {user.role === ROLES.ADMIN_GUDANG && (
                    <div className="flex justify-end p-4">
                        <Button
                            variant="success"
                            className="self-end"
                            onClick={handleConfirmClick}
                            disabled={isConfirmDisabled}
                        >
                            Konfirmasi Alokasi
                        </Button>
                    </div>
                )}
            </div>


            {/* Card Informasi - hanya untuk Penanggung Jawab */}
            {user.role === ROLES.PENANGGUNG_JAWAB && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 shrink-0">
                    <h2 className="text-xl font-bold text-[#002B5B] mb-6">
                        Pesanan Barang
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-6">
                            <Input
                                id="nama_pemesan"
                                name="nama_pemesan"
                                judul="Nama Pemesan"
                                placeholder="Nama Pemesan"
                                type="text"
                                value={pemesananItem?.user_name || ''}
                                onChange={() => { }}
                                readOnly={true}
                            />
                            <Input
                                id="ruangan"
                                name="ruangan"
                                judul="Ruangan"
                                placeholder="Ruangan"
                                type="text"
                                value={pemesananItem?.ruangan || ''}
                                onChange={() => { }}
                                readOnly={true}
                            />
                        </div>

                        <Input
                            id="tanggal"
                            name="tanggal"
                            judul="Tanggal Pemesanan"
                            placeholder="Tanggal"
                            type="text"
                            value={pemesananItem?.tanggal_pemesanan || ''}
                            onChange={() => { }}
                            readOnly={true}
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            variant="success"
                            className="self-end"
                            onClick={handleConfirmClick}
                        >
                            Konfirmasi
                        </Button>
                    </div>

                </div>
            )}

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
                {/* Container Modal */}
                <div className="w-full bg-white rounded-xl shadow-2xl">

                    {/* Header Modal */}
                    <div className="bg-[#057CFF] px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Kelola Detail Barang</h2>
                        <button
                            onClick={() => setIsModalInputOpen(false)}
                            className="text-[#057CFF] bg-white rounded-md cursor-pointer p-1 hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body Modal */}
                    <div className="p-6 space-y-6 text-gray-800">

                        {/* Info Alert Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} fill="#057CFF" color="white" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Atur kuantitas barang yang akan diambil dari BAST Penerimaan yang tersedia, dengan kategori pesanan berupa <span className="font-bold">Bahan Komputer</span>, yaitu <span className="font-bold">monitor</span> sebanyak <span className="font-bold">8 unit</span>.
                            </p>
                        </div>

                        {/* Input Section */}
                        <div className="flex items-center gap-4">
                            <label className="font-bold text-gray-700">Jumlah di ACC:</label>
                            <input
                                type="number"
                                value={accAmount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAccAmount(val === '' ? '' : parseInt(val));
                                }}
                                className="border border-gray-300 rounded-md px-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* 3. UPDATE TABLE DI SINI */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden relative min-h-[300px] flex flex-col">

                            {/* Loading Overlay */}
                            {isModalLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
                                    <Loader />
                                </div>
                            )}

                            {/* Tabel Area */}
                            <div className="flex-1 overflow-hidden relative max-h-[250px]">
                                <ReusableTable
                                    columns={modalColumns}
                                    currentItems={selectedItem}
                                    onRowClick={(item) => handleToggleCheckbox(item.detail_penerimaan_id)}
                                />
                            </div>

                            {/* Pagination Area (Sticky di bawah tabel) */}
                            <div className="border-t border-gray-100 bg-gray-50 z-10">
                                <Pagination
                                    currentPage={modalCurrentPage}
                                    totalItems={modalTotalItems}
                                    itemsPerPage={modalItemsPerPage}
                                    onPageChange={handleModalPageChange}
                                    totalPages={modalTotalPages}
                                />
                            </div>
                        </div>

                        {/* Summary Text (Opsional: Bisa dihitung dinamis) */}
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-gray-700">
                                {/* Hitung total dari input di tabel, bukan stok sisa */}
                                Total Akan Diambil: {
                                    Object.values(rowQuantities).reduce((a, b) => a + b, 0)
                                } Unit
                            </p>
                        </div>
                        {/* Status Message Box (Green/Red) */}
                        {targetAmount > 0 && (
                            <div className="mt-4">
                                {totalAmbil === targetAmount ? (
                                    // --- KONDISI HIJAU (Sesuai) ---
                                    <div className="bg-[#E6F4EA] border border-green-100 rounded-lg p-4 flex items-center gap-3 transition-all duration-300">
                                        <div className="bg-[#00A86B] rounded-full p-0.5 shrink-0">
                                            <CheckCircle size={16} className="text-white" />
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold text-[#00A86B]">Jumlah telah sesuai</span>, siap disimpan.
                                        </p>
                                    </div>
                                ) : (
                                    // --- KONDISI MERAH (Tidak Sesuai) ---
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 transition-all duration-300">
                                        <div className="bg-red-500 rounded-full p-0.5 shrink-0">
                                            <X size={16} className="text-white" />
                                        </div>
                                        <div className="flex flex-col text-sm text-gray-700">
                                            <span className="font-bold text-red-600">
                                                Jumlah belum sesuai!
                                            </span>
                                            <span>
                                                {totalAmbil < targetAmount
                                                    ? `Masih kurang ${targetAmount - totalAmbil} unit lagi.`
                                                    : `Kelebihan ${totalAmbil - targetAmount} unit.`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>

                    {/* Footer Modal */}
                    <div className="px-6 pb-6 flex justify-end">
                        <Button
                            variant="success"
                            onClick={handleSaveModal}
                            disabled={isSaveDisabled}
                            className="shadow-sm min-w-[180px]"
                        >
                            {isSaveDisabled ? "Tidak Ada Perubahan" : "Simpan Alokasi"}
                        </Button>
                    </div>

                </div>
            </Modal>
        </div>
    )
}