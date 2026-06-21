'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { data: complaint, isLoading, error } = useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => apiClient.getComplaint(complaintId).then((res) => res.data),
    enabled: showResults && !!complaintId,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId.trim()) {
      setShowResults(true);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Complaint</h1>
        <p className="text-lg text-gray-600">
          Enter your complaint ID to check the status of your complaint.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex gap-4">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter your complaint ID"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {showResults && isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Searching for your complaint...</p>
        </div>
      )}

      {/* Error State */}
      {showResults && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Complaint not found. Please check the ID and try again.
        </div>
      )}

      {/* Results */}
      {showResults && complaint && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                Complaint ID
              </h3>
              <p className="text-lg font-semibold text-gray-900">{complaint.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                Status
              </h3>
              <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                Title
              </h3>
              <p className="text-lg font-semibold text-gray-900">{complaint.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                Category
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {complaint.category.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Description
            </h3>
            <p className="text-gray-700">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Created</p>
              <p className="font-semibold">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Last Updated</p>
              <p className="font-semibold">
                {new Date(complaint.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Contact Email</p>
              <p className="font-semibold">{complaint.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
