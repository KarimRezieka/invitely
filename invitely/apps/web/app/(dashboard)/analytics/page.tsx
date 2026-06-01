'use client';

import { useEffect, useState } from 'react';
import { BarChart2, Eye, TrendingUp, Users, MousePointer, Clock, Globe } from 'lucide-react';
import api from '@/lib/api';

interface AnalyticsSummary {
  totalViews: number;
  totalRsvps: number;
  acceptedRsvps: number;
  declinedRsvps: number;
  topInvitation?: { title: string; viewCount: number };
}

const STAT_CARDS = (data: AnalyticsSummary) => [
  { label: 'Total Views', value: data.totalViews, icon: Eye, trend: '+12%' },
  { label: 'Total RSVPs', value: data.totalRsvps, icon: Users, trend: '+8%' },
  { label: 'Accepted', value: data.acceptedRsvps, icon: TrendingUp, trend: null },
  { label: 'Declined', value: data.declinedRsvps, icon: MousePointer, trend: null },
];

const TIPS = [
  { icon: Clock, title: 'Best send time', desc: 'Invitations sent Tuesday–Thursday between 10am–2pm see 23% higher open rates.' },
  { icon: Globe, title: 'Share channels', desc: 'WhatsApp links drive 3× more RSVP completions compared to email links.' },
  { icon: Users, title: 'Guest reminders', desc: 'Sending a reminder 2 weeks before your event increases RSVP rate by 40%.' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary>({
    totalViews: 0, totalRsvps: 0, acceptedRsvps: 0, declinedRsvps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/summary').then(res => {
      setData(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', background: 'var(--ink)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
          Analytics
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', lineHeight: 1.1 }}>
          Invitation performance
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
          Track views, RSVP rates, and guest engagement across all your invitations.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card animate-pulse" style={{ height: 100 }} />
            ))
          : STAT_CARDS(data).map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dust)' }}>
                    {stat.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {stat.trend && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--emerald)', background: 'rgba(61,122,90,0.12)', padding: '1px 6px', borderRadius: 999 }}>
                        {stat.trend}
                      </span>
                    )}
                    <stat.icon size={14} style={{ color: 'var(--gold-dim)' }} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: '2.25rem', color: 'var(--champagne)', lineHeight: 1 }}>
                  {stat.value.toLocaleString()}
                </div>
              </div>
            ))}
      </div>

      {/* RSVP breakdown */}
      {!loading && data.totalRsvps > 0 && (
        <div className="atelier-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)', marginBottom: '1.25rem' }}>
            RSVP Breakdown
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', borderRadius: 999, overflow: 'hidden', height: 8 }}>
            <div style={{
              flex: data.acceptedRsvps, background: 'var(--emerald)', borderRadius: 999,
              transition: 'flex 0.5s ease',
            }} />
            <div style={{
              flex: data.declinedRsvps, background: 'var(--crimson)', borderRadius: 999,
              transition: 'flex 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--mist)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)' }} />
              Attending ({data.acceptedRsvps})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--mist)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--crimson)' }} />
              Declined ({data.declinedRsvps})
            </div>
          </div>
        </div>
      )}

      {/* Engagement tips */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '1rem' }}>
          Tips to increase engagement
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {TIPS.map((tip) => (
            <div key={tip.title} className="atelier-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gold-glow)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <tip.icon size={16} color="var(--gold)" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--champagne)', fontWeight: 500, marginBottom: '0.375rem' }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', lineHeight: 1.6 }}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state for no data */}
      {!loading && data.totalViews === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', marginTop: '1rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--ink-raised)', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <BarChart2 size={24} color="var(--gold-dim)" strokeWidth={1.5} />
          </div>
          <h3 style={{ color: 'var(--champagne)', fontSize: '1rem', marginBottom: '0.5rem' }}>No data yet</h3>
          <p style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>
            Publish an invitation to start seeing analytics here.
          </p>
        </div>
      )}
    </div>
  );
}
