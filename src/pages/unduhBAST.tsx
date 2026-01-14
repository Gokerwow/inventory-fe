import PDFPreview from "../components/PDFPreview";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { PATHS } from "../Routes/path";
import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuthorization } from "../hooks/useAuthorization";
import { ROLES, type BASTAPI } from "../constant/roles";
import apiClient from "../utils/api";
import Button from "../components/button";
import BackButton from "../components/backButton";
import { Download, FileText, Loader2 } from "lucide-react";

export default function UnduhPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [data, setData] = useState<BASTAPI | null>(location.state?.data || null);
    const [loading, setLoading] = useState(!data);
    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);

    useEffect(() => {
        const fetchBastSignedDetail = async () => {
            if (!data && id) {
                try {
                    setLoading(true);
                    const response = await apiClient.get(`/api/v1/bast/signed`);

                    if (response.data && response.data.data) {
                        const list = response.data.data.data || response.data.data;
                        const findData = list.find((item: any) =>
                            item.uuid === id || item.id?.toString() === id
                        );

                        if (findData) {
                            setData(findData);
                        } else {
                            showToast("Dokumen tidak ditemukan dalam daftar BAST", "error");
                        }
                    }
                } catch (err) {
                    console.error("Error fetching BAST detail:", err);
                    showToast("Gagal mengambil detail dokumen BAST", "error");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBastSignedDetail();
    }, [id, data, showToast]);

    useEffect(() => {
        if (user?.role) {
            checkAccess(user.role);
        }
    }, [user?.role, checkAccess]);

    if (loading) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium">Memuat dokumen BAST...</p>
            </div>
        );
    }

    if (!data || !hasAccess(user?.role)) {
        return (
            <div className="min-h-full bg-white rounded-lg shadow-md flex flex-col p-8 gap-4 justify-center items-center">
                <div className="text-center text-red-600">
                    <h1 className="text-xl font-bold mb-4">Data Tidak Ditemukan / Akses Ditolak</h1>
                    <p className="text-gray-600">Sistem tidak menemukan dokumen atau Anda tidak memiliki akses.</p>
                    <button
                        onClick={() => navigate(PATHS.PENERIMAAN.INDEX)}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
                    >
                        Kembali ke Penerimaan
                    </button>
                </div>
            </div>
        );
    }

    const fileUrl = data.bast?.signed_file_url ?? data.bast?.file_url ?? (data as any).signed_file_url;
    const downloadEndpoint = data.bast?.download_endpoint ?? (data as any).download_endpoint;

    const handleUnduhClick = async () => {
        if (!downloadEndpoint) {
            showToast('Link download tidak tersedia untuk dokumen ini', 'error');
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
                if (fileNameMatch) fileName = fileNameMatch[1];
            }

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showToast('Berhasil mengunduh dokumen BAST', 'success');

        } catch (error) {
            console.error('Error download:', error);
            showToast('Gagal mengunduh file', 'error');
        }
    };

    return (
        <div className="min-h-full bg-white rounded-xl shadow-md flex flex-col overflow-hidden pb-10">
            <div className="bg-[#005DB9] p-6 text-white shadow-md relative flex flex-col items-center justify-center min-h-[120px]">
                <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2">
                    <BackButton />
                </div>
                <div className="text-center px-4 w-full">
                    <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wide">
                        DOKUMEN BERITA ACARA (BAST)
                    </h1>
                    <div className="mt-2 flex justify-center">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs md:text-sm font-mono text-blue-50 border border-white/20">
                            Nomor: {data.no_surat || "Tidak Tersedia"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 flex flex-col gap-6">
                <div>
                    <h2 className="text-base md:text-lg font-bold text-[#002B6A] mb-3 flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Panduan Penandatanganan
                    </h2>
                    <div className="bg-[#EBF5FF] p-4 md:p-6 rounded-lg text-gray-700 text-sm md:text-[15px] border border-blue-100 flex flex-col gap-3">
                        <p>Silahkan baca saksama dokumen BAST untuk detail pengadaan Belanja Natura.</p>
                        <p>Mohon unduh dan cetak dokumen ini, lakukan <strong>penandatanganan basah</strong> pada halaman terakhir.</p>
                        <p className="font-medium text-blue-800 italic">Setelah ditandatangani, scan dan unggah kembali melalui menu Upload.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-gray-700 text-sm italic">Preview Dokumen:</h3>
                    <div className="flex justify-center w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden min-h-[450px] md:min-h-[650px] shadow-inner">
                        {fileUrl ? (
                            <div className="w-full h-full">
                                <PDFPreview url={fileUrl} />
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center p-20 text-gray-400 gap-3">
                                <FileText size={48} className="opacity-10" />
                                <p className="text-sm font-medium">Maaf, file preview PDF tidak dapat ditampilkan.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                        variant="success"
                        onClick={handleUnduhClick}
                        className="w-full md:w-auto flex items-center justify-center gap-2 shadow-lg py-3 px-8 text-base transition-transform active:scale-95"
                    >
                        <Download size={20} />
                        Unduh File BAST
                    </Button>
                </div>
            </div>
        </div>
    );
}