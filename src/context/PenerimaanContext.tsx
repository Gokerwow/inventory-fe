import { createContext, type Dispatch, type SetStateAction } from "react";
import { type Detail_Barang, type FormDataPenerimaan } from "../constant/roles";

export type PenerimaanContextType = {
    barang: Detail_Barang[];
    setBarang: Dispatch<SetStateAction<Detail_Barang[]>>;
    formDataPenerimaan: FormDataPenerimaan;
    setFormDataPenerimaan: Dispatch<SetStateAction<FormDataPenerimaan>>;
};

export const PenerimaanContext = createContext<PenerimaanContextType | null>(null);
