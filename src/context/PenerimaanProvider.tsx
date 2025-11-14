import { useMemo, useState, type ReactNode } from "react";
import { PenerimaanContext, type PenerimaanContextType } from "./PenerimaanContext";
import type { TIPE_BARANG_BELANJA, FormData } from "../Mock Data/data";

export function PenerimaanProvider({ children }: { children: ReactNode }) {
    const [barang, setBarang] = useState<TIPE_BARANG_BELANJA[]>([])
    const [formDataPenerimaan, setFormDataPenerimaan] = useState<FormData>({
        id: 0,
        noSurat: '',
        namaPihakPertama: '',
        jabatanPihakPertama: '',
        NIPPihakPertama: '',
        alamatSatkerPihakPertama: '',
        namaPihakKedua: '',
        jabatanPihakKedua: '',
        NIPPihakKedua: '',
        alamatSatkerPihakKedua: '',
        deskripsiBarang: '',
    });

    const value = useMemo<PenerimaanContextType>(() => ({
        barang,
        setBarang,
        formDataPenerimaan,
        setFormDataPenerimaan,
    }), [formDataPenerimaan, barang]);

    return <PenerimaanContext.Provider value={value}>
        {children}
    </PenerimaanContext.Provider>;
}