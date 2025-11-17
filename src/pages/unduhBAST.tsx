import PDFPreview from "../components/PDFPreview"
import { useLocation } from "react-router-dom"
import ButtonConfirm from "../components/buttonConfirm"
import { PATHS } from "../Routes/path"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/useToast"
import { useEffect } from "react" // Hapus useState karena tidak butuh untuk data statis ini
import { useAuth } from "../hooks/useAuth"
import { useAuthorization } from "../hooks/useAuthorization"
import { ROLES, type BASTAPI } from "../constant/roles"
import apiClient from "../services/api"

export default function UnduhPage() {
    const location = useLocation()
    // Casting tipe data agar typescript mengenali struktur data
    const stateData = location.state as { data: BASTAPI } | null;
    const data = stateData?.data;

    const navigate = useNavigate()
    const { showToast } = useToast()
    const { user } = useAuth()

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);

    // 1. Perbaikan Logic Authorization & Loop
    useEffect(() => {
        checkAccess(user?.role);
    }, [user?.role]);

    // Jika tidak ada data, langsung return (Mencegah error properti null)
    if (!data || !hasAccess(user?.role)) {
        return (
            <div className="min-h-full bg-[#F3F7FA] rounded-lg shadow-md flex flex-col p-8 gap-4">
                <div className="text-center text-red-600">
                    <h1 className="text-xl font-bold mb-4">Data Tidak Ditemukan / Akses Ditolak</h1>
                    <p>Silakan kembali ke halaman sebelumnya.</p>
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

    // 2. Perbaikan Pengambilan Data (Langsung dari props, tidak perlu useState/useEffect)
    // Sesuaikan dengan JSON: "signed_file_url" BUKAN "file_url"
    const fileUrl = data.bast?.signed_file_url ?? data.bast?.file_url; 
    const downloadEndpoint = data.bast?.download_endpoint;

    const handleUnduhClick = async () => {
        if (!downloadEndpoint) {
            showToast('Link download tidak ditemukan', 'error');
            return;
        }

        try {            
            const response = await apiClient.get(downloadEndpoint, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/pdf'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Penamaan file
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `BAST-${data.no_surat}.pdf`;

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch) {
                    fileName = fileNameMatch[1];
                }
            }

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
            showToast('Anda berhasil mengunduh File', 'success');

        } catch (error) {
            console.error('Error saat download:', error);
            showToast('Terjadi kesalahan saat mengunduh file', 'error');
        }
    };

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
            
            {/* Pass fileUrl yang sudah diperbaiki namanya */}
            {fileUrl ? (
                <PDFPreview url={fileUrl} />
            ) : (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded">
                    <p>Preview PDF tidak tersedia (URL kosong)</p>
                </div>
            )}

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