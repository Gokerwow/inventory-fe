import PDFPreview from "../components/PDFPreview"
import { useLocation } from "react-router-dom"
import { PATHS } from "../Routes/path"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/useToast"
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useAuthorization } from "../hooks/useAuthorization"
import { ROLES, type BASTAPI } from "../constant/roles"
import apiClient from "../utils/api"
import Button from "../components/button"
import BackButton from "../components/backButton"
import { Download, FileText } from "lucide-react"

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
        // Container Utama
        <div className="min-h-full bg-white rounded-xl shadow-md flex flex-col overflow-hidden pb-10">

            {/* === HEADER RESPONSIF === */}
            <div className="bg-[#005DB9] p-6 text-white shadow-md relative flex flex-col items-center justify-center min-h-[120px]">
                
                {/* Back Button: Hidden di Mobile */}
                <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2">
                    <BackButton />
                </div>

                <div className="text-center px-4 w-full">
                    <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wide leading-tight">
                        DOKUMEN BERITA ACARA (BAST)
                    </h1>
                    <div className="mt-2 flex justify-center">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs md:text-sm font-mono text-blue-50 border border-white/20">
                            Nomor: {data.no_surat}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Body dengan Padding Responsif */}
            <div className="p-4 md:p-8 flex flex-col gap-6">

                {/* Section Panduan */}
                <div>
                    <h2 className="text-base md:text-lg font-bold text-[#002B6A] mb-3 flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Panduan Penandatanganan
                    </h2>

                    <div className="bg-[#EBF5FF] p-4 md:p-6 rounded-lg text-gray-700 text-sm md:text-[15px] leading-relaxed flex flex-col gap-3 border border-blue-100">
                        <p>
                            Silahkan dibaca dengan saksama dokumen Berita Acara Serah Terima (BAST). Dokumen ini berisi detail pengadaan Belanja Natura.
                        </p>
                        <p>
                            Mohon unduh dan cetak dokumen ini, kemudian lakukan <strong>penandatanganan basah</strong> pada halaman terakhir sebagai tanda persetujuan.
                        </p>
                        <p className="font-medium text-blue-800">
                            Setelah ditandatangani, scan dokumen dan unggah kembali melalui menu Upload.
                        </p>
                    </div>
                </div>

                {/* PDF Preview Area */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-gray-700 text-sm">Preview Dokumen:</h3>
                    <div className="flex justify-center w-full bg-gray-100 rounded-lg border border-gray-300 overflow-hidden min-h-[400px] md:min-h-[600px]">
                        {fileUrl ? (
                            <div className="w-full h-full min-h-[400px] md:min-h-[600px]">
                                <PDFPreview url={fileUrl} />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-10 text-gray-400 gap-2 min-h-[300px]">
                                <FileText size={40} className="opacity-20" />
                                <p className="text-sm">Preview PDF tidak tersedia</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action (Sticky style visual effect) */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                        variant="success"
                        onClick={handleUnduhClick}
                        className="w-full md:w-auto flex items-center justify-center gap-2 shadow-lg py-3 text-base"
                    >
                        <Download size={20} />
                        Unduh File BAST
                    </Button>
                </div>
            </div>
        </div>
    )
}