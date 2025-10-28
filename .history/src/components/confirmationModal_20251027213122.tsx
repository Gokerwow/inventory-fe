import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ConfirmationModal({ isOpen, onClose } : { isOpen: boolean, onClose: () => void }) {
    return (
        <div className='relative'>
            <Dialog open={isOpen} onClose={onClose} className="relative z-50 bg-amber-400">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-amber-400">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                        <Description>This will permanently deactivate your account</Description>
                        <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        <div className="flex gap-4">
                            <button onClick={onClose}>Cancel</button>
                            <button onClick={onClose}>Deactivate</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}