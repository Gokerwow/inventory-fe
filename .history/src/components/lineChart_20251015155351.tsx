import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PengeluaranChart = () => {
    const data = [
        {
            bulan: 'Agustus',
            'Barang Masuk': 55,
            'Barang Keluar': 32,
            'Stok Tersedia': 30,
        },
        {
            bulan: 'Agustus',
            'Barang Masuk': 88,
            'Barang Keluar': 55,
            'Stok Tersedia': 65,
        },
        {
            bulan: 'September',
            'Barang Masuk': 28,
            'Barang Keluar': 48,
            'Stok Tersedia': 48,
        },
        {
            bulan: 'September',
            'Barang Masuk': 60,
            'Barang Keluar': 55,
            'Stok Tersedia': 85,
        },
        {
            bulan: 'Oktober',
            'Barang Masuk': 65,
            'Barang Keluar': 42,
            'Stok Tersedia': 65,
        },
        {
            bulan: 'Oktober',
            'Barang Masuk': 38,
            'Barang Keluar': 60,
            'Stok Tersedia': 70,
        },
        {
            bulan: 'Oktober',
            'Barang Masuk': 45,
            'Barang Keluar': 95,
            'Stok Tersedia': 55,
        },
    ];

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
                Pengeluaran Barang per Bulan
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="bulan"
                        tick={{ fill: '#666' }}
                    />
                    <YAxis
                        label={{ value: 'juta', angle: -90, position: 'insideLeft' }}
                        tick={{ fill: '#666' }}
                    />
                    <Tooltip />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="square"
                    />
                    <Line
                        type="monotone"
                        dataKey="Barang Masuk"
                        stroke="#FF8A80"
                        strokeWidth={3}
                        dot={{ fill: '#FF8A80', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Barang Keluar"
                        stroke="#A8C5A3"
                        strokeWidth={3}
                        dot={{ fill: '#A8C5A3', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Stok Tersedia"
                        stroke="#6BA3D4"
                        strokeWidth={3}
                        dot={{ fill: '#6BA3D4', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PengeluaranChart;