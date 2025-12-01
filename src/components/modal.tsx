import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import simbaLogo from '../assets/Light Logo new 1.png'

// Komponen sekarang menerima 'isOpen', 'children', dan 'onClose'
export default function Modal({ isOpen, children, onClose, text, isForm }: { isOpen: boolean, children?: React.ReactNode, onClose: () => void, onConfirm: () => void, text: string, isForm?: boolean }) {

    // 1. Buat fungsi handler baru untuk menangani klik pada backdrop
    const handleBackdropClick = () => {
        if (isForm) {
            // 2. Jika isForm true, munculkan konfirmasi browser
            const confirmLeave = window.confirm("Apakah Anda yakin ingin menutup form? Data yang belum disimpan akan hilang.");
            
            // 3. Jika user klik "OK", baru jalankan onClose
            if (confirmLeave) {
                onClose();
            }
        } else {
            // 4. Jika bukan form, tutup langsung seperti biasa
            onClose();
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>

            <div className="fixed inset-0 z-40 overflow-y-auto" style={{ left: '256px', top: '80px' }}>

                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        aria-hidden="true"
                    />
                </Transition.Child>

                <div
                    className="absolute inset-0 flex items-center justify-center p-4"
                    // 5. Ganti onClose dengan handleBackdropClick disini
                    onClick={handleBackdropClick}
                >

                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className={`max-w-lg w-full bg-white ${isForm ? 'p-10' : ' p-18'} shadow-xl rounded-lg z-50 flex flex-col items-center justify-center gap-4`}
                            // stopPropagation tetap diperlukan agar klik di dalam kotak putih tidak memicu backdrop click
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!isForm &&
                                <>
                                    <img src={simbaLogo} alt="" />
                                    <h1 className="text-2xl text-center select-none">{text}</h1>
                                </>
                            }

                            {children}
                        </div>
                    </Transition.Child>
                </div>

            </div>
        </Transition>
    );
}