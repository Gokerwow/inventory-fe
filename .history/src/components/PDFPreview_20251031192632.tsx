export default function PDFViewer({ url, fileName } : { url: string, fileName?: string }) {
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
                    src={url + '#toolbar=0'}
                    className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
                    title="PDF Preview"
                />
                
                {fileName && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Nama File: {fileName}</p>
                    </div>
                )}
                
                {/* Tombol Download (Opsional) */}
            </div>
        </div>
    );
}