'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Mail, TrendingUp, ExternalLink, ArrowRight, Palette, BarChart2, Sparkles } from 'lucide-react';
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

const QUICK_ACTIONS = [
  { href: '/templates', icon: Palette, label: 'Browse Templates', desc: 'Choose from 20+ designs' },
  { href: '/analytics', icon: BarChart2, label: 'View Analytics', desc: 'Track guest engagement' },
  { href: '/billing', icon: Sparkles, label: 'Upgrade Plan', desc: 'Unlock premium features' },
];

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', background: 'var(--ink)' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
            Dashboard
          </div>
          <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', lineHeight: 1.1 }}>
            {greeting}, <span style={{ color: 'var(--gold-light)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
        <Link
          href="/templates"
          className="btn-gold"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '9px 18px', borderRadius: 8, fontSize: '0.82rem',
            fontWeight: 600, textDecoration: 'none', letterSpacing: '0.03em',
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> New Invitation
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Invitations', value: stats.total, icon: Mail, color: 'var(--gold)' },
          { label: 'Published', value: stats.published, icon: ExternalLink, color: '#6ECFA0' },
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'var(--gold-light)' },
          { label: 'RSVPs', value: stats.totalRsvps, icon: TrendingUp, color: '#B0A0E0' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card" style={{ transition: 'border-color 0.25s, box-shadow 0.25s' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-border-strong)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--gold-glow-lg)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)' }}>
                {stat.label}
              </span>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${stat.color}14`, border: `1px solid ${stat.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={13} style={{ color: stat.color }} strokeWidth={1.7} />
              </div>
            </div>
            <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--champagne)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions (shown when no invitations) ── */}
      {!loading && invitations.length === 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '1rem' }}>
            Get started
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="atelier-card"
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--gold-glow)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon size={17} color="var(--gold)" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--champagne)', fontWeight: 500 }}>{action.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>{action.desc}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--gold-dim)', marginTop: 'auto' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Invitations ── */}
      <div className="atelier-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>
            Your invitations
            {stats.total > 0 && (
              <span style={{ marginLeft: '0.625rem', fontSize: '0.72rem', color: 'var(--dust)', fontWeight: 400 }}>
                {stats.total} total
              </span>
            )}
          </h2>
          <Link href="/invitations" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : invitations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="font-display italic" style={{ fontSize: '3rem', color: 'var(--gold-dim)', opacity: 0.3, marginBottom: '1rem' }}>♡</div>
            <h3 style={{ color: 'var(--champagne)', fontSize: '1rem', marginBottom: '0.5rem' }}>No invitations yet</h3>
            <p style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Choose a template and craft your first invitation.
            </p>
            <Link
              href="/templates"
              className="btn-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '9px 18px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}
            >
              <Plus size={13} strokeWidth={2.5} /> Browse Templates
            </Link>
          </div>
        ) : (
          invitations.slice(0, 6).map((inv, idx) => (
            <div
              key={inv.id}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '0.875rem 1.5rem',
                borderBottom: idx < Math.min(invitations.length, 6) - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.03)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: 9, flexShrink: 0,
                background: 'linear-gradient(135deg, #1C170F, #2A2010)',
                border: '1px solid var(--ink-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: '1rem',
              }}>
                <span className="font-display italic" style={{ color: 'var(--gold-dim)', fontSize: '1.1rem' }}>
                  {inv.groomName.charAt(0)}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--champagne)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inv.groomName} <span className="font-display italic" style={{ color: 'var(--gold-dim)' }}>&</span> {inv.brideName}
                  </span>
                  <span className={inv.status === 'PUBLISHED' ? 'badge-published' : 'badge-muted'}>
                    {inv.status.toLowerCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--dust)', display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                  <span>{formatDate(inv.eventDate)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={10} /> {inv.viewCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Mail size={10} /> {inv._count?.rsvpResponses || 0} RSVPs
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                <Link href={`/builder/${inv.id}`}>
                  <button
                    style={{
                      padding: '5px 14px', borderRadius: 6, fontSize: '0.75rem',
                      background: 'var(--ink-surface)', border: '1px solid var(--ink-border-strong)',
                      color: 'var(--champagne)', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-dim)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-border-strong)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--champagne)';
                    }}
                  >
                    Edit
                  </button>
                </Link>
                {inv.status === 'PUBLISHED' && (
                  <Link href={`/inv/${inv.slug}`} target="_blank">
                    <button
                      style={{
                        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 6, background: 'none', border: '1px solid transparent',
                        color: 'var(--dust)', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--dust)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                      }}
                    >
                      <ExternalLink size={13} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
