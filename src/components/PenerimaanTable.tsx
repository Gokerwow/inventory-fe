import { generatePath, useNavigate } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import Status from './status';
import { useAuth } from '../hooks/useAuth';
import PencilIcon from '../assets/pencilIcon2.svg?react';
import { PATHS } from '../Routes/path';
import EyeIcon from '../assets/eye.svg?react';
import { ROLES, type BASTAPI, type PenerimaanItem, type RiwayatPenerimaanItem } from '../constant/roles';
import DownloadIcon from '../assets/download.svg?react';
import UploadIcon from '../assets/UnduhICON.svg?react';

// Gabungkan semua kemungkinan tipe data
type DataItem = PenerimaanItem | RiwayatPenerimaanItem | BASTAPI;

interface PenerimaanTableProps {
    data: DataItem[];
    variant: 'active' | 'history'; // Prop penentu mode: 'active' (halaman utama) atau 'history' (riwayat)
}

export default function PenerimaanTable({ data, variant }: PenerimaanTableProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Type guard untuk cek apakah item adalah BAST
    const isBAST = (item: DataItem): item is BASTAPI => {
        return 'bast' in item;
    };

    const handleAction = (id: number, type: 'edit' | 'inspect' | 'upload' | 'download', item?: BASTAPI) => {
        if (type === 'edit') navigate(generatePath(PATHS.PENERIMAAN.EDIT, { id: id.toString() }));
        if (type === 'inspect') navigate(generatePath(PATHS.PENERIMAAN.INSPECT, { id: id.toString() }));
        
        if (type === 'upload') {
            navigate(generatePath(PATHS.PENERIMAAN.UNGGAH, { id: id.toString() }), { state: { data: item } });
        }
        if (type === 'download') {
            navigate(generatePath(PATHS.PENERIMAAN.UNDUH, { id: id.toString() }), { state: { data: item } });
        }
    };

const renderActionButton = (item: DataItem) => {
        const userRole = user?.role;
        // Ukuran icon standar, misalnya w-5 h-5 (20px)
        const iconSize = "w-5 h-5"; 

        // 1. ADMIN GUDANG (Bisa Upload/Download BAST)
        if (userRole === ROLES.ADMIN_GUDANG && isBAST(item)) {
            if (variant === 'active') {
                // Di tab aktif: Bisa Unduh & Upload
                return (
                    <>
                        <ActionBtn 
                            icon={<DownloadIcon className={iconSize} />} // Tambahkan className
                            label="Unduh" 
                            onClick={() => handleAction(item.id, 'download', item)} 
                        />
                        <ActionBtn 
                            icon={<UploadIcon className={iconSize} />} // Tambahkan className
                            label="Upload" 
                            onClick={() => handleAction(item.id, 'upload', item)} 
                        />
                    </>
                );
            } else {
                // Di tab riwayat: Hanya Unduh
                return <ActionBtn 
                            icon={<DownloadIcon className={iconSize} />} 
                            label="Unduh" 
                            onClick={() => handleAction(item.id, 'download', item)} 
                        />;
            }
        }

        // 2. PPK (Hanya Edit di Active)
        if (userRole === ROLES.PPK && variant === 'active') {
            return <ActionBtn 
                        icon={<PencilIcon className={iconSize} />} 
                        label="Edit" 
                        onClick={() => handleAction(item.id, 'edit')} 
                    />;
        }

        // 3. TEKNIS (Inspect/Lihat di Active)
        if (userRole === ROLES.TEKNIS && variant === 'active') {
            return <ActionBtn 
                        icon={<EyeIcon className={iconSize} />} 
                        label="Lihat" 
                        onClick={() => handleAction(item.id, 'inspect')} 
                    />;
        }

        // Default
        return <span className="text-gray-400 text-xs">-</span>;
    };

    const columns: ColumnDefinition<DataItem>[] = [
        { header: 'No Surat', cell: (item) => item.no_surat },
        { header: 'Role', cell: (item) => item.role_user },
        { header: 'Nama Pegawai', cell: (item) => item.pegawai_name },
        {
            header: 'Kategori',
            cell: (item) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category_name === 'Komputer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                    {item.category_name}
                </span>
            )
        },
        {
            header: 'Aksi',
            align: 'center',
            cell: (item) => (
                <div className='flex items-center justify-center gap-4'>
                    {renderActionButton(item)}
                </div>
            )
        },
        {
            header: 'Status',
            cell: (item) => (
                <Status
                    text={item.status}
                    color={item.status.toLowerCase().includes('confirm') || item.status.toLowerCase().includes('selesai') ? 'bg-green-600' : 'bg-[#FFB14C]'}
                />
            )
        }
    ];

    return <ReusableTable columns={columns} currentItems={data} />;
}

// Komponen kecil internal untuk tombol aksi agar rapi
const ActionBtn = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <div onClick={onClick} className='flex items-center gap-2 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 hover:text-blue-600'>
        {icon}
        <span>{label}</span>
    </div>
);