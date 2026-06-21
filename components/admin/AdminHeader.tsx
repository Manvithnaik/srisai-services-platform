'use client';

import { useAuthContext } from '@/lib/context/AuthContext';

export function AdminHeader() {
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
