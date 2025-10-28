import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

// Tambahkan onConfirm ke props
export default function ConfirmationModal({ 
    isOpen, 
    onClose,
    // onConfirm // Tambahkan prop ini untuk aksi konfirmasi
} : { 
    isOpen: boolean, 
    onClose: () => void,
    // onConfirm: () => void // Tambahkan tipe untuk prop baru
}) {
    return (
        // 1. HAPUS <div className='relative...'> pembungkus dari sini.
        //    Langsung return <Dialog>.
        
        // 'relative z-50' pada Dialog sudah benar, ini untuk stacking context.
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            
            {/* 2. Tambahkan div untuk OVERLAY (latar belakang) */}
            {/* Gunakan 'fixed inset-0' agar menutupi seluruh layar */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* 3. Wrapper untuk memposisikan panel modal di tengah */}
            {/* Gunakan 'fixed inset-0' lagi agar berada di atas overlay */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                
                {/* 4. Panel modal Anda */}
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                    <Description>This will permanently deactivate your account</Description>
                    <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                    <div className="flex gap-4">
                        {/* Tombol Cancel memanggil onClose */}
                        <button onClick={onClose}>Cancel</button>
                        
                        {/* Tombol Deactivate seharusnya memanggil onConfirm */}
                        <button onClick={onConfirm}>Deactivate</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
        // HAPUS </div> penutup yang ada di sini
    )
}