import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PengeluaranChartProps {
    type: 'masuk' | 'keluar';
}

const PengeluaranChart: React.FC<PengeluaranChartProps> = ({ type }) => {
    const data = [
        {
            bulan: 'Agustus',
            value: type === 'masuk' ? 55 : 32,
        },
        {
            bulan: 'September',
            value: type === 'masuk' ? 28 : 48,
        },
        {
            bulan: 'Oktober',
            value: type === 'masuk' ? 65 : 42,
        },
        {
            bulan: 'November',
            value: type === 'masuk' ? 38 : 60,
        },
        {
            bulan: 'Desember',
            value: type === 'masuk' ? 45 : 95,
        },
    ];

    const chartConfig = {
        masuk: {
            color: '#FF8A80',
            label: 'Barang Masuk'
        },
        keluar: {
            color: '#A8C5A3',
            label: 'Barang Keluar'
        }
    };

    const config = chartConfig[type];

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
                        dataKey="value"
                        fill={config.color}
                        name={config.label}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PengeluaranChart;