import { useAuth } from '../context/AuthContext'; // <-- Import hook-nya

export default function RolePick() {
    const { user, login, logout } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
            <h4 className="font-bold text-lg mb-2">Role Simulator</h4>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => login('admin')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                    Login as Admin
                </button>
                <button
                    type="button"
                    onClick={() => login('user')}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                    Login as User
                </button>
                <button
                    type="button"
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                    Logout
                </button>
            </div>
            <div className="mt-2 text-sm">
                {user ? (
                    <span>
                        Logged in as: <strong>{user.name} ({user.role})</strong>
                    </span>
                ) : (
                    <span>Logged out (Guest)</span>
                )}
            </div>
        </div>
    );
}