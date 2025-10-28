import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react'; // Pastikan untuk mengimpor Fragment

// Komponen sekarang menerima 'isOpen', 'children', dan 'onClose'
export default function Modal({ isOpen, children, onClose } : { isOpen: boolean, children: React.ReactNode, onClose: () => void }) {

    return (
        <Transition show={isOpen} as={Fragment}>

            <div className="absolute inset-0 z-40 overflow-y-auto">

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
                    onClick={onClose}
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
                            className="max-w-lg w-full space-y-4 bg-white p-18 shadow-xl rounded-lg z-50 flex flex-col items-center justify-center gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </div>
                    </Transition.Child>
                </div>

            </div>
        </Transition>
    );
}