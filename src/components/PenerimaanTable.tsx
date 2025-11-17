import UploadIcon from '../assets/UnduhICON.svg?react';
import { generatePath, useNavigate } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import Status from './status';
import { useAuth } from '../hooks/useAuth';
import PencilIcon from '../assets/pencilIcon2.svg?react'
import { PATHS } from '../Routes/path';
import EyeIcon from '../assets/eye.svg?react'
import { ROLES, type BASTAPI } from '../constant/roles';
import { type PenerimaanItem } from '../constant/roles';
import DownloadIcon from '../assets/download.svg?react'

interface PenerimaanTableProps {
    currentItems: (PenerimaanItem | BASTAPI)[]; // ✅ Support both types
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
}

export default function PenerimaanTable({
    currentItems = [],
    startIndex = 0,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 7,
    onPageChange = () => { },
    totalPages = 1
}: PenerimaanTableProps) {

    const { user } = useAuth();
    const navigate = useNavigate();

    // ✅ Fix: Consistent parameter types
    const handleActionClick = (
        id: number, 
        state?: 'upload' | 'download', 
        item?: BASTAPI
    ) => {
        if (user?.role === ROLES.PPK) {
            navigate(generatePath(PATHS.PENERIMAAN.EDIT, { id: id.toString() }));
        } else if (user?.role === ROLES.TEKNIS) {
            navigate(generatePath(PATHS.PENERIMAAN.INSPECT, { id: id.toString() }));
        } else if (user?.role === ROLES.ADMIN_GUDANG) {
            if (state === 'upload') {
                navigate(generatePath(PATHS.PENERIMAAN.LIHAT, { id: id.toString() }), {
                    state: {
                        data: item || null
                    }
                });
            } else if (state === 'download') {
                console.log('Download item:', item);
                navigate(generatePath(PATHS.PENERIMAAN.UNDUH, { id: id.toString() }), {
                    state: {
                        data: item || null
                    }
                });
            }
        }
    };

    // ✅ Type guard to check if item is BASTAPI
    const isBAST = (item: PenerimaanItem | BASTAPI): item is BASTAPI => {
        return 'bast' in item;
    };

    const renderActionButton = (item: PenerimaanItem | BASTAPI) => {
        switch (user?.role) {
            case ROLES.PPK:
                return (
                    <div 
                        onClick={() => handleActionClick(item.id)} 
                        className='flex justify-center items-center gap-1 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'
                    >
                        <PencilIcon className='w-7 h-7' />
                        <span>Edit</span>
                    </div>
                );
            
            case ROLES.ADMIN_GUDANG:
                // ✅ Only show download/upload if item is BASTAPI
                if (isBAST(item)) {
                    return (
                        <>
                            <div 
                                onClick={() => handleActionClick(item.id, 'download', item)} 
                                className='flex justify-center items-center gap-1 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'
                            >
                                <DownloadIcon className='w-7 h-7' />
                                <span>Unduh</span>
                            </div>
                            <div 
                                onClick={() => handleActionClick(item.id, 'upload', item)} 
                                className='flex justify-center items-center gap-1 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'
                            >
                                <UploadIcon className='w-7 h-7' />
                                <span>Upload</span>
                            </div>
                        </>
                    );
                }
                return null;
            
            case ROLES.TEKNIS:
            default:
                return (
                    <div 
                        onClick={() => handleActionClick(item.id)} 
                        className='flex justify-center items-center gap-1 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'
                    >
                        <EyeIcon className='w-7 h-7' />
                        <span>Lihat</span>
                    </div>
                );
        }
    };

    // ✅ Fix: Proper type definition for columns
    const penerimaanColumns: ColumnDefinition<PenerimaanItem | BASTAPI>[] = [
        {
            header: 'No Surat',
            cell: (item) => <>{item.no_surat}</>
        },
        {
            header: 'Role',
            cell: (item) => <>{item.role_user}</>
        },
        {
            header: 'Nama Pegawai',
            cell: (item) => <>{item.pegawai_name}</>
        },
        {
            header: 'Kategori',
            cell: (item) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.category_name === 'Komputer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                }`}>
                    {item.category_name}
                </span>
            )
        },
        {
            header: 'Aksi',
            cell: (item) => (
                <div className='w-full flex items-center justify-center gap-4'>
                    {renderActionButton(item)}
                </div>
            )
        },
        {
            header: 'Status',
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
            totalPages={totalPages}
        />
    );
}