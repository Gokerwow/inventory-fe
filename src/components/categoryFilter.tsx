import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Pastikan lucide-react terinstall, atau ganti dengan SVG manual

interface CategoryFilterProps {
    selectedCategoryId: number | null | undefined;
    onCategoryClick: (categoryId: number) => void;
    categoryData: Array<{
        id: number;
        name: string;
        Icon: React.ComponentType<{ className?: string }>;
        colorClass: string;
        hoverClass: string;
    }>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategoryId,
    onCategoryClick,
    categoryData
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Cari kategori yang sedang aktif untuk label dropdown
    const activeCategory = categoryData.find(c => c.id === selectedCategoryId);

    const handleMobileSelect = (id: number) => {
        onCategoryClick(id);
        setIsOpen(false);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-3">
                Urutkan Berdasarkan Kategori
            </h3>

            {/* === TAMPILAN MOBILE: CUSTOM DROPDOWN === */}
            <div className="block md:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                    } bg-white`}
                >
                    <div className="flex items-center gap-2">
                        {activeCategory ? (
                            <>
                                <div className={`p-1.5 rounded-md ${activeCategory.colorClass}`}>
                                    <activeCategory.Icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-800">{activeCategory.name}</span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500">Pilih Kategori...</span>
                        )}
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {/* Opsi Reset / Semua */}
                            <button
                                onClick={() => { onCategoryClick(0); setIsOpen(false); }} // Asumsi 0 atau undefined untuk reset
                                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    !selectedCategoryId ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Semua Kategori
                            </button>

                            {/* List Kategori */}
                            {categoryData.map((cat) => {
                                const isSelected = selectedCategoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleMobileSelect(cat.id)}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                                            isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-md ${cat.colorClass}`}>
                                                <cat.Icon className="h-4 w-4" />
                                            </div>
                                            <span className={`text-sm ${isSelected ? 'font-bold text-blue-700' : 'font-medium text-gray-700'}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* === TAMPILAN DESKTOP: CHIPS (Kode Lama) === */}
            <div className="hidden md:flex flex-wrap gap-3">
                {categoryData.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryClick(cat.id)}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                                isSelected
                                    ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg scale-105'
                                    : ''
                            } ${cat.colorClass} ${cat.hoverClass}`}
                        >
                            <cat.Icon className="mr-2 h-4 w-4" />
                            {cat.name}
                            {isSelected && (
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};