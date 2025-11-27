import { useContext } from "react";
import { TagContext } from "../context/TagContext";

export const useTag = () => {
    const context = useContext(TagContext)
    if (!context) {
        throw new Error("useTag harus digunakan di dalam PenerimaanProvider");
    }
    return context
}