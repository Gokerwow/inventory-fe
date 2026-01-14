import { useState, useEffect, useMemo } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { CATEGORY_DATA, ROLES, type APIDetailBarang, type MutationItem } from "../constant/roles";
import { useAuth } from "../hooks/useAuth";
import { getDetailStokBarang } from "../services/barangService";
import { useParams } from "react-router-dom";
import AtkIcon from '../assets/svgs/AtkIcon.svg?react';
import ReusableTable, { type ColumnDefinition } from "../components/table";
import BackButton from "../components/backButton";
import Pagination from "../components/pagination";
import Loader from "../components/loader";
import { ArrowDownLeft, ArrowUpRight, Calendar, FileText } from "lucide-react"; // Icon tambahan

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
    }, [user?.role, paramId, currentPage, checkAccess, hasAccess]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatRupiah = (angka: string | number) => {
        const value = typeof angka === 'string' ? parseFloat(angka) : angka;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // --- Definisi Kolom Table (Desktop Only) ---
    const columns = useMemo<ColumnDefinition<MutationItem>[]>(() => {
        if (!data) return [];
        return [
            {
                header: "Tanggal",
                key: "tanggal",
                width: "1.2fr",
                cell: (item) => (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{formatDate(item.tanggal).split(' pukul ')[0]}</span>
                        <span className="text-xs text-gray-500">{formatDate(item.tanggal).split(' pukul ')[1] || item.tanggal.split(' ')[1]}</span>
                    </div>
                ),
            },
            {
                header: "Tipe",
                key: "tipe",
                align: "center",
                cell: (item) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                        ${item.tipe === "masuk" ? "bg-green-100 text-green-800 border border-green-200" : "bg-orange-100 text-orange-800 border border-orange-200"}`}>
                        {item.tipe}
                    </span>
                ),
            },
            {
                header: "No. Surat / Ref",
                key: "no_surat",
                width: "1.5fr",
                cell: (item) => <span className="font-medium text-gray-700 text-sm truncate block max-w-[150px]" title={item.no_surat}>{item.no_surat}</span>,
            },
            {
                header: "Jumlah",
                key: "quantity",
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
                cell: (item) => <span className="text-gray-600">{formatRupiah(item.harga)}</span>,
            },
            {
                header: "Total Nilai",
                key: "total_harga",
                cell: (item) => <span className="font-bold text-gray-800">{formatRupiah(item.total_harga)}</span>,
            },
        ];
    }, [data]);

    if (!data) return <Loader />

    const config = CATEGORY_DATA.find((c) => c.name === data.category_name);
    const IconComponent = config?.Icon || AtkIcon;
    const colorClass = config?.colorClass || "bg-gray-100 text-gray-700";

    return (
        <div className="min-h-full font-sans rounded-xl flex flex-col gap-5">
            
            {/* === HEADER HALAMAN === */}
            <div className="bg-[#005DB9] rounded-xl p-6 text-white shadow-md relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none z-0"></div>

                {/* Back Button: Hidden Mobile */}
                <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20">
                    <BackButton />
                </div>

                <div className="text-center relative z-10 px-4">
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                        DETAIL STOK BARANG
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1 opacity-90">
                        Informasi stok dan riwayat mutasi
                    </p>
                </div>
            </div>

            {/* === KARTU INFORMASI UTAMA === */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
                <div className="p-4 md:p-6 flex flex-col gap-6">
                    
                    {/* Top Section: Icon, Nama, Statistik */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-6">
                        
                        {/* Kiri: Icon & Nama */}
                        <div className="flex items-start gap-4 w-full md:w-auto">
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${colorClass} bg-opacity-20`}>
                                <IconComponent className={`w-8 h-8 md:w-10 md:h-10 ${colorClass.replace('bg-', 'text-').split(' ')[1]}`} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-500 border border-gray-200 mb-1">
                                    {data?.category_name}
                                </span>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight truncate-2-lines">{data.name}</h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">ID Barang: #{data.id}</p>
                            </div>
                        </div>

                        {/* Kanan: Statistik (Grid di Mobile, Flex di Desktop) */}
                        <div className="grid grid-cols-3 md:flex gap-2 md:gap-4 w-full md:w-auto">
                            <div className="px-3 py-3 md:px-6 md:py-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <p className="text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Satuan</p>
                                <p className="text-sm md:text-lg font-bold text-gray-700 capitalize truncate">{data.satuan}</p>
                            </div>
                            <div className="px-3 py-3 md:px-6 md:py-4 bg-green-50 rounded-xl border border-green-100 text-center">
                                <p className="text-[10px] md:text-xs text-green-600 mb-1 uppercase tracking-wider font-semibold">Total</p>
                                <p className="text-sm md:text-lg font-bold text-green-700">{parseFloat(data.total_stok)}</p>
                            </div>
                            <div className="px-3 py-3 md:px-6 md:py-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                                <p className="text-[10px] md:text-xs text-orange-600 mb-1 uppercase tracking-wider font-semibold">Min</p>
                                <p className="text-sm md:text-lg font-bold text-orange-700">{parseFloat(data.minimum_stok)}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- RIWAYAT MUTASI --- */}
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Riwayat Mutasi
                            </h3>
                            <span className="text-[10px] md:text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                Page {data.mutasi.current_page}
                            </span>
                        </div>

                        {/* CONTENT DATA */}
                        <div className="flex-1 min-h-[300px] flex flex-col">
                            {isLoading ? (
                                <Loader />
                            ) : data.mutasi.data.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex-1 flex flex-col justify-center items-center">
                                    <p className="text-gray-500 text-sm">Belum ada riwayat mutasi.</p>
                                </div>
                            ) : (
                                <>
                                    {/* === TAMPILAN DESKTOP (TABLE) === */}
                                    <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <ReusableTable
                                            columns={columns}
                                            currentItems={data.mutasi.data}
                                        />
                                    </div>

                                    {/* === TAMPILAN MOBILE (CARD LIST) === */}
                                    <div className="md:hidden space-y-3">
                                        {data.mutasi.data.map((item, index) => {
                                            const isMasuk = item.tipe === 'masuk';
                                            return (
                                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                                    {/* Header Card */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                                                                <Calendar size={12} />
                                                                <span>{formatDate(item.tanggal)}</span>
                                                            </div>
                                                            <span className="font-bold text-gray-800 text-sm line-clamp-1" title={item.no_surat}>
                                                                {item.no_surat}
                                                            </span>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                                            isMasuk ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                                                        }`}>
                                                            {item.tipe}
                                                        </span>
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="border-t border-gray-100"></div>

                                                    {/* Detail Grid */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Jumlah</span>
                                                            <div className={`flex items-center gap-1 font-bold ${isMasuk ? 'text-green-600' : 'text-red-500'}`}>
                                                                {isMasuk ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                                <span>{item.quantity} {data.satuan}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Nilai</span>
                                                            <span className="font-bold text-gray-800 text-sm">
                                                                {formatRupiah(item.total_harga)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Pagination */}
                <div className="border-t border-gray-100 bg-gray-50 p-2 md:p-0">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailStokBarang;