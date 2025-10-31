import PDFPreview from "../components/PDFPreview"

export default function UnduhPage() {
    
    return (
        <div className="min-h-full bg-[#F3F7FA] rounded-lg shadow-md flex flex-col p-8">
            <h1 className="text-xl font-bold text-[#057CFF] text-center">DOKUMEN BERITA ACARA SERAH TERIMA (BAST)</h1>

            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Panduan Penandatangan BAST</h1>

                <div>
                    <p className="text-lg mb-4">
                        Silahkan baca dengan saksama dokumen Berita Acara Serah Terima (BAST) yang kami lampirkan. BAST ini berisi pengadaan Belanja Natura dan Pakan Natura.
                    </p>

                    <p className="text-lg mb-4">
                        Setelah membaca dan memahami isi dokumen, mohon segera melakukan penandatanganan pada halaman terakhir sebagai tanda persetujuan. Lakukan dengan cara mengunduh dan mencetak dokumen BAST. Kemudian lakukan penandatanganan secara basah.
                    </p>

                    <p className="text-lg">
                        Setelah Penandatanganan scan dan unggah file BAST melalui link berikut atau tombol dibawah dokumen.
                    </p>
                </div>
            </div>
                <PDFPreview 
                value={}
                />
            <div>

            </div>
        </div>
    )
}