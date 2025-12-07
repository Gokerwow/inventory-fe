// src/components/confirmModal.tsx
import Modal from './modal';
import SimbaLogo from '../assets/Light Logo new 1.png';
import WarnButton from './warnButton';
import ButtonConfirm from './buttonConfirm';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    text: string;
    isLoading?: boolean;
    confirmLabel?: string; // Opsional, default "Iya"
    cancelLabel?: string;  // Opsional, default "Tidak"
}

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    text, 
    isLoading = false,
    confirmLabel = "Iya",
    cancelLabel = "Tidak"
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            // Tidak pakai title agar header hilang
            maxWidth="max-w-md"
            // Kita pasang style rounded khusus popup ini disini agar otomatis setiap dipakai
        >
            <div className="rounded-[40px] p-8 md:p-10 flex flex-col items-center justify-center gap-6">
                {/* 1. Logo Simba */}
                <img
                    src={SimbaLogo}
                    alt="Simba Logo"
                    className="h-16 object-contain mb-2"
                />

                {/* 2. Text Pertanyaan */}
                <h3 className="text-[#0f172a] text-xl font-medium text-center leading-snug px-4">
                    {text}
                </h3>

                {/* 3. Tombol Aksi */}
                <div className="flex gap-4 w-full justify-center mt-2">
                    {/* Tombol Confirm (Hijau) */}
                    <ButtonConfirm
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-[#41C654] hover:bg-[#36a847] text-white text-lg font-medium py-2 px-10 rounded-xl shadow-sm transition-all active:scale-95 w-32 disabled:opacity-70 disabled:cursor-not-allowed"
                        text={isLoading ? "..." : confirmLabel}
                    >
                    </ButtonConfirm>

                    {/* Tombol Cancel (Merah) */}
                    <WarnButton
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        text={cancelLabel}
                    />
                </div>
            </div>
        </Modal>
    );
}