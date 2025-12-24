import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/svgs/uploadBAST.svg?react';
import { useToast } from '../hooks/useToast';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import PDFIcon from '../assets/svgs/PDFICON.svg?react';
import Pagination from '../components/pagination';
import { getRiwayatBASTFile, uploadBAST } from '../services/bastService';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { ROLES, type RIWAYATBASTFILEAPI } from '../constant/roles';
import ConfirmModal from '../components/confirmModal';
import Button from '../components/button';
import Loader from '../components/loader';

const LihatPenerimaan = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // State Data & Loading
    const [isLoading, setIsLoading] = useState(false);
    const [riwayatBastFile, setRiwayatBastFile] = useState<RIWAYATBASTFILEAPI[]>([]);

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5; // Disesuaikan agar muat di layout kartu

    const [error, setError] = useState<string | null>(null);
    const { data } = location.state || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        uploaded_signed_file: null as File | null
    });
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    const { checkAccess, hasAccess } = useAuthorization(ROLES.ADMIN_GUDANG);
    const { user } = useAuth();

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) {
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const response = await getRiwayatBASTFile(currentPage, itemsPerPage);
                setRiwayatBastFile(response.data || []);
                setTotalItems(response.total || 0);
            } catch (err) {
                console.error("Error fetching history:", err);
                setError("Gagal mengambil riwayat.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [user.role, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            if (!file.type.startsWith('application/pdf')) {
                showToast('Harap pilih file PDF saja!', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('Ukuran file maksimal 5MB', 'error');
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                uploaded_signed_file: file
            }));
            setSelectedFileName(file.name);
            // Langsung buka modal konfirmasi setelah pilih file (opsional, sesuai UX tombol Unggah)
            // handleOpenModal(); 
        }
    };

    const handleRemoveFile = () => {
        setFormData(prevState => ({
            ...prevState,
            uploaded_signed_file: null
        }));
        setSelectedFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleConfirmSubmit = async () => {
        if (!formData.uploaded_signed_file) {
            showToast('Silakan pilih file terlebih dahulu!', 'error');
            handleCloseModal();
            return;
        }

        if (!data?.id) {
            showToast('ID Penerimaan tidak ditemukan!', 'error');
            handleCloseModal();
            return;
        }

        try {
            const result = await uploadBAST(data.id, formData);
            console.log("✅ Data BAST yang diupload:", result);
            showToast("Berhasil mengupload file BAST!", "success");
            navigate(PATHS.PENERIMAAN.INDEX);
            handleCloseModal();
        } catch (err) {
            console.error(err);
            showToast("Gagal mengupload file.", "error");
            handleCloseModal();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.uploaded_signed_file) {
            showToast('Silakan pilih file terlebih dahulu!', 'error');
            return;
        }
        handleOpenModal();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="h-full rounded-lg flex flex-col overflow-hidden">
            {/* Grid Layout: 2 Kolom pada layar besar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                {/* --- KOLOM KIRI: Upload Section --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">
                        Unggah Dokumen BAST
                    </h1>

                    <input
                        className='hidden'
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        {/* Area Dashed Border */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-6 transition-colors min-h-[400px]
                            ${formData.uploaded_signed_file ? 'border-blue-400 bg-blue-50' : 'border-gray-400 hover:border-blue-400'}`}
                        >
                            {/* Logic tampilan file terpilih vs belum terpilih */}
                            {!formData.uploaded_signed_file ? (
                                <>
                                    <div className="p-4 bg-gray-50 rounded-full">
                                        <UploadIcon className="w-12 h-12 text-gray-600" />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-gray-800 font-medium text-lg">
                                            Klik untuk mengunggah atau seret dan lepas
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Format: Pdf (Maks. 5MB)<br />
                                            Dokumen BAST yang sudah ditandatangani secara basah
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleUploadClick}
                                        className="bg-[#057CFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 mt-4"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        Pilih File
                                    </button>
                                </>
                            ) : (
                                // Tampilan saat file sudah dipilih
                                <div className="flex flex-col items-center w-full max-w-xs animate-fadeIn">
                                    <div className="w-16 h-20 mb-4 text-red-500">
                                        <PDFIcon className="w-full h-full" />
                                    </div>
                                    <p className="text-gray-800 font-semibold text-center break-all">
                                        {selectedFileName}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-6">
                                        {formatFileSize(formData.uploaded_signed_file.size)}
                                    </p>

                                    <div className="flex gap-3 w-full">
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                        >
                                            Hapus
                                        </button>
                                        {/* Tombol trigger upload sesungguhnya */}
                                        <Button
                                            className='flex-1'
                                            variant='success'
                                            onClick={handleSubmit}
                                        >
                                            Unggah
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- KOLOM KANAN: Riwayat Section --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col"> {/* TAMBAHKAN flex flex-col DISINI */}

                    {/* Container Konten (Header + List) */}
                    {/* flex-1 akan membuatnya mengisi sisa ruang, mendorong pagination ke bawah */}
                    <div className='p-6 pb-4 flex flex-col flex-1'>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Riwayat Upload Sebelumnya
                        </h2>

                        <div className="flex-1 overflow-y-auto"> {/* Tambahkan overflow-y-auto jika listnya panjang */}
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="space-y-4">
                                    {riwayatBastFile.length > 0 ? (
                                        riwayatBastFile.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow"
                                            >
                                                <div className="w-10 h-10 mr-4 shrink-0 text-red-500">
                                                    <PDFIcon className="w-full h-full" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-gray-800 font-semibold truncate text-sm md:text-base">
                                                        {item.filename || item.penerimaan_no_surat || "BAST Tim_PPK.pdf"}
                                                    </span>
                                                    <span className="text-gray-500 text-xs mt-1">
                                                        {item.uploaded_at || '12 Oktober 2025'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                            <p>Belum ada riwayat upload.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                    />
                </div>

            </div>

            {/* Modal Konfirmasi */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text={`Apakah Anda yakin ingin mengunggah file "${selectedFileName}"?`}
            />
        </div>
    );
};

export default LihatPenerimaan;