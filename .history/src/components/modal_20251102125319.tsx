import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import ButtonConfirm from './buttonConfirm';
import WarnButton from './warnButton';
import simbaLogo from '../assets/Light Logo new 1.png'

export default function Modal({ isOpen, children, onClose, onConfirm, text }: { 
    isOpen: boolean, 
    children?: React.ReactNode, 
    onClose: () => void, 
    onConfirm: () => void, 
    text: string 
}) {
    const modalRoot = document.getElementById('modal-portal-root');
    
    if (!modalRoot) return null;

    return createPortal(
        <Transition show={isOpen} as={Fragment}>
            {/* Absolute positioning relative to modal-portal-root */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
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
                        onClick={onClose}
                    />
                </Transition.Child>

                <div
                    className="absolute inset-0 flex items-center justify-center p-4"
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
                            className="max-w-lg w-full space-y-4 bg-white p-8 shadow-xl rounded-lg z-50 flex flex-col items-center justify-center gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={simbaLogo} alt="Logo" />
                            <h1 className="text-2xl text-center select-none">{text}</h1>

                            <div className="flex gap-4 justify-end">
                                <ButtonConfirm
                                    text="Iya"
                                    type="submit"
                                    onClick={onConfirm}
                                />
                                <WarnButton
                                    onClick={onClose}
                                    text="Tidak"
                                />
                            </div>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>,
        modalRoot
    );
}