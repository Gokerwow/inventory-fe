import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// --- TAMBAHAN: Tentukan tipe data yang diharapkan ---
interface ChartData {
    bulan: string;
    value: number;
}

interface DiagramBatangProps {
    type: 'masuk' | 'keluar';
    data: ChartData[]; // <-- UBAHAN: Terima data sebagai prop
}

const DiagramBatang: React.FC<DiagramBatangProps> = ({ type, data }) => { // <-- UBAHAN: Terima 'data'

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

    const COLORS = ['#5F97DF', '#F28671', '#5EC586'];
    const config = chartConfig[type];

    return (
        <div className="bg-white rounded-lg">
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={data} // <-- UBAHAN: Gunakan data dari props
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="bulan"
                        tick={{ fill: '#666' }}
                    />
                    <YAxis
                        label={{ angle: -90, position: 'insideLeft' }}
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
                    >
                        {/* --- 4. Petakan data Anda ke <Cell> --- */}
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}

                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DiagramBatang;