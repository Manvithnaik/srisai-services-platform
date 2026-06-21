'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function RecentComplaints() {
  const { data: complaints, isLoading, error } = useQuery({
    queryKey: ['complaints', 'recent'],
    queryFn: () => apiClient.getComplaints().then((res) => res.data?.slice(0, 5)),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>
        <p className="text-red-600">Failed to load complaints</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>

      {complaints && complaints.length > 0 ? (
        <div className="space-y-3">
          {complaints.map((complaint: any) => (
            <div
              key={complaint.id}
              className="flex items-start justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{complaint.title}</p>
                <p className="text-sm text-gray-600">{complaint.name}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ml-2 ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>
          ))}
          <Link
            href="/admin/complaints"
            className="block text-center px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View All
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">No complaints yet</p>
      )}
    </div>
  );
}
