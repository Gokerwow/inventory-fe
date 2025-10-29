import UnduhIcon from '../assets/UnduhICON.svg?react';
import { NavLink } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';

// Definisikan interface untuk data
interface PenerimaanItem {
    id: number;
    noSurat: string;
    role: string;
    namaPegawai: string;
    kategori: string;
    status: string;
    linkUnduh: string;
}

const penerimaanColumns: ColumnDefinition<PenerimaanItem>[] = [
    {
        header: 'NO SURAT',
        cell: (item) => <>{item.noSurat}</>
    },
    {
        header: 'ROLE',
        cell: (item) => <>{item.role}</>
    },
    {
        header: 'NAMA PEGAWAI',
        cell: (item) => <>{item.namaPegawai}</>
    },
    {
        header: 'KATEGORI',
        cell: (item) => (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.kategori === 'Komputer'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
                }`}>
                {item.kategori}
            </span>
        )
    },
    {
        header: 'AKSI',
        cell: (item) => (
            <NavLink to={`/penerimaan/unduh/${item.id}`} className="cursor-pointer hover:text-blue-600 hover:translate-y-1 transition-all duration-200">
                <div className='flex items-center gap-1 w-[80px]'>
                    <UnduhIcon />
                    <span>Unduh</span>
                </div>
            </NavLink>
        )
    },
    {
        header: 'STATUS',
        cell: (item) => (
            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white ${item.status === 'Telah Dikonfirmasi' ? 'bg-green-600' : 'bg-[#FFB14C]'
                }`}>
                {item.status}
            </span>
        )
    }
];

export default function PenerimaanTable({
    currentItems = [],
    startIndex = 0,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 7,
    onPageChange = () => { }
}: PenerimaanTableProps) {
    return (
        <div>
            <h1>Data Penerimaan</h1>
            {/* Gunakan komponen ReusableTable */}
            <ReusableTable
                columns={penerimaanColumns}
                currentItems={currentItems}
                totalItems={totalItems}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                onPageChange={onPageChange}
            />
        </div>
    );
}