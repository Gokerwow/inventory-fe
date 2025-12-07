import { useMemo, useState, type ReactNode } from "react";
import { PenerimaanContext, type PenerimaanContextType } from "./PenerimaanContext";
import { type FormDataPenerimaan, type Detail_Barang, type APIBarangBaru } from "../constant/roles";


export function PenerimaanProvider({ children }: { children: ReactNode }) {
    const [barang, setBarang] = useState<(Detail_Barang | APIBarangBaru)[]>([])
    const [formDataPenerimaan, setFormDataPenerimaan] = useState<FormDataPenerimaan>({
        no_surat: '',
        category_id: 0,
        category_name: '',
        deskripsi: '',
        detail_barangs: [],
        pegawais: [{
            pegawai_id_pertama: 0, // dari dropdown pihak
            pegawai_name_pertama: '',
            pegawai_NIP_pertama: '',
            jabatan_name_pertama: '',
            alamat_staker_pertama: ''
        },
        {
            pegawai_id_kedua: 0, // dari dropdown pihak
            pegawai_name_kedua: '',
            pegawai_NIP_kedua: '',
            jabatan_name_kedua: '',
            alamat_staker_kedua: ''
        }]
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