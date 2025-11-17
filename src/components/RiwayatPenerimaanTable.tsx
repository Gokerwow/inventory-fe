import { generatePath, useNavigate } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import DownloadIcon from '../assets/download.svg?react';
import Status from './status';
import { useAuth } from '../hooks/useAuth';
import { PATHS } from '../Routes/path';
import { ROLES, type BASTAPI, type RiwayatPenerimaanItem } from '../constant/roles';

interface PenerimaanTableProps {
    // ✅ Mengizinkan kedua tipe data agar kompatibel dengan logika BAST
    currentItems: (RiwayatPenerimaanItem | BASTAPI)[];
    startIndex: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
}

export default function RiwayatPenerimaanTable({
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

    // ✅ Type Guard: Mengecek apakah item memiliki properti 'bast' (untuk keamanan tipe data)
    const isBAST = (item: RiwayatPenerimaanItem | BASTAPI): item is BASTAPI => {
        return 'bast' in item;
    };

    // ✅ Handler khusus Download
    const handleDownloadClick = (id: number, item: BASTAPI) => {
        if (user?.role === ROLES.ADMIN_GUDANG) {
            console.log('Download item:', item);
            navigate(generatePath(PATHS.PENERIMAAN.UNDUH, { id: id.toString() }), {
                state: {
                    data: item || null
                }
            });
        } else {
            navigate(PATHS.UNAUTHORIZED);
        }
    };

    // ✅ Render Tombol Aksi (Hanya Download)
    const renderActionButton = (item: RiwayatPenerimaanItem | BASTAPI) => {
        // Hanya Admin Gudang yang boleh download di sini
        if (user?.role === ROLES.ADMIN_GUDANG) {
            // Pastikan item valid sebagai BAST sebelum render tombol
            if (isBAST(item)) {
                return (
                    <div
                        onClick={() => handleDownloadClick(item.id, item)}
                        className='flex justify-center items-center gap-1 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'
                    >
                        <DownloadIcon className='w-7 h-7' />
                        <span>Unduh</span>
                    </div>
                );
            }
        }
        // Jika bukan Admin Gudang atau bukan BAST valid, return null (kosong)
        return null;
    };

    const penerimaanColumns: ColumnDefinition<RiwayatPenerimaanItem | BASTAPI>[] = [
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
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.category_name === 'Komputer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {item.category_name}
                </span>
            )
        },
        ...(user?.role === ROLES.ADMIN_GUDANG ? [{
            header: 'Aksi',
            cell: (item: RiwayatPenerimaanItem | BASTAPI) => (
                <div className='w-full flex items-center justify-center'>
                    {renderActionButton(item)}
                </div>
            )
        }] : []),
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