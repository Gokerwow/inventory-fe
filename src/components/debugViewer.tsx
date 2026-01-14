/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/DebugViewer.tsx
import { useState } from 'react';
import { getDebugLogs, clearDebugLogs } from '../utils/debugLogger';

export const DebugViewer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState(getDebugLogs());

    const refresh = () => {
        setLogs(getDebugLogs());
    };

    const clear = () => {
        clearDebugLogs();
        setLogs([]);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    refresh();
                }}
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 z-50"
            >
                🐛 Debug Logs
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Debug Logs</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={refresh}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={clear}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs yet</p>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((log: any, index: number) => (
                                <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1">
                                        {log.timestamp}
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {log.message}
                                    </div>
                                    {log.data && (
                                        <pre className="text-xs mt-1 text-gray-700 overflow-x-auto">
                                            {JSON.stringify(log.data, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};