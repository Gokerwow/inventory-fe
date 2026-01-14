// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const log = { timestamp, message, data };
    
    // Log ke console
    console.log(`[DEBUG ${timestamp}]`, message, data);
    
    // Simpan ke sessionStorage
    const logs = JSON.parse(sessionStorage.getItem('debug_logs') || '[]');
    logs.push(log);
    
    // Batasi hanya 50 log terakhir
    if (logs.length > 50) {
        logs.shift();
    }
    
    sessionStorage.setItem('debug_logs', JSON.stringify(logs));
};

export const getDebugLogs = () => {
    return JSON.parse(sessionStorage.getItem('debug_logs') || '[]');
};

export const clearDebugLogs = () => {
    sessionStorage.removeItem('debug_logs');
};