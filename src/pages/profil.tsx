import React, { useEffect } from 'react';
import { User, Users, HelpCircle } from 'lucide-react';
import { useAuthorization } from '../hooks/useAuthorization';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../assets/svgs/Avatar.svg'
import { FAQ_DATA, ROLE_DISPLAY_NAMES } from '../constant/roles';
import FAQItem from '../components/FAQItem';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState('profil');

    const { user } = useAuth();
    const { checkAccess, hasAccess } = useAuthorization(user?.role);

    useEffect(() => {
        checkAccess(user?.role);
        if (!hasAccess(user?.role)) return;
    }, [user, checkAccess, hasAccess])

    console.log(user)

    const currentRoleFAQs = FAQ_DATA.find((item) => item.role === user?.role)?.faqs || [];

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="bg-[#005DB9] flex items-center gap-4 rounded-xl p-10 text-white shadow-md relative">
                <div className='rounded-full border-3 border-white w-40 h-40 flex items-center justify-center overflow-hidden shadow-2xl'>
                    <img src={user?.photo ?? Avatar} alt="Profile Picture" className='w-full' />
                </div>
                {/* Konten Tengah */}
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
                            ? 'bg-white text-blue-600 shadow-lg scale-105'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        Profil
                    </button>

                    <button
                        onClick={() => setActiveTab('pegawai')}
                        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'pegawai'
                            ? 'bg-white text-blue-600 shadow-lg scale-105'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Daftar Pegawai
                    </button>

                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'faq'
                            ? 'bg-white text-blue-600 shadow-lg scale-105'
                            : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <HelpCircle className="w-5 h-5" />
                        FAQ
                    </button>
                </div>

                {/* Profile Information Card */}
                <div className='w-full '>
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
                                    <div className="flex-1 text-gray-800">: {user?.role}</div>
                                </div>
                                <div className="flex pb-6">
                                    <div className="w-32 text-gray-600 font-medium">Email</div>
                                    <div className="flex-1 text-gray-800">: {user?.email}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'pegawai' && (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Pegawai</h2>
                            <p className="text-gray-600">Konten daftar pegawai akan ditampilkan di sini.</p>
                        </div>
                    )}
                    {activeTab === 'faq' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" />
                                FAQ - {ROLE_DISPLAY_NAMES[user?.role] || user?.role}
                            </h2>
                            
                            {currentRoleFAQs.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {currentRoleFAQs.map((faq, index) => (
                                        <FAQItem 
                                            key={index} 
                                            question={faq.question} 
                                            answer={faq.answer} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
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