import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface NavigationTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabClick: (id: string) => void;
    className?: string;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, activeTab, onTabClick, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Cari tab yang sedang aktif untuk label dropdown mobile
    const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

    return (
        <div className={`w-full ${className}`}>

            {/* === MOBILE VIEW: DROPDOWN MENU (RESPONSIVE UX) === */}
            <div className="lg:hidden relative z-20">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm transition-all active:bg-gray-50 ${isOpen ? 'ring-2 ring-blue-100 border-blue-400' : ''
                        }`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {activeTabObj.icon && (
                            <span className="text-blue-600 shrink-0">
                                {activeTabObj.icon}
                            </span>
                        )}
                        <span className="font-bold text-gray-800 truncate">{activeTabObj.label}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500 shrink-0" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500 shrink-0" />
                    )}
                </button>

                {/* Isi Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        {tabs.map((tab) => {
                            const isActive = tab.id === activeTab;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { onTabClick(tab.id); setIsOpen(false); }}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b border-gray-50 last:border-0
                                        ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <div className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {tab.icon}
                                    </div>
                                    {tab.label}

                                    {/* Indikator Aktif (Titik Biru) */}
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* === DESKTOP VIEW: ORIGINAL DESIGN (Standard Pills) === */}
            {/* Menggunakan flex-wrap agar aman jika tab banyak, tanpa background container pembungkus */}
            <div className="hidden lg:flex flex-wrap items-center gap-3" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`${isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } w-60 justify-center bg-white cursor-pointer rounded-t-lg group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm`}
                        >
                            {tab.icon}
                            {/* Tambahkan truncate jika teks terlalu panjang */}
                            <span className="truncate">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};