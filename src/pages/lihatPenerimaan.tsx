import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/uploadBAST.svg?react'
import ButtonConfirm from '../components/buttonConfirm';
import { useToast } from '../hooks/useToast';
import Modal from '../components/modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import PDFIcon from '../assets/PDFICON.svg?react'
import Pagination from '../components/pagination';
import { getRiwayatBASTFile, uploadBAST } from '../services/bastService'; // Pastikan path import benar
import WarnButton from '../components/warnButton';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import { ROLES, type RIWAYATBASTFILEAPI } from '../constant/roles';

const LihatPenerimaan = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()

    // State Data & Loading
    const [isLoading, setIsLoading] = useState(false);
    const [riwayatBastFile, setRiwayatBastFile] = useState<RIWAYATBASTFILEAPI[]>([])

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 7; // Sesuaikan dengan keinginan

    const [error, setError] = useState<string | null>(null);
    const { data } = location.state || {}
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        uploaded_signed_file: null as File | null
    })
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
                console.log(`🔄 Fetching BAST FILE data page ${currentPage}...`);

                // Panggil service dengan parameter page & perPage
                const response = await getRiwayatBASTFile(currentPage, itemsPerPage);

                // Set Data Array
                setRiwayatBastFile(response.data || []);

                // Set Total Items (Asumsi response API punya field 'total')
                // Jika PaginationResponse punya field 'meta', sesuaikan (misal: response.meta.total)
                // Jika response langsung object Laravel paginate, biasanya response.total
                setTotalItems(response.total || 0);

            } catch (err) {
                console.error("Error fetching history:", err);
                setError("Gagal mengambil riwayat.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllData()
    }, [user.role, currentPage]); // Tambahkan currentPage agar re-fetch saat ganti halaman

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
            showToast('File berhasil dipilih!', 'success');
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

        // Pastikan ada ID data dari location state
        if (!data?.id) {
            showToast('ID Penerimaan tidak ditemukan!', 'error');
            handleCloseModal();
            return;
        }

        try {
            const result = await uploadBAST(data.id, formData)
            console.log("✅ Data BAST yang diupload:", result);
            showToast("Berhasil mengupload file BAST!", "success");
            navigate(PATHS.PENERIMAAN.INDEX, {
                state: {
                    data: formData,
                    toastMessage: 'Anda berhasil mengupload BAST!',
                    toastType: 'success'
                }
            });
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
        handleOpenModal()
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-full mx-auto p-8 bg-white rounded-lg">
            {/* Header & Form Upload (Sama seperti sebelumnya) */}
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                UPLOAD BERITA ACARA SERAH TERIMA
            </h1>
            <p className="text-gray-600 mb-6">
                Dokumen yang diunggah di sini akan disimpan di drive cloud Anda
            </p>

            <input
                className='hidden'
                tabIndex={-1}
                aria-label='file input'
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
            />

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-4">
                    <UploadIcon
                        onClick={handleUploadClick}
                        className='hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200'
                    />
                    <div className='text-center'>
                        <p className="text-gray-700 mb-2">
                            <span className='text-[#057CFF] cursor-pointer' onClick={handleUploadClick}>
                                Klik untuk mengunggah
                            </span> atau seret dan lepas
                        </p>
                        <p className="text-gray-500 text-sm">PDF (max size 5MB)</p>
                    </div>

                    {selectedFileName && (
                        <div className="w-full max-w-md mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-12 rounded flex items-center justify-center mr-3 shrink-0">
                                        <PDFIcon />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-700 font-medium truncate">
                                            {selectedFileName}
                                        </p>
                                        {formData.uploaded_signed_file && (
                                            <p className="text-gray-500 text-sm">
                                                {formatFileSize(formData.uploaded_signed_file.size)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="ml-4 text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                                    aria-label="Hapus file"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Riwayat Upload (DIPERBAIKI) */}
            <div>
                <h2 className="text-gray-700 font-medium mb-4">Riwayat Upload sebelumnya</h2>

                {isLoading ? (
                    <p className="text-center py-4 text-gray-500">Memuat data...</p>
                ) : (
                    <div className="space-y-4">
                        {/* ✅ Gunakan riwayatBastFile dari API */}
                        {riwayatBastFile.length > 0 ? (
                            riwayatBastFile.map((item, index) => (
                                <div key={index} className="flex items-center bg-white shadow-lg p-4 rounded-lg" >
                                    <div className="w-8 h-10 rounded flex items-center justify-center mr-3">
                                        <PDFIcon />
                                    </div>
                                    <div className='flex flex-col'>
                                        {/* Sesuaikan field dengan response API */}
                                        <span className="text-gray-700">{item.filename || item.penerimaan_no_surat}</span>
                                        <span className="text-gray-500">{item.uploaded_at || '-'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Belum ada riwayat upload.</p>
                        )}

                        {/* ✅ Pagination Dinamis */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems} // Gunakan total items dari API
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                )}
            </div>

            {/* Footer & Modal (Sama seperti sebelumnya) */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <ButtonConfirm
                    text='Unggah BAST'
                    className='w-50'
                    onClick={handleSubmit}
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text="Apa anda yakin ingin mengunggah file BAST ini?"
            >
                <div className="flex gap-4 justify-end">
                    <ButtonConfirm
                        text="Iya"
                        type="button"
                        onClick={handleConfirmSubmit}
                    />
                    <WarnButton
                        onClick={() => setIsModalOpen(false)}
                        text="Tidak"
                    />
                </div>
            </Modal>
        </div >
    );
};

export default LihatPenerimaan;