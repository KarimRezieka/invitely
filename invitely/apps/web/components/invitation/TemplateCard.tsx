'use client';

/**
 * TemplateCard — renders a lifelike mini-invitation preview for each template.
 * Each style has its own visual identity so guests see exactly what they're choosing.
 */

import { Crown, ArrowRight } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnailUrl?: string;
  isPremium: boolean;
  description?: string;
  schema: {
    theme?: {
      primary?: string;
      secondary?: string;
      font?: string;
      dark?: boolean;
      rtl?: boolean;
    };
  };
}

interface Props {
  template: Template;
  onSelect: () => void;
}

// ─── Per-template mini-invitation renderers ──────────────────────────────────

function GoldenLuxuryPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #1C1508 0%, #2A1F0A 50%, #1C1508 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2, height: 2,
          borderRadius: '50%',
          background: '#C9A84C',
          opacity: 0.4 + (i % 3) * 0.2,
          top: `${10 + i * 11}%`,
          left: `${5 + i * 12}%`,
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}
      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: '1px solid #C9A84C', borderLeft: '1px solid #C9A84C', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderTop: '1px solid #C9A84C', borderRight: '1px solid #C9A84C', opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 20, height: 20, borderBottom: '1px solid #C9A84C', borderLeft: '1px solid #C9A84C', opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: '1px solid #C9A84C', borderRight: '1px solid #C9A84C', opacity: 0.6 }} />

      <div style={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: '#C9A84C', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
        Wedding Invitation
      </div>
      <div style={{ height: '0.5px', width: 50, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', marginBottom: '0.75rem' }} />
      <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.5rem', color: '#E4C47A', lineHeight: 1.15, marginBottom: '0.4rem' }}>
        Layla<br /><span style={{ fontSize: '0.7em', fontStyle: 'normal', opacity: 0.5 }}>&amp;</span><br />Karim
      </div>
      <div style={{ height: '0.5px', width: 50, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', marginTop: '0.75rem', marginBottom: '0.6rem' }} />
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: '#9E9188', textTransform: 'uppercase' }}>
        14 June 2025 · Dubai
      </div>
    </div>
  );
}

function MinimalWhitePreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FAFAFA',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem', position: 'relative',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 1, background: '#1A1A1A', marginBottom: '1rem', opacity: 0.3 }} />
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#1A1A1A', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          Layla<br />&amp; Karim
        </div>
        <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          June 14, 2025
        </div>
        <div style={{ fontSize: '0.55rem', color: '#aaa', letterSpacing: '0.06em' }}>
          Grand Ballroom, Dubai
        </div>
        <div style={{ width: 32, height: 1, background: '#1A1A1A', marginTop: '1rem', opacity: 0.3 }} />
      </div>
      <div style={{
        padding: '0.5rem 0.75rem', background: '#1A1A1A', borderRadius: 4,
        fontSize: '0.5rem', color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase',
        alignSelf: 'flex-start', marginTop: 'auto',
      }}>
        RSVP
      </div>
    </div>
  );
}

function RoseGardenPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(170deg, #FDF6F0, #F9EDE5)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative rose elements */}
      <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '3.5rem', opacity: 0.12, transform: 'rotate(-20deg)' }}>🌹</div>
      <div style={{ position: 'absolute', bottom: -10, left: -10, fontSize: '3.5rem', opacity: 0.12, transform: 'rotate(20deg)' }}>🌹</div>
      <div style={{ position: 'absolute', top: '15%', left: '-5%', fontSize: '2rem', opacity: 0.08, transform: 'rotate(-10deg)' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '20%', right: '-5%', fontSize: '2rem', opacity: 0.08, transform: 'rotate(15deg)' }}>🌸</div>

      <div style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: '#C2607A', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Together With Their Families
      </div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#8B3A5A', lineHeight: 1.2, marginBottom: '0.5rem' }}>
        Layla &amp; Karim
      </div>
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.08em', color: '#B07A8A', marginBottom: '0.75rem' }}>
        Request the pleasure of your company
      </div>
      <div style={{ height: '0.5px', width: 40, background: '#C2607A', opacity: 0.4, marginBottom: '0.75rem' }} />
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: '#C2607A', textTransform: 'uppercase' }}>
        June 14, 2025
      </div>
    </div>
  );
}

function ArabianNightsPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #1A0808, #2E1010)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.25rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Islamic geometric pattern suggestion */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg, #8B2E2E 0px, #8B2E2E 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, #8B2E2E 0px, #8B2E2E 1px, transparent 1px, transparent 8px)' }} />
      {/* Arabic crescent decoration */}
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.7 }}>☽</div>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.12em', color: '#D4A0A0', textTransform: 'uppercase', marginBottom: '0.5rem', direction: 'rtl' }}>
        بسم الله الرحمن الرحيم
      </div>
      <div style={{ height: '0.5px', width: 45, background: 'linear-gradient(90deg, transparent, #8B2E2E, transparent)', marginBottom: '0.6rem' }} />
      <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.35rem', color: '#E8A0A0', lineHeight: 1.2, marginBottom: '0.5rem' }}>
        ليلى &amp; كريم
      </div>
      <div style={{ fontSize: '0.45rem', color: '#C47A7A', letterSpacing: '0.08em' }}>
        Layla &amp; Karim
      </div>
      <div style={{ height: '0.5px', width: 45, background: 'linear-gradient(90deg, transparent, #8B2E2E, transparent)', marginTop: '0.6rem', marginBottom: '0.5rem' }} />
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.1em', color: '#906060', textTransform: 'uppercase' }}>
        14 يونيو 2025
      </div>
    </div>
  );
}

function MidnightGlamourPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#050505',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 3 === 0 ? 2 : 1,
          height: i % 3 === 0 ? 2 : 1,
          borderRadius: '50%',
          background: '#D4AF37',
          top: `${8 + i * 8}%`,
          left: `${6 + (i * 17) % 88}%`,
          opacity: 0.3 + (i % 4) * 0.15,
          animation: `glow-pulse ${2 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.25}s`,
        }} />
      ))}
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: '#D4AF37', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        ★ Black Tie ★
      </div>
      <div style={{ fontFamily: '"Cinzel", "Playfair Display", serif', fontSize: '1.35rem', color: '#D4AF37', letterSpacing: '0.06em', lineHeight: 1.2, marginBottom: '0.4rem' }}>
        LAYLA<br /><span style={{ fontSize: '0.65em', opacity: 0.5 }}>✦</span><br />KARIM
      </div>
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.16em', color: '#666', textTransform: 'uppercase', marginTop: '0.75rem' }}>
        An Evening Celebration
      </div>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.1em', color: '#444', marginTop: '0.35rem' }}>
        June 14, 2025
      </div>
    </div>
  );
}

function ModernScriptPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(170deg, #F8F9FA, #F0F4F0)',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem', position: 'relative',
    }}>
      {/* Green leaf accents */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 60, opacity: 0.12 }}>
        <div style={{ position: 'absolute', top: -5, right: -5, fontSize: '2.5rem' }}>🌿</div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.12, transform: 'rotate(180deg)' }}>
        <div style={{ fontSize: '2rem' }}>🌿</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.45rem', letterSpacing: '0.15em', color: '#2D6A4F', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.8 }}>
          You Are Invited
        </div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#1B4332', lineHeight: 1.15, marginBottom: '0.35rem' }}>
          Layla
        </div>
        <div style={{ fontSize: '0.55rem', color: '#2D6A4F', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>— and —</div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#1B4332', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Karim
        </div>
        <div style={{ width: 28, height: 1.5, background: '#2D6A4F', borderRadius: 2, opacity: 0.4, marginBottom: '0.6rem' }} />
        <div style={{ fontSize: '0.5rem', letterSpacing: '0.08em', color: '#52796F' }}>
          June 14, 2025 · Dubai
        </div>
      </div>
    </div>
  );
}

function RusticPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #F5EDD9, #EDE0C4)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'repeating-linear-gradient(90deg, #8B6914 0px, #8B6914 4px, transparent 4px, transparent 8px)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'repeating-linear-gradient(90deg, #8B6914 0px, #8B6914 4px, transparent 4px, transparent 8px)', opacity: 0.4 }} />
      <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', opacity: 0.5 }}>🌾</div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.3rem', color: '#5C3D11', lineHeight: 1.2, marginBottom: '0.5rem' }}>
        Layla &amp; Karim
      </div>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.12em', color: '#8B6914', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
        Are Getting Married
      </div>
      <div style={{ height: '0.5px', width: 40, background: '#8B6914', opacity: 0.4, margin: '0.5rem auto' }} />
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: '#A0784A', textTransform: 'uppercase' }}>
        14 June 2025
      </div>
      <div style={{ fontSize: '0.45rem', color: '#C4A060', marginTop: '0.25rem' }}>
        The Countryside Estate
      </div>
    </div>
  );
}

function BeachPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(170deg, #E8F4FD, #D0EBF5, #B8DFF0)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Wave decoration */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, opacity: 0.2 }}>
        <svg viewBox="0 0 300 30" style={{ width: '100%', height: '100%' }}>
          <path d="M0,15 C50,5 100,25 150,15 C200,5 250,25 300,15 L300,30 L0,30 Z" fill="#2196F3" />
        </svg>
      </div>
      <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', opacity: 0.6 }}>🌊</div>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.15em', color: '#0077A8', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.8 }}>
        Destination Wedding
      </div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.35rem', color: '#005577', lineHeight: 1.2, marginBottom: '0.5rem' }}>
        Layla &amp; Karim
      </div>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.1em', color: '#0099CC', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        June 14, 2025
      </div>
      <div style={{ fontSize: '0.45rem', color: '#55AACC' }}>
        Palm Jumeirah Beach
      </div>
    </div>
  );
}

// ─── Preview dispatcher ───────────────────────────────────────────────────────

const PREVIEWS: Record<string, React.FC> = {
  'golden-luxury': GoldenLuxuryPreview,
  'minimal-white': MinimalWhitePreview,
  'rose-garden': RoseGardenPreview,
  'arabian-nights': ArabianNightsPreview,
  'midnight-glamour': MidnightGlamourPreview,
  'modern-script': ModernScriptPreview,
  'rustic': RusticPreview,
  'beach': BeachPreview,
};

function getPreviewByCategory(slug: string, category: string): React.FC {
  if (PREVIEWS[slug]) return PREVIEWS[slug];
  const catMap: Record<string, React.FC> = {
    LUXURY: GoldenLuxuryPreview,
    MINIMAL: MinimalWhitePreview,
    FLORAL: RoseGardenPreview,
    ARABIC: ArabianNightsPreview,
    DARK: MidnightGlamourPreview,
    MODERN: ModernScriptPreview,
    RUSTIC: RusticPreview,
    BEACH: BeachPreview,
  };
  return catMap[category] || MinimalWhitePreview;
}

// ─── Main card ────────────────────────────────────────────────────────────────

export default function TemplateCard({ template, onSelect }: Props) {
  const PreviewComponent = getPreviewByCategory(template.slug, template.category);

  return (
    <div
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid var(--ink-border)',
        background: 'var(--ink-raised)',
        cursor: 'pointer',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.3s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5), 0 0 24px rgba(201,168,76,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--ink-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={onSelect}
    >
      {/* Mini-preview area */}
      <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
        <PreviewComponent />

        {/* Premium badge */}
        {template.isPremium && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(12,11,10,0.85)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: 999, padding: '3px 8px',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.6rem', color: '#E4C47A', fontWeight: 600, letterSpacing: '0.06em',
          }}>
            <Crown size={9} /> PREMIUM
          </div>
        )}

        {/* Hover CTA overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(12,11,10,0)',
          transition: 'background 0.25s',
          display: 'flex', alignItems: 'flex-end', padding: '1rem',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(12,11,10,0.6)';
            const btn = e.currentTarget.querySelector('.use-btn') as HTMLElement;
            if (btn) { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(12,11,10,0)';
            const btn = e.currentTarget.querySelector('.use-btn') as HTMLElement;
            if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(8px)'; }
          }}
        >
          <div className="use-btn btn-gold" style={{
            width: '100%', padding: '0.5rem', borderRadius: 8, border: 'none',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
            textAlign: 'center', opacity: 0, transform: 'translateY(8px)',
            transition: 'opacity 0.2s, transform 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Use This Template <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--ink-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--champagne)', marginBottom: '0.2rem' }}>
              {template.name}
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dust)' }}>
              {template.category.toLowerCase()}
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '1px solid var(--ink-border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold-dim)', transition: 'border-color 0.2s, color 0.2s',
          }}>
            <ArrowRight size={12} />
          </div>
        </div>
        {template.description && (
          <p style={{ fontSize: '0.72rem', color: 'var(--mist)', marginTop: '0.35rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {template.description}
          </p>
        )}
      </div>
    </div>
  );
}
