'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, BarChart2, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Stats {
  users: { total: number; newThisMonth: number; verified: number };
  invitations: { total: number; published: number; drafts: number };
  rsvps: { total: number; accepted: number };
  revenue: { mrr: number; totalRevenue: number };
  plans: { free: number; basic: number; premium: number };
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users/recent'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data);
      setRecentUsers(usersRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-zinc-500 mt-1">Platform overview and management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats?.users.total || 0, icon: Users, sub: `+${stats?.users.newThisMonth || 0} this month` },
          { label: 'Active Invitations', value: stats?.invitations.published || 0, icon: Mail, sub: `${stats?.invitations.total || 0} total` },
          { label: 'Total RSVPs', value: stats?.rsvps.total || 0, icon: BarChart2, sub: `${stats?.rsvps.accepted || 0} accepted` },
          { label: 'Plan Distribution', value: `${stats?.plans.premium || 0} Premium`, icon: TrendingUp, sub: `${stats?.plans.basic || 0} Basic · ${stats?.plans.free || 0} Free` },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{kpi.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{kpi.sub}</p>
                </div>
                <kpi.icon className="text-amber-500 opacity-80" size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-amber-600">{u.subscription?.plan || 'FREE'}</p>
                  <p className="text-xs text-zinc-400">{formatDate(u.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
