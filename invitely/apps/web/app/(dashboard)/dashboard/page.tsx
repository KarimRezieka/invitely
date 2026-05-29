'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Mail, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Invitation {
  id: string;
  title: string;
  slug: string;
  status: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  viewCount: number;
  template?: { name: string };
  _count?: { rsvpResponses: number };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invitations').then((res) => {
      setInvitations(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: invitations.length,
    published: invitations.filter((i) => i.status === 'PUBLISHED').length,
    totalViews: invitations.reduce((sum, i) => sum + i.viewCount, 0),
    totalRsvps: invitations.reduce((sum, i) => sum + (i._count?.rsvpResponses || 0), 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-zinc-500 mt-1">Here's an overview of your invitations</p>
        </div>
        <Link href="/templates">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus size={16} className="mr-2" /> Create Invitation
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Invitations', value: stats.total, icon: Mail, color: 'text-amber-600' },
          { label: 'Published', value: stats.published, icon: ExternalLink, color: 'text-green-600' },
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-blue-600' },
          { label: 'Total RSVPs', value: stats.totalRsvps, icon: TrendingUp, color: 'text-purple-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-amber-600" size={32} />
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No invitations yet</h3>
              <p className="text-zinc-500 mb-6">Create your first invitation to get started</p>
              <Link href="/templates">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus size={16} className="mr-2" /> Create Your First Invitation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{inv.title}</h3>
                      <Badge variant={inv.status === 'PUBLISHED' ? 'default' : 'outline'} className="text-xs">
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {inv.groomName} & {inv.brideName} · {formatDate(inv.eventDate)}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Eye size={12} /> {inv.viewCount} views</span>
                      <span className="flex items-center gap-1"><Mail size={12} /> {inv._count?.rsvpResponses || 0} RSVPs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/builder/${inv.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    {inv.status === 'PUBLISHED' && (
                      <Link href={`/inv/${inv.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
