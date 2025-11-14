import { useContext } from "react";
import { PenerimaanContext } from "../context/PenerimaanContext";

export const usePenerimaan = () => {
    const context = useContext(PenerimaanContext);
    if (!context) {
        throw new Error("usePenerimaan harus digunakan di dalam PenerimaanProvider");
    }
    return context;
}