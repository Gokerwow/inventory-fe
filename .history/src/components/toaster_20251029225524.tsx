// src/components/ToasterCustom.tsx
// (Nama file biarkan ToasterCustom.tsx, tapi nama komponen di bawah ini saya ubah)
// Pastikan impor di Layout.tsx juga diubah jika Anda mengubah nama ekspor

import { toast, type Toast } from 'react-hot-toast';

// Komponen ini wajib menerima 't' (objek toast)
interface Props {
    t: Toast;
}

export const ToasterCustom = ({ t }: Props) => {
    return (
        <div>
            halo
        </div>
    );
};