import { NavLink } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import EyeIcon from '../assets/eye.svg?react';
import Status from './status';


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

interface PenerimaanTableProps {
    currentItems: PenerimaanItem[];
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;

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
            <NavLink to={`/penerimaan/unduh/${item.id}`}>
                <div className='flex items-center gap-1 w-[80px]'>
                    <EyeIcon />
                    <span>Lihat</span>
                </div>
            </NavLink>
        )
    },
    {
        header: 'STATUS',
        cell: (item) => (
            <Status 
            text={item.status}
            color={item.status === 'Telah Dikonfirmasi' ? 'bg-green-600' : 'bg-[#FFB14C]'}
            />
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
        <ReusableTable
            columns={penerimaanColumns}
            currentItems={currentItems}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            onPageChange={onPageChange}
        />
    );
}