import React, { useEffect } from 'react';
import { User, Users, HelpCircle, Phone, FileText } from 'lucide-react';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../assets/svgs/Avatar.svg'
import { FAQ_DATA, ROLE_DISPLAY_NAMES } from '../constant/roles';
import FAQItem from '../components/FAQItem';
import Card from '../components/card';
import Status from '../components/status';

// --- 1. Interface & Dummy Data ---

export interface DaftarPegawai {
    id: number;
    name: string;
    nip: string;
    phone: string;
    status: string;
    jabatan_id: number;
    created_at: string;
    updated_at: string;
    jabatan: string;
}

const mockPegawai: DaftarPegawai[] = [
    {
        id: 1,
        name: "Ahmad Santoso",
        nip: "19850101 201001 1 001",
        phone: "081234567890",
        status: "Aktif",
        jabatan_id: 1,
        created_at: "2023-01-01T10:00:00Z",
        updated_at: "2023-01-01T10:00:00Z",
        jabatan: "Kepala Gudang"
    },
    {
        id: 2,
        name: "Siti Aminah",
        nip: "19900202 201502 2 002",
        phone: "089876543210",
        status: "Aktif",
        jabatan_id: 2,
        created_at: "2023-02-15T09:30:00Z",
        updated_at: "2023-02-15T09:30:00Z",
        jabatan: "Staff Administrasi"
    },
    {
        id: 3,
        name: "Budi Pratama",
        nip: "19920303 201903 1 003",
        phone: "085678901234",
        status: "Cuti",
        jabatan_id: 3,
        created_at: "2023-03-20T08:00:00Z",
        updated_at: "2023-03-20T08:00:00Z",
        jabatan: "Staff Logistik"
    },
    {
        id: 4,
        name: "Dewi Lestari",
        nip: "19950404 202004 2 004",
        phone: "081345678901",
        status: "Aktif",
        jabatan_id: 2,
        created_at: "2023-05-10T11:15:00Z",
        updated_at: "2023-05-10T11:15:00Z",
        jabatan: "Staff Administrasi"
    },
    {
        id: 5,
        name: "Eko Prasetyo",
        nip: "19880505 201205 1 005",
        phone: "087765432109",
        status: "Non-Aktif",
        jabatan_id: 4,
        created_at: "2023-06-01T14:00:00Z",
        updated_at: "2023-06-01T14:00:00Z",
        jabatan: "Pengawas Lapangan"
    }
];

// --- 2. Main Component ---

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState('profil');

    const { user } = useAuth();
    const { checkAccess, hasAccess } = useAuthorization(user?.role);

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;
    }, [user, checkAccess, hasAccess])

    const currentRoleFAQs = FAQ_DATA.find((item) => item.role === user?.role)?.faqs || [];

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Header Profil Diri */}
            <div className="bg-[#005DB9] flex items-center gap-4 rounded-xl p-10 text-white shadow-md relative">
                <div className='rounded-full border-4 border-white/30 bg-white/10 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm'>
                    <img src={user?.photo ?? Avatar} alt="Profile Picture" className='w-full h-full object-cover' />
                </div>
                <div className="">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        {user?.name}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1 opacity-90">
                        {ROLE_DISPLAY_NAMES[user?.role] || user?.role} Sistem Gudang
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('profil')}
                        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'profil'
                            ? 'bg-white text-blue-600 shadow-lg scale-105 ring-2 ring-blue-50'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        Profil
                    </button>

                    <button
                        onClick={() => setActiveTab('pegawai')}
                        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'pegawai'
                            ? 'bg-white text-blue-600 shadow-lg scale-105 ring-2 ring-blue-50'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Daftar Pegawai
                    </button>

                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'faq'
                            ? 'bg-white text-blue-600 shadow-lg scale-105 ring-2 ring-blue-50'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <HelpCircle className="w-5 h-5" />
                        FAQ
                    </button>
                </div>

                {/* --- Tab Content: Profil --- */}
                <div className='w-full'>
                    {activeTab === 'profil' && (
                        <div className="bg-white w-full rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8">Informasi Profil</h2>
                            <div className="space-y-6">
                                <div className="flex border-b border-gray-200 pb-6">
                                    <div className="w-32 text-gray-600 font-medium">Username</div>
                                    <div className="flex-1 text-gray-800">: {user?.name}</div>
                                </div>
                                <div className="flex border-b border-gray-200 pb-6">
                                    <div className="w-32 text-gray-600 font-medium">Role</div>
                                    <div className="flex-1 text-gray-800">: {ROLE_DISPLAY_NAMES[user?.role] || user?.role}</div>
                                </div>
                                <div className="flex pb-6">
                                    <div className="w-32 text-gray-600 font-medium">Email</div>
                                    <div className="flex-1 text-gray-800">: {user?.email}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Tab Content: Daftar Pegawai --- */}
                    {activeTab === 'pegawai' && (
                        <div className="animate-fadeIn">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Daftar Pegawai</h2>
                                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                                    Total: {mockPegawai.length}
                                </span>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {mockPegawai.map((pegawai) => (
                                    <Card key={pegawai.id} className="hover:shadow-xl transition-shadow duration-300 group">
                                        <div className='flex flex-col gap-2'>
                                            <div className="relative">
                                                <div className='rounded-full w-15 h-15 border-2 border-white bg-white flex items-center justify-center overflow-hidden'>
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(pegawai.name)}&background=random&size=128`}
                                                        alt={pegawai.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                            </div>

                                            {/* Nama & Jabatan */}
                                            <div className="w-full">
                                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {pegawai.name}
                                                </h3>
                                                <p className="text-sm font-medium text-blue-500 uppercase tracking-wide text-[10px]">
                                                    {pegawai.jabatan}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <Status
                                                value={pegawai.status}
                                                className='w-30 text-center shadow-sm rounded-xl'
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Tab Content: FAQ --- */}
                    {activeTab === 'faq' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" />
                                FAQ - {ROLE_DISPLAY_NAMES[user?.role] || user?.role}
                            </h2>

                            {currentRoleFAQs.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {currentRoleFAQs.map((faq, index) => (
                                        <FAQItem
                                            key={index}
                                            question={faq.question}
                                            answer={faq.answer}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p>Tidak ada informasi FAQ yang tersedia untuk role Anda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}