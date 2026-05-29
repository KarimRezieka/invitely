'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Crown, Eye, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  isPremium: boolean;
}

const CATEGORIES = ['All', 'LUXURY', 'MINIMAL', 'FLORAL', 'ARABIC', 'DARK', 'MODERN', 'RUSTIC', 'BEACH'];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category !== 'All') params.set('category', category);

    api.get(`/templates?${params}`).then((res) => {
      setTemplates(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [debouncedSearch, category]);

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', background: 'var(--ink)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
          Template Gallery
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', lineHeight: 1.1 }}>
          Choose your canvas
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '0 0 220px' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dust)', pointerEvents: 'none' }} />
          <Input
            placeholder="Search…"
            className="atelier-input"
            style={{ paddingLeft: '2.25rem', height: 36, fontSize: '0.8rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ height: '1px', width: 1, background: 'var(--ink-border)', margin: '0 0.25rem' }} />
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '5px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500,
                border: category === cat ? '1px solid var(--gold)' : '1px solid var(--ink-border-strong)',
                background: category === cat ? 'var(--gold-glow)' : 'transparent',
                color: category === cat ? 'var(--gold-light)' : 'var(--mist)',
                cursor: 'pointer', transition: 'all 0.15s',
                letterSpacing: '0.03em',
              }}
            >
              {cat === 'All' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ink-border)', background: 'var(--ink-raised)' }}>
              <div style={{ aspectRatio: '3/4', background: 'var(--ink-surface)' }} className="animate-pulse" />
              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ height: 12, borderRadius: 4, background: 'var(--ink-surface)', width: '70%' }} className="animate-pulse" />
                <div style={{ height: 10, borderRadius: 4, background: 'var(--ink-surface)', width: '40%' }} className="animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div className="font-display italic" style={{ fontSize: '3rem', color: 'var(--gold-dim)', opacity: 0.3, marginBottom: '1rem' }}>?</div>
          <h3 style={{ color: 'var(--champagne)', fontSize: '1rem', marginBottom: '0.5rem' }}>No templates found</h3>
          <p style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>Try a different search or category filter</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {templates.map((template) => (
            <div
              key={template.id}
              className="group"
              style={{
                borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--ink-border)',
                background: 'var(--ink-raised)',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4), 0 0 20px var(--gold-glow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--ink-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div style={{ aspectRatio: '3/4', background: 'var(--ink-surface)', position: 'relative', overflow: 'hidden' }}>
                {template.thumbnailUrl ? (
                  <img src={template.thumbnailUrl} alt={template.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Template preview mockup */}
                    <div style={{
                      width: '70%',
                      background: 'linear-gradient(160deg, #231C0F, #1A1508)',
                      borderRadius: 8, padding: '1.5rem 1rem', textAlign: 'center',
                      border: '1px solid rgba(201,168,76,0.15)',
                    }}>
                      <div style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--gold-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Invitation
                      </div>
                      <div className="font-display italic" style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
                        {template.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(12,11,10,0.75)',
                  opacity: 0, transition: 'opacity 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
                  className="template-overlay"
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <button
                    onClick={() => router.push(`/invitations/new?template=${template.id}`)}
                    className="btn-gold"
                    style={{ padding: '8px 16px', borderRadius: 8, fontSize: '0.78rem', border: 'none' }}
                  >
                    Use Template
                  </button>
                </div>

                {/* Hover overlay trigger wrapper */}
                <div
                  style={{ position: 'absolute', inset: 0 }}
                  onMouseEnter={e => {
                    const overlay = e.currentTarget.previousElementSibling as HTMLElement;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    const overlay = e.currentTarget.previousElementSibling as HTMLElement;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                />

                {template.isPremium && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Crown size={9} /> Premium
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '0.875rem 1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--champagne)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {template.name}
                </div>
                <span className="badge-muted">{template.category.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
