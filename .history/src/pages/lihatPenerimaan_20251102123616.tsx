import { useRef, useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/uploadBAST.svg?react'
import ButtonConfirm from '../components/buttonConfirm';
import { useToast } from '../context/toastContext';
import Modal from '../components/modal';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import PDFIcon from '../assets/PDFICON.svg?react'
import { riwayatUpload } from '../Mock Data/data';

const LihatPenerimaan = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        BASTFile: null as File | null
    })
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            // Validasi apakah file adalah PDF
            if (!file.type.startsWith('application/pdf')) {
                showToast('Harap pilih file PDF saja!', 'error');
                return;
            }

            // Validasi ukuran file (contoh: max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Ukuran file maksimal 5MB', 'error');
                return;
            }

            // Simpan file dan nama file
            setFormData(prevState => ({
                ...prevState,
                BASTFile: file
            }));
            setSelectedFileName(file.name);

            showToast('File berhasil dipilih!', 'success');
            console.log('File selected:', file);
        }
    };

    const handleRemoveFile = () => {
        setFormData(prevState => ({
            ...prevState,
            BASTFile: null
        }));
        setSelectedFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleConfirmSubmit = () => {
        if (!formData.BASTFile) {
            showToast('Silakan pilih file terlebih dahulu!', 'error');
            handleCloseModal();
            return;
        }

        console.log('Data barang:', formData);

        // Navigate dengan data
        navigate(PATHS.AKUN.INDEX, {
            state: {
                data: formData,
                toastMessage: 'Anda berhasil mengupload BAST!',
                toastType: 'success'
            }
        });
        handleCloseModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.BASTFile) {
            showToast('Silakan pilih file terlebih dahulu!', 'error');
            return;
        }

        console.log('Data barang:', formData);
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
            {/* Header */}
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                UPLOAD BERITA ACARA SERAH TERIMA
            </h1>
            <p className="text-gray-600 mb-6">
                Dokumen yang diunggah di sini akan disimpan di drive cloud Anda
            </p>

            {/* Upload Area */}
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

                    {/* Tampilkan file yang dipilih */}
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
                                        {formData.BASTFile && (
                                            <p className="text-gray-500 text-sm">
                                                {formatFileSize(formData.BASTFile.size)}
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Riwayat Upload */}
            <div>
                <h2 className="text-gray-700 font-medium mb-4">Riwayat Upload sebelumnya</h2>

                <div className="space-y-4">
                    {riwayatUpload.map((item) => {
                        return (
                            < div className = "flex items-center bg-white shadow-lg p-4 rounded-lg" >
                            <div className="w-8 h-10 rounded flex items-center justify-center mr-3">
                                <PDFIcon />
                            </div>
                            <div className='flex flex-col'>
                                <span className="text-gray-700">BAST_Tim_PPK.pdf</span>
                                <span className="text-gray-500">12 October 2025</span>
                            </div>
                    </>
                )
                    }) }
            </div>
        </div>

            {/* Footer */ }
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
            </Modal>
        </div >
    );
};

export default LihatPenerimaan;