import { PenerimaanProvider } from "../context/PenerimaanProvider"
import { Outlet } from "react-router-dom"

export default function PenerimaanLayout () {
    return (
        <PenerimaanProvider>
            <Outlet />
        </PenerimaanProvider>
    )
}