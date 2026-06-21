'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export default function FeedbackPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedback', selectedStatus],
    queryFn: () =>
      apiClient.getFeedback(selectedStatus).then((res) => res.data || []),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; status: string }) =>
      apiClient.updateFeedbackStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
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

  const statuses = ['pending', 'approved', 'rejected'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Feedback Management</h1>
        <p className="text-gray-600">Review and manage customer feedback.</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus(undefined)}
          className={`px-4 py-2 rounded font-medium transition ${
            selectedStatus === undefined
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded font-medium transition ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Failed to load feedback
        </div>
      )}

      {/* Feedback Cards */}
      {feedback && feedback.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {feedback.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.email}</p>
                  <p className="text-lg text-yellow-600 mt-1">{renderStars(item.rating)}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{item.message}</p>

              <div className="flex gap-2">
                {item.status !== 'approved' && (
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        status: 'approved',
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Approve
                  </button>
                )}
                {item.status !== 'rejected' && (
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        status: 'rejected',
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Received: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">No feedback found</p>
        </div>
      )}
    </div>
  );
}
