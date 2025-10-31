import { useRef } from 'react';
import UploadIcon from '../assets/uploadBAST.svg?react'

const LihatPenerimaan = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
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
            <input className='hidden' disabled aria-label='file input' ref={fileInputRef} type="file" accept="application/pdf" />

            <div onClick={handleUploadClick} className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-4 mb-8">
                <UploadIcon className='hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200'/>
                <div className='text-center'>
                    <p className="text-gray-700 mb-2">
                        <span className='text-[#057CFF]'>Klik untuk mengunggah</span> atau seret dan lepas
                    </p>
                    <p className="text-gray-500 text-sm">PDF (max size 100MB)</p>
                </div>
            </div>

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
            <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-gray-700">Legalitas Mat</p>
            </div>
        </div>
    );
};

export default LihatPenerimaan;