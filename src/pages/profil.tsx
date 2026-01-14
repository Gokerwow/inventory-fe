import { useEffect, useState } from 'react';
import { User, Users, HelpCircle } from 'lucide-react';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../assets/svgs/Avatar.svg';
import { FAQ_DATA, ROLE_DISPLAY_NAMES, ROLES, type APIProfilePegawai } from '../constant/roles';
import { getProfilePegawai } from '../services/pegawaiService';
import Card from '../components/card';
import Status from '../components/status';
import Pagination from '../components/pagination';
import Loader from '../components/loader';
import FAQComponent from '../components/FAQItem';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profil');
    const { user } = useAuth();
    const { checkAccess } = useAuthorization(user?.role || '');

    // --- State Management ---
    const [pegawaiList, setPegawaiList] = useState<APIProfilePegawai[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        checkAccess(user?.role);
    }, [user, checkAccess]);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchPegawai = async () => {
            if (activeTab !== 'pegawai') return;

            setIsLoading(true);
            try {
                const response = await getProfilePegawai(currentPage, ITEMS_PER_PAGE);
                setPegawaiList(response.data);
                setTotalPages(response.last_page);
                setTotalItems(response.total);
            } catch (error) {
                console.error("Gagal mengambil data pegawai", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPegawai();
    }, [activeTab, currentPage]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const currentRoleFAQs = FAQ_DATA.find((item) => item.role === user?.role)?.faqs || [];

    const allTabs = [
        { id: 'profil', label: 'Profil', icon: User },
        { id: 'pegawai', label: 'Pegawai', icon: Users },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ];

    const filteredTabs = allTabs.filter(tab => {
        if (user?.role === ROLES.SUPER_ADMIN) return tab.id === 'profil';
        if (user?.role === ROLES.INSTALASI || user?.role === ROLES.PENANGGUNG_JAWAB) return tab.id !== 'pegawai';
        return true;
    });

    return (
        <div className="w-full flex flex-col gap-4 md:gap-6 p-0 md:p-1">
            {/* Header Profil Responsif */}
            <div className="bg-[#005DB9] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Avatar Section */}
                <div className='relative z-10 rounded-full border-4 border-white bg-white/10 w-24 h-24 md:w-36 md:h-36 flex shrink-0 items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md'>
                    <img src={user?.photo ?? Avatar} alt="Profile" className='w-full h-full object-cover' />
                </div>

                {/* Info Text Section */}
                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                    <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tight wrap-break-word max-w-full">
                        {user?.name}
                    </h1>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm whitespace-nowrap">
                            {user?.role ? (ROLE_DISPLAY_NAMES[user.role] || user.role) : null}
                        </span>
                        <span className="text-blue-100 text-xs opacity-80 italic hidden sm:inline">Sistem Gudang</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Responsif */}
            <div className={`grid grid-cols-1 gap-2 sm:gap-3 ${filteredTabs.length === 3 ? 'md:grid-cols-3' :
                    filteredTabs.length === 2 ? 'md:grid-cols-2' :
                        'md:grid-cols-1'
                }`}>
                {filteredTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer active:scale-95 ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-md ring-2 ring-blue-100 scale-[1.02]'
                                : 'bg-gray-50 text-gray-500 hover:bg-white hover:text-blue-500'
                            }`}
                    >
                        <tab.icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm md:text-base">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px] flex flex-col">
                {/* 1. Tab Profil */}
                {activeTab === 'profil' && (
                    <div className="bg-white flex-1 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="text-blue-600 w-5 h-5" /> Informasi Pribadi
                        </h2>
                        <div className="grid gap-4">
                            {[
                                { label: 'Username', value: user?.name },
                                { label: 'Jabatan', value: user?.role ? (ROLE_DISPLAY_NAMES[user.role] || user.role) : '-'},
                                { label: 'Email', value: user?.email },
                            ].map((info, i) => (
                                // Ubah layout jadi stack di mobile, row di desktop
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-50 pb-4 last:border-0">
                                    <span className="w-full sm:w-40 text-gray-400 text-sm font-medium mb-1 sm:mb-0">{info.label}</span>
                                    {/* Gunakan break-all agar email panjang turun ke bawah jika layar sempit */}
                                    <span className="text-gray-700 font-semibold sm:ml-4 text-sm md:text-base break-all">
                                        {info.value || '-'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Tab Pegawai */}
                {activeTab === 'pegawai' && user?.role !== ROLES.INSTALASI && user?.role !== ROLES.PENANGGUNG_JAWAB && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Daftar Rekan Kerja</h2>
                            <div className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                                {totalItems} Orang
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader />
                            </div>
                        ) : pegawaiList.length > 0 ? (
                            <>
                                {/* Grid responsif sudah cukup baik (grid-cols-1 di mobile) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                    {pegawaiList.map((pegawai, index) => (
                                        <Card key={index} className="group hover:border-blue-200 transition-all duration-300">
                                            <div className="flex flex-col gap-3">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg md:text-xl font-bold border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                                    {pegawai.initial || pegawai.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-sm md:text-base">{pegawai.name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{pegawai.jabatan}</p>
                                                </div>
                                                <Status value={pegawai.status} className="w-fit text-[10px] py-1 px-3 rounded-xl shadow-none border border-gray-50" />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Users className="w-12 h-12 text-gray-200 mb-2" />
                                <p className="text-gray-500 font-medium">Belum ada data pegawai.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Tab FAQ */}
                {activeTab === 'faq' && user?.role !== ROLES.SUPER_ADMIN && (
                    <div className="animate-fadeIn">
                        <div className="bg-blue-600 p-6 rounded-2xl mb-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold">Pusat Bantuan</h2>
                                <p className="text-blue-100 text-sm opacity-80">Pertanyaan seputar role {user?.role ? (ROLE_DISPLAY_NAMES[user.role] || user.role) : null}</p>
                            </div>
                            <HelpCircle className="w-8 h-8 md:w-10 md:h-10 opacity-20 shrink-0" />
                        </div>
                        <div className="space-y-3">
                            {currentRoleFAQs.length > 0 ? (
                                currentRoleFAQs.map((faq, index) => (
                                    <FAQComponent key={index} question={faq.question} answer={faq.answer} />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 italic">FAQ belum tersedia.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}