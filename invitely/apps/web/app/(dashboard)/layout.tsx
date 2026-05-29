import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--ink)' }}>
        <DashboardNav />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--ink)' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
