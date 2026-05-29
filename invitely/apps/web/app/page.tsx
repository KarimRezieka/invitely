import Link from 'next/link';

const FEATURES = [
  {
    num: '01',
    title: 'Curated Templates',
    desc: 'Twenty bespoke designs spanning Luxury, Floral, Arabic, Dark Glamour, and Modern Minimal — each crafted by professional designers.',
  },
  {
    num: '02',
    title: 'Live Builder',
    desc: 'Drag, rearrange, and preview every section in real time. Your invitation is always one click from perfection.',
  },
  {
    num: '03',
    title: 'Intelligent RSVP',
    desc: 'A multi-step guest experience with meal preferences, plus-ones, and live dashboard — all delivered instantly.',
  },
  {
    num: '04',
    title: 'Deep Analytics',
    desc: 'Know exactly who opened your invitation, from which device, and through which channel. Beautifully visualised.',
  },
];

const PLANS = [
  {
    name: 'Complimentary',
    price: '$0',
    period: 'forever',
    features: ['1 invitation', '50 guests', 'Free templates', 'RSVP collection'],
    cta: 'Begin',
    href: '/register',
    accent: false,
  },
  {
    name: 'Essential',
    price: '$9',
    period: 'per month',
    features: ['3 invitations', '200 guests', 'All templates', 'CSV export', 'Email notifications'],
    cta: 'Choose Essential',
    href: '/register',
    accent: true,
  },
  {
    name: 'Prestige',
    price: '$19',
    period: 'per month',
    features: ['Unlimited invitations', 'Unlimited guests', 'Custom domain', 'Priority support', 'Advanced analytics'],
    cta: 'Choose Prestige',
    href: '/register',
    accent: false,
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--ink)', color: 'var(--champagne)', minHeight: '100vh' }}>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid var(--ink-border)' }} className="flex items-center justify-between px-8 md:px-16 py-5">
        <span className="font-display text-2xl" style={{ color: 'var(--gold-light)', letterSpacing: '-0.01em' }}>
          Invitely
        </span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm transition-colors duration-200"
            style={{ color: 'var(--mist)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}>
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-gold text-sm px-5 py-2.5 rounded-lg"
          >
            Begin Your Story
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-8 md:px-16 pt-28 pb-36 text-center">
        {/* Radial glow backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(201,168,76,0.09) 0%, transparent 70%)',
          }}
        />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0s', opacity: 0 }}>
          <div style={{ height: '1px', width: '40px', background: 'var(--gold-dim)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            Premium Digital Invitations
          </span>
          <div style={{ height: '1px', width: '40px', background: 'var(--gold-dim)' }} />
        </div>

        {/* Headline */}
        <h1
          className="font-display animate-fade-up"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            animationDelay: '0.12s',
            opacity: 0,
          }}
        >
          <span style={{ color: 'var(--champagne)' }}>Every great love</span>
          <br />
          <span className="gold-gradient font-display italic">deserves a great invitation.</span>
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-up mx-auto mt-8 text-lg leading-relaxed"
          style={{ maxWidth: 540, color: 'var(--mist)', animationDelay: '0.24s', opacity: 0 }}
        >
          Craft breathtaking digital wedding invitations with our luxury builder.
          Seamless RSVP collection, real-time analytics, and templates that astonish.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-up" style={{ animationDelay: '0.36s', opacity: 0 }}>
          <Link href="/register" className="btn-gold px-8 py-4 rounded-xl text-sm font-semibold inline-block" style={{ letterSpacing: '0.04em' }}>
            Create Your Invitation — Free
          </Link>
          <Link href="/register" className="btn-ghost px-8 py-4 rounded-xl text-sm inline-block">
            View Templates
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-xs animate-fade-up" style={{ color: 'var(--dust)', animationDelay: '0.48s', opacity: 0, letterSpacing: '0.06em' }}>
          TRUSTED BY <span style={{ color: 'var(--gold)' }}>12,000+</span> COUPLES WORLDWIDE
        </p>

        {/* Floating card preview */}
        <div
          className="animate-float mx-auto mt-20 animate-fade-up"
          style={{
            maxWidth: 380,
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          <div
            className="atelier-card text-left overflow-hidden"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px var(--gold-glow-lg)' }}
          >
            <div
              style={{
                background: 'linear-gradient(160deg, #1C170F, #2A2010)',
                padding: '2rem',
                borderBottom: '1px solid var(--ink-border)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.12), transparent)' }} />
              <div className="relative text-center">
                <div style={{ color: 'var(--gold-dim)', fontSize: '0.7rem', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>WEDDING INVITATION</div>
                <div className="font-display italic" style={{ fontSize: '2.2rem', color: 'var(--gold-light)', lineHeight: 1.2 }}>
                  Layla<br />&amp; Karim
                </div>
                <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginTop: '0.75rem', letterSpacing: '0.08em' }}>
                  SATURDAY, 14 JUNE 2025 · DUBAI
                </div>
              </div>
            </div>
            <div style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--dust)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Venue</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--champagne)', marginTop: '2px' }}>Atlantis The Palm</div>
              </div>
              <div
                className="btn-gold"
                style={{ padding: '6px 16px', borderRadius: 6, fontSize: '0.75rem', letterSpacing: '0.04em' }}
              >
                RSVP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--ink-border)' }} className="px-8 md:px-16 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex items-end justify-between flex-wrap gap-6">
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--champagne)', lineHeight: 1.1 }}>
              Everything you need<br />
              <span className="gold-gradient italic">to create magic.</span>
            </h2>
            <p style={{ maxWidth: 320, color: 'var(--mist)', fontSize: '0.95rem' }}>
              A complete platform designed around the most important day of your life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px" style={{ background: 'var(--ink-border)' }}>
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="group"
                style={{
                  background: 'var(--ink)',
                  padding: '2.5rem',
                  transition: 'background 0.25s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-raised)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
              >
                <div className="font-display" style={{ fontSize: '3rem', color: 'var(--ink-border-strong)', lineHeight: 1, marginBottom: '1.25rem' }}>
                  {f.num}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--champagne)', marginBottom: '0.75rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--ink-border)' }} className="px-8 md:px-16 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="ornament mb-6 text-xs tracking-widest uppercase" style={{ color: 'var(--gold-dim)', fontSize: '0.65rem' }}>
              Pricing
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--champagne)' }}>
              Begin free.<br />
              <span className="gold-gradient italic">Grow without limits.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="atelier-card flex flex-col"
                style={plan.accent ? {
                  borderColor: 'rgba(201,168,76,0.35)',
                  boxShadow: '0 0 40px var(--gold-glow-lg)',
                  position: 'relative',
                } : {}}
              >
                {plan.accent && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                  }} />
                )}
                <div style={{ padding: '2rem 2rem 1.5rem' }}>
                  {plan.accent && (
                    <div className="badge-gold mb-3" style={{ display: 'inline-block' }}>Most chosen</div>
                  )}
                  <div style={{ color: 'var(--mist)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display" style={{ fontSize: '3rem', color: plan.accent ? 'var(--gold-light)' : 'var(--champagne)', lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ color: 'var(--dust)', fontSize: '0.8rem' }}>/ {plan.period}</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--ink-border)', margin: '0 2rem' }} />

                <ul style={{ padding: '1.5rem 2rem', flex: 1, listStyle: 'none' }} className="space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3" style={{ fontSize: '0.875rem', color: 'var(--mist)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="var(--gold-dim)" strokeWidth="1"/>
                        <path d="M4 7l2 2 4-4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div style={{ padding: '0 2rem 2rem' }}>
                  <Link
                    href={plan.href}
                    className={plan.accent ? 'btn-gold' : 'btn-ghost'}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--ink-border)' }} className="px-8 md:px-16 py-28">
        <div
          className="max-w-4xl mx-auto text-center rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1C170F, #241C0E)', border: '1px solid rgba(201,168,76,0.2)', padding: '4rem 2rem' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(201,168,76,0.1), transparent)' }} />
          <div className="relative">
            <div className="font-display italic" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: 'var(--champagne)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Your love story begins<br />
              <span className="gold-gradient">with a single invitation.</span>
            </div>
            <p style={{ color: 'var(--mist)', marginBottom: '2.5rem', fontSize: '1rem' }}>
              No credit card required. Set up in under 5 minutes.
            </p>
            <Link href="/register" className="btn-gold px-10 py-4 rounded-xl text-sm font-semibold inline-block" style={{ letterSpacing: '0.04em' }}>
              Start For Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--ink-border)', padding: '2rem 4rem' }} className="flex items-center justify-between flex-wrap gap-4">
        <span className="font-display" style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>Invitely</span>
        <p style={{ color: 'var(--dust)', fontSize: '0.8rem', letterSpacing: '0.06em' }}>
          © 2025 INVITELY · ALL RIGHTS RESERVED
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--dust)', fontSize: '0.8rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust)')}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
