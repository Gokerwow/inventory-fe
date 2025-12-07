// NavigationTabs.tsx
import React from 'react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface NavigationTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabClick: (tabId: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
    tabs,
    activeTab,
    onTabClick
}) => {
    return (
        <nav className="flex gap-2" aria-label="Tabs">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`${
                            isActive
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } bg-white rounded-t-lg group inline-flex items-center py-4 px-2 border-b-2 font-medium text-sm`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                );
            })}
        </nav>
    );
};