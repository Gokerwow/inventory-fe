import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export default function Card({ children, className = "", title, action }: CardProps) {
    return (
        <div className={`bg-white p-6 border-2 border-white rounded-lg shadow-md flex flex-col ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-sm font-bold text-gray-700">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}