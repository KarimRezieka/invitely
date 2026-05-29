'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>({ users: [], total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '10' });
      if (s) params.set('search', s);
      const res = await api.get(`/admin/users?${params}`);
      setData(res.data);
    } catch {
      toast({ title: 'Error loading users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1, search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [page]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/admin/users/${userId}`, { role });
      fetchUsers();
      toast({ title: 'Role updated' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">User Management</h1>
          <p className="text-zinc-500 mt-1">{data.total} total users</p>
        </div>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-amber-600" size={32} />
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-zinc-100 dark:border-zinc-800">
                <tr className="text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-6">User</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Invitations</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u: any) => (
                  <tr key={u.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-zinc-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">{u.subscription?.plan || 'FREE'}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'} className={u.role === 'ADMIN' ? 'bg-amber-500' : ''}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600">{u._count?.invitations || 0}</td>
                    <td className="py-3 px-4 text-sm text-zinc-500">{formatDate(u.createdAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        className="text-xs border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-800"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Page {page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
