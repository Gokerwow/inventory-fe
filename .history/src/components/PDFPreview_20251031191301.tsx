export default function PDFViewer({ url, fileName }) {
    if (!url) {
        return (
            <div className="flex items-center justify-center h-[600px] border-2 border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500">Tidak ada dokumen untuk ditampilkan</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <iframe
                    src={url}
                    className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
                    title="PDF Preview"
                />
                
                {fileName && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Nama File: {fileName}</p>
                    </div>
                )}
                
                {/* Tombol Download (Opsional) */}
                
                    href={url}
                    download={fileName || 'document.pdf'}
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Download PDF
                </a>
            </div>
        </div>
    );
}