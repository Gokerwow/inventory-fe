export default function Penerimaan() {
    const data = [
        { nama: "Soleh", id: "#001", kategori: "ATK", item: "Spidol", tanggal: "9 Oktober 2025", status: "Belum dikonfirmasi" },
        { nama: "Samsul", id: "#002", kategori: "Kebersihan", item: "Sapu", tanggal: "10 Oktober 2025", status: "Telah dikonfirmasi" },
        { nama: "Ida", id: "#003", kategori: "ATK", item: "Kertas", tanggal: "11 Oktober 2025", status: "Telah dikonfirmasi" },
        { nama: "Ratna", id: "#004", kategori: "Komputer", item: "Tinta", tanggal: "11 Oktober 2025", status: "Telah dikonfirmasi" },
        { nama: "Joko", id: "#005", kategori: "ATK", item: "Bulpen", tanggal: "11 Oktober 2025", status: "Telah dikonfirmasi" },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="flex gap-2 justify-center items-center text-lg font-bold ">
                <li className="py-2 border-b-2">Penerimaan</li>
                <li className="py-2 border-b-2 border-gray-400 text-gray-500">Riwayat Penerimaan</li>
            </ul>
            <table className="w-full text-sm text-gray-700">
                <thead className="text-gray-500 border-b">
                    <tr>
                        <th className="py-3 px-4 text-left">Nama PPK</th>
                        <th className="py-3 px-4 text-left">ID Barang</th>
                        <th className="py-3 px-4 text-left">Kategori Barang</th>
                        <th className="py-3 px-4 text-left">Nama Item</th>
                        <th className="py-3 px-4 text-left">Tanggal Dibuat</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                        <th className="py-3 px-4 text-center">Status Konfirmasi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 px-4">{row.nama}</td>
                            <td className="py-3 px-4">{row.id}</td>
                            <td className="py-3 px-4">{row.kategori}</td>
                            <td className="py-3 px-4">{row.item}</td>
                            <td className="py-3 px-4">{row.tanggal}</td>
                            <td className="py-3 px-4 text-center text-blue-600 cursor-pointer">👁 Lihat</td>
                            <td className="py-3 px-4 text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-white text-xs ${row.status === "Belum dikonfirmasi" ? "bg-red-500" : "bg-green-500"
                                        }`}
                                >
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-right text-gray-500 text-sm mt-3">1-5 dari 20</div>
        </div>
    );
}
