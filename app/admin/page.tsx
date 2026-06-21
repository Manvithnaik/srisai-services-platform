import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentComplaints } from '@/components/admin/RecentComplaints';
import { RecentFeedback } from '@/components/admin/RecentFeedback';

export const metadata = {
  title: 'Dashboard | SriSai Services Admin',
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentComplaints />
        <RecentFeedback />
      </div>
    </div>
  );
}
