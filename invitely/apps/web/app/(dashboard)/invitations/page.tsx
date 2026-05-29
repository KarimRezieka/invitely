'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Mail, Trash2, ExternalLink, BarChart2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
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
  template?: { name: string; thumbnailUrl?: string };
  _count?: { rsvpResponses: number };
}

export default function InvitationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    api.get('/invitations').then((res) => {
      setInvitations(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/invitations/${id}`);
      setInvitations((prev) => prev.filter((i) => i.id !== id));
      toast({ title: 'Invitation deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Invitations</h1>
          <p className="text-zinc-500 mt-1">Manage all your wedding invitations</p>
        </div>
        <Link href="/templates">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus size={16} className="mr-2" /> New Invitation
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-amber-600" size={32} />
        </div>
      ) : invitations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="text-6xl mb-4">💍</div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No invitations yet</h3>
            <p className="text-zinc-500 mb-6">Create your first beautiful wedding invitation</p>
            <Link href="/templates">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus size={16} className="mr-2" /> Create Invitation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invitations.map((inv) => (
            <Card key={inv.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{inv.title}</h3>
                      <Badge
                        variant={inv.status === 'PUBLISHED' ? 'default' : 'outline'}
                        className={inv.status === 'PUBLISHED' ? 'bg-green-500' : ''}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {inv.groomName} & {inv.brideName}
                    </p>
                    <p className="text-sm text-zinc-400 mt-0.5">{formatDate(inv.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-blue-500" />
                    {inv.viewCount} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-green-500" />
                    {inv._count?.rsvpResponses || 0} RSVPs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/builder/${inv.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Edit Builder</Button>
                  </Link>
                  <Link href={`/invitations/${inv.id}/rsvp`}>
                    <Button variant="ghost" size="sm" title="RSVP Management">
                      <Mail size={14} />
                    </Button>
                  </Link>
                  <Link href={`/invitations/${inv.id}/analytics`}>
                    <Button variant="ghost" size="sm" title="Analytics">
                      <BarChart2 size={14} />
                    </Button>
                  </Link>
                  {inv.status === 'PUBLISHED' && (
                    <Link href={`/inv/${inv.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" title="View Public Page">
                        <ExternalLink size={14} />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(inv.id)}
                    disabled={deleting === inv.id}
                  >
                    {deleting === inv.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
