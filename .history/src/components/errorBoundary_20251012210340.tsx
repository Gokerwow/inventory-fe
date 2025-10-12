// components/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Oops! Terjadi Error
                </h2>
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-800 font-semibold">Error:</p>
                    <p className="text-red-600 text-sm mt-2">{error.message}</p>
                </div>
                <details className="mb-4">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {error.stack}
                    </pre>
                </details>
                <button
                    onClick={resetErrorBoundary}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, errorInfo) => {
                // Log error ke console atau service logging (Sentry, LogRocket, dll)
                console.error('Error caught by boundary:', error, errorInfo);
            }}
            onReset={() => {
                // Reset state aplikasi jika perlu
                window.location.href = '/';
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
}