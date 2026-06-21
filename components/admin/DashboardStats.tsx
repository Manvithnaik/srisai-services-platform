'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => apiClient.getDashboardStats().then((res) => res.data),
  });

  const statCards = [
    {
      label: 'Total Complaints',
      value: stats?.totalComplaints || 0,
      icon: '📋',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Open Complaints',
      value: stats?.openComplaints || 0,
      icon: '🔴',
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Total Feedback',
      value: stats?.totalFeedback || 0,
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Gallery Images',
      value: stats?.galleryImages || 0,
      icon: '🖼️',
      color: 'bg-green-100 text-green-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-lg text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
