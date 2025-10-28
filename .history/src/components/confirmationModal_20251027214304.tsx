import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

// Tambahkan onConfirm ke props
export default function ConfirmationModal({
    isOpen,
    onClose,
    // onConfirm // Tambahkan prop ini untuk aksi konfirmasi
}: {
    isOpen: boolean,
    onClose: () => void,
    // onConfirm: () => void // Tambahkan tipe untuk prop baru
}) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">

            {/* 1. OVERLAY */}
            {/* UBAH 'fixed' menjadi 'absolute' */}
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

            {/* 2. PANEL WRAPPER */}
            {/* UBAH 'fixed' menjadi 'absolute' */}
            {/* 'w-screen' diubah menjadi 'w-full' agar lebarnya 100% dari parent, bukan layar */}
            <div className="absolute inset-0 flex w-full items-center justify-center p-4">

                {/* Panel Modal Anda */}
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg shadow-xl">
                    <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                    <Description>This will permanently deactivate your account</Description>
                    <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                    <div className="flex gap-4">
                        <button onClick={onClose}>Cancel</button>
                        {/* <button onClick={onConfirm} className="text-red-600">Deactivate</button> */}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}