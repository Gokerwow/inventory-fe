import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/svgs/uploadBAST.svg?react';
import { useToast } from '../hooks/useToast';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Ganti useLocation dengan useParams
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
import BackButton from '../components/backButton';

const LihatPenerimaan = () => {
    // 2. Ambil ID dari URL Parameter (Misal route: /penerimaan/:id/upload)
    const { id } = useParams<{ id: string }>(); 
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // State Data & Loading
    const [isLoading, setIsLoading] = useState(false);
    const [riwayatBastFile, setRiwayatBastFile] = useState<RIWAYATBASTFILEAPI[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;

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

        // Validasi ID URL
        if (!id) {
            showToast("ID Penerimaan tidak valid", "error");
            navigate(PATHS.PENERIMAAN.INDEX);
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Catatan: Jika getRiwayatBASTFile butuh ID spesifik, tambahkan parameter id disini
                // Contoh: await getRiwayatBASTFile(id, currentPage, itemsPerPage);
                const response = await getRiwayatBASTFile(currentPage, itemsPerPage);
                setRiwayatBastFile(response.data || []);
                setTotalItems(response.total || 0);
            } catch (err) {
                console.error("Error fetching history:", err);
                showToast("Gagal mengambil riwayat.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.role, currentPage, id]);

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
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (!file.type.startsWith('application/pdf')) {
            showToast('Harap pilih file PDF saja!', 'error');
            return;
        }
        if (file.size > 100 * 1024 * 1024) { // 100MB
            showToast('Ukuran file maksimal 100MB', 'error');
            return;
        }
        setFormData(prevState => ({
            ...prevState,
            uploaded_signed_file: file
        }));
        setSelectedFileName(file.name);
        setUploadProgress(0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFormData(prevState => ({
            ...prevState,
            uploaded_signed_file: null
        }));
        setSelectedFileName('');
        setUploadProgress(0);
        setIsUploading(false);
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

        // 3. Validasi menggunakan ID dari params
        if (!id) {
            showToast('ID Penerimaan tidak ditemukan di URL!', 'error');
            handleCloseModal();
            return;
        }

        try {
            setIsUploading(true);
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            // 4. Gunakan ID dari params untuk upload
            const result = await uploadBAST(id, formData);
            
            clearInterval(interval);
            setUploadProgress(100);

            console.log("✅ Data BAST yang diupload:", result);
            showToast("Berhasil mengupload file BAST!", "success");

            setTimeout(() => {
                navigate(PATHS.PENERIMAAN.INDEX);
            }, 500);

            handleCloseModal();
        } catch (err) {
            console.error(err);
            showToast("Gagal mengupload file.", "error");
            setIsUploading(false);
            setUploadProgress(0);
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
        <div className="w-full flex-1 rounded-lg flex flex-col gap-5 overflow-hidden">
            <div className="bg-[#005DB9] rounded-xl p-6 text-white shadow-md relative">
                <BackButton
                    className="absolute left-6 top-1/2 -translate-y-1/2"
                />
                <div className="text-center">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        DOKUMEN BERITA ACARA SERAH TERIMA (BAST)
                    </h1>
                    {/* 5. Hapus No Surat karena data tidak tersedia dari URL */}
                    <p className="text-blue-100 text-sm mt-1 opacity-90">
                        Upload dokumen untuk ID Penerimaan: #{id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">

                {/* --- KOLOM KIRI: Upload Section --- */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <h1 className="text-xl font-bold text-[#1e3a5f] mb-6 flex-none">
                        Unggah Dokumen BAST
                    </h1>

                    <input
                        className='hidden'
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full gap-6">
                        {/* Area Dashed Border - Support Drag & Drop */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden
            ${isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : formData.uploaded_signed_file
                                        ? 'border-blue-200 bg-blue-50/30'
                                        : 'border-gray-300 bg-white'
                                }`}
                        >
                            <div className="flex flex-col items-center w-full text-center">
                                <div className={`w-20 h-20 mb-4 transition-colors ${formData.uploaded_signed_file ? 'text-blue-500' : 'text-gray-400'}`}>
                                    <UploadIcon className="w-full h-full" />
                                </div>

                                <p className="text-gray-900 font-semibold text-base mb-2">
                                    {formData.uploaded_signed_file ? "File siap diunggah" : "Klik untuk mengunggah atau seret dan lepas"}
                                </p>
                                <p className="text-gray-500 text-sm mb-4">
                                    Format: Pdf (Maks. 100Mb)
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Dokumen BAST yang sudah ditandatangani secara basah
                                </p>

                                <Button
                                    type="button"
                                    onClick={handleUploadClick}
                                    variant='primary'
                                    className='mt-6'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    {formData.uploaded_signed_file ? "Ganti File" : "Pilih File"}
                                </Button>
                            </div>
                        </div>

                        {/* File Preview & Actions */}
                        <div className="flex flex-col gap-4">
                            {/* File Info Card */}
                            <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${formData.uploaded_signed_file ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                                <div className="w-10 h-10 shrink-0">
                                    <PDFIcon className={`w-full h-full ${formData.uploaded_signed_file ? 'text-red-500' : 'text-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${formData.uploaded_signed_file ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                        {formData.uploaded_signed_file ? selectedFileName : "Belum ada file dipilih"}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        {formData.uploaded_signed_file ? formatFileSize(formData.uploaded_signed_file.size) : "-"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={!formData.uploaded_signed_file}
                                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors 
                    ${formData.uploaded_signed_file
                                            ? 'hover:bg-gray-200 cursor-pointer text-gray-600'
                                            : 'cursor-default text-gray-300'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Siap diunggah...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <button
                                type="submit"
                                disabled={isUploading || !formData.uploaded_signed_file}
                                className="w-full bg-linear-to-br from-[#057CFF] to-[#003F93] text-white py-3 rounded-lg font-medium hover:from-[#0164ce] hover:to-[#003273] transition-all duration-200 cursor-pointer shadow-sm disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                {isUploading ? 'Mengunggah...' : 'Upload BAST'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- KOLOM KANAN: Riwayat Section --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-0">
                    <div className='p-6 pb-2 flex-none'>
                        <h2 className="text-xl font-bold text-gray-800">
                            Riwayat Upload Sebelumnya
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 pt-2 min-h-0">
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
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                    />
                </div>

            </div>

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