import { useState } from 'react';

export default function PDFPreview({ value }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validasi tipe file PDF
            if (file.type !== 'application/pdf') {
                alert('File harus berupa PDF!');
                return;
            }
            
            setSelectedFile(file);
            
            // Buat preview URL untuk PDF
            const fileURL = URL.createObjectURL(file);
            setPreview(fileURL);
        }
    };

    const handleRemove = () => {
        if (preview) {
            URL.revokeObjectURL(preview); // Bersihkan memory
        }
        setSelectedFile(null);
        setPreview('');
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="font-semibold">Upload PDF</label>
            
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
            
            {preview && (
                <div className="relative">
                    <iframe
                        src={preview}
                        className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
                        title="PDF Preview"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Hapus File
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Nama: {selectedFile?.name}</p>
                        <p>Ukuran: {(selectedFile?.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
            )}
        </div>
    );
}