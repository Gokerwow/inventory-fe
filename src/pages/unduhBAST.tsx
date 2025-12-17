import PDFPreview from "../components/PDFPreview"
import { useLocation } from "react-router-dom"
import ButtonConfirm from "../components/buttonConfirm"
import { PATHS } from "../Routes/path"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/useToast"
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useAuthorization } from "../hooks/useAuthorization"
import { ROLES, type BASTAPI } from "../constant/roles"
import apiClient from "../services/api"

export default function UnduhPage() {
    const location = useLocation()
    const stateData = location.state as { data: BASTAPI } | null;
    const data = stateData?.data;

    const navigate = useNavigate()
    const { showToast } = useToast()
    const { user } = useAuth()

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);

    useEffect(() => {
        checkAccess(user?.role);
    }, [user?.role]);

    if (!data || !hasAccess(user?.role)) {
        return (
            <div className="min-h-full bg-white rounded-lg shadow-md flex flex-col p-8 gap-4 justify-center items-center">
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
        // Container Utama: Background Putih, Rounded, Shadow
        <div className="min-h-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
            
            {/* Header Biru Full Width */}
            <div className="bg-[#057CFF] w-full py-5 px-4 text-center text-white">
                <h1 className="text-xl font-bold">DOKUMEN BERITA ACARA SERAH TERIMA (BAST)</h1>
                <p className="mt-1 text-sm opacity-90">Nomor: {data.no_surat}</p>
            </div>

            {/* Content Body dengan Padding */}
            <div className="p-8 flex flex-col gap-6">
                
                {/* Section Panduan */}
                <div>
                    <h2 className="text-lg font-bold text-[#002B6A] mb-3">Panduan Penandatanganan BAST</h2>
                    
                    {/* Kotak Informasi Biru Muda */}
                    <div className="bg-[#EBF5FF] p-6 rounded-lg text-gray-700 text-[15px] leading-relaxed flex flex-col gap-4 border border-blue-100">
                        <p>
                            Silahkan dibaca dengan saksama dokumen Berita Acara Serah Terima (BAST) yang kami lampirkan. BAST ini berisi pengadaan Belanja Natura dan Pakan Natura.
                        </p>
                        <p>
                            Setelah membaca dan memahami isi dokumen, mohon segera melakukan penandatanganan pada halaman terakhir sebagai tanda persetujuan. Lakukan dengan cara mengunduh dan mencetak dokumen BAST. Kemudian lakukan penandatanganan secara basah.
                        </p>
                        <p>
                            Setelah Penandatanganan, scan dan unggah file BAST melalui link berikut atau tombol di bawah dokumen.
                        </p>
                    </div>
                </div>

                {/* PDF Preview Area */}
                <div className="flex justify-center w-full">
                    {fileUrl ? (
                        <div className="border border-gray-300 w-full shadow-sm">
                             <PDFPreview url={fileUrl} />
                        </div>
                    ) : (
                        <div className="w-full p-10 text-center border-2 border-dashed border-gray-300 rounded bg-gray-50">
                            <p className="text-gray-500">Preview PDF tidak tersedia (URL kosong)</p>
                        </div>
                    )}
                </div>

                {/* Tombol Action (Pindah ke Kanan Bawah & Warna Hijau) */}
                <div className="flex justify-end mt-2">
                    <ButtonConfirm
                        text='Unduh File'
                        // Menggunakan warna hijau (#4CAF50 / emerald-500) sesuai gambar
                        className="bg-[#4CAF50] hover:bg-[#43A047] text-white px-8 py-2.5 rounded-md font-medium min-w-[150px]"
                        onClick={handleUnduhClick}
                    />
                </div>
            </div>
        </div>
    )
}