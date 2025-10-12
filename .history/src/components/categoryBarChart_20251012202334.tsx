// components/CategoryBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function CategoryBarChart() {
    const data = [
        {
            kategori: 'Pembersih',
            'Barang Masuk': 40,
            'Barang Keluar': 60,
            'Stok Tersedia': 90,
        },
        {
            kategori: 'Listrik',
            'Barang Masuk': 50,
            'Barang Keluar': 90,
            'Stok Tersedia': 50,
        },
        {
            kategori: 'Kertas & Cover',
            'Barang Masuk': 20,
            'Barang Keluar': 30,
            'Stok Tersedia': 50,
        },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">
                Penerimaan Barang per Kategori
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="kategori" />
                    <YAxis label={{ value: 'juta', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Barang Masuk" fill="#5B8DEE" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Barang Keluar" fill="#FF8A80" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Stok Tersedia" fill="#66D9A6" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
