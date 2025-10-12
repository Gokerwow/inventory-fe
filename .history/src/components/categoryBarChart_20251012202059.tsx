// components/CategoryBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Pembersih', A: 40, B: 30, C: 50 },
    { name: 'Listrik', A: 45, B: 65, C: 90 },
    { name: 'Kertas & Cover', A: 20, B: 50, C: 70 },
];

export default function CategoryBarChart() {
    return (
        <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
            <h2 className="text-center mb-4 font-semibold">Penerimaan Barang per Kategori</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="A" fill="#4C7DFF" name="2021" />
                    <Bar dataKey="B" fill="#FF6B6B" name="2022" />
                    <Bar dataKey="C" fill="#4CAF50" name="2023" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
