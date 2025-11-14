// PRODUCTION ONLY

import { useAuth } from '../hooks/useAuth'; // <-- Import hook-nya;
import { USERNAMES } from '../constant/roles';

export default function RolePick() {
    const { user, login } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
            <h4 className="font-bold text-lg mb-2">Role Simulator</h4>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => login(USERNAMES.SUPER_ADMIN)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                    Login as SuperAdmin
                </button>
                <button
                    type="button"
                    onClick={() => login(USERNAMES.ADMIN_GUDANG)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as adminGudangUmum
                </button>
                <button
                    type="button"
                    onClick={() => login(USERNAMES.PPK)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as timPPK
                </button>
                <button
                    type="button"
                    onClick={() => login(USERNAMES.TEKNIS)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as Tim Teknis
                </button>
                <button
                    type="button"
                    onClick={() => login(USERNAMES.PENANGGUNG_JAWAB)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as Penanggung Jawab
                </button>
                <button
                    type="button"
                    onClick={() => login(USERNAMES.INSTALASI)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as instalasi
                </button>
            </div>
            <div className="mt-2 text-sm">
                {user ? (
                    <span>
                        Logged in as: <strong>{user.nama_pengguna} ({user.role})</strong>
                    </span>
                ) : (
                    <span>Logged out (Guest)</span>
                )}
            </div>
        </div>
    );
}