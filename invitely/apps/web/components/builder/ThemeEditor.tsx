'use client';

/**
 * ThemeEditor — full visual customization panel for colors, fonts, backgrounds, and music.
 * This is what gives the client complete control over their invitation.
 */

import { useState } from 'react';
import { Music, Palette, Type, Image, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

const WEDDING_FONTS = [
  { label: 'Playfair Display', value: 'Playfair Display', style: 'serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond', style: 'serif' },
  { label: 'Great Vibes', value: 'Great Vibes', style: 'script' },
  { label: 'Dancing Script', value: 'Dancing Script', style: 'script' },
  { label: 'Cinzel', value: 'Cinzel', style: 'serif' },
  { label: 'DM Serif Display', value: 'DM Serif Display', style: 'serif' },
  { label: 'Libre Baskerville', value: 'Libre Baskerville', style: 'serif' },
  { label: 'Raleway', value: 'Raleway', style: 'sans' },
  { label: 'Lato', value: 'Lato', style: 'sans' },
  { label: 'Montserrat', value: 'Montserrat', style: 'sans' },
];

const PRESET_PALETTES = [
  { name: 'Gold & Ivory', primary: '#C9A84C', secondary: '#F5EDD9', accent: '#8B6E32' },
  { name: 'Rose Gold', primary: '#C2607A', secondary: '#FDF6F0', accent: '#8B3A5A' },
  { name: 'Midnight', primary: '#D4AF37', secondary: '#050505', accent: '#9B7D35' },
  { name: 'Sage & Cream', primary: '#2D6A4F', secondary: '#F8F9FA', accent: '#1B4332' },
  { name: 'Dusty Blue', primary: '#4A7FA5', secondary: '#EEF4F8', accent: '#2C5F7A' },
  { name: 'Burgundy', primary: '#722F37', secondary: '#FFF8F5', accent: '#4A1A22' },
  { name: 'Lavender', primary: '#7C6FA0', secondary: '#F8F5FF', accent: '#5A4D7A' },
  { name: 'Terracotta', primary: '#C46B4A', secondary: '#FDF4EE', accent: '#8B4228' },
];

const BACKGROUND_TYPES = [
  { value: 'solid', label: 'Solid Color' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Photo Background' },
  { value: 'pattern', label: 'Pattern' },
];

const PATTERNS = [
  { value: 'none', label: 'None' },
  { value: 'floral', label: 'Floral' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'dots', label: 'Dots' },
  { value: 'arabesque', label: 'Arabesque' },
];

interface ThemeState {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  backgroundType: string;
  backgroundImage?: string;
  pattern: string;
  dark: boolean;
  musicUrl?: string;
  musicAutoplay: boolean;
  rtl: boolean;
}

interface Props {
  theme: Partial<ThemeState>;
  onChange: (updates: Partial<ThemeState>) => void;
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--ink-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '0.875rem 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--champagne)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <Icon size={14} style={{ color: 'var(--gold-dim)' }} />
          {title}
        </div>
        {open ? <ChevronUp size={13} style={{ color: 'var(--dust)' }} /> : <ChevronDown size={13} style={{ color: 'var(--dust)' }} />}
      </button>
      {open && (
        <div style={{ padding: '0 1rem 1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ColorSwatch({ color, label, onChange }: { color: string; label: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
      <label style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: color,
          border: '2px solid var(--ink-border-strong)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }} />
        <input
          type="color"
          value={color}
          onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
      </label>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--champagne)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--dust)', fontFamily: 'monospace' }}>{color}</div>
      </div>
    </div>
  );
}

export default function ThemeEditor({ theme, onChange }: Props) {
  const t = {
    primary: '#C9A84C',
    secondary: '#F5EDD9',
    accent: '#8B6E32',
    font: 'Playfair Display',
    backgroundType: 'solid',
    pattern: 'none',
    dark: false,
    musicAutoplay: false,
    rtl: false,
    ...theme,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--ink-border)' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '0.25rem' }}>
          Customize
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>
          Theme &amp; Style
        </div>
      </div>

      {/* Color Presets */}
      <Section title="Color Palette" icon={Palette}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', marginBottom: '1rem' }}>
          {PRESET_PALETTES.map(p => (
            <button
              key={p.name}
              onClick={() => onChange({ primary: p.primary, secondary: p.secondary, accent: p.accent })}
              style={{
                padding: '0.5rem', borderRadius: 8,
                border: `1px solid ${t.primary === p.primary ? 'var(--gold)' : 'var(--ink-border)'}`,
                background: t.primary === p.primary ? 'var(--gold-glow)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.primary }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.secondary, border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--mist)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.name}
              </span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '0.625rem' }}>
          Custom Colors
        </div>
        <ColorSwatch color={t.primary} label="Primary" onChange={v => onChange({ primary: v })} />
        <ColorSwatch color={t.secondary} label="Background" onChange={v => onChange({ secondary: v })} />
        <ColorSwatch color={t.accent || '#8B6E32'} label="Accent" onChange={v => onChange({ accent: v })} />

        <div style={{ marginTop: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)' }}>
            <div
              onClick={() => onChange({ dark: !t.dark })}
              style={{
                width: 36, height: 20, borderRadius: 10,
                background: t.dark ? 'var(--gold)' : 'var(--ink-surface)',
                border: '1px solid var(--ink-border-strong)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: t.dark ? 18 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: t.dark ? 'var(--ink)' : 'var(--dust)',
                transition: 'left 0.2s',
              }} />
            </div>
            Dark theme
          </label>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" icon={Type}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '0.625rem' }}>
          Display Font
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {WEDDING_FONTS.map(f => (
            <button
              key={f.value}
              onClick={() => onChange({ font: f.value })}
              style={{
                padding: '0.5rem 0.75rem', borderRadius: 8, textAlign: 'left',
                border: `1px solid ${t.font === f.value ? 'var(--gold)' : 'var(--ink-border)'}`,
                background: t.font === f.value ? 'var(--gold-glow)' : 'transparent',
                cursor: 'pointer', transition: 'border-color 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span style={{ fontFamily: `"${f.value}", serif`, fontSize: '0.875rem', color: 'var(--champagne)' }}>
                {f.label}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--dust)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {f.style}
              </span>
            </button>
          ))}
        </div>

        {/* RTL toggle */}
        <div style={{ marginTop: '0.875rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)' }}>
            <div
              onClick={() => onChange({ rtl: !t.rtl })}
              style={{
                width: 36, height: 20, borderRadius: 10,
                background: t.rtl ? 'var(--gold)' : 'var(--ink-surface)',
                border: '1px solid var(--ink-border-strong)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: t.rtl ? 18 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: t.rtl ? 'var(--ink)' : 'var(--dust)',
                transition: 'left 0.2s',
              }} />
            </div>
            Right-to-Left (Arabic)
          </label>
        </div>
      </Section>

      {/* Background */}
      <Section title="Background" icon={Image}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', marginBottom: '0.875rem' }}>
          {BACKGROUND_TYPES.map(bt => (
            <button
              key={bt.value}
              onClick={() => onChange({ backgroundType: bt.value })}
              style={{
                padding: '0.5rem', borderRadius: 8, fontSize: '0.72rem',
                border: `1px solid ${t.backgroundType === bt.value ? 'var(--gold)' : 'var(--ink-border)'}`,
                background: t.backgroundType === bt.value ? 'var(--gold-glow)' : 'transparent',
                color: t.backgroundType === bt.value ? 'var(--gold-light)' : 'var(--mist)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {bt.label}
            </button>
          ))}
        </div>

        {t.backgroundType === 'image' && (
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--dust)', marginBottom: '0.5rem' }}>Background image URL</div>
            <input
              type="url"
              value={t.backgroundImage || ''}
              onChange={e => onChange({ backgroundImage: e.target.value })}
              placeholder="https://..."
              className="atelier-input"
              style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.78rem', borderRadius: 8 }}
            />
          </div>
        )}

        {t.backgroundType === 'pattern' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
            {PATTERNS.map(p => (
              <button
                key={p.value}
                onClick={() => onChange({ pattern: p.value })}
                style={{
                  padding: '0.45rem', borderRadius: 6, fontSize: '0.7rem',
                  border: `1px solid ${t.pattern === p.value ? 'var(--gold)' : 'var(--ink-border)'}`,
                  background: t.pattern === p.value ? 'var(--gold-glow)' : 'transparent',
                  color: t.pattern === p.value ? 'var(--gold-light)' : 'var(--mist)',
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Music */}
      <Section title="Background Music" icon={Music} defaultOpen={false}>
        <div style={{ marginBottom: '0.875rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--dust)', marginBottom: '0.5rem' }}>
            Music URL (Spotify, YouTube, SoundCloud, or direct MP3)
          </div>
          <input
            type="url"
            value={t.musicUrl || ''}
            onChange={e => onChange({ musicUrl: e.target.value })}
            placeholder="https://..."
            className="atelier-input"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.78rem', borderRadius: 8 }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)' }}>
          <div
            onClick={() => onChange({ musicAutoplay: !t.musicAutoplay })}
            style={{
              width: 36, height: 20, borderRadius: 10,
              background: t.musicAutoplay ? 'var(--gold)' : 'var(--ink-surface)',
              border: '1px solid var(--ink-border-strong)',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: t.musicAutoplay ? 18 : 2,
              width: 14, height: 14, borderRadius: '50%',
              background: t.musicAutoplay ? 'var(--ink)' : 'var(--dust)',
              transition: 'left 0.2s',
            }} />
          </div>
          {t.musicAutoplay ? <Volume2 size={13} /> : <VolumeX size={13} />}
          Autoplay on open
        </label>

        {t.musicUrl && (
          <div style={{ marginTop: '0.75rem', padding: '0.625rem', background: 'var(--ink-surface)', borderRadius: 8, border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={12} style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--champagne)' }}>Music added</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--dust)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                {t.musicUrl}
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
