'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Check, Star, Sparkles, Zap, BarChart2, Layers } from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    icon: Layers,
    title: 'Curated Templates',
    desc: 'Twenty bespoke designs spanning Luxury, Floral, Arabic, Dark Glamour, and Modern Minimal — each crafted by professional designers.',
  },
  {
    num: '02',
    icon: Zap,
    title: 'Live Builder',
    desc: 'Drag, rearrange, and preview every section in real time. Your invitation is always one click from perfection.',
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'Intelligent RSVP',
    desc: 'A multi-step guest experience with meal preferences, plus-ones, and live dashboard — all delivered instantly.',
  },
  {
    num: '04',
    icon: BarChart2,
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
    cta: 'Begin Free',
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

const TESTIMONIALS = [
  {
    quote: 'Our guests were blown away. We received over 40 messages about how beautiful our digital invitation was.',
    name: 'Layla & Karim',
    detail: 'Dubai, UAE · Luxury template',
    rating: 5,
  },
  {
    quote: 'The RSVP system saved us hours of chasing down guests. Everything was organised in one beautiful dashboard.',
    name: 'Sophia & James',
    detail: 'London, UK · Rose Garden template',
    rating: 5,
  },
  {
    quote: 'I never imagined our wedding could have such a stunning digital presence. The builder is incredibly intuitive.',
    name: 'Amira & Faisal',
    detail: 'Riyadh, KSA · Arabian Nights template',
    rating: 5,
  },
];

const TEMPLATE_PREVIEWS = [
  { name: 'Golden Luxury', tag: 'LUXURY', bg: 'linear-gradient(160deg, #1C170F, #2A2010)', accent: '#C9A84C', text: '#E4C47A' },
  { name: 'Midnight Glamour', tag: 'DARK', bg: 'linear-gradient(160deg, #0A0A12, #12101E)', accent: '#9B8EC4', text: '#C8C0E8' },
  { name: 'Rose Garden', tag: 'FLORAL', bg: 'linear-gradient(160deg, #2A1A1A, #1E1518)', accent: '#D4909A', text: '#E8C4C8' },
  { name: 'Arabian Nights', tag: 'ARABIC', bg: 'linear-gradient(160deg, #1A0A0A, #2A1010)', accent: '#D4A844', text: '#E8C870' },
];

const STATS = [
  { value: '12,000+', label: 'Couples worldwide' },
  { value: '50+', label: 'Bespoke templates' },
  { value: '4.9 / 5', label: 'Average rating' },
  { value: '98%', label: 'RSVP open rate' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--ink)', color: 'var(--champagne)', minHeight: '100vh' }}>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '0 2rem',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: scrolled ? '1px solid var(--ink-border)' : '1px solid transparent',
          background: scrolled ? 'rgba(12,11,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ color: 'var(--gold-light)', fontSize: '1.4rem', letterSpacing: '-0.01em' }}>
            Invitely
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="hidden md:flex items-center gap-6">
            {['Templates', 'Features', 'Pricing'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{ color: 'var(--mist)', fontSize: '0.85rem', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
              >
                {item}
              </a>
            ))}
          </div>
          <div style={{ width: 1, height: 16, background: 'var(--ink-border-strong)' }} className="hidden md:block" />
          <Link
            href="/login"
            style={{ color: 'var(--mist)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--mist)')}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-gold"
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.82rem', letterSpacing: '0.03em', textDecoration: 'none' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: '10rem', paddingBottom: '6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Multi-layer radial backdrop */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', maxWidth: 900, background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 60%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '15%', right: '8%', width: 250, height: 250, background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>

        {/* Floating dot particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: 'var(--gold-dim)',
              opacity: 0.3 + (i % 4) * 0.1,
              left: `${10 + (i * 7.2) % 80}%`,
              top: `${5 + (i * 11.3) % 60}%`,
              animation: `float ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 2rem' }}>
          {/* Eyebrow pill */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 999, padding: '5px 16px', marginBottom: '2.5rem',
              animationDelay: '0s', opacity: 0,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', boxShadow: '0 0 8px var(--gold)' }} />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
              Premium Digital Invitations
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display animate-fade-up"
            style={{
              fontSize: 'clamp(2.8rem, 7.5vw, 7rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.025em',
              animationDelay: '0.1s', opacity: 0,
            }}
          >
            <span style={{ color: 'var(--champagne)', display: 'block' }}>Every great love</span>
            <span className="gold-gradient font-display italic">deserves a great invitation.</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up"
            style={{
              maxWidth: 520, margin: '2rem auto 0',
              color: 'var(--mist)', fontSize: '1.05rem', lineHeight: 1.75,
              animationDelay: '0.2s', opacity: 0,
            }}
          >
            Craft breathtaking digital wedding invitations with our luxury builder.
            Seamless RSVP collection, real-time analytics, and templates that astonish.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up"
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem',
              marginTop: '2.5rem',
              animationDelay: '0.3s', opacity: 0,
            }}
          >
            <Link
              href="/register"
              className="btn-gold"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '13px 28px', borderRadius: 10, fontSize: '0.88rem',
                letterSpacing: '0.04em', fontWeight: 600, textDecoration: 'none',
              }}
            >
              Create Your Invitation — Free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="#templates"
              className="btn-ghost"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '13px 28px', borderRadius: 10, fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              Browse Templates
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="animate-fade-up"
            style={{ marginTop: '2rem', animationDelay: '0.4s', opacity: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="var(--gold)" color="var(--gold)" />
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--dust)', letterSpacing: '0.08em' }}>
              TRUSTED BY <span style={{ color: 'var(--gold)' }}>12,000+</span> COUPLES WORLDWIDE
            </p>
          </div>
        </div>

        {/* Floating invitation card */}
        <div
          className="animate-float animate-fade-up mx-auto"
          style={{
            maxWidth: 360, marginTop: '5rem',
            animationDelay: '0.5s', opacity: 0,
            position: 'relative',
          }}
        >
          {/* Glow behind card */}
          <div style={{
            position: 'absolute', inset: '-20%',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.12), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div
            className="atelier-card text-left overflow-hidden"
            style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.15)', position: 'relative' }}
          >
            {/* Card top ornament line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

            <div style={{ background: 'linear-gradient(160deg, #1C170F, #2A2010)', padding: '2.25rem 2rem 1.75rem', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.14), transparent)', pointerEvents: 'none' }} />
              {/* Corner ornaments */}
              <div style={{ position: 'absolute', top: 10, left: 12, width: 20, height: 20, borderTop: '1px solid rgba(201,168,76,0.3)', borderLeft: '1px solid rgba(201,168,76,0.3)' }} />
              <div style={{ position: 'absolute', top: 10, right: 12, width: 20, height: 20, borderTop: '1px solid rgba(201,168,76,0.3)', borderRight: '1px solid rgba(201,168,76,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, width: 20, height: 20, borderBottom: '1px solid rgba(201,168,76,0.3)', borderLeft: '1px solid rgba(201,168,76,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 10, right: 12, width: 20, height: 20, borderBottom: '1px solid rgba(201,168,76,0.3)', borderRight: '1px solid rgba(201,168,76,0.3)' }} />

              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ color: 'var(--gold-dim)', fontSize: '0.62rem', letterSpacing: '0.22em', marginBottom: '0.875rem', textTransform: 'uppercase' }}>
                  Wedding Invitation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4))' }} />
                  <span style={{ color: 'var(--gold-dim)', fontSize: '1rem' }}>✦</span>
                  <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
                </div>
                <div className="font-display italic" style={{ fontSize: '2.4rem', color: 'var(--gold-light)', lineHeight: 1.15 }}>
                  Layla & Karim
                </div>
                <div style={{ marginTop: '0.875rem', color: 'var(--mist)', fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Saturday · 14 June 2025
                </div>
                <div style={{ color: 'var(--dust)', fontSize: '0.7rem', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
                  Atlantis The Palm, Dubai
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ink-raised)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--mist)' }}>
                <span style={{ color: 'var(--dust)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.6rem' }}>Countdown</span>
                <div style={{ color: 'var(--champagne)', fontSize: '0.85rem', marginTop: 2 }}>14 days to go</div>
              </div>
              <div className="btn-gold" style={{ padding: '8px 20px', borderRadius: 7, fontSize: '0.73rem', letterSpacing: '0.06em', fontWeight: 600 }}>
                RSVP Now
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--ink-border)', borderBottom: '1px solid var(--ink-border)', background: 'var(--ink-raised)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: '2rem', color: 'var(--gold-light)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.4rem', letterSpacing: '0.04em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Template Showcase ─────────────────────────────── */}
      <section id="templates" style={{ padding: '7rem 2rem', borderBottom: '1px solid var(--ink-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1rem' }}>
              Template Gallery
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--champagne)', lineHeight: 1.1 }}>
              Designed for every love story.
            </h2>
            <p style={{ color: 'var(--mist)', marginTop: '1rem', fontSize: '0.95rem', maxWidth: 440, margin: '1rem auto 0' }}>
              Twenty bespoke templates — from grand luxury to intimate minimal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {TEMPLATE_PREVIEWS.map((tpl, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--ink-border)', borderRadius: 16, overflow: 'hidden',
                  cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${tpl.accent}40`;
                  e.currentTarget.style.borderColor = `${tpl.accent}50`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--ink-border)';
                }}
              >
                {/* Mini invitation preview */}
                <div style={{ aspectRatio: '3/4', background: tpl.bg, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${tpl.accent}18, transparent)` }} />
                  <div style={{ textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: `${tpl.accent}99`, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Wedding Invitation</div>
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${tpl.accent}60, transparent)`, margin: '0 auto 0.75rem', width: '60%' }} />
                    <div className="font-display italic" style={{ fontSize: '1.4rem', color: tpl.text, lineHeight: 1.2 }}>
                      Layla &<br />Karim
                    </div>
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${tpl.accent}60, transparent)`, margin: '0.75rem auto 0.6rem', width: '60%' }} />
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: `${tpl.text}80`, textTransform: 'uppercase' }}>14 · VI · 2025</div>
                  </div>
                </div>

                {/* Template label */}
                <div style={{ padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--ink-raised)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--champagne)', fontWeight: 500 }}>{tpl.name}</span>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: tpl.accent, background: `${tpl.accent}14`, border: `1px solid ${tpl.accent}30`, borderRadius: 999, padding: '2px 8px' }}>
                    {tpl.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              href="/register"
              className="btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 28px', borderRadius: 10, fontSize: '0.875rem', textDecoration: 'none', letterSpacing: '0.02em' }}
            >
              View All Templates <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" style={{ padding: '7rem 2rem', borderBottom: '1px solid var(--ink-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1rem' }}>Features</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--champagne)', lineHeight: 1.1 }}>
                Everything you need<br />
                <span className="gold-gradient italic">to create magic.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 300, color: 'var(--mist)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              A complete platform designed around the most important day of your life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--ink-border)' }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.num}
                  style={{
                    background: 'var(--ink)', padding: '2.5rem',
                    transition: 'background 0.25s',
                    borderRadius: i === 0 ? '12px 0 0 0' : i === 1 ? '0 12px 0 0' : i === 2 ? '0 0 0 12px' : '0 0 12px 0',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-raised)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gold-glow)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="var(--gold)" strokeWidth={1.5} />
                    </div>
                    <span className="font-display" style={{ fontSize: '3.5rem', color: 'rgba(201,168,76,0.1)', lineHeight: 1, fontWeight: 700 }}>{f.num}</span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--champagne)', marginBottom: '0.75rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ color: 'var(--mist)', fontSize: '0.875rem', lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section style={{ padding: '7rem 2rem', borderBottom: '1px solid var(--ink-border)', background: 'var(--ink-raised)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1rem' }}>Stories</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--champagne)' }}>
              Couples who chose Invitely.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="atelier-card"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--champagne)', fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dust)', marginTop: '0.25rem', letterSpacing: '0.04em' }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '7rem 2rem', borderBottom: '1px solid var(--ink-border)' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1rem' }}>Pricing</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--champagne)', lineHeight: 1.15 }}>
              Begin free.<br />
              <span className="gold-gradient italic">Grow without limits.</span>
            </h2>
            <p style={{ color: 'var(--mist)', marginTop: '1rem', fontSize: '0.95rem' }}>
              No credit card required. Cancel any time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="atelier-card"
                style={{
                  display: 'flex', flexDirection: 'column', position: 'relative',
                  ...(plan.accent ? {
                    borderColor: 'rgba(201,168,76,0.3)',
                    boxShadow: '0 0 60px rgba(201,168,76,0.06)',
                  } : {}),
                }}
              >
                {plan.accent && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', borderRadius: '12px 12px 0 0' }} />
                )}
                <div style={{ padding: '2rem 2rem 1.5rem' }}>
                  {plan.accent && (
                    <div className="badge-gold" style={{ display: 'inline-block', marginBottom: '0.875rem' }}>Most popular</div>
                  )}
                  <div style={{ color: 'var(--dust)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
                    {plan.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="font-display" style={{ fontSize: '3rem', color: plan.accent ? 'var(--gold-light)' : 'var(--champagne)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {plan.price}
                    </span>
                    <span style={{ color: 'var(--dust)', fontSize: '0.8rem' }}>/ {plan.period}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--ink-border)', margin: '0 2rem' }} />

                <ul style={{ padding: '1.5rem 2rem', flex: 1, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--mist)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.accent ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${plan.accent ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={10} color={plan.accent ? 'var(--gold)' : 'var(--mist)'} strokeWidth={2.5} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div style={{ padding: '0 2rem 2rem' }}>
                  <Link
                    href={plan.href}
                    className={plan.accent ? 'btn-gold' : 'btn-ghost'}
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '0.8rem', borderRadius: 8,
                      fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em',
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
      <section style={{ padding: '7rem 2rem' }}>
        <div
          style={{
            maxWidth: 900, margin: '0 auto', textAlign: 'center',
            borderRadius: 20, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(145deg, #1C170F 0%, #241C0E 50%, #1A150C 100%)',
            border: '1px solid rgba(201,168,76,0.18)',
            padding: '5rem 3rem',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(201,168,76,0.11), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,168,76,0.05), transparent)', pointerEvents: 'none' }} />

          {/* Corner ornaments */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top');
            const isLeft = pos.includes('left');
            return (
              <div key={pos} style={{
                position: 'absolute',
                top: isTop ? 20 : undefined, bottom: !isTop ? 20 : undefined,
                left: isLeft ? 20 : undefined, right: !isLeft ? 20 : undefined,
                width: 28, height: 28,
                borderTop: isTop ? '1px solid rgba(201,168,76,0.25)' : undefined,
                borderBottom: !isTop ? '1px solid rgba(201,168,76,0.25)' : undefined,
                borderLeft: isLeft ? '1px solid rgba(201,168,76,0.25)' : undefined,
                borderRight: !isLeft ? '1px solid rgba(201,168,76,0.25)' : undefined,
              }} />
            );
          })}

          <div style={{ position: 'relative' }}>
            <div className="font-display italic" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: 'var(--champagne)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Your love story begins<br />
              <span className="gold-gradient">with a single invitation.</span>
            </div>
            <p style={{ color: 'var(--mist)', marginBottom: '2.5rem', fontSize: '1rem' }}>
              No credit card required. Set up in under 5 minutes.
            </p>
            <Link
              href="/register"
              className="btn-gold"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                padding: '14px 32px', borderRadius: 10, fontSize: '0.9rem',
                fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none',
              }}
            >
              Start For Free Today
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--ink-border)', padding: '2.5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        <span className="font-display" style={{ color: 'var(--gold)', fontSize: '1.35rem', letterSpacing: '-0.01em' }}>Invitely</span>
        <p style={{ color: 'var(--dust)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          © 2025 INVITELY · ALL RIGHTS RESERVED
        </p>
        <div style={{ display: 'flex', gap: '1.75rem' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a
              key={l}
              href="#"
              style={{ color: 'var(--dust)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust)')}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
