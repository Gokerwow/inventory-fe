import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <div className="bg-white rounded-lg">
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
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
                    <Bar
                        dataKey="Barang Masuk"
                        fill="#FF8A80"
                        name="Barang Masuk"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar
                        dataKey="Barang Keluar"
                        fill="#A8C5A3"
                        name="Barang Keluar"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar
                        dataKey="Stok Tersedia"
                        fill="#6BA3D4"
                        name="Stok Tersedia"
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PengeluaranChart;