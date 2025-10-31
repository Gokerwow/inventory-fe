import { useEffect, useState } from 'react';
import PlusIcon from '../assets/plus.svg?react'
import PenerimaanTable from '../components/PenerimaanTable';
import RiwayatPenerimaanTable from '../components/RiwayatPenerimaanTable';
import { NavLink } from 'react-router-dom';
import { PenerimaanData } from '../Mock Data/data';
import { PATHS } from '../Routes/path';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';

const PenerimaanPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = PenerimaanData.slice(startIndex, startIndex + itemsPerPage);
    const [activeTab, setActiveTab] = useState('penerimaan');

    const { checkAccess, hasAccess } = useAuthorization(['Admin Gudang Umum', 'Tim PPK']);
    const { user } = useAuth()

    useEffect(() => {
        checkAccess(user?.role);
        console.log(test)
    }, [user, checkAccess]);

    // Early return jika tidak memiliki akses
    if (!hasAccess(user?.role)) {
        return null;
    }

    const handleClick = (activeTab: string) => {
        setActiveTab(activeTab);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-full p-6 bg-white rounded-lg shadow-md gap-4">
            {/* Header */}
            <div className='flex justify-between'>
                <div className="flex shrink-0 gap-4">
                    <h1
                        onClick={() => handleClick('penerimaan')}
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'penerimaan'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Penerimaan
                    </h1>
                    <h1
                        onClick={() => handleClick('riwayat')}
                        className={`text-xl font-semibold border-b-4 py-2 cursor-pointer transition-colors ${activeTab === 'riwayat'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-gray-400 hover:text-blue-500'
                            }`}
                    >
                        Riwayat Penerimaan
                    </h1>
                </div>
                <div className='cursor-pointer hover:scale-110 transition-all duration-200 active:scale-85'>
                    <NavLink to={PATHS.PENERIMAAN.TAMBAH}>
                        <PlusIcon />
                    </NavLink>
                </div>
            </div>

            {activeTab === 'penerimaan' ?
                <PenerimaanTable
                    currentItems={currentItems}
                    startIndex={startIndex}
                    currentPage={currentPage}
                    totalItems={PenerimaanData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
                :
                <RiwayatPenerimaanTable
                    currentItems={currentItems}
                    startIndex={startIndex}
                    currentPage={currentPage}
                    totalItems={PenerimaanData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange} />
            }
        </div>
    );
};

export default PenerimaanPage;