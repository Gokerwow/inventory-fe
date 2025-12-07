// CategoryFilter.tsx
import React from 'react';

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
    return (
        <div className="bg-white p-4 rounded-lg">
            <h3 className="text-base font-medium text-gray-900 mb-3">
                Urutkan Berdasarkan Kategori
            </h3>
            <div className="flex flex-wrap gap-3">
                {categoryData.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryClick(cat.id)}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
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