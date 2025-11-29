import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react'; // Pastikan untuk mengimpor Fragment
import simbaLogo from '../assets/Light Logo new 1.png'

// Komponen sekarang menerima 'isOpen', 'children', dan 'onClose'
export default function Modal({ isOpen, children, onClose, text }: { isOpen: boolean, children?: React.ReactNode, onClose: () => void, onConfirm: () => void, text: string }) {

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
                            <img src={simbaLogo} alt="" />
                            <h1 className="text-2xl text-center select-none">{ text }</h1>
                            {children}
                        </div>
                    </Transition.Child>
                </div>

            </div>
        </Transition>
    );
}