import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
