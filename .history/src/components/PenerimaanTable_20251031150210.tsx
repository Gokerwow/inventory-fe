import UnduhIcon from '../assets/UnduhICON.svg?react';
import { NavLink, useNavigate } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import Status from './status';
import { useAuth } from '../hooks/useAuth';
import PencilIcon from '../assets/pencilIcon2.svg?react'

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


export default function PenerimaanTable({
    currentItems = [],
    startIndex = 0,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 7,
    onPageChange = () => { }
}: PenerimaanTableProps) {

    const { user } = useAuth()
    const navigate = useNavigate()

    const handleActionClick = ( id: number ) => {
        if (user?.role === 'Admin Gudang Umum') {
            navigate(`/penerimaan/unduhBAST/${id}`)
        }
        
        navigate('/penerimaan/edit')
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
                <div onClick={() => handleActionClick(item.id)} className='flex items-center gap-1 w-20'>
                    {user?.role === 'Tim PPK' ?
                        <>
                            <PencilIcon className='w-7 h-7' />
                            <span>Edit</span>
                        </>
                        :
                        <>
                            <UnduhIcon />
                            <span>Unduh</span>
                        </>
                    }

                </div>
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