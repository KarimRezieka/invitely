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
    <div style={{ padding: '2.5rem 2.5rem', minHeight: '100%', background: 'var(--ink)' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
            Dashboard
          </div>
          <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', lineHeight: 1.1 }}>
            Good to see you, <span style={{ color: 'var(--gold-light)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
        <Link href="/templates">
          <Button size="sm" style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> New Invitation
          </Button>
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Invitations', value: stats.total, icon: Mail },
          { label: 'Published', value: stats.published, icon: ExternalLink },
          { label: 'Total Views', value: stats.totalViews, icon: Eye },
          { label: 'RSVPs', value: stats.totalRsvps, icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dust)' }}>
                {stat.label}
              </span>
              <stat.icon size={14} style={{ color: 'var(--gold-dim)' }} />
            </div>
            <div className="font-display" style={{ fontSize: '2.25rem', color: 'var(--champagne)', lineHeight: 1 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Invitations ── */}
      <div className="atelier-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>Your Invitations</h2>
          <Link href="/invitations" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : invitations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="font-display italic" style={{ fontSize: '3rem', color: 'var(--gold-dim)', opacity: 0.4, marginBottom: '1rem' }}>♡</div>
            <h3 style={{ color: 'var(--champagne)', fontSize: '1rem', marginBottom: '0.5rem' }}>No invitations yet</h3>
            <p style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Choose a template and craft your first invitation
            </p>
            <Link href="/templates">
              <Button size="sm" style={{ padding: '0.625rem 1.25rem' }}>
                <Plus size={13} style={{ marginRight: 6 }} /> Browse Templates
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {invitations.slice(0, 6).map((inv, idx) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderBottom: idx < invitations.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Couple initial avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--ink-surface), var(--ink-raised))',
                  border: '1px solid var(--ink-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '1rem',
                }}>
                  <span className="font-display italic" style={{ color: 'var(--gold-dim)', fontSize: '1rem' }}>
                    {inv.groomName.charAt(0)}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--champagne)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.groomName} <span className="font-display italic" style={{ color: 'var(--gold-dim)' }}>&amp;</span> {inv.brideName}
                    </span>
                    <span className={inv.status === 'PUBLISHED' ? 'badge-published' : 'badge-muted'}>
                      {inv.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dust)', display: 'flex', gap: '1rem' }}>
                    <span>{formatDate(inv.eventDate)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={10} /> {inv.viewCount}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={10} /> {inv._count?.rsvpResponses || 0}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                  <Link href={`/builder/${inv.id}`}>
                    <button style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem',
                      background: 'var(--ink-surface)', border: '1px solid var(--ink-border-strong)',
                      color: 'var(--champagne)', cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-dim)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--ink-border-strong)')}
                    >
                      Edit
                    </button>
                  </Link>
                  {inv.status === 'PUBLISHED' && (
                    <Link href={`/inv/${inv.slug}`} target="_blank">
                      <button style={{
                        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 6, background: 'none', border: '1px solid transparent',
                        color: 'var(--dust)', cursor: 'pointer', transition: 'color 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--dust)'; }}
                      >
                        <ExternalLink size={13} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
