import { useRef, useState } from 'react';
import UploadIcon from '../assets/uploadBAST.svg?react'
import ButtonConfirm from '../components/buttonConfirm';
import { useToast } from '../context/toastContext';
import Modal from '../components/modal';

const LihatPenerimaan = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ formData, setFormData ] = useState({
        BASTFile : null as File | null
    })

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };


    const handleConfirmSubmit = () => {
        // ← Logic submit dipindahkan ke sini
        console.log('Data barang:', formData);

        // Navigate dengan data
        navigate(PATHS.AKUN.INDEX, {
            state: {
                data: formData,
                toastMessage: isEdit ? 'Anda berhasil mengedit akun!' : 'Anda berhasil membuat akun!'
            }
        });
        handleCloseModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Data barang:', formData);
        handleOpenModal()
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
            <input className='hidden' tabIndex={-1} aria-label='file input' ref={fileInputRef} type="file" accept="application/pdf" />

            <form onSubmit={handleSubmit} className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-4 mb-8">
                <UploadIcon onClick={handleUploadClick} className='hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200' />
                <div className='text-center'>
                    <p className="text-gray-700 mb-2">
                        <span className='text-[#057CFF]'>Klik untuk mengunggah</span> atau seret dan lepas
                    </p>
                    <p className="text-gray-500 text-sm">PDF (max size 100MB)</p>
                </div>
            </form>

            {/* Riwayat Upload */}
            <div>
                <h2 className="text-gray-700 font-medium mb-4">Riwayat Upload sebelumnya</h2>

                <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-xs">PDF</span>
                            </div>
                            <span className="text-gray-700">BAS T Tim_PPK.pdf</span>
                        </div>
                        <span className="text-gray-500">12 October 2025</span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-xs">PDF</span>
                            </div>
                            <span className="text-gray-700">BAS T Tim_PPK.pdf</span>
                        </div>
                        <span className="text-gray-500">13 October 2025</span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-xs">PDF</span>
                            </div>
                            <span className="text-gray-700">BAS T Tim_PPK.pdf</span>
                        </div>
                        <span className="text-gray-500">14 October 2025</span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-xs">PDF</span>
                            </div>
                            <span className="text-gray-700">BAS T Tim_PPK.pdf</span>
                        </div>
                        <span className="text-gray-500">15 October 2025</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <ButtonConfirm
                    text='Unggah BAST'
                    className='w-50'
                    onClick={handleOpenModal}
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                text={isEdit ? "Apa anda yakin  mengedit akun ini?" : "Apa anda yakin  membuat akun baru?"}
            >
            </Modal>
        </div>
    );
};

export default LihatPenerimaan;