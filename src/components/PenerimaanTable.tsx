import { generatePath, useNavigate } from 'react-router-dom';
import ReusableTable, { type ColumnDefinition } from '../components/table';
import Status from './status';
import { useAuth } from '../hooks/useAuth';
import PencilIcon from '../assets/svgs/pencilIcon2.svg?react';
import { PATHS } from '../Routes/path';
import EyeIcon from '../assets/svgs/eye.svg?react';
import { ROLES, type BASTAPI, type PenerimaanItem, type RiwayatPenerimaanItem } from '../constant/roles';
import DownloadIcon from '../assets/svgs/download.svg?react';
import UploadIcon from '../assets/svgs/UnduhICON.svg?react';
import DeleteIcon from '../assets/svgs/IconHapus.svg?react';

type DataItem = PenerimaanItem | RiwayatPenerimaanItem | BASTAPI;

interface PenerimaanTableProps {
    data: DataItem[];
    variant: 'active' | 'history';
    // 1. Tambahkan prop onDelete (opsional agar tidak error di tempat lain jika belum dipasang)
    onDelete?: (id: number) => void;
}

export default function PenerimaanTable({ data, variant, onDelete }: PenerimaanTableProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAction = async (id: number, type: 'edit' | 'detail' | 'inspect' | 'upload' | 'download' | 'hapus', item?: BASTAPI) => {
        console.log("Item yang dikirim:", item);

        if (type === 'edit') navigate(generatePath(PATHS.PENERIMAAN.EDIT, { id: id.toString() }));
        if (type === 'detail') navigate(generatePath(PATHS.PENERIMAAN.PREVIEW, { id: id.toString() }));
        if (type === 'inspect') navigate(generatePath(PATHS.PENERIMAAN.INSPECT, { id: id.toString() }));

        if (type === 'upload') {
            navigate(generatePath(PATHS.PENERIMAAN.UNGGAH, { id: id.toString() }), { state: { data: item } });
        }
        if (type === 'download') {
            navigate(generatePath(PATHS.PENERIMAAN.UNDUH, { id: id.toString() }), { state: { data: item } });
        }

        // 2. Modifikasi logika Hapus
        if (type === 'hapus') {
            if (onDelete) {
                // Panggil fungsi dari Parent
                onDelete(id);
            } else {
                console.warn("Fungsi onDelete tidak diberikan ke tabel");
            }
        }
    };

    const renderActionButton = (item: DataItem) => {
        const userRole = user?.role;
        const iconSize = "w-5 h-5";

        if (userRole === ROLES.ADMIN_GUDANG) {
            if (variant === 'active') {
                return (
                    <>
                        {/* Pastikan logic handleAction aman menerima item umum */}
                        <ActionBtn icon={<DownloadIcon className={iconSize} />} label="Unduh" onClick={() => handleAction(item.id, 'download', item as BASTAPI)} />
                        <ActionBtn icon={<UploadIcon className={iconSize} />} label="Upload" onClick={() => handleAction(item.id, 'upload', item as BASTAPI)} />
                    </>
                )
            } else {
                return <ActionBtn icon={<DownloadIcon className={iconSize} />} label="Unduh" onClick={() => handleAction(item.id, 'download', item as BASTAPI)} />;
            }
        }

        if (userRole === ROLES.PPK && variant === 'active') {
            return (
                <>
                    <ActionBtn icon={<PencilIcon className={iconSize} />} label="Edit" onClick={() => handleAction(item.id, 'edit')} />
                    <ActionBtn icon={<DeleteIcon className={iconSize} />} className="hover:text-red-600" label="Hapus" onClick={() => handleAction(item.id, 'hapus')} />
                </>
            )
        }

        if (variant === 'history') {
            return <ActionBtn icon={<EyeIcon className={iconSize} />} label="Lihat" onClick={() => handleAction(item.id, 'detail')} />;

        }

        if (userRole === ROLES.TEKNIS && variant === 'active') {
            return <ActionBtn icon={<EyeIcon className={iconSize} />} label="Lihat" onClick={() => handleAction(item.id, 'inspect')} />;
        }

        return <span className="text-gray-400 text-xs">-</span>;
    };

    const columns: ColumnDefinition<DataItem>[] = [
        { header: 'No Surat', cell: (item) => item.no_surat },
        { header: 'Role', cell: (item) => item.role_user },
        { header: 'Nama Pegawai', cell: (item) => item.pegawai_name },
        {
            header: 'Kategori',
            cell: (item) => item.category_name
        },
        {
            header: 'Status',
            cell: (item) => (
                <Status
                    // Logic warna ikut status_code (misal: "0", "pending")
                    code={item.status_code}

                    // Teks yang muncul ikut status (misal: "Belum Ditandatangani")
                    label={item.status}

                    // Fallback (jaga-jaga jika code/label kosong)
                    value={item.status_code || item.status}
                />
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
    ];

    return <ReusableTable columns={columns} currentItems={data} />;
}

const ActionBtn = ({ icon, label, onClick, className }: { icon: React.ReactNode, label: string, onClick: () => void, className?: string }) => (
    <div onClick={onClick} className={`flex items-center gap-2 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200  ${className ? className : 'hover:text-blue-600'}`}>
        {icon}
        <span>{label}</span>
    </div>
);