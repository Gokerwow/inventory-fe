import { Transition } from '@headlessui/react';
import { Fragment } from 'react'; // Pastikan untuk mengimpor Fragment

// Komponen sekarang menerima 'isOpen', 'children', dan 'onClose'
export default function Modal({ isOpen, children, onClose }) {

    // Kita tidak lagi menggunakan 'if (!isOpen) return null;'
    // <Transition> akan menanganinya secara otomatis.
    return (
        <Transition show={isOpen} as={Fragment}>

            {/* Ini adalah wrapper 'absolute' utama.
        'show={isOpen}' akan mengontrol kapan semua yang ada di dalamnya
        muncul atau menghilang.
      */}
            <div className="absolute inset-0 z-40 overflow-y-auto">

                {/* 1. Backdrop (Latar Belakang Blur) */}
                {/* Dianimasikan terpisah (fade in/out) */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* Div ini adalah backdrop (latar belakang).
            Kita tambahkan 'onClick={onClose}' di sini.
            Saya juga menambahkan 'bg-black/30' agar efek blur terlihat.
          */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose} // <-- Prop 'onClose' Anda diletakkan di sini
                        aria-hidden="true"
                    />
                </Transition.Child>

                {/* 2. Kontainer untuk memposisikan Panel di tengah */}
                {/* Kita butuh wrapper ini agar panel bisa di-scroll 
                jika layarnya kecil, terpisah dari backdrop.
                */}
                <div className="absolute inset-0 flex items-center justify-center p-4">

                    {/* 3. Panel (Kotak Putih) */}
                    {/* Dianimasikan terpisah (fade + scale in/out) */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {/* Ini adalah panel konten Anda.
                        Mengklik di sini TIDAK akan memicu 'onClose'
                        karena ini adalah sibling dari backdrop, bukan child.
                        */}
                        <div className="max-w-lg w-full space-y-4 border bg-white p-8 shadow-xl rounded-lg z-50">
                            {children}
                        </div>
                    </Transition.Child>
                </div>

            </div>
        </Transition>
    );
}