import PDFPreview from "../components/PDFPreview"
import { useLocation } from "react-router-dom"
import ButtonConfirm from "../components/buttonConfirm"
import { PATHS } from "../Routes/path"
import { useNavigate } from "react-router-dom"

export default function UnduhPage() {
    const location = useLocation()
    const { data } = location.state || {}
    const navigate = useNavigate()

    const handleUnduhClick = () => {
        // Validasi data terlebih dahulu
        if (!data || !data.linkUnduh) {
            console.error('Data atau link unduh tidak tersedia:', data)
            alert('File tidak ditemukan. Silakan kembali ke halaman sebelumnya.')
            return
        }

        try {
            const link = document.createElement('a');
            link.href = data.linkUnduh;

            // Gunakan nama file dari data atau buat default
            const fileName = data.fileName || data.noSurat || `BAST-${Date.now()}.pdf`;
            link.download = fileName;

            // Tambahkan attribute untuk browser compatibility
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optional: Tambahkan feedback sukses
            console.log('Download berhasil:', fileName);

        } catch (error) {
            console.error('Error saat download:', error);
            alert('Terjadi kesalahan saat mengunduh file.');
        }
    }

    if (!data) {
        return (
            <div className="min-h-full bg-[#F3F7FA] rounded-lg shadow-md flex flex-col p-8 gap-4">
                <div className="text-center text-red-600">
                    <h1 className="text-xl font-bold mb-4">Data Tidak Ditemukan</h1>
                    <p>Silakan kembali ke halaman sebelumnya dan coba lagi.</p>
                    <button
                        onClick={() => navigate(PATHS.PENERIMAAN.INDEX)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Kembali ke Penerimaan
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-full bg-[#F3F7FA] rounded-lg shadow-md flex flex-col p-8 gap-4">
            <h1 className="text-xl font-bold text-[#057CFF] text-center">DOKUMEN BERITA ACARA SERAH TERIMA (BAST)</h1>

            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Panduan Penandatangan BAST</h1>

                <div>
                    <p className="text-lg mb-4">
                        Silahkan baca dengan saksama dokumen Berita Acara Serah Terima (BAST) yang kami lampirkan. BAST ini berisi pengadaan Belanja Natura dan Pakan Natura.
                    </p>

                    <p className="text-lg mb-4">
                        Setelah membaca dan memahami isi dokumen, mohon segera melakukan penandatanganan pada halaman terakhir sebagai tanda persetujuan. Lakukan dengan cara mengunduh dan mencetak dokumen BAST. Kemudian lakukan penandatanganan secara basah.
                    </p>

                    <p className="text-lg">
                        Setelah Penandatanganan scan dan unggah file BAST melalui link berikut atau tombol dibawah dokumen.
                    </p>
                </div>
            </div>
            <PDFPreview
                url={data.linkUnduh}
            />
            <div>
                <ButtonConfirm
                    text='Unduh File'
                    className="w-50"
                    onClick={handleUnduhClick}
                />
            </div>
        </div>
    )
}