import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="absolute inset-0 z-10" onClose={onClose}>
                {/* Overlay gelap di belakang modal */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="absolute inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Logo SIMBAI */}
                                {/* Anda bisa mengganti ini dengan komponen logo atau tag <img> */}
                                <div className="flex justify-center mb-6">
                                    {/* Ini hanya placeholder, ganti dengan SVG logo SIMBAI Anda */}
                                    {/* Contoh: <img src="/path/to/simbai-logo.svg" alt="SIMBAI Logo" className="h-12" /> */}
                                    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0" y="0" width="120" height="40" fill="#E0F2F7" /> {/* Background placeholder */}
                                        <text x="60" y="25" font-family="Arial" font-size="20" fill="#000" text-anchor="middle" font-weight="bold">SIMBAI</text>
                                        {/* Tambahkan elemen SVG logo Anda di sini */}
                                    </svg>
                                </div>


                                {/* Pesan Konfirmasi */}
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-medium leading-6 text-gray-900 text-center mt-4 mb-8"
                                >
                                    {title || "Apa Anda yakin data yang dibuat sudah?"}
                                </Dialog.Title>

                                {/* Tombol Aksi */}
                                <div className="mt-4 flex justify-center gap-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-teal-500 px-6 py-3 text-base font-medium text-white hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                                        onClick={onConfirm} // Jalankan fungsi konfirmasi
                                    >
                                        Iya
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-6 py-3 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        onClick={onClose} // Tutup modal
                                    >
                                        Tidak
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ConfirmationModal;