import { useState, useEffect, useMemo } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { CATEGORY_DATA, ROLES, type APIDetailBarang, type RiwayatPenerimaan } from "../constant/roles"; // Pastikan type RiwayatPenerimaan diexport juga
import { useAuth } from "../hooks/useAuth";
import { getDetailStokBarang } from "../services/barangService";
import { useParams } from "react-router-dom";
import AtkIcon from '../assets/svgs/AtkIcon.svg?react';
import ReusableTable, { type ColumnDefinition } from "../components/table"; // Sesuaikan path import

const DetailStokBarang = () => {
    const [data, setData] = useState<APIDetailBarang | null>(null);
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();
    const { id: paramId } = useParams();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;

        const fetchData = async () => {
            const detailStok = await getDetailStokBarang(paramId ? parseInt(paramId) : 0);
            setData(detailStok);
        };
        fetchData();
    }, [user?.role, paramId]);

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
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Definisi Kolom untuk ReusableTable
    const columns = useMemo<ColumnDefinition<RiwayatPenerimaan>[]>(() => {
        if (!data) return [];

        return [
            {
                header: "No. Surat",
                key: "no_surat",
                width: "1.5fr",
                cell: (item) => <span className="font-medium text-gray-900">{item.no_surat}</span>,
            },
            {
                header: "Tanggal Terima",
                key: "created_at",
                width: "1.5fr",
                cell: (item) => (
                    <div className="flex items-center gap-2">
                        {/* Icon: Calendar */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
            {
                header: "Jumlah",
                key: "quantity",
                width: "1fr",
                align: "center",
                cell: (item) => (
                    <span className="font-semibold">
                        {item.quantity} {data.satuan}
                    </span>
                ),
            },
            {
                header: "Harga Satuan",
                key: "harga",
                width: "1fr",
                align: "right",
                cell: (item) => formatRupiah(item.harga),
            },
            {
                header: "Total Harga",
                key: "total_harga",
                width: "1fr",
                align: "right",
                cell: (item) => <span className="font-bold text-gray-800">{formatRupiah(item.total_harga)}</span>,
            },
            {
                header: "Status",
                key: "status",
                width: "1fr",
                align: "center",
                cell: (item) => (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            item.status === "checked"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {item.status}
                    </span>
                ),
            },
        ];
    }, [data]); // Re-create columns if data (satuan) changes

    if (!data) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

    // Logic Kategori & Icon
    const config = CATEGORY_DATA.find((c) => c.name === data.category_name);
    const IconComponent = config?.Icon || AtkIcon;
    const colorClass = config?.colorClass || "bg-gray-100 text-gray-700";

    return (
        <div className="min-h-screen p-6 font-sans rounded-xl flex flex-col gap-6">
            {/* --- Header Halaman & Tombol Kembali --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                    >
                        {/* Icon: Arrow Left */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Detail Stok Barang</h1>
                        <p className="text-sm text-gray-500">Informasi detail dan riwayat penerimaan</p>
                    </div>
                </div>
            </div>

            {/* --- Kartu Informasi Utama Barang --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 ${colorClass}`}>
                             <div className={`shrink-0 rounded-lg flex items-center justify-center `}>
                                <IconComponent className='w-10 h-10' />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
                            <div className={`mt-2 flex items-center gap-3 w-fit px-3 py-2 rounded-2xl ${colorClass}`}>
                                <span className={`rounded-full text-xs font-medium`}>
                                    {data.category_name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-5 py-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Satuan</p>
                            <p className="font-bold text-gray-800">{data.satuan}</p>
                        </div>
                        <div className="px-5 py-3 bg-red-50 rounded-lg border border-red-100 text-center">
                            <p className="text-xs text-red-500 mb-1 uppercase tracking-wider">Min. Stok</p>
                            <p className="font-bold text-red-700">{parseFloat(data.minimum_stok)}</p>
                        </div>
                    </div>
                </div>

                {/* --- Section Riwayat Penerimaan dengan ReusableTable --- */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {/* Icon: Layers */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Riwayat Penerimaan (BAST)
                    </h3>
                    
                    {/* Container Table: Berikan height tertentu jika ingin scrollable, atau biarkan auto */}
                    <div className="h-[400px] border border-gray-200 rounded-lg overflow-hidden">
                        <ReusableTable 
                            columns={columns} 
                            currentItems={data.riwayat_penerimaan} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailStokBarang;