import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;           
    children: React.ReactNode; 
    maxWidth?: string;        
    isForm?: boolean;         
}

export default function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'max-w-lg', 
    isForm = false 
}: ModalProps) {

    const handleBackdropClick = () => {
        if (isForm) {
            const confirmLeave = window.confirm("Apakah Anda yakin ingin menutup form? Data yang belum disimpan akan hilang.");
            if (confirmLeave) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <div className="relative z-50">
                {/* Backdrop / Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
                        aria-hidden="true"
                    />
                </Transition.Child>

                {/* Modal Position Wrapper */}
                <div 
                    className="fixed inset-0 z-10 w-screen overflow-y-auto"
                    onClick={handleBackdropClick} 
                >
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        
                        {/* Modal Panel */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div 
                                className={twMerge(
                                    "relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 w-full flex flex-col",
                                    "rounded-[20px]", // Membuat sudut sangat bulat sesuai gambar
                                    maxWidth 
                                )}
                                onClick={(e) => e.stopPropagation()} 
                            >
                                {/* Header Modal (Hanya render jika ada title) */}
                                {title && (
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                            {title}
                                        </h3>
                                        <button 
                                            type="button" 
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={handleBackdropClick}
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Body Modal */}
                                <div className="">
                                    {children}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Transition>
    );
}