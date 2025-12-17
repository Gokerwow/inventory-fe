// src/components/confirmModal.tsx
import Modal from './modal';
import SimbaLogo from '../assets/images/Light Logo new 1.png';
import Button from './button';

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
                    {/* Tombol Confirm */}
                    <Button
                        variant="success"    // Uses your consistent Brand Blue (or 'success' if you added that)
                        onClick={onConfirm}
                        isLoading={isLoading} // The new Button handles the "..." text automatically
                        className="flex-1" 
                    >
                        {confirmLabel}
                    </Button>

                    {/* Tombol Cancel */}
                    <Button
                        variant="danger"      // Keeps it Red (consistent with your system's red)
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1" 
                    // No need for extra classes, the component handles the styling
                    >
                        {cancelLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}