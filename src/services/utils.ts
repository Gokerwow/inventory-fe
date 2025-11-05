/**
 * Mensimulasikan panggilan API dengan jeda waktu.
 * @param data Data yang ingin dikembalikan (data dummy).
 * @param delay Waktu tunda dalam milidetik (ms).
 */
export const simulateApiCall = <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
};