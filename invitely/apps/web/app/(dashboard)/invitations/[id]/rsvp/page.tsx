'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download, Loader2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface RSVPStats {
  total: number;
  accepted: number;
  declined: number;
  pending: number;
  totalGuests: number;
}

interface RSVP {
  id: string;
  guestName: string;
  guestEmail?: string;
  status: string;
  guestCount: number;
  mealPreference: string;
  notes?: string;
  isConfirmed: boolean;
  createdAt: string;
}

export default function RSVPManagementPage() {
  const params = useParams();
  const { toast } = useToast();
  const invitationId = params.id as string;
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([
      api.get(`/rsvp/${invitationId}`),
      api.get(`/rsvp/${invitationId}/stats`),
    ]).then(([rsvpRes, statsRes]) => {
      setRsvps(rsvpRes.data);
      setStats(statsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [invitationId]);

  const handleExport = async () => {
    try {
      const res = await api.get(`/rsvp/${invitationId}/export`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `rsvps-${invitationId}.csv`;
      a.click();
    } catch {
      toast({ title: 'Export failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (rsvpId: string) => {
    if (!confirm('Delete this RSVP?')) return;
    try {
      await api.delete(`/rsvp/${rsvpId}`);
      setRsvps((prev) => prev.filter((r) => r.id !== rsvpId));
      toast({ title: 'RSVP deleted' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const filtered = filter === 'ALL' ? rsvps : rsvps.filter((r) => r.status === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">RSVP Management</h1>
          <p className="text-zinc-500 mt-1">Manage guest responses for this invitation</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download size={14} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total RSVPs', value: stats.total, color: 'text-zinc-900' },
            { label: 'Attending', value: stats.accepted, color: 'text-green-600' },
            { label: 'Declined', value: stats.declined, color: 'text-red-600' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Total Guests', value: stats.totalGuests, color: 'text-blue-600' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['ALL', 'ACCEPTED', 'DECLINED', 'PENDING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-amber-600" size={32} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">No RSVPs found</div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-zinc-100 dark:border-zinc-800">
                <tr className="text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-6">Guest</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Guests</th>
                  <th className="text-left py-3 px-4">Meal</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="py-3 px-6">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{rsvp.guestName}</p>
                      {rsvp.guestEmail && <p className="text-xs text-zinc-500">{rsvp.guestEmail}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={rsvp.status === 'ACCEPTED' ? 'default' : rsvp.status === 'DECLINED' ? 'destructive' : 'secondary'}
                        className={rsvp.status === 'ACCEPTED' ? 'bg-green-500' : rsvp.status === 'DECLINED' ? 'bg-red-500' : ''}
                      >
                        {rsvp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600">{rsvp.guestCount}</td>
                    <td className="py-3 px-4 text-sm text-zinc-500 capitalize">{rsvp.mealPreference.toLowerCase()}</td>
                    <td className="py-3 px-4 text-sm text-zinc-500">{formatDate(rsvp.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(rsvp.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
