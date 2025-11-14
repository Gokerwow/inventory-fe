import { createContext, type Dispatch, type SetStateAction } from "react";
import { type TIPE_BARANG_BELANJA, type FormData } from "../Mock Data/data";

export type PenerimaanContextType = {
    barang: TIPE_BARANG_BELANJA[];
    setBarang: Dispatch<SetStateAction<TIPE_BARANG_BELANJA[]>>;
    formDataPenerimaan: FormData;
    setFormDataPenerimaan: Dispatch<SetStateAction<FormData>>;
};

export const PenerimaanContext = createContext<PenerimaanContextType | null>(null);