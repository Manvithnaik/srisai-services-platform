'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function RecentFeedback() {
  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedback', 'recent'],
    queryFn: () => apiClient.getFeedback('pending').then((res) => res.data?.slice(0, 5)),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h3>
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h3>
        <p className="text-red-600">Failed to load feedback</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h3>

      {feedback && feedback.length > 0 ? (
        <div className="space-y-3">
          {feedback.map((item: any) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-yellow-600 mb-1">
                  {renderStars(item.rating)}
                </p>
                <p className="text-sm text-gray-600 truncate">{item.message}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ml-2 ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          ))}
          <Link
            href="/admin/feedback"
            className="block text-center px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View All
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">No pending feedback</p>
      )}
    </div>
  );
}
