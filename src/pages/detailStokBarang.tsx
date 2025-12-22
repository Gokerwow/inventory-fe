import { useState, useEffect, useMemo } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { CATEGORY_DATA, ROLES } from "../constant/roles";
import { useAuth } from "../hooks/useAuth";
import { getDetailStokBarang } from "../services/barangService";
import { useParams } from "react-router-dom";
import AtkIcon from '../assets/svgs/AtkIcon.svg?react';
import ReusableTable, { type ColumnDefinition } from "../components/table";
import BackButton from "../components/backButton";
import Pagination from "../components/pagination";
import Loader from "../components/loader";

// --- Definisikan Type Sesuai JSON Backend ---
// (Idealnya ini dipindah ke file types/interfaces terpisah)
interface MutationItem {
    tanggal: string;
    tipe: 'masuk' | 'keluar';
    no_surat: string;
    quantity: number;
    harga: string;
    total_harga: string;
}

interface APIDetailBarang {
    id: number;
    name: string;
    category_name: string;
    satuan: string;
    minimum_stok: string;
    mutasi: {
        current_page: number;
        data: MutationItem[];
    };
}

const DetailStokBarang = () => {
    const [data, setData] = useState<APIDetailBarang | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();
    const { id: paramId } = useParams();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Pastikan service mengembalikan struktur data yang sesuai
                const detailStok = await getDetailStokBarang(paramId ? parseInt(paramId) : 0, currentPage);
                setData(detailStok);
                setTotalItems(detailStok.mutasi?.total || 0)
                setItemsPerPage(detailStok.mutasi?.per_page || 10);
                setTotalPages(detailStok.mutasi?.last_page || 1);
            } catch (error) {
                console.error("Gagal mengambil data", error)
            } finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, [user?.role, paramId, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Helper: Format Rupiah
    const formatRupiah = (angka: string | number) => {
        const value = typeof angka === 'string' ? parseFloat(angka) : angka;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Helper: Format Tanggal
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short", // Menggunakan short month agar lebih rapi di tabel
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // --- Definisi Kolom untuk Mutasi ---
    const columns = useMemo<ColumnDefinition<MutationItem>[]>(() => {
        if (!data) return [];

        return [
            {
                header: "Tanggal",
                key: "tanggal",
                width: "1.2fr",
                cell: (item) => (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                            {formatDate(item.tanggal).split(' pukul ')[0]}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(item.tanggal).split(' pukul ')[1] || item.tanggal.split(' ')[1]}
                        </span>
                    </div>
                ),
            },
            {
                header: "Tipe",
                key: "tipe",
                width: "0.8fr",
                align: "center",
                cell: (item) => (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                        ${item.tipe === "masuk"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-orange-100 text-orange-800 border border-orange-200"
                            }`}
                    >
                        {item.tipe}
                    </span>
                ),
            },
            {
                header: "No. Surat / Referensi",
                key: "no_surat",
                width: "1.5fr",
                cell: (item) => <span className="font-medium text-gray-700 text-sm">{item.no_surat}</span>,
            },
            {
                header: "Jumlah",
                key: "quantity",
                width: "1fr",
                align: "left",
                cell: (item) => {
                    const isMasuk = item.tipe === 'masuk';
                    return (
                        <div className={`font-bold flex items-center gap-1 ${isMasuk ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{isMasuk ? '+' : '-'}</span>
                            <span>{item.quantity}</span>
                            <span className="text-xs font-normal text-gray-500">{data.satuan}</span>
                        </div>
                    );
                },
            },
            {
                header: "Harga Satuan",
                key: "harga",
                width: "1fr",
                align: "left",
                cell: (item) => <span className="text-gray-600">{formatRupiah(item.harga)}</span>,
            },
            {
                header: "Total Nilai",
                key: "total_harga",
                width: "1fr",
                align: "left",
                cell: (item) => <span className="font-bold text-gray-800">{formatRupiah(item.total_harga)}</span>,
            },
        ];
    }, [data]);

    if (!data) return <Loader />

    // Logic Kategori & Icon
    const config = CATEGORY_DATA.find((c) => c.name === data.category_name);
    const IconComponent = config?.Icon || AtkIcon;
    const colorClass = config?.colorClass || "bg-gray-100 text-gray-700";

    return (
        <div className="min-h-full font-sans rounded-xl flex flex-col gap-6">
            <div className="bg-[#005DB9] rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                {/* Decoration Background - Turunkan z-index */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none z-0"></div>

                {/* Back Button - Pastikan z-index lebih tinggi */}
                <BackButton className="absolute left-6 top-1/2 -translate-y-1/2 z-20" />

                {/* Header Content */}
                <div className="text-center relative z-10">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        DETAIL STOK BARANG
                    </h1>
                    <p className="text-blue-100 text-sm mt-1 opacity-90">
                        Informasi stok dan riwayat mutasi
                    </p>
                </div>
            </div>

            {/* --- Kartu Informasi Utama Barang --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                    {/* Icon & Nama Barang */}
                    <div className="flex items-start gap-5">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm ${colorClass} bg-opacity-20`}>
                            <IconComponent className={`w-10 h-10 ${colorClass.replace('bg-', 'text-').split(' ')[1]}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-500 border border-gray-200">
                                    {data?.category_name}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 leading-tight">{data.name}</h2>
                            <p className="text-sm text-gray-400 mt-1">ID Barang: #{data.id}</p>
                        </div>
                    </div>

                    {/* Statistik Mini */}
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 text-center min-w-[120px]">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Satuan</p>
                            <p className="text-lg font-bold text-gray-700 capitalize">{data.satuan}</p>
                        </div>
                        <div className="flex-1 md:flex-none px-6 py-4 bg-red-50 rounded-xl border border-red-100 text-center min-w-[120px]">
                            <p className="text-xs text-red-500 mb-1 uppercase tracking-wider font-semibold">Min. Stok</p>
                            <p className="text-lg font-bold text-red-600">{parseFloat(data.minimum_stok)}</p>
                        </div>
                    </div>
                </div>

                {/* --- Section Riwayat Mutasi --- */}
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Riwayat Mutasi Barang
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            Page {data.mutasi.current_page}
                        </span>
                    </div>


                    {/* Jika data kosong */}
                    {data.mutasi.data.length === 0 ?
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex-1 flex justify-center items-center">
                            <p className="text-gray-500">Belum ada riwayat mutasi untuk barang ini.</p>
                        </div>
                        :
                        isLoading ? <div className="flex-1 flex justify-center items-center">
                            <Loader />
                        </div> :
                        <>
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <ReusableTable
                                    columns={columns}
                                    currentItems={data.mutasi.data} // Menggunakan data mutasi dari JSON
                                />
                            </div>
                            {/* FOOTER: Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                                totalPages={totalPages}
                            />
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default DetailStokBarang;